
/**
 * Modelo de usuário - responsável pelas operações de banco relacionadas aos usuários
 */
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface CreateUserData {
  email: string;
  name?: string;
  password: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name?: string;
  username: string; // Manter por compatibilidade
}

/**
 * Cria um novo usuário no banco de dados
 */
export async function createUser(userData: CreateUserData): Promise<UserResponse> {
  try {
    console.log("📝 Criando usuário:", userData.email);
    
    const [newUser] = await db.insert(users).values({
      email: userData.email,
      name: userData.name,
      username: userData.email, // Usar e-mail como username por compatibilidade
      password: userData.password,
    }).returning();

    console.log("✅ Usuário criado com sucesso:", newUser.email);
    
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  } catch (error) {
    console.error("💥 Erro ao criar usuário:", error);
    throw new Error("Falha ao criar usuário");
  }
}

/**
 * Busca usuário por e-mail
 */
export async function getUserByEmail(email: string) {
  try {
    console.log("🔍 Buscando usuário por e-mail:", email);
    
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (user.length === 0) {
      console.log("❌ Usuário não encontrado:", email);
      return null;
    }

    console.log("✅ Usuário encontrado:", email);
    return user[0];
  } catch (error) {
    console.error("💥 Erro ao buscar usuário:", error);
    throw new Error("Falha ao buscar usuário");
  }
}

/**
 * Busca usuário por ID
 */
export async function getUserById(id: string) {
  try {
    const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
    
    if (user.length === 0) {
      return null;
    }

    const { password: _, ...userWithoutPassword } = user[0];
    return userWithoutPassword;
  } catch (error) {
    console.error("💥 Erro ao buscar usuário por ID:", error);
    throw new Error("Falha ao buscar usuário");
  }
}

/**
 * Verifica se e-mail já existe
 */
export async function emailExists(email: string): Promise<boolean> {
  try {
    const user = await getUserByEmail(email);
    return user !== null;
  } catch (error) {
    console.error("💥 Erro ao verificar e-mail:", error);
    return false;
  }
}
