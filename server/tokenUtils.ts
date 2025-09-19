
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';

/**
 * Gera um token JWT para reset de senha
 * @param userId - ID do usuário
 * @returns Token JWT com validade de 30 minutos
 */
export function generateResetToken(userId: string): string {
  return jwt.sign(
    { userId, type: 'password-reset' },
    JWT_SECRET,
    { expiresIn: '30m' }
  );
}

/**
 * Valida e decodifica o token de reset
 * @param token - Token a ser validado
 * @returns Dados do token se válido, null se inválido
 */
export function validateResetToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    if (decoded.type !== 'password-reset') {
      return null;
    }
    
    return { userId: decoded.userId };
  } catch (error) {
    console.error('❌ Token inválido:', error);
    return null;
  }
}

/**
 * Gera um UUID único para uso como token alternativo
 * @returns String UUID única
 */
export function generateUUID(): string {
  return uuidv4();
}
