import { 
  type User, 
  type InsertUser,
  type BodyMetrics,
  type InsertBodyMetrics,
  type Calculation,
  type InsertCalculation,
  type MenuPlanData,
  type InsertMenuPlan,
  type AlimentoHispano,
  type InsertAlimentoHispano,
  type TemplateMenuData,
  type InsertTemplateMenu,
  users,
  bodyMetrics,
  calculations,
  menuPlans,
  alimentosHispanos,
  templateMenus
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
  deleteMenuPlan(userId: string): Promise<void>;

  // Alimentos hispanos methods
  createAlimento(data: InsertAlimentoHispano): Promise<AlimentoHispano>;
  getAllAlimentos(): Promise<AlimentoHispano[]>;
  getAlimentosByCategoria(categoria: string): Promise<AlimentoHispano[]>;
  bulkCreateAlimentos(alimentos: InsertAlimentoHispano[]): Promise<void>;

  // User summary for dashboard
  getUserSummary(userId: string): Promise<{
    hasMetrics: boolean;
    hasCalculation: boolean;
    hasMenu: boolean;
  }>;

  // Clear all user data
  clearAllUserData(userId: string): Promise<void>;

  // Template menu methods
  createTemplateMenu(data: InsertTemplateMenu): Promise<TemplateMenuData>;
  getAllTemplateMenus(): Promise<TemplateMenuData[]>;
  getTemplateMenusByGenderAndCalories(gender: string, targetCalories: number): Promise<TemplateMenuData[]>;
  findBestMatchingTemplate(gender: string, targetCalories: number, targetProtein: number, targetCarb: number, targetFat: number): Promise<TemplateMenuData | undefined>;
  bulkCreateTemplateMenus(templates: InsertTemplateMenu[]): Promise<void>;

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
    // Primeiro tenta por e-mail, depois por username (compatibilidade)
    const userByEmail = await db.select().from(users).where(eq(users.email, username)).limit(1);
    if (userByEmail.length > 0) {
      return userByEmail[0];
    }

    return await db.select().from(users).where(eq(users.username, username)).limit(1).then(rows => rows[0]);
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

  async deleteMenuPlan(userId: string): Promise<void> {
    await db.delete(menuPlans).where(eq(menuPlans.userId, userId));
  }

  async clearAllUserData(userId: string): Promise<void> {
    // Delete all user data in the correct order (due to foreign key constraints)
    await db.delete(menuPlans).where(eq(menuPlans.userId, userId));
    await db.delete(calculations).where(eq(calculations.userId, userId));
    await db.delete(bodyMetrics).where(eq(bodyMetrics.userId, userId));
  }

  // Alimentos hispanos methods
  async createAlimento(data: InsertAlimentoHispano): Promise<AlimentoHispano> {
    const [alimento] = await db
      .insert(alimentosHispanos)
      .values(data)
      .returning();
    return alimento;
  }

  async getAllAlimentos(): Promise<AlimentoHispano[]> {
    return await db.select().from(alimentosHispanos);
  }

  async getAlimentosByCategoria(categoria: string): Promise<AlimentoHispano[]> {
    return await db
      .select()
      .from(alimentosHispanos)
      .where(eq(alimentosHispanos.categoria, categoria));
  }

  async bulkCreateAlimentos(alimentos: InsertAlimentoHispano[]): Promise<void> {
    if (alimentos.length > 0) {
      await db.insert(alimentosHispanos).values(alimentos);
    }
  }

  // Template menu methods
  async createTemplateMenu(data: InsertTemplateMenu): Promise<TemplateMenuData> {
    const [templateMenu] = await db
      .insert(templateMenus)
      .values(data)
      .returning();
    return templateMenu;
  }

  async getAllTemplateMenus(): Promise<TemplateMenuData[]> {
    return await db.select().from(templateMenus);
  }

  async getTemplateMenusByGenderAndCalories(gender: string, targetCalories: number): Promise<TemplateMenuData[]> {
    return await db
      .select()
      .from(templateMenus)
      .where(eq(templateMenus.gender, gender));
  }

  async findBestMatchingTemplate(
    gender: string,
    targetCalories: number,
    targetProtein: number,
    targetCarb: number,
    targetFat: number
  ): Promise<TemplateMenuData | undefined> {
    const templates = await db
      .select()
      .from(templateMenus)
      .where(eq(templateMenus.gender, gender));

    if (templates.length === 0) return undefined;

    // Calculate similarity score for each template
    let bestTemplate = templates[0];
    let bestScore = Infinity;

    for (const template of templates) {
      // Calculate normalized differences
      const caloriesDiff = Math.abs(template.total_calories - targetCalories) / targetCalories;
      const proteinDiff = Math.abs(template.protein_grams - targetProtein) / Math.max(targetProtein, 1);
      const carbDiff = Math.abs(template.carb_grams - targetCarb) / Math.max(targetCarb, 1);
      const fatDiff = Math.abs(template.fat_grams - targetFat) / Math.max(targetFat, 1);

      // Weighted similarity score (calories have higher weight)
      const score = (caloriesDiff * 0.4) + (proteinDiff * 0.2) + (carbDiff * 0.2) + (fatDiff * 0.2);

      if (score < bestScore) {
        bestScore = score;
        bestTemplate = template;
      }
    }

    console.log(`✅ Best template found: ${bestTemplate?.name} with score: ${bestScore.toFixed(3)}`);
    return bestTemplate;
  }

  async bulkCreateTemplateMenus(templates: InsertTemplateMenu[]): Promise<void> {
    if (templates.length > 0) {
      await db.insert(templateMenus).values(templates);
    }
  }
}

