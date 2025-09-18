import { MacroTarget, FoodItem, Meal, MealItem, MenuPlan } from "@shared/schema";

// Translation map from Spanish to Portuguese categories
const categoryTranslations: { [key: string]: string } = {
  'restrictivo': 'restritivo',
  'moderado': 'moderado',
  'suave': 'suave'
};

// Function to translate Spanish categories to Portuguese
export function translateCategoryToPortuguese(category: string): string {
  const lowerCategory = category.toLowerCase();
  return categoryTranslations[lowerCategory] || lowerCategory;
}

// Translation map from Portuguese to Mexican Spanish for food names
const foodNameTranslations: { [key: string]: string } = {
  // Proteins
  'ovo inteiro': 'huevo entero',
  'ovo': 'huevo',
  'ovos': 'huevos',
  'clara': 'clara de huevo',
  'frango': 'pollo',
  'frango desfiado': 'pollo deshebrado',
  'frango assado': 'pollo asado',
  'peito de frango': 'pechuga de pollo',
  'carne magra bovina': 'carne magra de res',
  'carne moída magra': 'carne molida magra',
  'carne suína magra': 'carne magra de cerdo',
  'peixe grelhado': 'pescado a la plancha',
  'pescado branco': 'pescado blanco',
  'filé de tilápia': 'filete de tilapia',
  'tilápia': 'tilapia',
  'atum': 'atún',
  'atum grelhado': 'atún a la plancha',
  'salmão': 'salmón',

  // Dairy
  'leite desnatado': 'leche descremada',
  'leite de coco': 'leche de coco',
  'leite de amêndoas': 'leche de almendras',
  'iogurte grego': 'yogur griego',
  'iogurte natural': 'yogur natural',
  'queijo cottage': 'queso cottage',
  'queijo fresco': 'queso fresco',
  'queijo parmesão': 'queso parmesano',
  'kefir': 'kéfir',

  // Carbs
  'arroz integral': 'arroz integral',
  'quinoa': 'quinoa',
  'quinoa cozida': 'quinoa cocida',
  'aveia': 'avena',
  'panqueca de aveia': 'panqueque de avena',
  'granola': 'granola',
  'tortilla de milho integral': 'tortilla de maíz integral',
  'pão integral': 'pan integral',
  'batata doce': 'camote',
  'batata-doce assada': 'camote asado',
  'batata doce assada': 'camote asado',
  'batata doce cozida': 'camote cocido',
  'mandioca': 'yuca',
  'inhame': 'ñame',
  'tapioca': 'tapioca',

  // Vegetables
  'salada completa': 'ensalada completa',
  'salada verde': 'ensalada verde',
  'salada tropical': 'ensalada tropical',
  'vegetais salteados': 'verduras salteadas',
  'vegetais': 'verduras',
  'brócolis': 'brócoli',
  'brócolis cozido': 'brócoli cocido',
  'brócolis e couve-flor': 'brócoli y coliflor',
  'brócolis e cenoura': 'brócoli y zanahoria',
  'couve refogada': 'col rizada salteada',
  'couve-flor': 'coliflor',
  'espinafre': 'espinacas',
  'alface': 'lechuga',
  'tomate': 'tomate',
  'pepino': 'pepino',
  'cenoura': 'zanahoria',
  'vagem refogada': 'ejotes salteados',
  'abóbora': 'calabaza',
  'abóbora em cubos': 'calabaza en cubos',
  'ratatouille': 'ratatouille',

  // Fruits
  'banana': 'plátano',
  'açaí': 'açaí',
  'acaí': 'açaí',
  'manga': 'mango',
  'abacate': 'aguacate',
  'frutas vermelhas': 'frutos rojos',
  'mix de frutas': 'mezcla de frutas',
  'suco de laranja': 'jugo de naranja',
  'mel': 'miel',

  // Fats & nuts
  'azeite': 'aceite de oliva',
  'amêndoas': 'almendras',
  'pasta de amendoim': 'mantequilla de maní',
  'pasta de amendoim integral': 'mantequilla de maní integral',
  'sementes de chia': 'semillas de chía',
  'sementes de girassol': 'semillas de girasol',

  // Legumes
  'feijão preto': 'frijoles negros',
  'lentilha': 'lentejas',
  'lentilhas': 'lentejas',
  'grão-de-bico': 'garbanzos',

  // Other
  'canela em pó': 'canela en polvo',
  'smoothie de iogurte': 'batido de yogur'
};

