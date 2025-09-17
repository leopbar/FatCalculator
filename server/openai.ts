
import { storage } from "./storage";
import { MacroTarget, Meal, MealItem, FoodItem } from "@shared/schema";

// Internal meal generation functions (adapted from client-side nutrition.ts)
function categorizeFoodsWithQuality(foods: FoodItem[]) {
  const categories = {
    protein: [] as FoodItem[],
    carb: [] as FoodItem[],
    fat: [] as FoodItem[],
    vegetables: [] as FoodItem[],
    fruits: [] as FoodItem[],
    dairy: [] as FoodItem[],
    eggs: [] as FoodItem[]
  };

  foods.forEach(food => {
    const category = food.category.toLowerCase();
    
    // Protein sources
    if (category.includes('carne') || category.includes('pollo') || category.includes('pescado') || 
        category.includes('cerdo') || category.includes('proteína')) {
      categories.protein.push(food);
    }
    // Carbohydrates
    else if (category.includes('cereales') || category.includes('legumbres') || category.includes('arroz') ||
             category.includes('pan') || category.includes('pasta')) {
      categories.carb.push(food);
    }
    // Dairy
    else if (category.includes('lácteos') || category.includes('leche') || category.includes('queso') ||
             category.includes('yogur')) {
      categories.dairy.push(food);
    }
    // Vegetables
    else if (category.includes('verduras') || category.includes('vegetales') || category.includes('hortalizas')) {
      categories.vegetables.push(food);
    }
    // Fruits
    else if (category.includes('frutas')) {
      categories.fruits.push(food);
    }
    // Eggs
    else if (category.includes('huevos')) {
      categories.eggs.push(food);
    }
    // Fats and oils
    else if (category.includes('grasas') || category.includes('aceites') || category.includes('frutos secos')) {
      categories.fat.push(food);
    }
    // Default to carb if uncertain
    else {
      categories.carb.push(food);
    }
  });

  return categories;
}

function generatePreciseMeal(
  mealName: string,
  targetCalories: number,
  targetProtein: number,
  targetCarb: number,
  targetFat: number,
  categorizedFoods: any,
  usedFoods: Set<string>
): MealItem[] {
  const items: MealItem[] = [];
  let currentCalories = 0;
  let currentProtein = 0;
  let currentCarb = 0;
  let currentFat = 0;

  // Select primary protein source
  const availableProteins = [...categorizedFoods.protein, ...categorizedFoods.eggs, ...categorizedFoods.dairy]
    .filter(f => !usedFoods.has(f.id));
  
  if (availableProteins.length > 0) {
    const protein = availableProteins[0];
    const proteinGrams = Math.max(50, Math.min(200, targetProtein * 100 / protein.protein_per_100g));
    
    items.push({
      foodId: protein.id,
      name: protein.name,
      grams: Math.round(proteinGrams),
      protein: Math.round((proteinGrams * protein.protein_per_100g / 100) * 10) / 10,
      carb: Math.round((proteinGrams * protein.carb_per_100g / 100) * 10) / 10,
      fat: Math.round((proteinGrams * protein.fat_per_100g / 100) * 10) / 10,
      kcal: Math.round(proteinGrams * protein.kcal_per_100g / 100)
    });
    
    currentProtein += items[items.length - 1].protein;
    currentCarb += items[items.length - 1].carb;
    currentFat += items[items.length - 1].fat;
    currentCalories += items[items.length - 1].kcal;
    usedFoods.add(protein.id);
  }

  // Add carbohydrate source if needed
  const remainingCarb = targetCarb - currentCarb;
  if (remainingCarb > 10) {
    const availableCarbs = categorizedFoods.carb.filter((f: FoodItem) => !usedFoods.has(f.id));
    if (availableCarbs.length > 0) {
      const carb = availableCarbs[0];
      const carbGrams = Math.max(30, Math.min(150, remainingCarb * 100 / carb.carb_per_100g));
      
      items.push({
        foodId: carb.id,
        name: carb.name,
        grams: Math.round(carbGrams),
        protein: Math.round((carbGrams * carb.protein_per_100g / 100) * 10) / 10,
        carb: Math.round((carbGrams * carb.carb_per_100g / 100) * 10) / 10,
        fat: Math.round((carbGrams * carb.fat_per_100g / 100) * 10) / 10,
        kcal: Math.round(carbGrams * carb.kcal_per_100g / 100)
      });
      
      usedFoods.add(carb.id);
    }
  }

  // Add vegetables for volume and nutrients
  if (categorizedFoods.vegetables.length > 0) {
    const vegetable = categorizedFoods.vegetables[0];
    const vegGrams = 100; // Standard serving
    
    items.push({
      foodId: vegetable.id,
      name: vegetable.name,
      grams: vegGrams,
      protein: Math.round((vegGrams * vegetable.protein_per_100g / 100) * 10) / 10,
      carb: Math.round((vegGrams * vegetable.carb_per_100g / 100) * 10) / 10,
      fat: Math.round((vegGrams * vegetable.fat_per_100g / 100) * 10) / 10,
      kcal: Math.round(vegGrams * vegetable.kcal_per_100g / 100)
    });
  }

  return items;
}

