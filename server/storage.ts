import {
  type User,
  type InsertUser,
  type BodyMetrics,
  type InsertBodyMetrics,
  type Calculation,
  type InsertCalculation,
  users,
  bodyMetrics,
  calculations
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
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

  
}

// Use DatabaseStorage instead of MemStorage for persistent data
export const storage = new DatabaseStorage();