
import { MacroTarget, FoodItem, Meal, MealItem, MenuPlan } from "@shared/schema";

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

// Enhanced food categorization with quality scores
function categorizeFoodsWithQuality(foods: FoodItem[]): {
  protein: Array<FoodItem & { quality: number }>;
  carb: Array<FoodItem & { quality: number }>;
  fat: Array<FoodItem & { quality: number }>;
  vegetable: Array<FoodItem & { quality: number }>;
  dairy: Array<FoodItem & { quality: number }>;
  eggs: Array<FoodItem & { quality: number }>;
} {
  const categorized = {
    protein: [] as Array<FoodItem & { quality: number }>,
    carb: [] as Array<FoodItem & { quality: number }>,
    fat: [] as Array<FoodItem & { quality: number }>,
    vegetable: [] as Array<FoodItem & { quality: number }>,
    dairy: [] as Array<FoodItem & { quality: number }>,
    eggs: [] as Array<FoodItem & { quality: number }>,
  };

  foods.forEach(food => {
    const name = food.name.toLowerCase();
    
    // Identify eggs specifically
    if (name.includes('ovo') || name.includes('huevo') || name.includes('clara')) {
      categorized.eggs.push({
        ...food,
        quality: food.protein_per_100g * 10 // High quality protein
      });
    }
    
    // Identify dairy products
    if (name.includes('leite') || name.includes('iogurte') || name.includes('yogur') || 
        name.includes('queijo') || name.includes('queso') || name.includes('milk')) {
      categorized.dairy.push({
        ...food,
        quality: food.protein_per_100g * 8 + (food.kcal_per_100g < 100 ? 20 : 0)
      });
    }
    
    // High protein foods (>15g per 100g) - but exclude eggs and dairy to avoid double categorization
    if (food.protein_per_100g >= 15 && !categorized.eggs.some(e => e.id === food.id) && !categorized.dairy.some(d => d.id === food.id)) {
      const proteinQuality = food.protein_per_100g;
      const fatPenalty = food.fat_per_100g > 20 ? -10 : 0;
      categorized.protein.push({
        ...food,
        quality: proteinQuality + fatPenalty
      });
    }
    
    // High carb foods (>50g per 100g)
    if (food.carb_per_100g >= 50) {
      const fiberBonus = (food.fiber_per_100g || 0) * 2;
      const qualityScore = food.carb_per_100g + fiberBonus - (food.fat_per_100g * 2);
      categorized.carb.push({
        ...food,
        quality: qualityScore
      });
    }
    
    // High fat foods (>70% fat calories)
    const fatCalories = food.fat_per_100g * 9;
    const fatPercentage = food.kcal_per_100g > 0 ? fatCalories / food.kcal_per_100g : 0;
    if (fatPercentage >= 0.7) {
      const healthBonus = name.includes('azeite') || name.includes('oliva') || 
                         name.includes('amend') || name.includes('abacate') ? 20 : 0;
      categorized.fat.push({
        ...food,
        quality: food.fat_per_100g + healthBonus
      });
    }
    
    // Low calorie vegetables (<50 kcal per 100g)
    if (food.kcal_per_100g < 50 && food.carb_per_100g < 15) {
      const fiberBonus = (food.fiber_per_100g || 0) * 3;
      const proteinBonus = food.protein_per_100g * 2;
      categorized.vegetable.push({
        ...food,
        quality: fiberBonus + proteinBonus + (50 - food.kcal_per_100g)
      });
    }
  });

  // Sort by quality descending
  Object.values(categorized).forEach(category => {
    category.sort((a, b) => b.quality - a.quality);
  });

  return categorized;
}

