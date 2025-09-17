import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate meal plan using OpenAI with calculated macros
export async function generateMealPlanWithAI(
  calories: number,
  protein: number,
  carb: number,
  fat: number,
  category: string
): Promise<string> {
  try {
    // Log API key status (without exposing the key)
    const hasApiKey = !!process.env.OPENAI_API_KEY;
    const keyPreview = process.env.OPENAI_API_KEY ? `${process.env.OPENAI_API_KEY.slice(0, 7)}...${process.env.OPENAI_API_KEY.slice(-4)}` : 'not set';
    console.log(`OpenAI API Key status: ${hasApiKey ? 'present' : 'missing'} (${keyPreview})`);

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `Cree un plan de comidas personalizado para un día con los siguientes macronutrientes:
    - Calorías totales: ${calories} kcal
    - Proteínas: ${protein}g
    - Carbohidratos: ${carb}g
    - Grasas: ${fat}g
    - Categoría de pérdida de peso: ${category}

    Formato del plan:
    🌅 DESAYUNO (XX:XX AM)
    - Alimento 1: XXg
    - Alimento 2: XXg

    🍽️ ALMUERZO (XX:XX PM)
    - Alimento 1: XXg
    - Alimento 2: XXg

    🥪 MERIENDA (XX:XX PM)
    - Alimento 1: XXg

    🍽️ CENA (XX:XX PM)
    - Alimento 1: XXg
    - Alimento 2: XXg

    🌙 COLACIÓN NOCTURNA (XX:XX PM)
    - Alimento 1: XXg

    Incluya alimentos tradicionales latinoamericanos como quinoa, amaranto, frijoles, aguacate, choclo, camote, etc. Sea específico con las cantidades en gramos.`;

    console.log("Calling OpenAI API...");

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Eres un nutricionista especializado en dietas latinoamericanas y planes de alimentación personalizados."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    console.log("OpenAI API call successful");
    return completion.choices[0]?.message?.content || "Error generando el plan de comidas";
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      code: error.code,
      status: error.status
    });
    throw error;
  }
}