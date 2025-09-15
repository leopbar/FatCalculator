import { MacroTarget, FoodItem, Meal, MealItem, MenuPlan } from "@shared/schema";
import foodsData from "@shared/data/foods.json";

// Parse foods data with proper typing
export const FOODS: FoodItem[] = foodsData as FoodItem[];

// Get food by ID with error handling
export function getFoodById(id: string): FoodItem {
  const food = FOODS.find(f => f.id === id);
  if (!food) {
    throw new Error(`Food with id ${id} not found`);
  }
  return food;
}

// Calculate macronutrient targets based on international standards (AMDR)
export function calculateMacroTargets(
  tdee: number,
  targetCalories: number,
  bodyWeight: number,
  bodyFatPercentage: number,
  category: 'suave' | 'moderado' | 'restritivo'
): MacroTarget {
  // Validate inputs
  if (!Number.isFinite(tdee) || !Number.isFinite(targetCalories) || 
      !Number.isFinite(bodyWeight) || !Number.isFinite(bodyFatPercentage)) {
    throw new Error("Invalid numeric inputs for macro calculation");
  }

  // Calculate Lean Body Mass (LBM) in kg
  const lbm = bodyWeight * (1 - bodyFatPercentage / 100);
  
  // Protein targets based on ISSN/ACSM guidelines (g/kg LBM)
  // Higher protein for more restrictive diets to preserve muscle mass
  const proteinPerKgLBM = {
    suave: 1.8,
    moderado: 2.0,
    restritivo: 2.2
  };
  
  let proteinGrams = lbm * proteinPerKgLBM[category];
  let proteinCalories = proteinGrams * 4;
  
  // Ensure protein stays within AMDR bounds (10-35% of total calories)
  const minProteinCal = targetCalories * 0.10;
  const maxProteinCal = targetCalories * 0.35;
  
  if (proteinCalories < minProteinCal) {
    proteinCalories = minProteinCal;
    proteinGrams = proteinCalories / 4;
  } else if (proteinCalories > maxProteinCal) {
    proteinCalories = maxProteinCal;
    proteinGrams = proteinCalories / 4;
  }
  
  // Minimum fat for hormone production and essential fatty acids (0.6 g/kg LBM)
  // But ensure fat doesn't exceed 35% of calories (AMDR upper bound)
  let fatGrams = Math.max(lbm * 0.6, targetCalories * 0.20 / 9);
  let fatCalories = fatGrams * 9;
  
  const maxFatCal = targetCalories * 0.35;
  if (fatCalories > maxFatCal) {
    fatCalories = maxFatCal;
    fatGrams = fatCalories / 9;
  }
  
  // Remaining calories go to carbohydrates
  let remainingCalories = targetCalories - proteinCalories - fatCalories;
  let carbCalories = remainingCalories;
  
  // Ensure carbs stay within AMDR bounds (45-65%)
  const minCarbCal = targetCalories * 0.45;
  const maxCarbCal = targetCalories * 0.65;
  
  // Adjust if carbs are outside AMDR bounds
  if (carbCalories < minCarbCal) {
    carbCalories = minCarbCal;
    fatCalories = targetCalories - proteinCalories - carbCalories;
    fatGrams = fatCalories / 9;
  } else if (carbCalories > maxCarbCal) {
    carbCalories = maxCarbCal;
    // Increase fat with remaining calories (keeping within fat max of 35%)
    const adjustedFatCal = targetCalories - proteinCalories - carbCalories;
    const maxFatCalAllowed = targetCalories * 0.35;
    
    if (adjustedFatCal <= maxFatCalAllowed) {
      fatCalories = adjustedFatCal;
      fatGrams = fatCalories / 9;
    } else {
      // If we can't fit remaining in fat, distribute between fat and protein
      fatCalories = maxFatCalAllowed;
      fatGrams = fatCalories / 9;
      const extraCal = targetCalories - carbCalories - fatCalories;
      proteinCalories += extraCal;
      proteinGrams = proteinCalories / 4;
    }
  }
  
  const carbGrams = carbCalories / 4;
  
  return {
    calories: targetCalories,
    protein_g: Math.round(proteinGrams),
    carb_g: Math.round(carbGrams),
    fat_g: Math.round(fatGrams),
    protein_percent: Math.round((proteinCalories / targetCalories) * 100),
    carb_percent: Math.round((carbCalories / targetCalories) * 100),
    fat_percent: Math.round((fatCalories / targetCalories) * 100),
  };
}

// Calculate macros for a specific amount of food
export function calculateFoodMacros(food: FoodItem, grams: number): {
  protein: number;
  carb: number;
  fat: number;
  kcal: number;
} {
  const factor = grams / 100;
  return {
    protein: Math.round(food.protein_per_100g * factor * 10) / 10,
    carb: Math.round(food.carb_per_100g * factor * 10) / 10,
    fat: Math.round(food.fat_per_100g * factor * 10) / 10,
    kcal: Math.round(food.kcal_per_100g * factor),
  };
}

