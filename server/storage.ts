import {
  type User,
  type InsertUser,
  type BodyMetrics,
  type InsertBodyMetrics,
  type Calculation,
  type InsertCalculation,
  users,
  bodyMetrics,
  calculations,
  menus,
  comidas,
  alimentos,
  categorias_alimentos,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";
import { randomUUID } from "crypto";
import session from "express-session";
import createMemoryStore from "memorystore";
import ConnectPgSimple from "connect-pg-simple";

// Based on javascript_auth_all_persistance blueprint

// Based on javascript_auth_all_persistance blueprint
const MemoryStore = createMemoryStore(session);
const PgStore = ConnectPgSimple(session);

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(user: InsertUser): Promise<User>;
  createUserWithEmail(userData: { name: string; email: string; password: string }): Promise<User>;

  // Body metrics methods
  upsertBodyMetrics(userId: string, data: InsertBodyMetrics): Promise<BodyMetrics>;
  getBodyMetrics(userId: string): Promise<BodyMetrics | undefined>;

  // Calculation methods
  saveCalculation(userId: string, data: InsertCalculation): Promise<Calculation>;
  getLatestCalculation(userId: string): Promise<Calculation | undefined>;

  // Menu plan methods removed - now using new menu structure

  // User summary for dashboard
  getUserSummary(userId: string): Promise<{
    hasMetrics: boolean;
    hasCalculation: boolean;
  }>;

  // Clear all user data
  clearAllUserData(userId: string): Promise<void>;

  // Menu plan methods for personalizing menu
  getMenuByMacros(macros: { calories: number; protein: number; carbs: number; fat: number }): Promise<any | undefined>;
  getClosestMenu(calories: number, protein_g: number, carb_g: number, fat_g: number): Promise<any | undefined>;

  sessionStore: any; // Using any for compatibility with express-session types
}

export class DatabaseStorage implements IStorage {
  sessionStore: any; // Using any for compatibility with express-session types

  constructor() {
    // Use PostgreSQL for session storage
    this.sessionStore = new PgStore({
      conString: process.env.DATABASE_URL,
      tableName: 'session', // Use `session` table name
      createTableIfMissing: true,
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return user || null;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        id: randomUUID(),
        ...userData,
      })
      .returning();
    return user;
  }

