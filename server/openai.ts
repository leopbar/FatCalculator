
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
  const prompt = `Você é um(a) nutricionista altamente qualificado(a), especialista em elaborar cardápios para emagrecimento com foco em alta densidade nutricional, saciedade e variedade alimentar. A maior parte do seu público é hispânico (México, Colômbia e outros países da América Latina), portanto suas sugestões devem considerar alimentos comuns e típicos dessas culturas, mantendo praticidade e familiaridade gastronômica.

Meta nutricional total do dia: ${calories} kcal
${protein}g de proteínas (${Math.round((protein * 4 / calories) * 100)}%)
${carb}g de carboidratos (${Math.round((carb * 4 / calories) * 100)}%)
${fat}g de gorduras (${Math.round((fat * 9 / calories) * 100)}%)

Categoria do plano: ${category}

Formato de entrega: organize o cardápio em refeições (café da manhã, lanche da manhã, almoço, lanche da tarde, jantar, ceia).

Para cada refeição, apresente os alimentos em formato estruturado:
- Nome do alimento e quantidade em gramas
- Valores nutricionais (kcal, proteínas, carboidratos, gorduras)
- Subtotal da refeição

Diretrizes importantes:
1. Use principalmente alimentos típicos hispânicos: arepas, frijoles, quinoa, aguacate, plátano, pollo, pescado, etc.
2. Porções realistas e práticas (150g de frango, não 10g de clara de ovo)
3. Combinações culturalmente familiares (arepa com queso, arroz con frijoles, etc.)
4. Mantenha as metas de macros dentro de 5% de tolerância
5. Priorize alimentos integrais e minimamente processados
6. Distribua as refeições equilibradamente ao longo do dia

Exemplo de formato esperado:
🍳 Café da manhã
Clara de huevo (200g – ~6 claras) → 100 kcal | 22g P | 2g C | 0g G
Arepa integral (60g) → 130 kcal | 4g P | 27g C | 1g G
...
Subtotal: X kcal | Xg P | Xg C | Xg G

Por favor, gere um cardápio completo seguindo exatamente essas diretrizes.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system", 
          content: "Você é um nutricionista especialista em cardápios para população hispânica. Responda sempre em português, mas use nomes de alimentos típicos hispânicos."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || "Erro ao gerar cardápio";
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw new Error("Falha ao gerar cardápio com IA");
  }
}
