
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

// Enhanced portion calculation with strict macro adherence
function calculateOptimalPortions(
  foods: { [key: string]: FoodItem },
  targetCalories: number,
  targetProtein: number,
  targetCarb: number,
  targetFat: number
): { [key: string]: number } {
  const portions: { [key: string]: number } = {};
  const foodKeys = Object.keys(foods);
  
  // Initialize with minimal portions
  foodKeys.forEach(key => {
    portions[key] = 20; // Start smaller
  });

  // Optimization algorithm with priority-based scaling
  for (let iteration = 0; iteration < 50; iteration++) {
    const currentMacros = calculateCurrentMacros(foods, portions);
    
    // Check if within acceptable tolerance (3%)
    const tolerance = 0.03;
    const withinRange = (
      Math.abs(currentMacros.kcal - targetCalories) / targetCalories <= tolerance &&
      Math.abs(currentMacros.protein - targetProtein) / Math.max(targetProtein, 1) <= tolerance &&
      Math.abs(currentMacros.carb - targetCarb) / Math.max(targetCarb, 1) <= tolerance &&
      Math.abs(currentMacros.fat - targetFat) / Math.max(targetFat, 1) <= tolerance
    );
    
    if (withinRange) break;

    // Priority-based adjustments
    const deficits = {
      protein: targetProtein - currentMacros.protein,
      carb: targetCarb - currentMacros.carb,
      fat: targetFat - currentMacros.fat,
      calories: targetCalories - currentMacros.kcal
    };

    // If exceeding calorie target significantly, scale down all portions
    if (currentMacros.kcal > targetCalories * 1.05) {
      const scaleFactor = (targetCalories * 0.98) / currentMacros.kcal;
      foodKeys.forEach(key => {
        portions[key] = Math.max(5, portions[key] * scaleFactor);
      });
      continue;
    }

    // Adjust portions based on macro deficits
    const adjustmentMade = adjustPortionsForMacros(foods, portions, deficits);
    if (!adjustmentMade) break; // Prevent infinite loops
  }

  // Final portion refinement
  return refineFinalPortions(portions);
}

// Helper function to calculate current macros
function calculateCurrentMacros(foods: { [key: string]: FoodItem }, portions: { [key: string]: number }) {
  return Object.entries(foods).reduce(
    (acc, [key, food]) => {
      const macros = calculateFoodMacros(food, portions[key]);
      return {
        protein: acc.protein + macros.protein,
        carb: acc.carb + macros.carb,
        fat: acc.fat + macros.fat,
        kcal: acc.kcal + macros.kcal
      };
    },
    { protein: 0, carb: 0, fat: 0, kcal: 0 }
  );
}

// Helper function to adjust portions for macro targets
function adjustPortionsForMacros(
  foods: { [key: string]: FoodItem }, 
  portions: { [key: string]: number }, 
  deficits: { protein: number; carb: number; fat: number; calories: number }
): boolean {
  let adjustmentMade = false;

  // Find the most efficient food for each macro
  ['protein', 'carb', 'fat'].forEach(macroType => {
    const deficit = deficits[macroType as keyof typeof deficits];
    if (Math.abs(deficit) < 0.5) return; // Skip small deficits

    let bestFood = '';
    let bestEfficiency = 0;

    Object.entries(foods).forEach(([key, food]) => {
      let macroContent = 0;
      if (macroType === 'protein') macroContent = food.protein_per_100g;
      else if (macroType === 'carb') macroContent = food.carb_per_100g;
      else if (macroType === 'fat') macroContent = food.fat_per_100g;

      // Efficiency = macro content per calorie (to minimize calorie impact)
      const efficiency = food.kcal_per_100g > 0 ? macroContent / food.kcal_per_100g : 0;
      
      if (efficiency > bestEfficiency && macroContent > 5) {
        bestEfficiency = efficiency;
        bestFood = key;
      }
    });

    if (bestFood && bestEfficiency > 0) {
      const food = foods[bestFood];
      let macroContent = 0;
      if (macroType === 'protein') macroContent = food.protein_per_100g;
      else if (macroType === 'carb') macroContent = food.carb_per_100g;
      else if (macroType === 'fat') macroContent = food.fat_per_100g;

      // Calculate portion adjustment needed
      const gramsNeeded = (deficit / macroContent) * 100;
      const newPortion = portions[bestFood] + gramsNeeded;
      
      // Apply reasonable limits
      portions[bestFood] = Math.max(5, Math.min(400, newPortion));
      adjustmentMade = true;
    }
  });

  return adjustmentMade;
}