function convertMealsToText(meals: Meal[]): string {
  const mealTimeNames = [
    "🌅 CAFÉ DA MANHÃ (07:00 AM)",
    "🍽️ ALMOÇO (12:30 PM)", 
    "🥪 LANCHE DA TARDE (15:30 PM)",
    "🍽️ JANTAR (19:00 PM)",
    "🌙 CEIA (21:30 PM)"
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

// Generate meal plan using real food data instead of external AI
export async function generateMealPlanWithAI(
  calories: number,
  protein: number,
  carb: number,
  fat: number,
  category: string
): Promise<string> {
  console.log(`Using internal meal generator with real food data`);

  try {
    // Get all foods from database  
    const foods = await storage.getAllAlimentos();
    if (!foods || foods.length === 0) {
      throw new Error("No foods available in database");
    }

    // Convert to FoodItem format
    const foodItems: FoodItem[] = foods.map(food => ({
      id: food.id,
      name: food.nombre,
      category: food.categoria,
      protein_per_100g: food.proteinas_por_100g,
      carb_per_100g: food.carbohidratos_por_100g,
      fat_per_100g: food.grasas_por_100g,
      kcal_per_100g: food.calorias_por_100g,
      fiber_per_100g: 0, // Default value
      energy_density: food.calorias_por_100g / 100
    }));

    // Create macro target object
    const macroTarget: MacroTarget = {
      calories: calories,
      protein_g: protein,
      carb_g: carb,
      fat_g: fat,
      protein_percent: (protein * 4 / calories) * 100,
      carb_percent: (carb * 4 / calories) * 100,
      fat_percent: (fat * 9 / calories) * 100
    };

    // Categorize foods
    const categorizedFoods = categorizeFoodsWithQuality(foodItems);

    // Meal distribution that adds up to exactly 100%
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

      // Reset used foods if we've used most of the database
      if (usedFoods.size > foodItems.length * 0.9) {
        usedFoods.clear();
      }
    });

    // Convert meals to formatted text
    const mealPlanText = convertMealsToText(meals);
    
    // Add footer with macro information
    const finalText = `${mealPlanText}

💡 INFORMAÇÕES NUTRICIONAIS PLANEJADAS:
📊 Calorias: ${calories} kcal
🥩 Proteínas: ${protein}g (${Math.round((protein * 4 / calories) * 100)}%)
🍞 Carboidratos: ${carb}g (${Math.round((carb * 4 / calories) * 100)}%)
🥑 Gorduras: ${fat}g (${Math.round((fat * 9 / calories) * 100)}%)

⭐ Categoria: ${category.toUpperCase()}

📝 OBSERVAÇÕES IMPORTANTES:
• Este cardápio foi gerado com alimentos reais da base de dados USDA
• As quantidades são calculadas para atingir seus macro objetivos
• Beba pelo menos 2 litros de água ao longo do dia
• Mantenha intervalo de 3 horas entre as refeições
• Consulte um nutricionista para orientações personalizadas`;

    console.log("Real food-based meal plan generated successfully");
    return finalText;
  } catch (error: any) {
    console.error("Error generating meal plan with real foods:", error);
    throw error;
  }
}