  async createUserWithEmail(userData: { name: string; email: string; password: string }): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        id: randomUUID(),
        username: userData.name, // Use name as username
        email: userData.email,
        password: userData.password,
      })
      .returning();
    return user;
  }


  async upsertBodyMetrics(userId: string, data: InsertBodyMetrics): Promise<BodyMetrics> {
    // First try to find existing metrics for this user
    const existingMetrics = await db.select().from(bodyMetrics).where(eq(bodyMetrics.userId, userId));

    if (existingMetrics.length > 0) {
      // Update existing metrics
      const [updated] = await db
        .update(bodyMetrics)
        .set({
          gender: data.gender,
          age: data.age,
          height: data.height,
          weight: data.weight,
          neck: data.neck,
          waist: data.waist,
          hip: data.hip ?? null
        })
        .where(eq(bodyMetrics.userId, userId))
        .returning();
      return updated;
    } else {
      // Create new metrics
      const [created] = await db
        .insert(bodyMetrics)
        .values({
          ...data,
          userId,
          hip: data.hip ?? null
        })
        .returning();
      return created;
    }
  }

  async getBodyMetrics(userId: string): Promise<BodyMetrics | undefined> {
    const [metrics] = await db.select().from(bodyMetrics).where(eq(bodyMetrics.userId, userId));
    return metrics || undefined;
  }

  async saveCalculation(userId: string, data: InsertCalculation): Promise<Calculation> {
    const [calculation] = await db
      .insert(calculations)
      .values({
        ...data,
        userId
      })
      .returning();
    return calculation;
  }

  async getLatestCalculation(userId: string): Promise<Calculation | undefined> {
    const [calculation] = await db
      .select()
      .from(calculations)
      .where(eq(calculations.userId, userId))
      .orderBy(desc(calculations.id)) // Get the most recent one
      .limit(1);
    return calculation || undefined;
  }

  // Menu plan methods removed - now using new menu structure with menus, comidas, alimentos tables

  async getUserSummary(userId: string): Promise<{
    hasMetrics: boolean;
    hasCalculation: boolean;
  }> {
    const [userMetrics] = await db.select().from(bodyMetrics).where(eq(bodyMetrics.userId, userId));
    const [userCalculation] = await db.select().from(calculations).where(eq(calculations.userId, userId));

    return {
      hasMetrics: !!userMetrics,
      hasCalculation: !!userCalculation,
    };
  }

  // deleteMenuPlan method removed - now using new menu structure

  async clearAllUserData(userId: string): Promise<void> {
    // Delete all user data in the correct order (due to foreign key constraints)
    await db.delete(calculations).where(eq(calculations.userId, userId));
    await db.delete(bodyMetrics).where(eq(bodyMetrics.userId, userId));
  }

  async getMenuByMacros(macros: { calories: number; protein: number; carbs: number; fat: number }): Promise<any | undefined> {
    // This is a placeholder. A real implementation would involve complex queries
    // to find the closest matching menu based on the provided macros.
    // For now, we'll just select a random menu as an example.
    const [menu] = await db
      .select()
      .from(menus)
      .orderBy(db.fn.random()) // Select a random menu
      .limit(1);
    return menu;
  }

  async getClosestMenu(calories: number, protein_g: number, carb_g: number, fat_g: number): Promise<any | undefined> {
    try {
      // Get all menus with their meals and foods
      const menusWithMeals = await db
        .select({
          id: menus.id,
          nombre: menus.nombre,
          calorias_totales: menus.calorias_totales,
          proteina_total_gramos: menus.proteina_total_gramos,
          carbohidratos_total_gramos: menus.carbohidratos_total_gramos,
          grasas_total_gramos: menus.grasas_total_gramos,
          comida_id: comidas.id,
          tipo_comida: comidas.tipo_comida,
          calorias_comida: comidas.calorias_comida,
          proteina_comida_gramos: comidas.proteina_comida_gramos,
          carbohidratos_comida_gramos: comidas.carbohidratos_comida_gramos,
          grasas_comida_gramos: comidas.grasas_comida_gramos,
          alimento_id: alimentos.id,
          alimento_nombre: alimentos.nombre,
          cantidad_gramos: alimentos.cantidad_gramos,
          medida_casera: alimentos.medida_casera,
          alimento_calorias: alimentos.calorias,
          alimento_proteina: alimentos.proteina_gramos,
          alimento_carbohidratos: alimentos.carbohidratos_gramos,
          alimento_grasas: alimentos.grasas_gramos,
          categoria_id: categorias_alimentos.id,
          categoria_nombre: categorias_alimentos.nombre,
        })
        .from(menus)
        .leftJoin(comidas, eq(comidas.menu_id, menus.id))
        .leftJoin(alimentos, eq(alimentos.comida_id, comidas.id))
        .leftJoin(categorias_alimentos, eq(categorias_alimentos.id, alimentos.categoria_id));

      if (menusWithMeals.length === 0) {
        return null;
      }

      // Group by menu and calculate closest match
      const menuMap = new Map();
      
      menusWithMeals.forEach(row => {
        if (!menuMap.has(row.id)) {
          menuMap.set(row.id, {
            id: row.id,
            nombre: row.nombre,
            calorias_totales: row.calorias_totales,
            proteina_total_gramos: row.proteina_total_gramos,
            carbohidratos_total_gramos: row.carbohidratos_total_gramos,
            grasas_total_gramos: row.grasas_total_gramos,
            meals: new Map()
          });
        }

        const menu = menuMap.get(row.id);
        
        if (row.comida_id && !menu.meals.has(row.comida_id)) {
          menu.meals.set(row.comida_id, {
            id: row.comida_id,
            tipo_comida: row.tipo_comida,
            calorias_comida: row.calorias_comida,
            proteina_comida_gramos: row.proteina_comida_gramos,
            carbohidratos_comida_gramos: row.carbohidratos_comida_gramos,
            grasas_comida_gramos: row.grasas_comida_gramos,
            alimentos: []
          });
        }

        if (row.alimento_id) {
          const meal = menu.meals.get(row.comida_id);
          meal.alimentos.push({
            id: row.alimento_id,
            nombre: row.alimento_nombre,
            cantidad_gramos: row.cantidad_gramos,
            medida_casera: row.medida_casera,
            calorias: row.alimento_calorias,
            proteina_gramos: row.alimento_proteina,
            carbohidratos_gramos: row.alimento_carbohidratos,
            grasas_gramos: row.alimento_grasas,
            categoria: {
              id: row.categoria_id,
              nombre: row.categoria_nombre
            }
          });
        }
      });

      // Find closest match by calculating distance
      let closestMenu = null;
      let minDistance = Infinity;

      console.log(`🎯 Searching for menu matching: ${calories} kcal, ${protein_g}g protein, ${carb_g}g carbs, ${fat_g}g fat`);
      console.log(`📊 Found ${menuMap.size} menus in database`);

      for (const [menuId, menu] of menuMap) {
        const caloriesDiff = Math.abs(menu.calorias_totales - calories);
        const proteinDiff = Math.abs(menu.proteina_total_gramos - protein_g);
        const carbDiff = Math.abs(menu.carbohidratos_total_gramos - carb_g);
        const fatDiff = Math.abs(menu.grasas_total_gramos - fat_g);
        
        // Weighted distance calculation - calorias são mais importantes
        const distance = (caloriesDiff * 0.5) + (proteinDiff * 0.2) + (carbDiff * 0.2) + (fatDiff * 0.1);
        
        console.log(`📋 Menu "${menu.nombre}": ${menu.calorias_totales} kcal, distance: ${distance.toFixed(2)}`);
        
        if (distance < minDistance) {
          minDistance = distance;
          closestMenu = menu;
        }
      }

      console.log(`✅ Selected menu: "${closestMenu?.nombre}" with distance: ${minDistance.toFixed(2)}`);

      if (closestMenu) {
        // Convert meals Map to array
        closestMenu.meals = Array.from(closestMenu.meals.values());
        return closestMenu;
      }

      return null;
    } catch (error) {
      console.error('Error finding closest menu:', error);
      return null;
    }
  }



}