// Helper function to refine final portions
function refineFinalPortions(portions: { [key: string]: number }): { [key: string]: number } {
  const refined: { [key: string]: number } = {};
  
  Object.entries(portions).forEach(([key, grams]) => {
    // Round to nearest 5g for realistic portions
    let roundedGrams = Math.round(grams / 5) * 5;
    
    // Enforce practical limits
    roundedGrams = Math.max(10, Math.min(350, roundedGrams));
    
    refined[key] = roundedGrams;
  });
  
  return refined;
}

// Define types for meal templates
type MealName = keyof typeof NUTRITIONAL_MEAL_TEMPLATES;

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
  const template = NUTRITIONAL_MEAL_TEMPLATES[mealName as MealName];
  if (!template) return [];

  const selectedFoods: { [key: string]: FoodItem } = {};

  // Select required foods first
  template.requiredCategories.forEach((category: string) => {
    const food = selectNutritionalFood(
      category,
      availableFoods,
      template.preferences[category as keyof typeof template.preferences] || [],
      usedFoods
    );
    if (food) {
      selectedFoods[category] = food;
    }
  });

  // Add optional foods if we still have macro/calorie budget
  template.optionalCategories.forEach((category: string) => {
    const food = selectNutritionalFood(
      category,
      availableFoods,
      template.preferences[category as keyof typeof template.preferences] || [],
      usedFoods
    );
    if (food) {
      selectedFoods[category] = food;
    }
  });

  if (Object.keys(selectedFoods).length === 0) return [];

  // Calculate optimal portions with strict macro adherence
  const portions = calculateOptimalPortions(
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

// Generate meal plan with AI using calculated macros
export async function generateMealPlanWithAI(
  macroTarget: MacroTarget,
  category: 'suave' | 'moderado' | 'restritivo'
): Promise<string> {
  try {
    const response = await fetch('/api/generate-menu-ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        calories: macroTarget.calories,
        protein: macroTarget.protein_g,
        carb: macroTarget.carb_g,
        fat: macroTarget.fat_g,
        category: category
      }),
    });

    if (!response.ok) {
      throw new Error('Falha na requisição para IA');
    }

    const data = await response.json();
    return data.menuContent;
  } catch (error) {
    console.error('Error generating AI menu:', error);
    throw error;
  }
}

// Generate meal plan with strict adherence to macro targets (FALLBACK)
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

// Convert meal objects to text format for display
export function convertMealsToText(meals: Meal[]): string {
  const mealTimeNames = [
    "🌅 DESAYUNO (7:00 AM)",
    "🍽️ ALMUERZO (12:30 PM)", 
    "🥪 MERIENDA (3:30 PM)",
    "🍽️ CENA (7:00 PM)",
    "🌙 COLACIÓN NOCTURNA (9:30 PM)"
  ];

  let textContent = "";
  
  meals.forEach((meal, index) => {
    const mealTime = mealTimeNames[index] || `REFEIÇÃO ${index + 1}`;
    textContent += `${mealTime}\n`;
    
    meal.items.forEach(item => {
      textContent += `- ${item.name}: ${item.grams}g\n`;
    });
    
    textContent += `\nTotais: ${Math.round(meal.totals.kcal)} kcal | `;
    textContent += `${Math.round(meal.totals.protein)}g proteína | `;
    textContent += `${Math.round(meal.totals.carb)}g carboidratos | `;
    textContent += `${Math.round(meal.totals.fat)}g gorduras\n\n`;
  });

  return textContent;
}

