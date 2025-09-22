import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, json, timestamp } from "drizzle-orm/pg-core";
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
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").unique(),
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

// Tables removed: cardapios, refeicoes, alimentos (old structure)
// New tables for menu generation

export const categorias_alimentos = pgTable("categorias_alimentos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nombre: text("nombre").notNull().unique(), // proteínas, carbohidratos, grasas, vegetales, frutas, lácteos, etc.
  descripcion: text("descripcion"),
  fecha_creacion: timestamp("fecha_creacion").defaultNow().notNull(),
});

export const menus = pgTable("menus", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nombre: text("nombre").notNull(),
  calorias_totales: real("calorias_totales").notNull().default(0),
  proteina_total_gramos: real("proteina_total_gramos").notNull().default(0),
  carbohidratos_total_gramos: real("carbohidratos_total_gramos").notNull().default(0),
  grasas_total_gramos: real("grasas_total_gramos").notNull().default(0),
  proteina_porcentaje: real("proteina_porcentaje").notNull().default(0),
  carbohidratos_porcentaje: real("carbohidratos_porcentaje").notNull().default(0),
  grasas_porcentaje: real("grasas_porcentaje").notNull().default(0),
  fecha_creacion: timestamp("fecha_creacion").defaultNow().notNull(),
});

export const comidas = pgTable("comidas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  menu_id: varchar("menu_id").notNull().references(() => menus.id, { onDelete: "cascade" }),
  tipo_comida: text("tipo_comida").notNull(), // desayuno, almuerzo, merienda, cena, colación
  calorias_comida: real("calorias_comida").notNull().default(0),
  proteina_comida_gramos: real("proteina_comida_gramos").notNull().default(0),
  carbohidratos_comida_gramos: real("carbohidratos_comida_gramos").notNull().default(0),
  grasas_comida_gramos: real("grasas_comida_gramos").notNull().default(0),
  fecha_creacion: timestamp("fecha_creacion").defaultNow().notNull(),
});

export const alimentos = pgTable("alimentos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  comida_id: varchar("comida_id").notNull().references(() => comidas.id, { onDelete: "cascade" }),
  categoria_id: varchar("categoria_id").notNull().references(() => categorias_alimentos.id),
  nombre: text("nombre").notNull(),
  cantidad_gramos: real("cantidad_gramos").notNull(),
  medida_casera: text("medida_casera"), // "1 taza", "2 cucharadas", etc.
  calorias: real("calorias").notNull(),
  proteina_gramos: real("proteina_gramos").notNull(),
  carbohidratos_gramos: real("carbohidratos_gramos").notNull(),
  grasas_gramos: real("grasas_gramos").notNull(),
  fecha_creacion: timestamp("fecha_creacion").defaultNow().notNull(),
});


// Insert schemas

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertBodyMetricsSchema = z.object({
  age: z.coerce.number().int().positive().min(1).max(120),
  gender: z.enum(["masculino", "feminino"]),
  weight: z.coerce.number().positive().min(1).max(1000),
  height: z.coerce.number().positive().min(1).max(300),
  neck: z.coerce.number().positive().min(1).max(100),
  waist: z.coerce.number().positive().min(1).max(200),
  hip: z.coerce.number().positive().min(1).max(200).nullable(), // Allow null for males
  activityLevel: z.enum(["sedentario", "leve", "ligero", "moderado", "intenso", "muito_intenso"])
});

export const insertCalculationSchema = z.object({
  bodyFatPercent: z.coerce.number().min(0).max(100),
  category: z.string().min(1),
  bmr: z.coerce.number().positive(),
  tdee: z.coerce.number().positive()
});

export const insertCategoriaAlimentoSchema = createInsertSchema(categorias_alimentos).omit({
  id: true,
  fecha_creacion: true,
});

export const insertMenuSchema = createInsertSchema(menus).omit({
  id: true,
  fecha_creacion: true,
});

export const insertComidaSchema = createInsertSchema(comidas).omit({
  id: true,
  fecha_creacion: true,
});

export const insertAlimentoSchema = createInsertSchema(alimentos).omit({
  id: true,
  fecha_creacion: true,
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

export type CategoriaAlimento = typeof categorias_alimentos.$inferSelect;
export type InsertCategoriaAlimento = z.infer<typeof insertCategoriaAlimentoSchema>;
export type Menu = typeof menus.$inferSelect;
export type InsertMenu = z.infer<typeof insertMenuSchema>;
export type Comida = typeof comidas.$inferSelect;
export type InsertComida = z.infer<typeof insertComidaSchema>;
export type Alimento = typeof alimentos.$inferSelect;
export type InsertAlimento = z.infer<typeof insertAlimentoSchema>;