// Translation map for meal names
const mealNameTranslations: { [key: string]: string } = {
  'café da manhã': 'desayuno',
  'almoço': 'almuerzo',
  'lanche da tarde': 'merienda',
  'jantar': 'cena',
  'ceia': 'colación nocturna'
};

// Translation map for UI text
const uiTextTranslations: { [key: string]: string } = {
  'menú personalizado': 'menú personalizado',
  'metas de macronutrientes': 'metas de macronutrientes',
  'calorías': 'calorías',
  'proteína': 'proteína',
  'carbohidratos': 'carbohidratos',
  'grasas': 'grasas',
  'totales diarios': 'totales diarios',
  'calorías totales': 'calorías totales',
  'total de la comida': 'total del día',
  'plan': 'plan'
};

// Function to translate food names from Portuguese to Mexican Spanish
export function translateFoodNameToSpanish(foodName: string): string {
  const lowerName = foodName.toLowerCase();
  return foodNameTranslations[lowerName] || foodName;
}

// Function to translate meal names from Portuguese to Mexican Spanish
export function translateMealNameToSpanish(mealName: string): string {
  const lowerName = mealName.toLowerCase();
  return mealNameTranslations[lowerName] || mealName;
}

// Function to translate UI text to Mexican Spanish
export function translateUITextToSpanish(text: string): string {
  const lowerText = text.toLowerCase();
  return uiTextTranslations[lowerText] || text;
}

