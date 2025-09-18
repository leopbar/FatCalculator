import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Types for nutrition and meal planning (client-side only for now)
export const foodItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  // Macros per 100g based on USDA FoodData Central
  protein_per_100g: z.number(),
  carb_per_100g: z.number(),
  fat_per_100g: z.number(),
  kcal_per_100g: z.number(),
  fiber_per_100g: z.number(),
  // Energy density for satiety calculation (kcal/g)
  energy_density: z.number(),
});

export const mealItemSchema = z.object({
  foodId: z.string(),
  name: z.string(),
  grams: z.number(),
  protein: z.number(),
  carb: z.number(),
  fat: z.number(),
  kcal: z.number(),
});

export const mealSchema = z.object({
  name: z.string(),
  items: z.array(mealItemSchema),
  totals: z.object({
    protein: z.number(),
    carb: z.number(),
    fat: z.number(),
    kcal: z.number(),
  }),
});

export const macroTargetSchema = z.object({
  calories: z.number(),
  protein_g: z.number(),
  carb_g: z.number(),
  fat_g: z.number(),
  protein_percent: z.number(),
  carb_percent: z.number(),
  fat_percent: z.number(),
});

export const menuPlanSchema = z.object({
  category: z.enum(['suave', 'moderado', 'restritivo']),
  tdee: z.number(),
  targetCalories: z.number(),
  macroTarget: macroTargetSchema,
  meals: z.array(mealSchema),
  dailyTotals: z.object({
    protein: z.number(),
    carb: z.number(),
    fat: z.number(),
    kcal: z.number(),
  }),
});

export type FoodItem = z.infer<typeof foodItemSchema>;
export type MealItem = z.infer<typeof mealItemSchema>;
export type Meal = z.infer<typeof mealSchema>;
export type MacroTarget = z.infer<typeof macroTargetSchema>;
export type MenuPlan = z.infer<typeof menuPlanSchema>;

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Body metrics table - stores user measurements
export const bodyMetrics = pgTable("body_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  gender: text("gender", { enum: ["masculino", "feminino"] }).notNull(),
  age: integer("age").notNull(),
  height: real("height").notNull(), // cm
  weight: real("weight").notNull(), // kg
  neck: real("neck").notNull(), // cm
  waist: real("waist").notNull(), // cm
  hip: real("hip"), // cm (optional for males)
  activityLevel: text("activity_level", { 
    enum: ["sedentario", "leve", "moderado", "intenso", "muito_intenso"] 
  }).notNull(),
});

// Calculation results table - stores body fat, BMR, TDEE calculations
export const calculations = pgTable("calculations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  bodyFatPercent: real("body_fat_percent").notNull(),
  category: text("category").notNull(), // fitness category
  bmr: real("bmr").notNull(), // basal metabolic rate
  tdee: real("tdee").notNull(), // total daily energy expenditure
});

// Menu plans table - stores generated meal plans
export const menuPlans = pgTable("menu_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  category: text("category", { enum: ["suave", "moderado", "restritivo"] }).notNull(),
  tdee: real("tdee").notNull(),
  targetCalories: real("target_calories").notNull(),
  macroTarget: json("macro_target").$type<MacroTarget>().notNull(),
  meals: json("meals").$type<Meal[]>().notNull(),
  dailyTotals: json("daily_totals").$type<{
    protein: number;
    carb: number;
    fat: number;
    kcal: number;
  }>().notNull(),
});

