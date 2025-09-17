
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

// Meal templates based on nutritional science and cultural patterns
const MEAL_TEMPLATES = {
  "Café da manhã": {
    structure: ["protein", "dairy", "carb", "fat"],
    preferences: {
      protein: ["ovos", "ovo", "huevo", "clara"],
      dairy: ["leite", "iogurte", "yogur"],
      carb: ["aveia", "banana", "pão", "pan"],
      fat: ["azeite", "amend", "almend"]
    },
    ratios: { protein: 0.25, dairy: 0.25, carb: 0.35, fat: 0.15 }
  },
  "Almoço": {
    structure: ["protein", "vegetable", "carb", "fat"],
    preferences: {
      protein: ["frango", "pollo", "tilapia", "peixe", "pescado", "carne"],
      vegetable: ["brócoli", "brocoli", "espinafre", "espinaca", "tomate"],
      carb: ["arroz", "quinoa", "batata", "papa"],
      fat: ["azeite", "oliva", "abacate", "aguacate"]
    },
    ratios: { protein: 0.30, vegetable: 0.15, carb: 0.40, fat: 0.15 }
  },
  "Lanche da tarde": {
    structure: ["dairy", "carb", "fat"],
    preferences: {
      dairy: ["iogurte", "yogur", "queijo"],
      carb: ["banana", "aveia", "batata"],
      fat: ["amend", "almend", "nuez"]
    },
    ratios: { dairy: 0.40, carb: 0.40, fat: 0.20 }
  },
  "Janta": {
    structure: ["protein", "vegetable", "carb", "fat"],
    preferences: {
      protein: ["tilapia", "salmão", "salmon", "frango", "pollo"],
      vegetable: ["brócoli", "brocoli", "espinafre", "lechuga", "alface"],
      carb: ["quinoa", "arroz", "batata doce", "camote"],
      fat: ["azeite", "oliva", "abacate"]
    },
    ratios: { protein: 0.35, vegetable: 0.20, carb: 0.30, fat: 0.15 }
  },
  "Ceia": {
    structure: ["protein", "dairy", "vegetable"],
    preferences: {
      protein: ["ovos", "clara", "queijo"],
      dairy: ["iogurte", "leite"],
      vegetable: ["alface", "lechuga", "tomate"]
    },
    ratios: { protein: 0.40, dairy: 0.35, vegetable: 0.25 }
  }
};

// Smart food selection based on preferences and nutritional goals
function selectOptimalFood(
  category: keyof ReturnType<typeof categorizeFoodsWithQuality>,
  preferences: string[],
  availableFoods: ReturnType<typeof categorizeFoodsWithQuality>,
  usedFoods: Set<string>
): (FoodItem & { quality: number }) | null {
  const categoryFoods = availableFoods[category];
  if (!categoryFoods || categoryFoods.length === 0) return null;

  // First try to find preferred foods that haven't been used
  for (const preference of preferences) {
    const preferredFood = categoryFoods.find(food => 
      food.name.toLowerCase().includes(preference) && !usedFoods.has(food.id)
    );
    if (preferredFood) {
      usedFoods.add(preferredFood.id);
      return preferredFood;
    }
  }

  // Fallback to highest quality unused food
  const availableFood = categoryFoods.find(food => !usedFoods.has(food.id));
  if (availableFood) {
    usedFoods.add(availableFood.id);
    return availableFood;
  }

  return null;
}