// Função para converter gramas em medidas caseiras em espanhol mexicano
export function convertToHouseholdMeasuresSpanish(foodName: string, grams: number): string {
  const name = foodName.toLowerCase();

  // Huevos - 1 huevo mediano = ~50g
  if (name.includes('huevo') || name.includes('clara')) {
    const eggs = Math.round(grams / 50);
    return `(${eggs} ${eggs === 1 ? 'huevo' : 'huevos'})`;
  }

  // Leche y líquidos - 1 taza = ~240ml = ~240g
  if (name.includes('leche') || name.includes('yogur')) {
    if (grams >= 240) {
      const cups = Math.round(grams / 240 * 10) / 10;
      return `(${cups} ${cups === 1 ? 'taza' : 'tazas'})`;
    } else {
      const ml = Math.round(grams);
      return `(${ml}ml)`;
    }
  }

  // Quesos - 1 rebanada mediana = ~30g
  if (name.includes('queso')) {
    const slices = Math.round(grams / 30);
    return `(${slices} ${slices === 1 ? 'rebanada' : 'rebanadas'})`;
  }

  // Arroz cocido - 1 cucharada = ~20g
  if (name.includes('arroz') && name.includes('integral')) {
    const spoons = Math.round(grams / 20);
    return `(${spoons} ${spoons === 1 ? 'cucharada' : 'cucharadas'})`;
  }

  // Avena - 1 cucharada = ~15g
  if (name.includes('avena')) {
    const spoons = Math.round(grams / 15);
    return `(${spoons} ${spoons === 1 ? 'cucharada' : 'cucharadas'})`;
  }

  // Camote - 1 unidad mediana = ~150g
  if (name.includes('camote')) {
    if (grams >= 75) {
      const units = Math.round(grams / 150 * 10) / 10;
      return `(${units} ${units === 1 ? 'camote mediano' : 'camotes medianos'})`;
    } else {
      const spoons = Math.round(grams / 20);
      return `(${spoons} ${spoons === 1 ? 'cucharada' : 'cucharadas'})`;
    }
  }

  // Plátano - 1 unidad mediana = ~100g
  if (name.includes('plátano')) {
    const units = Math.round(grams / 100 * 10) / 10;
    return `(${units} ${units === 1 ? 'plátano' : 'plátanos'})`;
  }

  // Pan integral - 1 rebanada = ~25g
  if (name.includes('pan')) {
    const slices = Math.round(grams / 25);
    return `(${slices} ${slices === 1 ? 'rebanada' : 'rebanadas'})`;
  }

  // Aceite de oliva - 1 cucharada = ~15ml = ~15g
  if (name.includes('aceite')) {
    const spoons = Math.round(grams / 15);
    return `(${spoons} ${spoons === 1 ? 'cucharada' : 'cucharadas'})`;
  }

  // Almendras y nueces - 1 cucharada = ~15g
  if (name.includes('almendra') || name.includes('mantequilla de maní') || name.includes('nuez')) {
    const spoons = Math.round(grams / 15);
    return `(${spoons} ${spoons === 1 ? 'cucharada' : 'cucharadas'})`;
  }

  // Aguacate - 1 unidad mediana = ~200g
  if (name.includes('aguacate')) {
    if (grams >= 100) {
      const units = Math.round(grams / 200 * 10) / 10;
      return `(${units} ${units === 1 ? 'aguacate mediano' : 'aguacates medianos'})`;
    } else {
      const spoons = Math.round(grams / 20);
      return `(${spoons} ${spoons === 1 ? 'cucharada' : 'cucharadas'})`;
    }
  }

  // Mantequilla de maní - 1 cucharada = ~15g
  if (name.includes('mantequilla')) {
    const spoons = Math.round(grams / 15);
    return `(${spoons} ${spoons === 1 ? 'cucharada' : 'cucharadas'})`;
  }

  // Verduras de hoja (brócoli, espinacas, lechuga) - 1 taza = ~30g
  if (name.includes('brócoli') || name.includes('espinacas') || name.includes('lechuga')) {
    const cups = Math.round(grams / 30);
    return `(${cups} ${cups === 1 ? 'taza' : 'tazas'})`;
  }

  // Tomate - 1 unidad mediana = ~120g
  if (name.includes('tomate')) {
    if (grams >= 60) {
      const units = Math.round(grams / 120 * 10) / 10;
      return `(${units} ${units === 1 ? 'tomate mediano' : 'tomates medianos'})`;
    } else {
      const spoons = Math.round(grams / 20);
      return `(${spoons} ${spoons === 1 ? 'cucharada' : 'cucharadas'})`;
    }
  }

  // Pepino - 1 unidad mediana = ~200g
  if (name.includes('pepino')) {
    if (grams >= 100) {
      const units = Math.round(grams / 200 * 10) / 10;
      return `(${units} ${units === 1 ? 'pepino mediano' : 'pepinos medianos'})`;
    } else {
      const slices = Math.round(grams / 10);
      return `(${slices} rebanadas)`;
    }
  }

  // Carnes (pollo, tilapia, etc) - usar cucharadas o porciones
  if (name.includes('pollo') || name.includes('tilapia') || 
      name.includes('pescado') || name.includes('carne') || name.includes('salmón') || name.includes('atún')) {
    if (grams >= 100) {
      const portions = Math.round(grams / 100 * 10) / 10;
      return `(${portions} ${portions === 1 ? 'porción' : 'porciones'})`;
    } else {
      const spoons = Math.round(grams / 20);
      return `(${spoons} ${spoons === 1 ? 'cucharada' : 'cucharadas'})`;
    }
  }

  // Quinoa cocida - 1 cucharada = ~20g
  if (name.includes('quinoa')) {
    const spoons = Math.round(grams / 20);
    return `(${spoons} ${spoons === 1 ? 'cucharada' : 'cucharadas'})`;
  }

  // Para otros alimentos, usar cucharadas como medida estándar
  if (grams >= 60) {
    const spoons = Math.round(grams / 15);
    return `(${spoons} ${spoons === 1 ? 'cucharada' : 'cucharadas'})`;
  } else if (grams >= 15) {
    const spoons = Math.round(grams / 15);
    return `(${spoons} ${spoons === 1 ? 'cucharada' : 'cucharadas'})`;
  } else {
    const teaspoons = Math.round(grams / 5);
    return `(${teaspoons} ${teaspoons === 1 ? 'cucharadita' : 'cucharaditas'})`;
  }
}

