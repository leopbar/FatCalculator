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

// Foods table - stores official nutritional data from hispanic table
export const foods = pgTable("foods", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(), // A-Cereales, B-Verduras, C-Frutas, etc.
  // Macros per 100g from official hispanic nutritional table
  protein_per_100g: real("protein_per_100g").notNull(),
  carb_per_100g: real("carb_per_100g").notNull(),
  fat_per_100g: real("fat_per_100g").notNull(),
  kcal_per_100g: real("kcal_per_100g").notNull(),
  fiber_per_100g: real("fiber_per_100g").default(0), // Default 0 if not specified
  // Energy density for satiety calculation (kcal/g)
  energy_density: real("energy_density").notNull(),
  // Macro classification for meal generation
  macro_class: text("macro_class", { 
    enum: ["protein", "carb", "fat", "vegetable", "mixed"] 
  }).notNull(),
});

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

export const insertFoodSchema = createInsertSchema(foods).omit({
  id: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Food = typeof foods.$inferSelect;
export type InsertFood = z.infer<typeof insertFoodSchema>;
export type BodyMetrics = typeof bodyMetrics.$inferSelect;
export type InsertBodyMetrics = z.infer<typeof insertBodyMetricsSchema>;
export type Calculation = typeof calculations.$inferSelect;
export type InsertCalculation = z.infer<typeof insertCalculationSchema>;
export type MenuPlanData = typeof menuPlans.$inferSelect;
export type InsertMenuPlan = z.infer<typeof insertMenuPlanSchema>;