// Precise meal templates with strict nutritional guidelines
const NUTRITIONAL_MEAL_TEMPLATES = {
  "Café da manhã": {
    requiredCategories: ["eggs", "dairy", "carb"],
    optionalCategories: ["fat", "vegetable"],
    macroDistribution: { protein: 0.25, carb: 0.25, fat: 0.20 },
    preferences: {
      eggs: ["ovo", "clara", "huevo"],
      dairy: ["leite", "iogurte", "yogur"],
      carb: ["aveia", "banana", "pão"],
      fat: ["azeite", "amend"],
    }
  },
  "Almoço": {
    requiredCategories: ["protein", "carb", "vegetable"],
    optionalCategories: ["fat"],
    macroDistribution: { protein: 0.30, carb: 0.35, fat: 0.25 },
    preferences: {
      protein: ["frango", "pollo", "tilapia", "peixe", "carne"],
      carb: ["arroz", "quinoa", "batata"],
      vegetable: ["brócoli", "espinafre", "tomate"],
      fat: ["azeite", "oliva", "abacate"],
    }
  },
  "Lanche da tarde": {
    requiredCategories: ["dairy", "carb"],
    optionalCategories: ["fat", "vegetable"],
    macroDistribution: { protein: 0.15, carb: 0.20, fat: 0.15 },
    preferences: {
      dairy: ["iogurte", "yogur", "queijo"],
      carb: ["banana", "aveia", "batata"],
      fat: ["amend", "almend", "nuez"],
    }
  },
  "Janta": {
    requiredCategories: ["protein", "vegetable", "carb"],
    optionalCategories: ["fat"],
    macroDistribution: { protein: 0.25, carb: 0.20, fat: 0.30 },
    preferences: {
      protein: ["tilapia", "salmão", "frango", "pollo"],
      carb: ["quinoa", "arroz", "batata doce"],
      vegetable: ["brócoli", "espinafre", "alface"],
      fat: ["azeite", "oliva", "abacate"],
    }
  },
  "Ceia": {
    requiredCategories: ["protein", "dairy"],
    optionalCategories: ["vegetable"],
    macroDistribution: { protein: 0.15, carb: 0.05, fat: 0.10 },
    preferences: {
      protein: ["clara", "queijo"],
      dairy: ["iogurte", "leite"],
      vegetable: ["alface", "tomate"],
    }
  }
};

// Precise food selection with nutritional preferences
function selectNutritionalFood(
  categoryName: string,
  availableFoods: ReturnType<typeof categorizeFoodsWithQuality>,
  preferences: string[],
  usedFoods: Set<string>
): (FoodItem & { quality: number }) | null {
  let foods: Array<FoodItem & { quality: number }> = [];

  // Map category names to available food arrays
  switch (categoryName) {
    case "eggs":
      foods = availableFoods.eggs;
      break;
    case "dairy":
      foods = availableFoods.dairy;
      break;
    case "protein":
      foods = availableFoods.protein;
      break;
    case "carb":
      foods = availableFoods.carb;
      break;
    case "fat":
      foods = availableFoods.fat;
      break;
    case "vegetable":
      foods = availableFoods.vegetable;
      break;
    default:
      return null;
  }

  if (!foods || foods.length === 0) return null;

  // First try to find preferred foods that haven't been used
  for (const preference of preferences) {
    const preferredFood = foods.find(food => 
      food.name.toLowerCase().includes(preference) && !usedFoods.has(food.id)
    );
    if (preferredFood) {
      usedFoods.add(preferredFood.id);
      return preferredFood;
    }
  }

  // Fallback to highest quality unused food
  const availableFood = foods.find(food => !usedFoods.has(food.id));
  if (availableFood) {
    usedFoods.add(availableFood.id);
    return availableFood;
  }

  return null;
}

