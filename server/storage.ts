import { 
  type User, 
  type InsertUser,
  type BodyMetrics,
  type InsertBodyMetrics,
  type Calculation,
  type InsertCalculation,
  type MenuPlanData,
  type InsertMenuPlan,
  type Food,
  type InsertFood,
  users,
  bodyMetrics,
  calculations,
  menuPlans,
  foods
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";
import { randomUUID } from "crypto";
import session from "express-session";
import createMemoryStore from "memorystore";
import ConnectPgSimple from "connect-pg-simple";

// Based on javascript_auth_all_persistance blueprint  
const MemoryStore = createMemoryStore(session);
const PgStore = ConnectPgSimple(session);

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Body metrics methods
  upsertBodyMetrics(userId: string, data: InsertBodyMetrics): Promise<BodyMetrics>;
  getBodyMetrics(userId: string): Promise<BodyMetrics | undefined>;
  
  // Calculation methods
  saveCalculation(userId: string, data: InsertCalculation): Promise<Calculation>;
  getLatestCalculation(userId: string): Promise<Calculation | undefined>;
  
  // Menu plan methods
  saveMenuPlan(userId: string, data: InsertMenuPlan): Promise<MenuPlanData>;
  getLatestMenuPlan(userId: string): Promise<MenuPlanData | undefined>;
  
  // User summary for dashboard
  getUserSummary(userId: string): Promise<{
    hasMetrics: boolean;
    hasCalculation: boolean;
    hasMenu: boolean;
  }>;
  
  // Clear all user data
  clearAllUserData(userId: string): Promise<void>;
  
  // Food methods
  getFoods(filters?: { category?: string; macro_class?: string; limit?: number }): Promise<Food[]>;
  seedFoods(foods: InsertFood[]): Promise<void>;
  getFoodsByMacroClass(macro_class: string, limit?: number): Promise<Food[]>;
  
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

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
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
          hip: data.hip ?? null,
          activityLevel: data.activityLevel
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

  async saveMenuPlan(userId: string, data: InsertMenuPlan): Promise<MenuPlanData> {
    const row = { ...data, userId } as typeof menuPlans.$inferInsert;
    const [menuPlan] = await db
      .insert(menuPlans)
      .values(row)
      .returning();
    return menuPlan as MenuPlanData;
  }

  async getLatestMenuPlan(userId: string): Promise<MenuPlanData | undefined> {
    const [menuPlan] = await db
      .select()
      .from(menuPlans)
      .where(eq(menuPlans.userId, userId))
      .orderBy(desc(menuPlans.id)) // Get the most recent one
      .limit(1);
    return (menuPlan as MenuPlanData) || undefined;
  }

  async getUserSummary(userId: string): Promise<{
    hasMetrics: boolean;
    hasCalculation: boolean;
    hasMenu: boolean;
  }> {
    const [userMetrics] = await db.select().from(bodyMetrics).where(eq(bodyMetrics.userId, userId));
    const [userCalculation] = await db.select().from(calculations).where(eq(calculations.userId, userId));
    const [userMenu] = await db.select().from(menuPlans).where(eq(menuPlans.userId, userId));

    return {
      hasMetrics: !!userMetrics,
      hasCalculation: !!userCalculation,
      hasMenu: !!userMenu,
    };
  }

  async clearAllUserData(userId: string): Promise<void> {
    // Delete all user data in the correct order (due to foreign key constraints)
    await db.delete(menuPlans).where(eq(menuPlans.userId, userId));
    await db.delete(calculations).where(eq(calculations.userId, userId));
    await db.delete(bodyMetrics).where(eq(bodyMetrics.userId, userId));
  }

  async getFoods(filters?: { category?: string; macro_class?: string; limit?: number }): Promise<Food[]> {
    if (!filters || (!filters.category && !filters.macro_class)) {
      // Simple case - no filters
      const query = db.select().from(foods);
      return filters?.limit ? await query.limit(filters.limit) : await query;
    }
    
    // Complex case - with filters
    if (filters.category && filters.macro_class) {
      const query = db.select().from(foods)
        .where(and(
          eq(foods.category, filters.category),
          eq(foods.macro_class, filters.macro_class as any)
        ));
      return filters.limit ? await query.limit(filters.limit) : await query;
    }
    
    if (filters.category) {
      const query = db.select().from(foods).where(eq(foods.category, filters.category));
      return filters.limit ? await query.limit(filters.limit) : await query;
    }
    
    if (filters.macro_class) {
      const query = db.select().from(foods).where(eq(foods.macro_class, filters.macro_class as any));
      return filters.limit ? await query.limit(filters.limit) : await query;
    }
    
    return [];
  }

  async seedFoods(foodList: InsertFood[]): Promise<void> {
    // Use batch insert with conflict resolution
    if (foodList.length === 0) return;
    
    // Insert in batches to avoid hitting query limits
    const batchSize = 100;
    for (let i = 0; i < foodList.length; i += batchSize) {
      const batch = foodList.slice(i, i + batchSize);
      await db.insert(foods).values(batch).onConflictDoNothing({
        target: [foods.name, foods.category]
      });
    }
  }

  async getFoodsByMacroClass(macro_class: string, limit = 20): Promise<Food[]> {
    return await db
      .select()
      .from(foods)
      .where(eq(foods.macro_class, macro_class as any))
      .limit(limit);
  }
}

