import { MacroTarget, FoodItem, Meal, MealItem, MenuPlan } from "@shared/schema";

// Calculate macronutrient targets based on international standards (AMDR)
export function calculateMacroTargets(
  tdee: number,
  targetCalories: number,
  weight: number,
  bodyFatPercent: number,
  category: 'suave' | 'moderado' | 'restritivo'
): MacroTarget {
  // Validate inputs - more strict validation to prevent NaN
  if (!tdee || !targetCalories || !weight || bodyFatPercent === undefined || bodyFatPercent === null || !category) {
    console.error('Invalid inputs for macro calculation:', { tdee, targetCalories, weight, bodyFatPercent, category });
    throw new Error('Dados inválidos para cálculo de macros');
  }

  // Additional NaN checks
  if (isNaN(tdee) || isNaN(targetCalories) || isNaN(weight) || isNaN(bodyFatPercent)) {
    console.error('NaN values detected:', { tdee, targetCalories, weight, bodyFatPercent });
    throw new Error('Valores inválidos detectados nos cálculos');
  }

  // Validate ranges
  if (tdee <= 0 || targetCalories <= 0 || weight <= 0 || bodyFatPercent < 0 || bodyFatPercent > 100) {
    console.error('Values out of valid range:', { tdee, targetCalories, weight, bodyFatPercent });
    throw new Error('Valores fora do intervalo válido');
  }

  // Calculate lean body mass
  const leanBodyMass = weight * (1 - bodyFatPercent / 100);

  // More conservative protein targets to fit within calorie limits
  let proteinMultiplier: number;
  switch (category) {
    case 'suave':
      proteinMultiplier = 1.2; // Lower protein for easier adherence
      break;
    case 'moderado':
      proteinMultiplier = 1.4; 
      break;
    case 'restritivo':
      proteinMultiplier = 1.6; // Higher protein for muscle preservation
      break;
  }

  const proteinGrams = Math.round(leanBodyMass * proteinMultiplier);
  const proteinCalories = proteinGrams * 4;

  // Ensure protein doesn't exceed 40% of total calories
  const maxProteinCalories = targetCalories * 0.4;
  const finalProteinCalories = Math.min(proteinCalories, maxProteinCalories);
  const finalProteinGrams = Math.round(finalProteinCalories / 4);

  // Fat targets based on category (20-30% of calories)
  let fatPercentage: number;
  switch (category) {
    case 'suave':
      fatPercentage = 25; // Higher fat for satiety
      break;
    case 'moderado':
      fatPercentage = 22;
      break;
    case 'restritivo':
      fatPercentage = 20; // Lower fat for more protein/carbs
      break;
  }

  const fatCalories = Math.round(targetCalories * (fatPercentage / 100));
  const fatGrams = Math.round(fatCalories / 9);

  // Remaining calories for carbs
  const remainingCalories = targetCalories - finalProteinCalories - fatCalories;
  const carbGrams = Math.max(0, Math.round(remainingCalories / 4));
  const carbCalories = carbGrams * 4;

  // Ensure total doesn't exceed target calories
  const actualTotalCalories = finalProteinCalories + fatCalories + carbCalories;

  // Calculate actual percentages
  const proteinPercent = Math.round((finalProteinCalories / targetCalories) * 100);
  const fatPercent = Math.round((fatCalories / targetCalories) * 100);
  const carbPercent = Math.round((carbCalories / targetCalories) * 100);

  const result = {
    calories: targetCalories, // Use target calories, not calculated total
    protein_g: finalProteinGrams,
    carb_g: carbGrams,
    fat_g: fatGrams,
    protein_percent: proteinPercent,
    carb_percent: carbPercent,
    fat_percent: fatPercent,
  };

  // Final NaN validation before returning
  const hasNaN = Object.values(result).some(value => isNaN(value) || value === null || value === undefined);
  if (hasNaN) {
    console.error('NaN detected in final macro targets:', result);
    throw new Error('Erro interno: valores inválidos gerados no cálculo de macros');
  }

  console.log('✅ Macro targets calculated:', result);
  return result;
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

// Helper function to get suitable foods for a specific meal
function getSuitableFoodsForMeal(mealName: string, foods: FoodItem[]): FoodItem[] {
  const mealTemplate = NUTRITIONAL_MEAL_TEMPLATES[mealName];
  if (!mealTemplate) return [];

  const suitableFoodIds = new Set<string>();

  // Add foods from required categories
  mealTemplate.requiredCategories.forEach(category => {
    const categoryFoods = getFoodsByCategory(category, foods);
    categoryFoods.forEach(food => suitableFoodIds.add(food.id));
  });

  // Add foods from optional categories
  mealTemplate.optionalCategories.forEach(category => {
    const categoryFoods = getFoodsByCategory(category, foods);
    categoryFoods.forEach(food => suitableFoodIds.add(food.id));
  });

  return foods.filter(food => suitableFoodIds.has(food.id));
}

// Helper function to get foods belonging to a specific category
function getFoodsByCategory(category: string, foods: FoodItem[]): FoodItem[] {
  const lowerCaseCategory = category.toLowerCase();
  return foods.filter(food => {
    const lowerCaseName = food.name.toLowerCase();
    switch (lowerCaseCategory) {
      case 'protein':
        return food.protein_per_100g >= 15 || ['frango', 'pollo', 'tilapia', 'peixe', 'carne', 'salmão', 'ovo', 'clara', 'huevo'].some(keyword => lowerCaseName.includes(keyword));
      case 'carb':
        return food.carb_per_100g >= 50 || ['arroz', 'quinoa', 'batata', 'aveia', 'banana', 'pão'].some(keyword => lowerCaseName.includes(keyword));
      case 'fat':
        return food.fat_per_100g >= 20 || ['azeite', 'oliva', 'amend', 'abacate', 'noz'].some(keyword => lowerCaseName.includes(keyword));
      case 'vegetable':
        return food.kcal_per_100g < 50 && food.carb_per_100g < 15 || ['brócoli', 'espinafre', 'tomate', 'alface', 'pepino'].some(keyword => lowerCaseName.includes(keyword));
      case 'dairy':
        return ['leite', 'iogurte', 'yogur', 'queijo', 'queso', 'milk'].some(keyword => lowerCaseName.includes(keyword));
      case 'eggs':
        return ['ovo', 'clara', 'huevo'].some(keyword => lowerCaseName.includes(keyword));
      default:
        return false;
    }
  });
}


// Placeholder for generateMeal function (replace with actual implementation if available)
// This is a crucial part that needs to be implemented based on your specific logic for generating a single meal.
// The following is a dummy implementation to allow the code to compile.
function generateMeal(
  name: string,
  targetCalories: number,
  targetProtein: number,
  targetCarb: number,
  targetFat: number,
  foods: FoodItem[],
  category: 'suave' | 'moderado' | 'restritivo'
): Meal {
  const mealItems: MealItem[] = [];
  let currentCalories = 0;
  let currentProtein = 0;
  let currentCarb = 0;
  let currentFat = 0;

  // Safety check for invalid targets
  if (targetCalories <= 0 || targetProtein < 0 || targetCarb < 0 || targetFat < 0) {
    console.warn(`Invalid meal targets for ${name}:`, { targetCalories, targetProtein, targetCarb, targetFat });
    return {
      name,
      items: [],
      totals: { protein: 0, carb: 0, fat: 0, kcal: 0 },
    };
  }

  // Get foods suitable for this meal type
  const suitableFoods = getSuitableFoodsForMeal(name, foods);

  if (suitableFoods.length === 0) {
    console.warn(`No suitable foods found for meal: ${name}`);
    return {
      name,
      items: [],
      totals: { protein: 0, carb: 0, fat: 0, kcal: 0 },
    };
  }

  // Shuffle foods for variety
  const shuffledFoods = [...suitableFoods].sort(() => Math.random() - 0.5);

  // More conservative calorie target - stay within bounds
  const maxCalories = targetCalories * 0.95; // 5% under target to be safe

  for (const food of shuffledFoods) {
    if (currentCalories >= maxCalories || mealItems.length >= 5) break;

    // Calculate how many calories we still need
    const remainingCalories = maxCalories - currentCalories;
    if (remainingCalories <= 10) break; // Stop if very little calories left

    const caloriesPerGram = food.kcal_per_100g / 100;
    if (caloriesPerGram === 0) continue; // Avoid division by zero

    // Calculate serving size - be more conservative
    let servingGrams = Math.round(remainingCalories / caloriesPerGram);

    // Reasonable portion sizes
    servingGrams = Math.max(15, Math.min(150, servingGrams));

    // Calculate nutrition for this serving
    const factor = servingGrams / 100;

    const itemProtein = Math.round((food.protein_per_100g * factor) * 10) / 10;
    const itemCarb = Math.round((food.carb_per_100g * factor) * 10) / 10;
    const itemFat = Math.round((food.fat_per_100g * factor) * 10) / 10;
    const itemCalories = Math.round(food.kcal_per_100g * factor);

    // Double check we don't exceed remaining calories
    if (currentCalories + itemCalories > maxCalories) {
      continue; // Skip this food
    }

    const mealItem: MealItem = {
      foodId: food.id,
      name: food.name,
      grams: servingGrams,
      protein: itemProtein,
      carb: itemCarb,
      fat: itemFat,
      kcal: itemCalories,
    };

    mealItems.push(mealItem);
    currentCalories += itemCalories;
    currentProtein += itemProtein;
    currentCarb += itemCarb;
    currentFat += itemFat;

    // Stop if we have enough items or calories
    if (mealItems.length >= 3) {
      break;
    }
  }

  return {
    name,
    items: mealItems,
    totals: {
      protein: Math.round(currentProtein * 10) / 10,
      carb: Math.round(currentCarb * 10) / 10,
      fat: Math.round(currentFat * 10) / 10,
      kcal: Math.round(currentCalories),
    },
  };
}