// Alimentos hispanos table - stores Hispanic food nutritional data
export const alimentosHispanos = pgTable("alimentos_hispanos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nombre: text("nombre").notNull(), // Spanish food name
  categoria: text("categoria").notNull(), // Category (A-Cereales, B-Verduras, etc.)
  calorias_por_100g: real("calorias_por_100g").notNull(),
  carbohidratos_por_100g: real("carbohidratos_por_100g").notNull(),
  proteinas_por_100g: real("proteinas_por_100g").notNull(),
  grasas_por_100g: real("grasas_por_100g").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertBodyMetricsSchema = createInsertSchema(bodyMetrics).omit({
  id: true,
  userId: true,
});

export const insertCalculationSchema = createInsertSchema(calculations).omit({
  id: true,
  userId: true,
});

export const insertMenuPlanSchema = createInsertSchema(menuPlans).omit({
  id: true,
  userId: true,
});

export const insertAlimentoHispanoSchema = createInsertSchema(alimentosHispanos).omit({
  id: true,
});

export const insertTemplateMenuSchema = createInsertSchema(templateMenus).omit({
  id: true,
  created_at: true,
});</old_str>

// Template menu schemas for pre-defined meal plans
export const mealItemTemplateSchema = z.object({
  name: z.string(),
  grams: z.number(),
  categoria: z.string(), // categoria do alimento hispano
});

export const mealTemplateSchema = z.object({
  name: z.string(),
  items: z.array(mealItemTemplateSchema),
  approximate_calories: z.number(),
});

export const templateMenuSchema = z.object({
  name: z.string(),
  gender: z.enum(['masculino', 'feminino']),
  calorie_level: z.number(), // 1200, 1500, 1800, 2000, 2300, 2500
  total_calories: z.number(),
  protein_grams: z.number(),
  carb_grams: z.number(),
  fat_grams: z.number(),
  meals: z.array(mealTemplateSchema),
  smart_substitutions: z.string(), // texto das substituições inteligentes
});

export type MealItemTemplate = z.infer<typeof mealItemTemplateSchema>;
export type MealTemplate = z.infer<typeof mealTemplateSchema>;
export type TemplateMenu = z.infer<typeof templateMenuSchema>;

// Template menus table - stores pre-defined meal plan templates
export const templateMenus = pgTable("template_menus", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // "Cardápio 1 – Mulheres – 1200 kcal"
  gender: text("gender", { enum: ["masculino", "feminino"] }).notNull(),
  calorie_level: integer("calorie_level").notNull(), // 1200, 1500, 1800, etc.
  total_calories: real("total_calories").notNull(),
  protein_grams: real("protein_grams").notNull(),
  carb_grams: real("carb_grams").notNull(),
  fat_grams: real("fat_grams").notNull(),
  meals: json("meals").$type<MealTemplate[]>().notNull(),
  smart_substitutions: text("smart_substitutions").notNull(),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type BodyMetrics = typeof bodyMetrics.$inferSelect;
export type InsertBodyMetrics = z.infer<typeof insertBodyMetricsSchema>;
export type Calculation = typeof calculations.$inferSelect;
export type InsertCalculation = z.infer<typeof insertCalculationSchema>;
export type MenuPlanData = typeof menuPlans.$inferSelect;
export type InsertMenuPlan = z.infer<typeof insertMenuPlanSchema>;
export type AlimentoHispano = typeof alimentosHispanos.$inferSelect;
export type InsertAlimentoHispano = z.infer<typeof insertAlimentoHispanoSchema>;
export type TemplateMenuData = typeof templateMenus.$inferSelect;
export type InsertTemplateMenu = typeof templateMenus.$inferInsert;</old_str>

// Mapper function to convert AlimentoHispano to FoodItem
export function mapAlimentoToFoodItem(alimento: AlimentoHispano): FoodItem {
  return {
    id: alimento.id,
    name: alimento.nombre,
    category: alimento.categoria,
    protein_per_100g: alimento.proteinas_por_100g,
    carb_per_100g: alimento.carbohidratos_por_100g,
    fat_per_100g: alimento.grasas_por_100g,
    kcal_per_100g: alimento.calorias_por_100g,
    fiber_per_100g: 0, // Default for now, can be updated later if data is available
    energy_density: alimento.calorias_por_100g / 100, // kcal/g
  };
}

// Helper function to map array of AlimentoHispano to FoodItem array
export function mapAlimentosToFoodItems(alimentos: AlimentoHispano[]): FoodItem[] {
  return alimentos.map(mapAlimentoToFoodItem);
}
