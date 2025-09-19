
import { Request, Response, NextFunction } from "express";
import { getUserByEmail, updateUserPassword } from "./userModel";
import { hashPassword, isPasswordValid } from "./authUtils";
import { generateResetToken, validateResetToken } from "./tokenUtils";
import { sendPasswordResetEmail } from "./emailService";
import { z } from "zod";

// Schemas de validação
const forgotPasswordSchema = z.object({
  email: z.string().email("E-mail inválido")
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token é obrigatório"),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres")
});

/**
 * Inicia o processo de recuperação de senha
 */
export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    console.log("🔄 Solicitação de reset de senha recebida:", req.body.email, "IP:", req.ip);
    
    // Validar dados de entrada
    const validationResult = forgotPasswordSchema.safeParse(req.body);
    if (!validationResult.success) {
      console.log("❌ Dados inválidos:", validationResult.error.errors);
      return res.status(400).json({ 
        error: validationResult.error.errors[0].message 
      });
    }

    const { email } = validationResult.data;

    // Buscar usuário por e-mail
    const user = await getUserByEmail(email);
    if (!user) {
      console.log("❌ Usuário não encontrado:", email);
      // Por segurança, sempre retorna sucesso mesmo se o e-mail não existir
      return res.status(200).json({ 
        message: "Se o e-mail existir em nosso sistema, você receberá as instruções de redefinição." 
      });
    }

    // Gerar token de reset
    const resetToken = generateResetToken(user.id);
    console.log("🔑 Token de reset gerado para:", email);

    // Enviar e-mail
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    await sendPasswordResetEmail(email, resetToken, baseUrl);

    console.log("✅ E-mail de reset enviado para:", email);
    res.status(200).json({ 
      message: "Se o e-mail existir em nosso sistema, você receberá as instruções de redefinição." 
    });
    
  } catch (error) {
    console.error("💥 Erro no forgot password:", error);
    next(error);
  }
}

/**
 * Redefine a senha usando o token
 */
export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    console.log("🔄 Tentativa de reset de senha com token:", req.body.token?.substring(0, 20) + "...");
    
    // Validar dados de entrada
    const validationResult = resetPasswordSchema.safeParse(req.body);
    if (!validationResult.success) {
      console.log("❌ Dados de reset inválidos:", validationResult.error.errors);
      return res.status(400).json({ 
        error: validationResult.error.errors[0].message 
      });
    }

    const { token, password } = validationResult.data;

    // Validar força da senha
    if (!isPasswordValid(password)) {
      console.log("❌ Senha não cumpre os critérios");
      return res.status(400).json({ 
        error: "A senha deve ter pelo menos 8 caracteres, incluindo letra maiúscula, minúscula, número e símbolo" 
      });
    }

    // Validar token
    const tokenData = validateResetToken(token);
    if (!tokenData) {
      console.log("❌ Token inválido ou expirado");
      return res.status(400).json({ 
        error: "Token inválido ou expirado. Solicite uma nova redefinição." 
      });
    }

    // Gerar hash da nova senha
    console.log("🔐 Gerando hash da nova senha...");
    const hashedPassword = await hashPassword(password);

    // Atualizar senha no banco
    await updateUserPassword(tokenData.userId, hashedPassword);

    console.log("✅ Senha redefinida com sucesso para usuário:", tokenData.userId);
    res.status(200).json({ 
      message: "Senha redefinida com sucesso. Você já pode fazer login com a nova senha." 
    });
    
  } catch (error) {
    console.error("💥 Erro no reset password:", error);
    next(error);
  }
}

/**
 * Valida se um token de reset é válido (para verificação frontend)
 */
export async function validateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const { token } = req.query;
    
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ 
        error: "Token é obrigatório",
        valid: false 
      });
    }

    const tokenData = validateResetToken(token);
    
    if (!tokenData) {
      return res.status(400).json({ 
        error: "Token inválido ou expirado",
        valid: false 
      });
    }

    res.status(200).json({ 
      message: "Token válido",
      valid: true 
    });
    
  } catch (error) {
    console.error("💥 Erro na validação do token:", error);
    next(error);
  }
}
