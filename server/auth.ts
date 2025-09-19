
// Based on javascript_auth_all_persistance blueprint
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import { comparePassword } from "./authUtils";
import { loginRateLimiter, registerRateLimiter } from "./rateLimiter";
import { registerUser, loginUser, logoutUser, getAuthenticatedUser } from "./authController";
import { getUserByEmail, getUserById } from "./userModel";

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
    new LocalStrategy(
      {
        usernameField: 'email', // Usar e-mail como campo de username
        passwordField: 'password'
      },
      async (email, password, done) => {
        try {
          console.log("🔍 Tentativa de login para:", email);

          if (!email || !password) {
            console.log("❌ Credenciais em falta");
            return done(null, false, { message: "E-mail y contraseña son obligatorios" });
          }

          const user = await getUserByEmail(email);
          if (!user) {
            console.log("❌ Usuário não encontrado:", email);
            return done(null, false, { message: "E-mail o contraseña incorrectos" });
          }

          console.log("🔐 Verificando senha para usuário:", email);
          const isValidPassword = await comparePassword(password, user.password);

          if (!isValidPassword) {
            console.log("❌ Senha incorreta para usuário:", email);
            return done(null, false, { message: "E-mail o contraseña incorrectos" });
          }

          console.log("✅ Login bem-sucedido para usuário:", email);
          const { password: _, ...userWithoutPassword } = user;
          return done(null, userWithoutPassword);
        } catch (error) {
          console.error("💥 Erro na autenticação:", error);
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await getUserById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Rotas de autenticação
  app.post("/api/register", registerRateLimiter, registerUser);
  app.post("/api/login", loginRateLimiter, loginUser);
  app.post("/api/logout", logoutUser);
  app.get("/api/user", getAuthenticatedUser);
}
