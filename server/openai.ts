
// Using Ollama as free local AI alternative
const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
const OLLAMA_MODEL = 'llama3.1:8b'; // Free local model

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

// Generate meal plan using Ollama with calculated macros
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
    console.log(`Ollama service status: checking local installation`);

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

    Incluya alimentos tradicionales latinoamericanos como quinoa, amaranto, frijoles, aguacate, choclo, camote, etc. Sea específico con las cantidades en gramos.

    Eres un nutricionista especializado en dietas latinoamericanas y planes de alimentación personalizados. Responde solo con el plan de comidas, sin explicaciones adicionales.`;

    console.log("Calling Ollama API...");

    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const completion = await response.json();
    console.log("Ollama API call successful");
    circuitBreaker.recordSuccess();
    return completion.response || "Error generando el plan de comidas";
  } catch (error: any) {
    console.error("Error calling Ollama API:", error);
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
