
import { Router, type Request, type Response, type NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import passport from '../auth/passport';
import { storage } from '../storage';
import { 
  generateAccessToken, 
  generateRefreshToken, 
  verifyRefreshToken,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions 
} from '../utils/jwt';
import { UserRegistrationSchema, UserLoginSchema, type UserPublic } from '../models/User';

const router = Router();

// Middleware para autenticação JWT
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: any) => {
    if (err) {
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    
    if (!user) {
      return res.status(401).json({ error: 'Token de acceso inválido o expirado' });
    }
    
    req.user = user;
    next();
  })(req, res, next);
};

// Registro
router.post('/register', async (req: Request, res: Response) => {
  try {
    console.log('📨 POST /api/register:', {
      contentType: req.headers['content-type'],
      body: req.body,
      hasBody: !!req.body
    });

    const validation = UserRegistrationSchema.safeParse(req.body);
    
    if (!validation.success) {
      console.log('❌ Dados de registro inválidos:', validation.error.issues);
      return res.status(400).json({ 
        error: validation.error.issues[0].message,
        details: validation.error.issues 
      });
    }

    const { name, email, password } = validation.data;
    console.log('📝 Request de registro recebido para:', email, 'IP:', req.ip);

    // Verificar se o usuário já existe
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      console.log('❌ Tentativa de registro com email já existente:', email);
      return res.status(409).json({ error: 'El email ya está en uso' });
    }

    // Hash da senha
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Criar usuário
    const user = await storage.createUserWithEmail({
      name,
      email,
      password: hashedPassword
    });

    console.log('✅ Usuário criado com sucesso:', user.id);

    // Gerar tokens
    const tokenPayload = { userId: user.id, email: user.email };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Configurar cookies
    res.cookie('access_token', accessToken, getAccessTokenCookieOptions());
    res.cookie('refresh_token', refreshToken, getRefreshTokenCookieOptions());

    // Retornar dados do usuário (sem senha)
    const userPublic: UserPublic = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: userPublic
    });
  } catch (error) {
    console.error('❌ Erro no registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Login
router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  console.log('📨 POST /api/login:', {
    contentType: req.headers['content-type'],
    body: req.body,
    hasBody: !!req.body
  });

  const validation = UserLoginSchema.safeParse(req.body);
  
  if (!validation.success) {
    console.log('❌ Dados de login inválidos:', validation.error.issues);
    return res.status(400).json({ 
      error: validation.error.issues[0].message 
    });
  }

  console.log('📝 Request de login recebido:', {
    email: validation.data.email,
    ip: req.ip,
    userAgent: req.headers['user-agent']?.substring(0, 100)
  });

  passport.authenticate('local', { session: false }, (err: any, user: any, info: any) => {
    if (err) {
      console.error('❌ Erro na autenticação:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    if (!user) {
      console.log('❌ Login falhado para:', validation.data.email, 'Motivo:', info?.message);
      return res.status(401).json({ error: info?.message || 'Credenciales inválidas' });
    }

    console.log('✅ Login bem-sucedido para:', user.email);

    // Gerar tokens
    const tokenPayload = { userId: user.id, email: user.email };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Configurar cookies
    res.cookie('access_token', accessToken, getAccessTokenCookieOptions());
    res.cookie('refresh_token', refreshToken, getRefreshTokenCookieOptions());

    // Retornar dados do usuário
    const userPublic: UserPublic = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    res.json({
      message: 'Inicio de sesión realizado exitosamente',
      user: userPublic
    });
  })(req, res, next);
});

// Refresh Token
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Token de actualización no encontrado' });
    }

    const payload = verifyRefreshToken(refreshToken);
    
    // Verificar se o usuário ainda existe
    const user = await storage.getUser(payload.userId);
    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    // Gerar novo access token
    const tokenPayload = { userId: user.id, email: user.email };
    const newAccessToken = generateAccessToken(tokenPayload);

    // Atualizar cookie do access token
    res.cookie('access_token', newAccessToken, getAccessTokenCookieOptions());

    const userPublic: UserPublic = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    res.json({
      message: 'Token renovado exitosamente',
      user: userPublic
    });
  } catch (error) {
    console.error('❌ Erro no refresh token:', error);
    res.status(401).json({ error: 'Token de actualización inválido o expirado' });
  }
});

// Logout
router.post('/logout', (req: Request, res: Response) => {
  console.log('📝 Logout solicitado');
  
  // Limpar cookies
  res.clearCookie('access_token', { path: '/' });
  res.clearCookie('refresh_token', { path: '/' });
  
  res.json({ message: 'Cierre de sesión realizado exitosamente' });
});

// Rota para verificar usuário autenticado
router.get('/user', authenticateJWT, (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }

  res.json(req.user);
});

export { router as authRoutes };