// Keep MemStorage for fallback if needed
export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private bodyMetrics: Map<string, BodyMetrics>; // keyed by userId
  private calculations: Map<string, Calculation>; // keyed by userId
  // menuPlans removed - now using new menu structure
  sessionStore: any; // Using any for compatibility with express-session types

  constructor() {
    this.users = new Map();
    this.bodyMetrics = new Map();
    this.calculations = new Map();
    // Based on javascript_auth_all_persistance blueprint
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    ) || null;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createUserWithEmail(userData: { name: string; email: string; password: string }): Promise<User> {
    const id = randomUUID();
    const user: User = {
      id,
      username: userData.name, // Use name as username
      email: userData.email,
      password: userData.password,
    };
    this.users.set(id, user);
    return user;
  }


  async upsertBodyMetrics(userId: string, data: InsertBodyMetrics): Promise<BodyMetrics> {
    const id = randomUUID();
    const bodyMetrics: BodyMetrics = {
      ...data,
      id,
      userId,
      hip: data.hip ?? null // Convert undefined to null
    };
    this.bodyMetrics.set(userId, bodyMetrics);
    return bodyMetrics;
  }

  async getBodyMetrics(userId: string): Promise<BodyMetrics | undefined> {
    return this.bodyMetrics.get(userId);
  }

  async saveCalculation(userId: string, data: InsertCalculation): Promise<Calculation> {
    const id = randomUUID();
    const calculation: Calculation = { ...data, id, userId };
    this.calculations.set(userId, calculation);
    return calculation;
  }

  async getLatestCalculation(userId: string): Promise<Calculation | undefined> {
    return this.calculations.get(userId);
  }

  // Menu plan methods removed - now using new menu structure

  async getUserSummary(userId: string): Promise<{
    hasMetrics: boolean;
    hasCalculation: boolean;
  }> {
    return {
      hasMetrics: this.bodyMetrics.has(userId),
      hasCalculation: this.calculations.has(userId),
    };
  }

  async clearAllUserData(userId: string): Promise<void> {
    this.bodyMetrics.delete(userId);
    this.calculations.delete(userId);
  }

  // Placeholder for getMenuByMacros in MemStorage
  async getMenuByMacros(macros: { calories: number; protein: number; carbs: number; fat: number }): Promise<any | undefined> {
    console.warn("getMenuByMacros not implemented in MemStorage");
    return undefined;
  }

  async getClosestMenu(calories: number, protein_g: number, carb_g: number, fat_g: number): Promise<any | undefined> {
    console.warn("getClosestMenu not implemented in MemStorage");
    return undefined;
  }

}

// Use DatabaseStorage instead of MemStorage for persistent data
export const storage = new DatabaseStorage();