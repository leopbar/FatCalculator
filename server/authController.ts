
/**
 * Controlador de autenticação - gerencia login, registro e logout
 */
import { Request, Response, NextFunction } from "express";
import { hashPassword, comparePassword, isPasswordValid } from "./authUtils";
import { createUser, getUserByEmail, emailExists } from "./userModel";
import { loginSchema, insertUserSchema } from "@shared/schema";

/**
 * Registra um novo usuário
 */
export async function registerUser(req: Request, res: Response, next: NextFunction) {
  try {
    console.log("📝 Request de registro recebido para:", req.body.email, "IP:", req.ip);
    
    // Validar dados de entrada
    const validationResult = insertUserSchema.safeParse(req.body);
    if (!validationResult.success) {
      console.log("❌ Dados de registro inválidos:", validationResult.error.errors);
      return res.status(400).json({ 
        error: validationResult.error.errors[0].message 
      });
    }

    const { email, name, password } = validationResult.data;

    // Validar força da senha
    if (!isPasswordValid(password)) {
      console.log("❌ Contraseña no cumple con los criterios");
      return res.status(400).json({ 
        error: "La contraseña debe tener al menos 8 caracteres, incluyendo letra mayúscula, minúscula, número y símbolo" 
      });
    }

    // Verificar se e-mail já existe
    const userExists = await emailExists(email);
    if (userExists) {
      console.log("❌ E-mail já existe:", email);
      return res.status(400).json({ 
        error: "Este e-mail ya está registrado" 
      });
    }

    // Criar hash da senha e salvar usuário
    console.log("🔐 Gerando hash da senha...");
    const hashedPassword = await hashPassword(password);
    
    const user = await createUser({
      email,
      name,
      password: hashedPassword,
    });

    console.log("✅ Usuário criado com sucesso:", email);

    // Fazer login automático após registro
    req.login(user, (err) => {
      if (err) {
        console.error("💥 Erro no login automático:", err);
        return next(err);
      }

      console.log("✅ Login automático realizado para:", email);
      res.status(201).json(user);
    });
  } catch (error) {
    console.error("💥 Erro no registro:", error);
    next(error);
  }
}

/**
 * Autentica um usuário
 */
export async function loginUser(req: Request, res: Response, next: NextFunction) {
  try {
    console.log("📝 Request de login recebido:", { 
      email: req.body.email, 
      ip: req.ip,
      userAgent: req.get('User-Agent')?.substring(0, 100) 
    });

    // Validar dados de entrada
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) {
      console.log("❌ Dados de login inválidos:", validationResult.error.errors);
      return res.status(401).json({ 
        error: validationResult.error.errors[0].message 
      });
    }

    const { email, password } = validationResult.data;

    // Buscar usuário por e-mail
    const user = await getUserByEmail(email);
    if (!user) {
      console.log("❌ Usuário não encontrado:", email);
      return res.status(401).json({ 
        error: "E-mail ou senha incorretos" 
      });
    }

    // Verificar senha
    console.log("🔐 Verificando senha para usuário:", email);
    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      console.log("❌ Senha incorreta para usuário:", email);
      return res.status(401).json({ 
        error: "E-mail ou senha incorretos" 
      });
    }

    // Fazer login
    const { password: _, ...userWithoutPassword } = user;
    req.login(userWithoutPassword, (loginErr) => {
      if (loginErr) {
        console.error("💥 Erro no login:", loginErr);
        return next(loginErr);
      }

      console.log("✅ Login realizado com sucesso para:", email);
      res.status(200).json(userWithoutPassword);
    });
  } catch (error) {
    console.error("💥 Erro no login:", error);
    next(error);
  }
}

/**
 * Faz logout do usuário
 */
export function logoutUser(req: Request, res: Response, next: NextFunction) {
  req.logout((err) => {
    if (err) return next(err);
    res.sendStatus(200);
  });
}

/**
 * Retorna dados do usuário autenticado
 */
export function getAuthenticatedUser(req: Request, res: Response) {
  if (!req.isAuthenticated()) {
    return res.sendStatus(401);
  }
  res.json(req.user);
}
