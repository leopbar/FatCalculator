import { 
  type User, 
  type InsertUser,
  type BodyMetrics,
  type InsertBodyMetrics,
  type Calculation,
  type InsertCalculation,
  type MenuPlanData,
  type InsertMenuPlan
} from "@shared/schema";
import { randomUUID } from "crypto";
import session from "express-session";
import createMemoryStore from "memorystore";

// Based on javascript_auth_all_persistance blueprint
const MemoryStore = createMemoryStore(session);

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
  
  sessionStore: any; // Using any for compatibility with express-session types
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private bodyMetrics: Map<string, BodyMetrics>; // keyed by userId
  private calculations: Map<string, Calculation>; // keyed by userId
  private menuPlans: Map<string, MenuPlanData>; // keyed by userId
  sessionStore: any; // Using any for compatibility with express-session types

  constructor() {
    this.users = new Map();
    this.bodyMetrics = new Map();
    this.calculations = new Map();
    this.menuPlans = new Map();
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
}

export const storage = new MemStorage();