// Calculate optimal portions to meet macro targets
function calculateOptimalPortions(
  selectedFoods: { [key: string]: FoodItem },
  targetCalories: number,
  targetProtein: number,
  targetCarb: number,
  targetFat: number,
  ratios: { [key: string]: number }
): { [key: string]: number } {
  const portions: { [key: string]: number } = {};
  
  // Initial calculation based on calorie ratios
  Object.entries(selectedFoods).forEach(([type, food]) => {
    const targetCals = targetCalories * ratios[type];
    portions[type] = Math.max(20, Math.min(200, (targetCals / food.kcal_per_100g) * 100));
  });

  // Iterative adjustment to meet macro targets (simplified)
  for (let iteration = 0; iteration < 3; iteration++) {
    const currentMacros = Object.entries(selectedFoods).reduce(
      (acc, [type, food]) => {
        const grams = portions[type];
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

    // Adjust portions based on macro gaps
    const proteinGap = targetProtein - currentMacros.protein;
    const carbGap = targetCarb - currentMacros.carb;
    const fatGap = targetFat - currentMacros.fat;

    // Find food with highest protein content for protein adjustment
    if (Math.abs(proteinGap) > 2) {
      const proteinFood = Object.entries(selectedFoods).reduce((best, [type, food]) => 
        food.protein_per_100g > best.protein ? { type, protein: food.protein_per_100g } : best,
        { type: '', protein: 0 }
      );
      if (proteinFood.type) {
        const adjustment = (proteinGap / selectedFoods[proteinFood.type].protein_per_100g) * 100;
        portions[proteinFood.type] = Math.max(10, Math.min(300, portions[proteinFood.type] + adjustment));
      }
    }

    // Similar adjustments for carbs and fats
    if (Math.abs(carbGap) > 3) {
      const carbFood = Object.entries(selectedFoods).reduce((best, [type, food]) => 
        food.carb_per_100g > best.carb ? { type, carb: food.carb_per_100g } : best,
        { type: '', carb: 0 }
      );
      if (carbFood.type) {
        const adjustment = (carbGap / selectedFoods[carbFood.type].carb_per_100g) * 100;
        portions[carbFood.type] = Math.max(10, Math.min(400, portions[carbFood.type] + adjustment));
      }
    }

    if (Math.abs(fatGap) > 1) {
      const fatFood = Object.entries(selectedFoods).reduce((best, [type, food]) => 
        food.fat_per_100g > best.fat ? { type, fat: food.fat_per_100g } : best,
        { type: '', fat: 0 }
      );
      if (fatFood.type) {
        const adjustment = (fatGap / selectedFoods[fatFood.type].fat_per_100g) * 100;
        portions[fatFood.type] = Math.max(5, Math.min(150, portions[fatFood.type] + adjustment));
      }
    }
  }

  // Round portions to realistic values (multiples of 5g)
  Object.keys(portions).forEach(type => {
    portions[type] = Math.round(portions[type] / 5) * 5;
    portions[type] = Math.max(10, portions[type]); // Minimum 10g
  });

  return portions;
}

// Generate a single meal using nutritional science approach
function generateNutritionallyBalancedMeal(
  mealName: string,
  targetCalories: number,
  targetProtein: number,
  targetCarb: number,
  targetFat: number,
  availableFoods: ReturnType<typeof categorizeFoodsWithQuality>,
  usedFoods: Set<string>
): MealItem[] {
  const template = MEAL_TEMPLATES[mealName];
  if (!template) return [];

  const selectedFoods: { [key: string]: FoodItem } = {};

  // Select foods based on meal structure and preferences
  template.structure.forEach(category => {
    if (category === "dairy" && availableFoods.dairy.length > 0) {
      const food = selectOptimalFood("dairy", template.preferences.dairy || [], availableFoods, usedFoods);
      if (food) selectedFoods.dairy = food;
    } else if (category === "eggs" && availableFoods.eggs.length > 0) {
      const food = selectOptimalFood("eggs", template.preferences.protein || [], availableFoods, usedFoods);
      if (food) selectedFoods.protein = food;
    } else if (category === "protein" && !selectedFoods.protein) {
      // Try eggs first for breakfast, then dairy, then regular protein
      if (mealName === "Café da manhã" && availableFoods.eggs.length > 0) {
        const food = selectOptimalFood("eggs", ["ovo", "huevo", "clara"], availableFoods, usedFoods);
        if (food) selectedFoods.protein = food;
      }
      if (!selectedFoods.protein && availableFoods.dairy.length > 0) {
        const food = selectOptimalFood("dairy", template.preferences.dairy || [], availableFoods, usedFoods);
        if (food) selectedFoods.protein = food;
      }
      if (!selectedFoods.protein) {
        const food = selectOptimalFood("protein", template.preferences.protein || [], availableFoods, usedFoods);
        if (food) selectedFoods.protein = food;
      }
    } else if (category === "vegetable") {
      const food = selectOptimalFood("vegetable", template.preferences.vegetable || [], availableFoods, usedFoods);
      if (food) selectedFoods.vegetable = food;
    } else if (category === "carb") {
      const food = selectOptimalFood("carb", template.preferences.carb || [], availableFoods, usedFoods);
      if (food) selectedFoods.carb = food;
    } else if (category === "fat") {
      const food = selectOptimalFood("fat", template.preferences.fat || [], availableFoods, usedFoods);
      if (food) selectedFoods.fat = food;
    }
  });

  // Calculate optimal portions
  const portions = calculateOptimalPortions(
    selectedFoods,
    targetCalories,
    targetProtein,
    targetCarb,
    targetFat,
    template.ratios
  );

  // Create meal items
  const mealItems: MealItem[] = Object.entries(selectedFoods).map(([type, food]) => {
    const grams = portions[type];
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

// Generate a balanced meal plan with 5 meals using enhanced nutritional approach
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

  // Enhanced meal distribution with better macro allocation
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
    
    const mealItems = generateNutritionallyBalancedMeal(
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
    
    // Reset used foods occasionally to allow repetition if needed
    if (usedFoods.size > foods.length * 0.8) {
      usedFoods.clear();
    }
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

  // Allow 10% tolerance for more realistic meal planning
  const tolerance = 1.1;
  
  return (
    dailyTotals.kcal <= macroTarget.calories * tolerance &&
    dailyTotals.protein <= macroTarget.protein_g * tolerance &&
    dailyTotals.carb <= macroTarget.carb_g * tolerance &&
    dailyTotals.fat <= macroTarget.fat_g * tolerance
  );
}
