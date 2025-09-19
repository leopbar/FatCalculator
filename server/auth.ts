// Based on javascript_auth_all_persistance blueprint
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import { hashPassword, comparePassword, isPasswordValid } from "./authUtils";

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
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Usuário não encontrado" });
        }
        
        const isValidPassword = await comparePassword(password, user.password);
        if (!isValidPassword) {
          return done(null, false, { message: "Senha incorreta" });
        }
        
        return done(null, user);
      } catch (error) {
        console.error("Erro na autenticação:", error);
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

  app.post("/api/register", async (req, res, next) => {
    try {
      const { username, password } = req.body;
      
      // Validar se os campos obrigatórios estão presentes
      if (!username || !password) {
        return res.status(400).json({ 
          error: "Username e password são obrigatórios" 
        });
      }

      // Validar força da senha
      if (!isPasswordValid(password)) {
        return res.status(400).json({ 
          error: "A senha deve ter pelo menos 8 caracteres, incluindo letras e números" 
        });
      }

      // Verificar se usuário já existe
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ 
          error: "Usuário já existe" 
        });
      }

      // Criar hash da senha e salvar usuário
      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        username,
        password: hashedPassword,
      });

      // Fazer login automático após registro
      req.login(user, (err) => {
        if (err) {
          console.error("Erro no login automático:", err);
          return next(err);
        }
        
        // Remover senha do retorno por segurança
        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      console.error("Erro no registro:", error);
      next(error);
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        console.error("Erro na autenticação:", err);
        return next(err);
      }
      
      if (!user) {
        return res.status(401).json({ 
          error: info?.message || "Credenciais inválidas" 
        });
      }
      
      req.login(user, (loginErr) => {
        if (loginErr) {
          console.error("Erro no login:", loginErr);
          return next(loginErr);
        }
        
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