
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcryptjs';
import { storage } from '../storage';
import { verifyAccessToken, type TokenPayload } from '../utils/jwt';
import type { Request } from 'express';

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || 'access-secret-key-change-in-production';

// Extract JWT from cookies
const cookieExtractor = (req: Request): string | null => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['access_token'];
  }
  return token;
};

// Local Strategy para login
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email: string, password: string, done) => {
    try {
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return done(null, false, { message: 'Email ou senha incorretos' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return done(null, false, { message: 'Email ou senha incorretos' });
      }

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      return done(null, userWithoutPassword);
    } catch (error) {
      return done(error);
    }
  }
));

// JWT Strategy para rotas protegidas
passport.use(new JwtStrategy(
  {
    jwtFromRequest: cookieExtractor,
    secretOrKey: ACCESS_TOKEN_SECRET,
    issuer: 'nutrition-app'
  },
  async (payload: TokenPayload, done) => {
    try {
      const user = await storage.getUser(payload.userId);
      
      if (!user) {
        return done(null, false);
      }

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      return done(null, userWithoutPassword);
    } catch (error) {
      return done(error);
    }
  }
));

// Serialization (necessário para o Passport)
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await storage.getUser(id);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      done(null, userWithoutPassword);
    } else {
      done(null, false);
    }
  } catch (error) {
    done(error);
  }
});

export default passport;
