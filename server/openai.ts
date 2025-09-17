import OpenAI from 'openai';

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Circuit breaker to prevent infinite retries
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private readonly maxFailures = 3;
  private readonly resetTime = 300000; // 5 minutes

  isOpen(): boolean {
    if (this.failures >= this.maxFailures) {
      const timeSinceLastFailure = Date.now() - this.lastFailureTime;
      if (timeSinceLastFailure < this.resetTime) {
        return true; // Circuit is open, don't allow calls
      } else {
        this.reset(); // Reset circuit after timeout
      }
    }
    return false;
  }

  recordFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();
  }

  recordSuccess(): void {
    this.reset();
  }

  private reset(): void {
    this.failures = 0;
    this.lastFailureTime = 0;
  }
}

const circuitBreaker = new CircuitBreaker();

// Generate meal plan using OpenAI with calculated macros
export async function generateMealPlanWithAI(
  calories: number,
  protein: number,
  carb: number,
  fat: number,
  category: string
): Promise<string> {
  // Check circuit breaker first
  if (circuitBreaker.isOpen()) {
    throw new Error("Circuit breaker is open - too many recent failures. Please try again later.");
  }

  try {
    // Log API key status (without exposing the key)
    const hasApiKey = !!process.env.OPENAI_API_KEY;
    const keyPreview = process.env.OPENAI_API_KEY ? `${process.env.OPENAI_API_KEY.slice(0, 7)}...${process.env.OPENAI_API_KEY.slice(-4)}` : 'not set';
    console.log(`OpenAI API Key status: ${hasApiKey ? 'present' : 'missing'} (${keyPreview})`);

    if (!process.env.OPENAI_API_KEY) {
      circuitBreaker.recordFailure();
      throw new Error("OpenAI API key not configured");
    }

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
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
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
    circuitBreaker.recordSuccess();
    return completion.choices[0]?.message?.content || "Error generando el plan de comidas";
  } catch (error: any) {
    console.error("Error calling OpenAI API:", error);
    console.error("Error details:", {
      name: error?.name,
      message: error?.message,
      code: error?.code,
      status: error?.status
    });
    
    // Record failure in circuit breaker
    circuitBreaker.recordFailure();
    throw error;
  }
}