// Calculate precise portions using linear programming approach
function calculatePrecisePortions(
  foods: { [key: string]: FoodItem },
  targetCalories: number,
  targetProtein: number,
  targetCarb: number,
  targetFat: number
): { [key: string]: number } {
  const portions: { [key: string]: number } = {};
  
  // Start with minimum viable portions
  Object.keys(foods).forEach(key => {
    portions[key] = 30; // Start with 30g
  });

  // Iteratively adjust to meet targets with strict limits
  for (let iteration = 0; iteration < 20; iteration++) {
    const currentMacros = Object.entries(foods).reduce(
      (acc, [key, food]) => {
        const grams = portions[key];
        const macros = calculateFoodMacros(food, grams);
        return {
          protein: acc.protein + macros.protein,
          carb: acc.carb + macros.carb,
          fat: acc.fat + macros.fat,
          kcal: acc.kcal + macros.kcal
        };
      },
      { protein: 0, carb: 0, fat: 0, kcal: 0 }
    );

    // Check if we're close enough to targets (within 5% tolerance)
    const calorieError = Math.abs(currentMacros.kcal - targetCalories) / targetCalories;
    const proteinError = Math.abs(currentMacros.protein - targetProtein) / targetProtein;
    const carbError = Math.abs(currentMacros.carb - targetCarb) / targetCarb;
    const fatError = Math.abs(currentMacros.fat - targetFat) / targetFat;

    if (calorieError < 0.05 && proteinError < 0.05 && carbError < 0.05 && fatError < 0.05) {
      break;
    }

    // If we're exceeding targets significantly, reduce all portions
    if (currentMacros.kcal > targetCalories * 1.1) {
      const reductionFactor = targetCalories / currentMacros.kcal;
      Object.keys(portions).forEach(key => {
        portions[key] = Math.max(10, portions[key] * reductionFactor);
      });
      continue;
    }

    // Fine-tune individual macros
    const adjustments = {
      protein: targetProtein - currentMacros.protein,
      carb: targetCarb - currentMacros.carb,
      fat: targetFat - currentMacros.fat
    };

    // Find foods that can best address each macro deficit/excess
    Object.entries(adjustments).forEach(([macro, deficit]) => {
      if (Math.abs(deficit) < 1) return; // Skip small adjustments

      let bestFood = "";
      let bestRatio = 0;

      Object.entries(foods).forEach(([key, food]) => {
        let ratio = 0;
        if (macro === "protein") ratio = food.protein_per_100g;
        else if (macro === "carb") ratio = food.carb_per_100g;
        else if (macro === "fat") ratio = food.fat_per_100g;

        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestFood = key;
        }
      });

      if (bestFood && bestRatio > 0) {
        const adjustment = (deficit / bestRatio) * 100;
        const newPortion = portions[bestFood] + adjustment;
        portions[bestFood] = Math.max(5, Math.min(250, newPortion));
      }
    });
  }

  // Final cleanup - round to realistic portions
  Object.keys(portions).forEach(key => {
    portions[key] = Math.round(portions[key] / 5) * 5; // Round to nearest 5g
    portions[key] = Math.max(10, Math.min(300, portions[key])); // Enforce limits
  });

  return portions;
}

// Generate precise nutritionally balanced meal
function generatePreciseMeal(
  mealName: string,
  targetCalories: number,
  targetProtein: number,
  targetCarb: number,
  targetFat: number,
  availableFoods: ReturnType<typeof categorizeFoodsWithQuality>,
  usedFoods: Set<string>
): MealItem[] {
  const template = NUTRITIONAL_MEAL_TEMPLATES[mealName];
  if (!template) return [];

  const selectedFoods: { [key: string]: FoodItem } = {};

  // Select required foods first
  template.requiredCategories.forEach(category => {
    const food = selectNutritionalFood(
      category,
      availableFoods,
      template.preferences[category] || [],
      usedFoods
    );
    if (food) {
      selectedFoods[category] = food;
    }
  });

  // Add optional foods if we still have macro/calorie budget
  template.optionalCategories.forEach(category => {
    const food = selectNutritionalFood(
      category,
      availableFoods,
      template.preferences[category] || [],
      usedFoods
    );
    if (food) {
      selectedFoods[category] = food;
    }
  });

  if (Object.keys(selectedFoods).length === 0) return [];

  // Calculate precise portions
  const portions = calculatePrecisePortions(
    selectedFoods,
    targetCalories,
    targetProtein,
    targetCarb,
    targetFat
  );

  // Create meal items with calculated portions
  const mealItems: MealItem[] = Object.entries(selectedFoods).map(([key, food]) => {
    const grams = portions[key];
    const macros = calculateFoodMacros(food, grams);
    
    return {
      foodId: food.id,
      name: food.name,
      grams: grams,
      ...macros
    };
  });

  return mealItems;
}