// Keep MemStorage for fallback if needed
export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private bodyMetrics: Map<string, BodyMetrics>; // keyed by userId
  private calculations: Map<string, Calculation>; // keyed by userId
  private menuPlans: Map<string, MenuPlanData>; // keyed by userId
  private foods: Map<string, Food>; // keyed by food id
  sessionStore: any; // Using any for compatibility with express-session types

  constructor() {
    this.users = new Map();
    this.bodyMetrics = new Map();
    this.calculations = new Map();
    this.menuPlans = new Map();
    this.foods = new Map();
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

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
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

  async saveMenuPlan(userId: string, data: InsertMenuPlan): Promise<MenuPlanData> {
    const id = randomUUID();
    const menuPlan: MenuPlanData = { 
      ...data, 
      id, 
      userId
    } as MenuPlanData;
    this.menuPlans.set(userId, menuPlan);
    return menuPlan;
  }

  async getLatestMenuPlan(userId: string): Promise<MenuPlanData | undefined> {
    return this.menuPlans.get(userId);
  }

  async getUserSummary(userId: string): Promise<{
    hasMetrics: boolean;
    hasCalculation: boolean;
    hasMenu: boolean;
  }> {
    return {
      hasMetrics: this.bodyMetrics.has(userId),
      hasCalculation: this.calculations.has(userId),
      hasMenu: this.menuPlans.has(userId),
    };
  }

  async clearAllUserData(userId: string): Promise<void> {
    this.bodyMetrics.delete(userId);
    this.calculations.delete(userId);
    this.menuPlans.delete(userId);
  }

  async getFoods(filters?: { category?: string; macro_class?: string; limit?: number }): Promise<Food[]> {
    let result = Array.from(this.foods.values());
    
    if (filters?.category) {
      result = result.filter(f => f.category === filters.category);
    }
    if (filters?.macro_class) {
      result = result.filter(f => f.macro_class === filters.macro_class);
    }
    if (filters?.limit) {
      result = result.slice(0, filters.limit);
    }
    
    return result;
  }

  async seedFoods(foodList: InsertFood[]): Promise<void> {
    for (const food of foodList) {
      const id = randomUUID();
      const foodWithId: Food = { 
        ...food, 
        id,
        fiber_per_100g: food.fiber_per_100g ?? 0 
      };
      this.foods.set(id, foodWithId);
    }
  }

  async getFoodsByMacroClass(macro_class: string, limit = 20): Promise<Food[]> {
    return Array.from(this.foods.values())
      .filter(f => f.macro_class === macro_class)
      .slice(0, limit);
  }
}

// Use DatabaseStorage instead of MemStorage for persistent data
export const storage = new DatabaseStorage();
