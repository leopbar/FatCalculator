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

// Tables

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(), // Manter por compatibilidade
  email: text("email").notNull().unique(),
  name: text("name"),
  password: text("password").notNull(),
});

export const bodyMetrics = pgTable("body_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  gender: text("gender", { enum: ["masculino", "feminino"] }).notNull(),
  age: integer("age").notNull(),
  height: real("height").notNull(), // cm
  weight: real("weight").notNull(), // kg
  neck: real("neck").notNull(),     // cm
  waist: real("waist").notNull(),   // cm
  hip: real("hip"),                 // cm (optional for males)
  activityLevel: text("activity_level", {
    enum: ["sedentario", "leve", "ligero", "moderado", "intenso", "muito_intenso"]
  }).notNull(),
});

export const calculations = pgTable("calculations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  bodyFatPercent: real("body_fat_percent").notNull(),
  category: text("category").notNull(), // fitness category
  bmr: real("bmr").notNull(),           // basal metabolic rate
  tdee: real("tdee").notNull(),         // total daily energy expenditure
});

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

export const alimentosHispanos = pgTable("alimentos_hispanos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nombre: text("nombre").notNull(),
  categoria: text("categoria").notNull(),
  calorias_por_100g: real("calorias_por_100g").notNull(),
  carbohidratos_por_100g: real("carbohidratos_por_100g").notNull(),
  proteinas_por_100g: real("proteinas_por_100g").notNull(),
  grasas_por_100g: real("grasas_por_100g").notNull(),
});

// Insert schemas

export const insertUserSchema = z.object({
  email: z.string().email("E-mail inválido"),
  name: z.string().optional(),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
});

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export const insertBodyMetricsSchema = z.object({
  age: z.coerce.number().int().positive().min(1).max(120),
  gender: z.enum(["masculino", "feminino"]),
  weight: z.coerce.number().positive().min(1).max(1000),
  height: z.coerce.number().positive().min(1).max(300),
  neck: z.coerce.number().positive().min(1).max(100),
  waist: z.coerce.number().positive().min(1).max(200),
  hip: z.coerce.number().positive().min(1).max(200).optional(),
  activityLevel: z.enum(["sedentario", "leve", "ligero", "moderado", "intenso", "muito_intenso"])
});

export const insertCalculationSchema = z.object({
  bodyFatPercent: z.coerce.number().min(0).max(100),
  category: z.string().min(1),
  bmr: z.coerce.number().positive(),
  tdee: z.coerce.number().positive()
});

export const insertMenuPlanSchema = createInsertSchema(menuPlans).omit({
  id: true,
  userId: true,
});

export const insertAlimentoHispanoSchema = createInsertSchema(alimentosHispanos).omit({
  id: true,
});

// Template menus table – stores pre-defined meal plan templates

export const templateMenus = pgTable("template_menus", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  gender: text("gender", { enum: ["masculino", "feminino"] }).notNull(),
  calorie_level: integer("calorie_level").notNull(),
  total_calories: real("total_calories").notNull(),
  protein_grams: real("protein_grams").notNull(),
  carb_grams: real("carb_grams").notNull(),
  fat_grams: real("fat_grams").notNull(),
  meals: json("meals").$type<MealTemplate[]>().notNull(),
  smart_substitutions: text("smart_substitutions").notNull(),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const insertTemplateMenuSchema = createInsertSchema(templateMenus).omit({
  id: true,
  created_at: true,
});

// Template menu schemas for pre-defined meal plans

export const mealItemTemplateSchema = z.object({
  name: z.string(),
  grams: z.number(),
  categoria: z.string(),
});

export const mealTemplateSchema = z.object({
  name: z.string(),
  items: z.array(mealItemTemplateSchema),
  approximate_calories: z.number(),
});

export const templateMenuSchema = z.object({
  name: z.string(),
  gender: z.enum(['masculino', 'feminino']),
  calorie_level: z.number(),
  total_calories: z.number(),
  protein_grams: z.number(),
  carb_grams: z.number(),
  fat_grams: z.number(),
  meals: z.array(mealTemplateSchema),
  smart_substitutions: z.string(),
});

export type MealItemTemplate = z.infer<typeof mealItemTemplateSchema>;
export type MealTemplate = z.infer<typeof mealTemplateSchema>;
export type TemplateMenu = z.infer<typeof templateMenuSchema>;

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
    fiber_per_100g: 0,
    energy_density: alimento.calorias_por_100g / 100,
  };
}

export function mapAlimentosToFoodItems(alimentos: AlimentoHispano[]): FoodItem[] {
  return alimentos.map(mapAlimentoToFoodItem);
}