// Keep MemStorage for fallback if needed
export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private bodyMetrics: Map<string, BodyMetrics>; // keyed by userId
  private calculations: Map<string, Calculation>; // keyed by userId
  private menuPlans: Map<string, MenuPlanData>; // keyed by userId
  private alimentos: Map<string, AlimentoHispano>; // keyed by id
  sessionStore: any; // Using any for compatibility with express-session types

  constructor() {
    this.users = new Map();
    this.bodyMetrics = new Map();
    this.calculations = new Map();
    this.menuPlans = new Map();
    this.alimentos = new Map();
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

  async deleteMenuPlan(userId: string): Promise<void> {
    this.menuPlans.delete(userId);
  }

  async clearAllUserData(userId: string): Promise<void> {
    this.bodyMetrics.delete(userId);
    this.calculations.delete(userId);
    this.menuPlans.delete(userId);
  }

  // Alimentos hispanos methods
  async createAlimento(data: InsertAlimentoHispano): Promise<AlimentoHispano> {
    const id = randomUUID();
    const alimento: AlimentoHispano = { ...data, id };
    this.alimentos.set(id, alimento);
    return alimento;
  }

  async getAllAlimentos(): Promise<AlimentoHispano[]> {
    return Array.from(this.alimentos.values());
  }

  async getAlimentosByCategoria(categoria: string): Promise<AlimentoHispano[]> {
    return Array.from(this.alimentos.values()).filter(
      (alimento) => alimento.categoria === categoria
    );
  }

  async bulkCreateAlimentos(alimentos: InsertAlimentoHispano[]): Promise<void> {
    alimentos.forEach((data) => {
      const id = randomUUID();
      const alimento: AlimentoHispano = { ...data, id };
      this.alimentos.set(id, alimento);
    });
  }

  // Template menu methods for MemStorage
  private templateMenus: Map<string, TemplateMenuData> = new Map();

  async createTemplateMenu(data: InsertTemplateMenu): Promise<TemplateMenuData> {
    const id = randomUUID();
    const templateMenu: TemplateMenuData = { 
      ...data, 
      id,
      created_at: new Date().toISOString()
    } as TemplateMenuData;
    this.templateMenus.set(id, templateMenu);
    return templateMenu;
  }

  async getAllTemplateMenus(): Promise<TemplateMenuData[]> {
    return Array.from(this.templateMenus.values());
  }

  async getTemplateMenusByGenderAndCalories(gender: string, targetCalories: number): Promise<TemplateMenuData[]> {
    return Array.from(this.templateMenus.values()).filter(
      (template) => template.gender === gender
    );
  }

  async findBestMatchingTemplate(
    gender: string, 
    targetCalories: number, 
    targetProtein: number, 
    targetCarb: number, 
    targetFat: number
  ): Promise<TemplateMenuData | undefined> {
    const templates = Array.from(this.templateMenus.values()).filter(
      (template) => template.gender === gender
    );

    if (templates.length === 0) return undefined;

    let bestTemplate = templates[0];
    let bestScore = Infinity;

    for (const template of templates) {
      const calorieDiff = Math.abs(template.total_calories - targetCalories) / targetCalories;
      const proteinDiff = Math.abs(template.protein_grams - targetProtein) / targetProtein;
      const carbDiff = Math.abs(template.carb_grams - targetCarb) / targetCarb;
      const fatDiff = Math.abs(template.fat_grams - targetFat) / targetFat;

      const score = (calorieDiff * 0.4) + (proteinDiff * 0.2) + (carbDiff * 0.2) + (fatDiff * 0.2);

      if (score < bestScore) {
        bestScore = score;
        bestTemplate = template;
      }
    }

    return bestTemplate;
  }

  async bulkCreateTemplateMenus(templates: InsertTemplateMenu[]): Promise<void> {
    templates.forEach((data) => {
      const id = randomUUID();
      const templateMenu: TemplateMenuData = { 
        ...data, 
        id,
        created_at: new Date().toISOString()
      } as TemplateMenuData;
      this.templateMenus.set(id, templateMenu);
    });
  }
}

// Use DatabaseStorage instead of MemStorage for persistent data
export const storage = new DatabaseStorage();