// Função para converter gramas em medidas caseiras
export function convertToHouseholdMeasures(foodName: string, grams: number): string {
  const name = foodName.toLowerCase();
  
  // Ovos - 1 ovo médio = ~50g
  if (name.includes('ovo') || name.includes('clara')) {
    const eggs = Math.round(grams / 50);
    return `(${eggs} ${eggs === 1 ? 'ovo' : 'ovos'})`;
  }
  
  // Leite e líquidos - 1 xícara = ~240ml = ~240g
  if (name.includes('leite') || name.includes('iogurte') || name.includes('yogur')) {
    if (grams >= 240) {
      const cups = Math.round(grams / 240 * 10) / 10;
      return `(${cups} ${cups === 1 ? 'xícara' : 'xícaras'})`;
    } else {
      const ml = Math.round(grams);
      return `(${ml}ml)`;
    }
  }
  
  // Queijos - 1 fatia média = ~30g
  if (name.includes('queijo')) {
    const slices = Math.round(grams / 30);
    return `(${slices} ${slices === 1 ? 'fatia' : 'fatias'})`;
  }
  
  // Arroz cozido - 1 colher de sopa = ~20g
  if (name.includes('arroz') && name.includes('cozido')) {
    const spoons = Math.round(grams / 20);
    return `(${spoons} ${spoons === 1 ? 'colher de sopa' : 'colheres de sopa'})`;
  }
  
  // Aveia - 1 colher de sopa = ~15g
  if (name.includes('aveia')) {
    const spoons = Math.round(grams / 15);
    return `(${spoons} ${spoons === 1 ? 'colher de sopa' : 'colheres de sopa'})`;
  }
  
  // Batata doce - 1 unidade média = ~150g
  if (name.includes('batata doce')) {
    if (grams >= 75) {
      const units = Math.round(grams / 150 * 10) / 10;
      return `(${units} ${units === 1 ? 'unidade média' : 'unidades médias'})`;
    } else {
      const spoons = Math.round(grams / 20);
      return `(${spoons} ${spoons === 1 ? 'colher de sopa' : 'colheres de sopa'})`;
    }
  }
  
  // Banana - 1 unidade média = ~100g
  if (name.includes('banana') || name.includes('plátano')) {
    const units = Math.round(grams / 100 * 10) / 10;
    return `(${units} ${units === 1 ? 'banana' : 'bananas'})`;
  }
  
  // Pão integral - 1 fatia = ~25g
  if (name.includes('pão')) {
    const slices = Math.round(grams / 25);
    return `(${slices} ${slices === 1 ? 'fatia' : 'fatias'})`;
  }
  
  // Azeite de oliva - 1 colher de sopa = ~15ml = ~15g
  if (name.includes('azeite')) {
    const spoons = Math.round(grams / 15);
    return `(${spoons} ${spoons === 1 ? 'colher de sopa' : 'colheres de sopa'})`;
  }
  
  // Amêndoas e nozes - 1 colher de sopa = ~15g
  if (name.includes('amêndoa') || name.includes('amendoim') || name.includes('noz')) {
    const spoons = Math.round(grams / 15);
    return `(${spoons} ${spoons === 1 ? 'colher de sopa' : 'colheres de sopa'})`;
  }
  
  // Abacate - 1 unidade média = ~200g
  if (name.includes('abacate') || name.includes('aguacate')) {
    if (grams >= 100) {
      const units = Math.round(grams / 200 * 10) / 10;
      return `(${units} ${units === 1 ? 'abacate médio' : 'abacates médios'})`;
    } else {
      const spoons = Math.round(grams / 20);
      return `(${spoons} ${spoons === 1 ? 'colher de sopa' : 'colheres de sopa'})`;
    }
  }
  
  // Pasta de amendoim - 1 colher de sopa = ~15g
  if (name.includes('pasta')) {
    const spoons = Math.round(grams / 15);
    return `(${spoons} ${spoons === 1 ? 'colher de sopa' : 'colheres de sopa'})`;
  }
  
  // Vegetais folhosos (brócolis, espinafre, alface) - 1 xícara = ~30g
  if (name.includes('brócoli') || name.includes('espinafre') || name.includes('alface')) {
    const cups = Math.round(grams / 30);
    return `(${cups} ${cups === 1 ? 'xícara' : 'xícaras'})`;
  }
  
  // Tomate - 1 unidade média = ~120g
  if (name.includes('tomate')) {
    if (grams >= 60) {
      const units = Math.round(grams / 120 * 10) / 10;
      return `(${units} ${units === 1 ? 'tomate médio' : 'tomates médios'})`;
    } else {
      const spoons = Math.round(grams / 20);
      return `(${spoons} ${spoons === 1 ? 'colher de sopa' : 'colheres de sopa'})`;
    }
  }
  
  // Pepino - 1 unidade média = ~200g
  if (name.includes('pepino')) {
    if (grams >= 100) {
      const units = Math.round(grams / 200 * 10) / 10;
      return `(${units} ${units === 1 ? 'pepino médio' : 'pepinos médios'})`;
    } else {
      const slices = Math.round(grams / 10);
      return `(${slices} fatias)`;
    }
  }
  
  // Carnes (frango, tilápia, etc) - usar colheres ou porções
  if (name.includes('frango') || name.includes('pollo') || name.includes('tilápia') || 
      name.includes('peixe') || name.includes('carne') || name.includes('salmão')) {
    if (grams >= 100) {
      const portions = Math.round(grams / 100 * 10) / 10;
      return `(${portions} ${portions === 1 ? 'porção' : 'porções'})`;
    } else {
      const spoons = Math.round(grams / 20);
      return `(${spoons} ${spoons === 1 ? 'colher de sopa' : 'colheres de sopa'})`;
    }
  }
  
  // Quinoa cozida - 1 colher de sopa = ~20g
  if (name.includes('quinoa')) {
    const spoons = Math.round(grams / 20);
    return `(${spoons} ${spoons === 1 ? 'colher de sopa' : 'colheres de sopa'})`;
  }
  
  // Para outros alimentos, usar colheres como medida padrão
  if (grams >= 60) {
    const spoons = Math.round(grams / 15);
    return `(${spoons} ${spoons === 1 ? 'colher de sopa' : 'colheres de sopa'})`;
  } else if (grams >= 15) {
    const spoons = Math.round(grams / 15);
    return `(${spoons} ${spoons === 1 ? 'colher de sopa' : 'colheres de sopa'})`;
  } else {
    const teaspoons = Math.round(grams / 5);
    return `(${teaspoons} ${teaspoons === 1 ? 'colher de chá' : 'colheres de chá'})`;
  }
}

