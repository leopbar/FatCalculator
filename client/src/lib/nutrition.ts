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

// Categorize foods by function (protein, carb, fat, vegetable)
function categorizeFoodsByFunction(foods: FoodItem[]): {
  protein: FoodItem[];
  carb: FoodItem[];
  fat: FoodItem[];
  vegetable: FoodItem[];
} {
  const categorized = {
    protein: [] as FoodItem[],
    carb: [] as FoodItem[],
    fat: [] as FoodItem[],
    vegetable: [] as FoodItem[]
  };

  foods.forEach(food => {
    // High protein foods (>15g per 100g) - carnes, pescados, huevos, lacteos
    if (food.protein_per_100g >= 15) {
      categorized.protein.push(food);
    }
    
    // High carb foods (>50g per 100g) - cereales, leguminosas, tubérculos  
    if (food.carb_per_100g >= 50) {
      categorized.carb.push(food);
    }
    
    // High fat foods (>70% fat calories) - grasas, nueces, aceites
    const fatCalories = food.fat_per_100g * 9;
    const fatPercentage = fatCalories / food.kcal_per_100g;
    if (fatPercentage >= 0.7) {
      categorized.fat.push(food);
    }
    
    // Low calorie vegetables (<50 kcal per 100g) - verduras, frutas de baixa caloría
    if (food.kcal_per_100g < 50) {
      categorized.vegetable.push(food);
    }
  });

  return categorized;
}

// Generate meal items with strict constraints
function generateMealItemsConstrained(
  mealName: string,
  targetCalories: number,
  targetProtein: number,
  targetCarb: number,
  targetFat: number,
  availableFoods: {
    protein: FoodItem[];
    carb: FoodItem[];
    fat: FoodItem[];
    vegetable: FoodItem[];
  }
): MealItem[] {
  const items: MealItem[] = [];
  let remainingCalories = targetCalories;
  let remainingProtein = targetProtein;
  let remainingCarb = targetCarb;  
  let remainingFat = targetFat;

  // Step 1: Add protein source (constrained by all targets)
  if (availableFoods.protein.length > 0 && remainingProtein > 5) {
    const proteinFood = availableFoods.protein[0]; // Take first available
    
    // Calculate max grams we can add without exceeding any target
    const maxGramsByProtein = Math.floor((remainingProtein * 100) / proteinFood.protein_per_100g);
    const maxGramsByCalories = Math.floor((remainingCalories * 100) / proteinFood.kcal_per_100g);
    const maxGramsByCarb = proteinFood.carb_per_100g > 0 ? 
      Math.floor((remainingCarb * 100) / proteinFood.carb_per_100g) : maxGramsByProtein;
    const maxGramsByFat = proteinFood.fat_per_100g > 0 ? 
      Math.floor((remainingFat * 100) / proteinFood.fat_per_100g) : maxGramsByProtein;
    
    let proteinGrams = Math.min(maxGramsByProtein, maxGramsByCalories, maxGramsByCarb, maxGramsByFat);
    proteinGrams = Math.floor(proteinGrams / 5) * 5; // Round down to 5g
    proteinGrams = Math.max(20, proteinGrams); // Minimum 20g
    
    if (proteinGrams > 0) {
      const proteinMacros = calculateFoodMacros(proteinFood, proteinGrams);
      
      // Double check we don't exceed limits
      if (proteinMacros.kcal <= remainingCalories && 
          proteinMacros.protein <= remainingProtein &&
          proteinMacros.carb <= remainingCarb &&
          proteinMacros.fat <= remainingFat) {
        
        items.push({
          foodId: proteinFood.id,
          name: proteinFood.name,
          grams: proteinGrams,
          ...proteinMacros
        });
        
        remainingCalories -= proteinMacros.kcal;
        remainingProtein -= proteinMacros.protein;
        remainingCarb -= proteinMacros.carb;
        remainingFat -= proteinMacros.fat;
      }
    }
  }

  // Step 2: Add vegetables for volume (minimal calories)
  if (availableFoods.vegetable.length > 0 && remainingCalories > 20) {
    const vegetableFood = availableFoods.vegetable[0];
    
    // Use 20% of remaining calories for vegetables, but at least 50g
    const vegetableCalories = Math.min(remainingCalories * 0.2, remainingCalories - 50);
    let vegetableGrams = Math.floor((vegetableCalories * 100) / vegetableFood.kcal_per_100g);
    vegetableGrams = Math.max(50, Math.min(200, vegetableGrams)); // Between 50-200g
    
    const vegetableMacros = calculateFoodMacros(vegetableFood, vegetableGrams);
    
    if (vegetableMacros.kcal <= remainingCalories && 
        vegetableMacros.protein <= remainingProtein &&
        vegetableMacros.carb <= remainingCarb &&
        vegetableMacros.fat <= remainingFat) {
      
      items.push({
        foodId: vegetableFood.id,
        name: vegetableFood.name,
        grams: vegetableGrams,
        ...vegetableMacros
      });
      
      remainingCalories -= vegetableMacros.kcal;
      remainingProtein -= vegetableMacros.protein;
      remainingCarb -= vegetableMacros.carb;
      remainingFat -= vegetableMacros.fat;
    }
  }

  // Step 3: Add carb source (constrained)
  if (availableFoods.carb.length > 0 && remainingCarb > 10 && remainingCalories > 20) {
    const carbFood = availableFoods.carb[0];
    
    const maxGramsByCarb = Math.floor((remainingCarb * 100) / carbFood.carb_per_100g);
    const maxGramsByCalories = Math.floor((remainingCalories * 100) / carbFood.kcal_per_100g);
    const maxGramsByFat = carbFood.fat_per_100g > 0 ? 
      Math.floor((remainingFat * 100) / carbFood.fat_per_100g) : maxGramsByCarb;
    
    let carbGrams = Math.min(maxGramsByCarb, maxGramsByCalories, maxGramsByFat);
    carbGrams = Math.floor(carbGrams / 5) * 5; // Round down to 5g
    carbGrams = Math.max(10, carbGrams); // Minimum 10g
    
    if (carbGrams > 0) {
      const carbMacros = calculateFoodMacros(carbFood, carbGrams);
      
      if (carbMacros.kcal <= remainingCalories && 
          carbMacros.protein <= remainingProtein &&
          carbMacros.carb <= remainingCarb &&
          carbMacros.fat <= remainingFat) {
        
        items.push({
          foodId: carbFood.id,
          name: carbFood.name,
          grams: carbGrams,
          ...carbMacros
        });
        
        remainingCalories -= carbMacros.kcal;
        remainingProtein -= carbMacros.protein;
        remainingCarb -= carbMacros.carb;
        remainingFat -= carbMacros.fat;
      }
    }
  }

  // Step 4: Add fat source (constrained)
  if (availableFoods.fat.length > 0 && remainingFat > 2 && remainingCalories > 10) {
    const fatFood = availableFoods.fat[0];
    
    const maxGramsByFat = Math.floor((remainingFat * 100) / fatFood.fat_per_100g);
    const maxGramsByCalories = Math.floor((remainingCalories * 100) / fatFood.kcal_per_100g);
    
    let fatGrams = Math.min(maxGramsByFat, maxGramsByCalories);
    fatGrams = Math.floor(fatGrams / 5) * 5; // Round down to 5g
    fatGrams = Math.max(5, Math.min(30, fatGrams)); // Between 5-30g
    
    if (fatGrams > 0) {
      const fatMacros = calculateFoodMacros(fatFood, fatGrams);
      
      if (fatMacros.kcal <= remainingCalories && 
          fatMacros.protein <= remainingProtein &&
          fatMacros.carb <= remainingCarb &&
          fatMacros.fat <= remainingFat) {
        
        items.push({
          foodId: fatFood.id,
          name: fatFood.name,
          grams: fatGrams,
          ...fatMacros
        });
        
        remainingCalories -= fatMacros.kcal;
        remainingProtein -= fatMacros.protein;
        remainingCarb -= fatMacros.carb;
        remainingFat -= fatMacros.fat;
      }
    }
  }

  return items;
}