// Calculate macronutrient targets based on international standards (AMDR)
export function calculateMacroTargets(
  tdee: number,
  targetCalories: number,
  weight: number,
  bodyFatPercent: number,
  category: 'suave' | 'moderado' | 'restritivo'
): MacroTarget {
  console.log("🎯 Calculating macro targets:", { tdee, targetCalories, weight, bodyFatPercent, category });

  // Translate Spanish categories to Portuguese
  const translatedCategory = translateCategoryToPortuguese(category);
  console.log("📝 Translated category from", category, "to", translatedCategory);

  // Validate inputs
  if (!tdee || !targetCalories || !weight || bodyFatPercent === undefined) {
    console.error("❌ Invalid inputs for macro calculation:", { tdee, targetCalories, weight, bodyFatPercent });
    throw new Error("Invalid inputs for macro calculation");
  }

  // Calculate lean body mass (kg)
  const leanBodyMass = weight * (1 - bodyFatPercent / 100);

  // Protein targets based on category and lean body mass
  let proteinMultiplier: number;
  let carbPercent: number;
  let fatPercent: number;

  switch (translatedCategory) {
    case 'suave':
      proteinMultiplier = 1.6;  // 1.6g per kg LBM
      carbPercent = 0.45;       // 45% carbs
      fatPercent = 0.30;        // 30% fat
      break;
    case 'moderado':
      proteinMultiplier = 1.8;  // 1.8g per kg LBM
      carbPercent = 0.40;       // 40% carbs
      fatPercent = 0.25;        // 25% fat
      break;
    case 'restritivo':
      proteinMultiplier = 2.0;  // 2.0g per kg LBM
      carbPercent = 0.35;       // 35% carbs
      fatPercent = 0.25;        // 25% fat
      break;
    default:
      console.warn("⚠️ Unknown category:", category, "using default moderado values");
      proteinMultiplier = 1.8;
      carbPercent = 0.40;
      fatPercent = 0.25;
  }

  // Calculate macros with proper validation
  const protein_g = Math.round(leanBodyMass * proteinMultiplier);
  const protein_calories = protein_g * 4;

  const carb_calories = Math.round(targetCalories * carbPercent);
  const carb_g = Math.round(carb_calories / 4);

  const fat_calories = Math.round(targetCalories * fatPercent);
  const fat_g = Math.round(fat_calories / 9);

  // Validate all calculations are numbers
  if (isNaN(protein_g) || isNaN(carb_g) || isNaN(fat_g) || 
      protein_g <= 0 || carb_g <= 0 || fat_g <= 0) {
    console.error("🚫 Invalid macro calculations:", { 
      protein_g, carb_g, fat_g, 
      leanBodyMass, proteinMultiplier, carbPercent, fatPercent 
    });
    throw new Error("Erro no cálculo de macronutrientes");
  }

  // Calculate percentages
  const total_macro_calories = protein_calories + carb_calories + fat_calories;
  const protein_percent = Math.round((protein_calories / total_macro_calories) * 100);
  const carb_percent_final = Math.round((carb_calories / total_macro_calories) * 100);
  const fat_percent_final = Math.round((fat_calories / total_macro_calories) * 100);

  const result = {
    calories: targetCalories,
    protein_g: protein_g,
    carb_g: carb_g, 
    fat_g: fat_g,
    protein_percent: protein_percent,
    carb_percent: carb_percent_final,
    fat_percent: fat_percent_final,
  };

  console.log("✅ Macro targets calculated:", result);

  // Final validation to ensure no null/undefined values
  Object.entries(result).forEach(([key, value]) => {
    if (value === null || value === undefined || isNaN(value)) {
      console.error(`🚫 Invalid value for ${key}:`, value);
      throw new Error(`Valor inválido para ${key}: ${value}`);
    }
  });

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

  // Aguacate - 1 unidad mediana = ~200g
  if (name.includes('aguacate') || name.includes('abacate')) {
    if (grams >= 100) {
      const units = Math.round(grams / 200 * 10) / 10;
      return `(${units} ${units === 1 ? 'aguacate mediano' : 'aguacates medianos'})`;
    } else {
      const spoons = Math.round(grams / 20);
      return `(${spoons} ${spoons === 1 ? 'cucharada' : 'cucharadas'})`;
    }
  }

  // Pasta de amendoim - 1 colher de sopa = ~15g
  if (name.includes('pasta')) {
    const spoons = Math.round(grams / 15);
    return `(${spoons} ${spoons === 1 ? 'colher de sopa' : 'colheres de sopa'})`;
  }

  // Vegetais folhosos (brócoli, espinafre, alface) - 1 xícara = ~30g
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

  // Para outros alimentos, usar cucharadas como medida estándar
  if (grams >= 60) {
    const spoons = Math.round(grams / 15);
    return `(${spoons} ${spoons === 1 ? 'cucharada' : 'cucharadas'})`;
  } else if (grams >= 15) {
    const spoons = Math.round(grams / 15);
    return `(${spoons} ${spoons === 1 ? 'cucharada' : 'cucharadas'})`;
  } else {
    const teaspoons = Math.round(grams / 5);
    return `(${teaspoons} ${teaspoons === 1 ? 'cucharadita' : 'cucharaditas'})`;
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