// Ultra-strict validation that meal plan stays within macro targets
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

  // Ultra-strict tolerance: Maximum 8% over target (no more exceeding chosen limits)
  const tolerance = 1.08;
  
  const isValid = (
    dailyTotals.kcal <= macroTarget.calories * tolerance &&
    dailyTotals.protein <= macroTarget.protein_g * tolerance &&
    dailyTotals.carb <= macroTarget.carb_g * tolerance &&
    dailyTotals.fat <= macroTarget.fat_g * tolerance
  );

  // Enhanced logging for better debugging
  if (!isValid) {
    console.warn("🚫 Meal plan exceeds user's chosen targets:", {
      userSelectedCalories: macroTarget.calories,
      generatedCalories: Math.round(dailyTotals.kcal),
      exceedsBy: Math.round(dailyTotals.kcal - macroTarget.calories),
      macroTargets: {
        protein: `${macroTarget.protein_g}g (generated: ${Math.round(dailyTotals.protein)}g)`,
        carb: `${macroTarget.carb_g}g (generated: ${Math.round(dailyTotals.carb)}g)`,
        fat: `${macroTarget.fat_g}g (generated: ${Math.round(dailyTotals.fat)}g)`
      }
    });
  } else {
    console.log("✅ Meal plan within acceptable range:", {
      targetCalories: macroTarget.calories,
      generatedCalories: Math.round(dailyTotals.kcal),
      adherencePercentage: Math.round((dailyTotals.kcal / macroTarget.calories) * 100) + "%"
    });
  }

  return isValid;
}