// Generate a balanced meal plan with 5 meals using database foods
export function generateMealPlan(
  macroTarget: MacroTarget,
  category: 'suave' | 'moderado' | 'restritivo',
  foods: FoodItem[]
): Meal[] {
  if (!foods || foods.length === 0) {
    throw new Error("No foods provided for meal generation");
  }

  // Categorize foods by function
  const categorizedFoods = categorizeFoodsByFunction(foods);
  
  // Validate we have foods in each category
  if (categorizedFoods.protein.length === 0) {
    throw new Error("No protein foods available in database");
  }
  if (categorizedFoods.carb.length === 0) {
    throw new Error("No carb foods available in database");  
  }

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
    const mealCalories = Math.floor(macroTarget.calories * calorieRatio);
    const mealProtein = Math.floor(macroTarget.protein_g * calorieRatio);
    const mealCarb = Math.floor(macroTarget.carb_g * calorieRatio);
    const mealFat = Math.floor(macroTarget.fat_g * calorieRatio);
    
    const mealItems = generateMealItemsConstrained(
      mealName, 
      mealCalories, 
      mealProtein, 
      mealCarb, 
      mealFat, 
      categorizedFoods
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
  });
  
  return meals;
}

// Validate that meal plan doesn't exceed macro targets
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

  return (
    dailyTotals.kcal <= macroTarget.calories &&
    dailyTotals.protein <= macroTarget.protein_g &&
    dailyTotals.carb <= macroTarget.carb_g &&
    dailyTotals.fat <= macroTarget.fat_g
  );
}