// Generate meal plan with strict adherence to macro targets
export function generateMealPlan(
  macroTarget: MacroTarget,
  category: 'suave' | 'moderado' | 'restritivo',
  foods: FoodItem[]
): Meal[] {
  if (!foods || foods.length === 0) {
    throw new Error("No foods provided for meal generation");
  }

  // Categorize foods with quality scoring
  const categorizedFoods = categorizeFoodsWithQuality(foods);
  
  // Validate we have essential food categories
  if (categorizedFoods.protein.length === 0 && categorizedFoods.eggs.length === 0 && categorizedFoods.dairy.length === 0) {
    throw new Error("No protein foods available in database");
  }
  if (categorizedFoods.carb.length === 0) {
    throw new Error("No carb foods available in database");  
  }

  // Strict meal distribution that adds up to exactly 100%
  const mealDistribution = {
    "Café da manhã": { calories: 0.20, protein: 0.25, carb: 0.25, fat: 0.20 },
    "Almoço": { calories: 0.30, protein: 0.30, carb: 0.35, fat: 0.30 },
    "Lanche da tarde": { calories: 0.15, protein: 0.15, carb: 0.20, fat: 0.15 },
    "Janta": { calories: 0.25, protein: 0.25, carb: 0.20, fat: 0.25 },
    "Ceia": { calories: 0.10, protein: 0.15, carb: 0.05, fat: 0.10 }
  };
  
  const meals: Meal[] = [];
  const usedFoods = new Set<string>();
  
  Object.entries(mealDistribution).forEach(([mealName, distribution]) => {
    const mealCalories = Math.floor(macroTarget.calories * distribution.calories);
    const mealProtein = Math.floor(macroTarget.protein_g * distribution.protein);
    const mealCarb = Math.floor(macroTarget.carb_g * distribution.carb);
    const mealFat = Math.floor(macroTarget.fat_g * distribution.fat);
    
    const mealItems = generatePreciseMeal(
      mealName, 
      mealCalories, 
      mealProtein, 
      mealCarb, 
      mealFat, 
      categorizedFoods,
      usedFoods
    );
    
    // Calculate actual meal totals
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
    
    // Only reset used foods if we've used most of the database
    if (usedFoods.size > foods.length * 0.9) {
      usedFoods.clear();
    }
  });
  
  return meals;
}

// Strict validation that meal plan stays within macro targets
export function validateMealPlan(meals: Meal[], macroTarget: MacroTarget): boolean {
  const dailyTotals = meals.reduce(
    (acc, meal) => ({
      protein: acc.protein + meal.totals.protein,
      carb: acc.carb + meal.totals.carb,
      fat: acc.fat + meal.totals.fat,
      kcal: acc.kcal + meal.totals.kcal,
    }),
    { protein: 0, carb: 0, fat: 0, kcal: 0 }
  );

  // Strict tolerance of 5% - no more than that
  const tolerance = 1.05;
  
  const isValid = (
    dailyTotals.kcal <= macroTarget.calories * tolerance &&
    dailyTotals.protein <= macroTarget.protein_g * tolerance &&
    dailyTotals.carb <= macroTarget.carb_g * tolerance &&
    dailyTotals.fat <= macroTarget.fat_g * tolerance
  );

  // Log validation results for debugging
  if (!isValid) {
    console.log("Generated meal plan exceeds macro targets", {
      dailyTotals,
      macroTarget
    });
  }

  return isValid;
}