// Generate a balanced meal plan with 5 meals
export function generateMealPlan(
  macroTarget: MacroTarget,
  category: 'suave' | 'moderado' | 'restritivo'
): Meal[] {
  // Meal distribution (percentage of daily calories)
  const mealDistribution = {
    "Café da manhã": 0.20,
    "Almoço": 0.30,
    "Lanche da tarde": 0.15,
    "Janta": 0.25,
    "Ceia": 0.10
  };
  
  const meals: Meal[] = [];
  
  Object.entries(mealDistribution).forEach(([mealName, calorieRatio]) => {
    const mealCalories = Math.round(macroTarget.calories * calorieRatio);
    const mealProtein = Math.round(macroTarget.protein_g * calorieRatio);
    const mealCarb = Math.round(macroTarget.carb_g * calorieRatio);
    const mealFat = Math.round(macroTarget.fat_g * calorieRatio);
    
    const mealItems = generateMealItems(mealName, mealCalories, mealProtein, mealCarb, mealFat);
    
    // Calculate meal totals
    const totals = mealItems.reduce(
      (acc, item) => ({
        protein: acc.protein + item.protein,
        carb: acc.carb + item.carb,
        fat: acc.fat + item.fat,
        kcal: acc.kcal + item.kcal,
      }),
      { protein: 0, carb: 0, fat: 0, kcal: 0 }
    );
    
    meals.push({
      name: mealName,
      items: mealItems,
      totals: {
        protein: Math.round(totals.protein * 10) / 10,
        carb: Math.round(totals.carb * 10) / 10,
        fat: Math.round(totals.fat * 10) / 10,
        kcal: Math.round(totals.kcal),
      },
    });
  });
  
  return meals;
}

// Generate items for a specific meal
function generateMealItems(
  mealName: string,
  targetCalories: number,
  targetProtein: number,
  targetCarb: number,
  targetFat: number
): MealItem[] {
  const items: MealItem[] = [];
  
  // Meal templates based on meal type
  const mealTemplates = {
    "Café da manhã": {
      protein: ["protein_eggs", "protein_greek_yogurt"],
      carb: ["carb_oats", "carb_banana", "carb_bread_whole"],
      fat: ["fat_almonds", "fat_peanut_butter"],
      vegetable: ["vegetable_tomato"]
    },
    "Almoço": {
      protein: ["protein_chicken_breast", "protein_tilapia"],
      carb: ["carb_brown_rice", "carb_sweet_potato"],
      fat: ["fat_olive_oil", "fat_avocado"],
      vegetable: ["vegetable_broccoli", "vegetable_lettuce"]
    },
    "Lanche da tarde": {
      protein: ["protein_greek_yogurt", "protein_cottage_cheese"],
      carb: ["carb_banana", "carb_oats"],
      fat: ["fat_almonds"],
      vegetable: ["vegetable_cucumber"]
    },
    "Janta": {
      protein: ["protein_chicken_breast", "protein_tilapia"],
      carb: ["carb_sweet_potato", "carb_brown_rice"],
      fat: ["fat_olive_oil"],
      vegetable: ["vegetable_spinach", "vegetable_broccoli"]
    },
    "Ceia": {
      protein: ["protein_cottage_cheese", "protein_greek_yogurt"],
      carb: ["carb_banana"],
      fat: ["fat_almonds"],
      vegetable: ["vegetable_cucumber"]
    }
  };
  
  const template = mealTemplates[mealName as keyof typeof mealTemplates];
  
  // Add protein source (primary)
  const proteinFood = getFoodById(template.protein[0]);
  const proteinGrams = Math.round((targetProtein * 100 / proteinFood.protein_per_100g) / 5) * 5; // Round to 5g
  const proteinMacros = calculateFoodMacros(proteinFood, proteinGrams);
  
  items.push({
    foodId: proteinFood.id,
    name: proteinFood.name,
    grams: proteinGrams,
    ...proteinMacros
  });
  
  // Add vegetables for volume and satiety
  const vegetableFood = getFoodById(template.vegetable[0]);
  const vegetableGrams = Math.max(100, Math.round(targetCalories * 0.3 / vegetableFood.kcal_per_100g * 100)); // At least 100g
  const vegetableMacros = calculateFoodMacros(vegetableFood, vegetableGrams);
  
  items.push({
    foodId: vegetableFood.id,
    name: vegetableFood.name,
    grams: vegetableGrams,
    ...vegetableMacros
  });
  
  // Calculate remaining macros needed
  const usedProtein = proteinMacros.protein + vegetableMacros.protein;
  const usedCarb = proteinMacros.carb + vegetableMacros.carb;
  const usedFat = proteinMacros.fat + vegetableMacros.fat;
  const usedCalories = proteinMacros.kcal + vegetableMacros.kcal;
  
  const remainingCarb = Math.max(0, targetCarb - usedCarb);
  const remainingFat = Math.max(0, targetFat - usedFat);
  
  // Add carbohydrate source
  if (remainingCarb > 5) {
    const carbFood = getFoodById(template.carb[0]);
    const carbGrams = Math.round((remainingCarb * 100 / carbFood.carb_per_100g) / 5) * 5;
    const carbMacros = calculateFoodMacros(carbFood, carbGrams);
    
    items.push({
      foodId: carbFood.id,
      name: carbFood.name,
      grams: carbGrams,
      ...carbMacros
    });
  }
  
  // Add fat source
  if (remainingFat > 2) {
    const fatFood = getFoodById(template.fat[0]);
    const fatGrams = Math.round((remainingFat * 100 / fatFood.fat_per_100g) / 5) * 5;
    const fatMacros = calculateFoodMacros(fatFood, Math.max(5, fatGrams)); // Minimum 5g
    
    items.push({
      foodId: fatFood.id,
      name: fatFood.name,
      grams: Math.max(5, fatGrams),
      ...fatMacros
    });
  }
  
  return items;
}