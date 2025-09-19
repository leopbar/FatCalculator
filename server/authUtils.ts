
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

/**
 * Gera hash da senha usando bcrypt com salt seguro
 * @param password - Senha em texto plano
 * @returns Promise com hash da senha
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    console.error("Erro ao gerar hash da senha:", error);
    throw new Error("Falha na criptografia da senha");
  }
}

/**
 * Compara senha em texto plano com hash armazenado
 * @param password - Senha digitada pelo usuário
 * @param hashedPassword - Hash armazenado no banco
 * @returns Promise<boolean> - true se as senhas coincidem
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error("Erro ao comparar senhas:", error);
    throw new Error("Falha na verificação da senha");
  }
}

/**
 * Valida força da senha (opcional - pode ser expandido)
 * @param password - Senha a ser validada
 * @returns boolean - true se a senha atende aos critérios
 */
export function isPasswordValid(password: string): boolean {
  // Mínimo 8 caracteres, pelo menos 1 letra e 1 número
  const minLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  return minLength && hasLetter && hasNumber;
}
