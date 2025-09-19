// Based on javascript_auth_all_persistance blueprint
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import { hashPassword, comparePassword, isPasswordValid } from "./authUtils";
import { loginRateLimiter, registerRateLimiter } from "./rateLimiter";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        console.log("🔍 Tentativa de login para:", username);

        if (!username || !password) {
          console.log("❌ Credenciais em falta");
          return done(null, false, { message: "Username y password son obligatorios" });
        }

        const user = await storage.getUserByUsername(username);
        if (!user) {
          console.log("❌ Usuário não encontrado:", username);
          return done(null, false, { message: "Usuario no encontrado" });
        }

        console.log("🔐 Verificando senha para usuário:", username);
        const isValidPassword = await comparePassword(password, user.password);

        if (!isValidPassword) {
          console.log("❌ Senha incorreta para usuário:", username);
          return done(null, false, { message: "Contraseña incorrecta" });
        }

        console.log("✅ Login bem-sucedido para usuário:", username);
        return done(null, user);
      } catch (error) {
        console.error("💥 Erro na autenticação:", error);
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/register", registerRateLimiter, async (req, res, next) => {
    try {
      console.log("📝 Request de registro recebido para:", req.body.username, "IP:", req.ip);
      const { username, password } = req.body;

      // Validar se os campos obrigatórios estão presentes
      if (!username || !password) {
        console.log("❌ Campos obrigatórios ausentes");
        return res.status(400).json({ 
          error: "Username y password son obligatorios" 
        });
      }

      // Validar força da senha
      if (!isPasswordValid(password)) {
        console.log("❌ Contraseña no cumple con los criterios");
        return res.status(400).json({ 
          error: "La contraseña debe tener al menos 8 caracteres, incluyendo letra mayúscula, minúscula, número y símbolo" 
        });
      }

      // Verificar se usuário já existe
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        console.log("❌ Usuário já existe:", username);
        return res.status(400).json({ 
          error: "Usuario ya existe" 
        });
      }

      // Criar hash da senha e salvar usuário
      console.log("🔐 Gerando hash da senha...");
      const hashedPassword = await hashPassword(password);
      console.log("💾 Salvando usuário no banco...");

      const user = await storage.createUser({
        username,
        password: hashedPassword,
      });

      console.log("✅ Usuário criado com sucesso:", username);

      // Fazer login automático após registro
      req.login(user, (err) => {
        if (err) {
          console.error("💥 Erro no login automático:", err);
          return next(err);
        }

        console.log("✅ Login automático realizado para:", username);
        // Remover senha do retorno por segurança
        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      console.error("💥 Erro no registro:", error);
      next(error);
    }
  });

  app.post("/api/login", loginRateLimiter, (req, res, next) => {
    console.log("📝 Request de login recebido:", { 
      body: req.body, 
      ip: req.ip,
      userAgent: req.get('User-Agent')?.substring(0, 100) 
    });

    // Verificar se as credenciais estão presentes no body
    const { username, password } = req.body;
    if (!username || !password) {
      console.log("❌ Credenciais ausentes no body");
      return res.status(401).json({ 
        error: "Missing credentials" 
      });
    }

    passport.authenticate("local", (err, user, info) => {
      if (err) {
        console.error("💥 Erro na autenticação:", err);
        return next(err);
      }

      if (!user) {
        console.log("❌ Autenticação falhou:", info?.message);
        return res.status(401).json({ 
          error: info?.message || "Credenciais inválidas" 
        });
      }

      req.login(user, (loginErr) => {
        if (loginErr) {
          console.error("💥 Erro no login:", loginErr);
          return next(loginErr);
        }

        console.log("✅ Login realizado com sucesso para:", user.username);
        // Remover senha do retorno por segurança
        const { password: _, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}