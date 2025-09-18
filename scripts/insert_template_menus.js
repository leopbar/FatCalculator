// Script para inserir cardápios de template na tabela template_menus
// Processando cardápios de 1500 kcal

const cardapios1500 = [
  {
    name: "Cardápio 1 – Mulheres – 1500 kcal",
    gender: "feminino",
    calorie_level: 1500,
    total_calories: 1500,
    protein_grams: 0, // Calculado depois
    carb_grams: 0,    // Calculado depois
    fat_grams: 0,     // Calculado depois
    meals: [
      {
        name: "Café da Manhã",
        items: [
          { name: "Ovos", grams: 100, categoria: "proteínas" },
          { name: "Arepa de milho integral", grams: 60, categoria: "carboidratos" },
          { name: "Queijo fresco (queso fresco)", grams: 30, categoria: "proteínas" },
          { name: "Mamão formosa", grams: 100, categoria: "frutas" }
        ],
        approximate_calories: 350
      },
      {
        name: "Almoço",
        items: [
          { name: "Peito de frango (pechuga de pollo)", grams: 130, categoria: "proteínas" },
          { name: "Arroz integral cozido", grams: 100, categoria: "carboidratos" },
          { name: "Feijão preto (frijoles negros) cozido", grams: 90, categoria: "leguminosas" },
          { name: "Salada de vegetais (alface, tomate, pepino)", grams: 150, categoria: "vegetais" },
          { name: "Abacate", grams: 30, categoria: "gorduras" }
        ],
        approximate_calories: 450
      },
      {
        name: "Lanche da Tarde",
        items: [
          { name: "Iogurte grego natural sem açúcar", grams: 150, categoria: "proteínas" },
          { name: "Banana prata", grams: 80, categoria: "frutas" },
          { name: "Amêndoas", grams: 15, categoria: "gorduras" }
        ],
        approximate_calories: 250
      },
      {
        name: "Jantar",
        items: [
          { name: "Filé de tilápia", grams: 150, categoria: "proteínas" },
          { name: "Batata-doce (camote) assada", grams: 130, categoria: "carboidratos" },
          { name: "Brócolis e cenoura no vapor", grams: 150, categoria: "vegetais" }
        ],
        approximate_calories: 350
      },
      {
        name: "Ceia",
        items: [
          { name: "Queijo cottage (ou requesón)", grams: 60, categoria: "proteínas" },
          { name: "Sementes de girassol", grams: 10, categoria: "gorduras" }
        ],
        approximate_calories: 100
      }
    ],
    smart_substitutions: "Arepa / Tortilla de milho ↔ Pão integral (2 fatias) ↔ Cuscuz de milho (4 col. sopa) ↔ Batata doce (100g). Feijão preto (frijoles) ↔ Lentilhas (lentejas) ↔ Grão-de-bico (garbanzos) ↔ Feijão fradinho (mesma quantidade cozida). Peito de frango ↔ Pescado branco (tilápia) ↔ Lombo de porco ↔ Carne bovina magra (lomo, patinho) ↔ Salmão (mesmo peso). Arroz (integral ou branco) ↔ Quinoa ↔ Mandioca (yuca) ↔ Plátano macho verde cozido (respeitar a quantidade em gramas). Iogurte grego/natural ↔ Queijo cottage (requesón) ↔ Kefir natural (mesma quantidade). Abacate ↔ Azeite de oliva (2 colheres de sopa de abacate ≈ 1 colher de chá de azeite) ↔ Pasta de amendoim (1 colher de sopa). Amêndoas/Nozes ↔ Sementes de girassol/abóbora ↔ Pasta de amendoim (1 colher de sopa de pasta ≈ 15g de oleaginosas)."
  },
  
  {
    name: "Cardápio 2 – Mulheres – 1500 kcal",
    gender: "feminino",
    calorie_level: 1500,
    total_calories: 1500,
    protein_grams: 0,
    carb_grams: 0,
    fat_grams: 0,
    meals: [
      {
        name: "Café da Manhã",
        items: [
          { name: "Aveia em flocos", grams: 40, categoria: "carboidratos" },
          { name: "Leite desnatado", grams: 200, categoria: "proteínas" },
          { name: "Morangos (fresas) picados", grams: 100, categoria: "frutas" },
          { name: "Sementes de chia", grams: 10, categoria: "gorduras" }
        ],
        approximate_calories: 360
      },
      {
        name: "Almoço",
        items: [
          { name: "Carne bovina magra (lomo ou patinho) em tiras", grams: 120, categoria: "proteínas" },
          { name: "Tortillas de milho integrais", grams: 60, categoria: "carboidratos" },
          { name: "Pimentão e cebola fatiados e refogados", grams: 100, categoria: "vegetais" },
          { name: "Guacamole simples (abacate amassado com tomate, cebola e coentro)", grams: 50, categoria: "gorduras" }
        ],
        approximate_calories: 460
      },
      {
        name: "Lanche da Tarde",
        items: [
          { name: "Pão integral", grams: 40, categoria: "carboidratos" },
          { name: "Pasta de grão-de-bico (homus)", grams: 40, categoria: "proteínas" },
          { name: "Rodelas de pepino", grams: 50, categoria: "vegetais" }
        ],
        approximate_calories: 230
      },
      {
        name: "Jantar",
        items: [
          { name: "Salmão ao forno", grams: 130, categoria: "proteínas" },
          { name: "Quinoa cozida", grams: 80, categoria: "carboidratos" },
          { name: "Aspargos no vapor", grams: 100, categoria: "vegetais" }
        ],
        approximate_calories: 350
      },
      {
        name: "Ceia",
        items: [
          { name: "Iogurte natural desnatado", grams: 150, categoria: "proteínas" }
        ],
        approximate_calories: 100
      }
    ],
    smart_substitutions: "Arepa / Tortilla de milho ↔ Pão integral (2 fatias) ↔ Cuscuz de milho (4 col. sopa) ↔ Batata doce (100g). Feijão preto (frijoles) ↔ Lentilhas (lentejas) ↔ Grão-de-bico (garbanzos) ↔ Feijão fradinho (mesma quantidade cozida). Peito de frango ↔ Pescado branco (tilápia) ↔ Lombo de porco ↔ Carne bovina magra (lomo, patinho) ↔ Salmão (mesmo peso). Arroz (integral ou branco) ↔ Quinoa ↔ Mandioca (yuca) ↔ Plátano macho verde cozido (respeitar a quantidade em gramas). Iogurte grego/natural ↔ Queijo cottage (requesón) ↔ Kefir natural (mesma quantidade). Abacate ↔ Azeite de oliva (2 colheres de sopa de abacate ≈ 1 colher de chá de azeite) ↔ Pasta de amendoim (1 colher de sopa). Amêndoas/Nozes ↔ Sementes de girassol/abóbora ↔ Pasta de amendoim (1 colher de sopa de pasta ≈ 15g de oleaginosas)."
  },

  {
    name: "Cardápio 3 – Mulheres – 1500 kcal",
    gender: "feminino",
    calorie_level: 1500,
    total_calories: 1500,
    protein_grams: 0,
    carb_grams: 0,
    fat_grams: 0,
    meals: [
      {
        name: "Café da Manhã",
        items: [
          { name: "Ovo", grams: 50, categoria: "proteínas" },
          { name: "Goma de tapioca", grams: 40, categoria: "carboidratos" },
          { name: "Banana prata fatiada com canela", grams: 80, categoria: "frutas" }
        ],
        approximate_calories: 340
      },
      {
        name: "Almoço",
        items: [
          { name: "Lentilha", grams: 80, categoria: "leguminosas" },
          { name: "Cenoura", grams: 50, categoria: "vegetais" },
          { name: "Batata", grams: 70, categoria: "carboidratos" },
          { name: "Carne magra em cubos", grams: 80, categoria: "proteínas" }
        ],
        approximate_calories: 450
      },
      {
        name: "Lanche da Tarde",
        items: [
          { name: "Abacate", grams: 70, categoria: "gorduras" },
          { name: "Whey protein (sabor neutro ou baunilha)", grams: 15, categoria: "proteínas" },
          { name: "Cacau em pó 100%", grams: 5, categoria: "outros" }
        ],
        approximate_calories: 260
      },
      {
        name: "Jantar",
        items: [
          { name: "Ovos cozidos", grams: 100, categoria: "proteínas" },
          { name: "Mix de folhas", grams: 100, categoria: "vegetais" },
          { name: "Grão-de-bico cozido", grams: 80, categoria: "leguminosas" },
          { name: "Tomate cereja", grams: 50, categoria: "vegetais" },
          { name: "Azeite de oliva", grams: 5, categoria: "gorduras" }
        ],
        approximate_calories: 350
      },
      {
        name: "Ceia",
        items: [
          { name: "Nozes", grams: 15, categoria: "gorduras" }
        ],
        approximate_calories: 100
      }
    ],
    smart_substitutions: "Arepa / Tortilla de milho ↔ Pão integral (2 fatias) ↔ Cuscuz de milho (4 col. sopa) ↔ Batata doce (100g). Feijão preto (frijoles) ↔ Lentilhas (lentejas) ↔ Grão-de-bico (garbanzos) ↔ Feijão fradinho (mesma quantidade cozida). Peito de frango ↔ Pescado branco (tilápia) ↔ Lombo de porco ↔ Carne bovina magra (lomo, patinho) ↔ Salmão (mesmo peso). Arroz (integral ou branco) ↔ Quinoa ↔ Mandioca (yuca) ↔ Plátano macho verde cozido (respeitar a quantidade em gramas). Iogurte grego/natural ↔ Queijo cottage (requesón) ↔ Kefir natural (mesma quantidade). Abacate ↔ Azeite de oliva (2 colheres de sopa de abacate ≈ 1 colher de chá de azeite) ↔ Pasta de amendoim (1 colher de sopa). Amêndoas/Nozes ↔ Sementes de girassol/abóbora ↔ Pasta de amendoim (1 colher de sopa de pasta ≈ 15g de oleaginosas)."
  },

  {
    name: "Cardápio 4 – Mulheres – 1500 kcal",
    gender: "feminino",
    calorie_level: 1500,
    total_calories: 1500,
    protein_grams: 0,
    carb_grams: 0,
    fat_grams: 0,
    meals: [
      {
        name: "Café da Manhã",
        items: [
          { name: "Pão integral", grams: 40, categoria: "carboidratos" },
          { name: "Ovos mexidos", grams: 100, categoria: "proteínas" },
          { name: "Couve", grams: 30, categoria: "vegetais" },
          { name: "Abacaxi", grams: 80, categoria: "frutas" },
          { name: "Água", grams: 200, categoria: "outros" }
        ],
        approximate_calories: 355
      },
      {
        name: "Almoço",
        items: [
          { name: "Sobrecoxa de frango assada (sem pele)", grams: 130, categoria: "proteínas" },
          { name: "Cuscuz de milho (flocão) cozido", grams: 100, categoria: "carboidratos" },
          { name: "Feijão fradinho cozido", grams: 80, categoria: "leguminosas" },
          { name: "Tomate picado", grams: 50, categoria: "vegetais" },
          { name: "Coentro e cebola roxa", grams: 20, categoria: "vegetais" }
        ],
        approximate_calories: 450
      },
      {
        name: "Lanche da Tarde",
        items: [
          { name: "Maçã", grams: 120, categoria: "frutas" },
          { name: "Pasta de amendoim integral", grams: 20, categoria: "gorduras" }
        ],
        approximate_calories: 240
      },
      {
        name: "Jantar",
        items: [
          { name: "Carne moída magra", grams: 100, categoria: "proteínas" },
          { name: "Abóbora (calabaza) em cubos, cozida", grams: 200, categoria: "vegetais" },
          { name: "Queijo parmesão ralado", grams: 10, categoria: "proteínas" }
        ],
        approximate_calories: 355
      },
      {
        name: "Ceia",
        items: [
          { name: "Leite desnatado morno", grams: 200, categoria: "proteínas" },
          { name: "Canela em pó", grams: 1, categoria: "outros" }
        ],
        approximate_calories: 100
      }
    ],
    smart_substitutions: "Arepa / Tortilla de milho ↔ Pão integral (2 fatias) ↔ Cuscuz de milho (4 col. sopa) ↔ Batata doce (100g). Feijão preto (frijoles) ↔ Lentilhas (lentejas) ↔ Grão-de-bico (garbanzos) ↔ Feijão fradinho (mesma quantidade cozida). Peito de frango ↔ Pescado branco (tilápia) ↔ Lombo de porco ↔ Carne bovina magra (lomo, patinho) ↔ Salmão (mesmo peso). Arroz (integral ou branco) ↔ Quinoa ↔ Mandioca (yuca) ↔ Plátano macho verde cozido (respeitar a quantidade em gramas). Iogurte grego/natural ↔ Queijo cottage (requesón) ↔ Kefir natural (mesma quantidade). Abacate ↔ Azeite de oliva (2 colheres de sopa de abacate ≈ 1 colher de chá de azeite) ↔ Pasta de amendoim (1 colher de sopa). Amêndoas/Nozes ↔ Sementes de girassol/abóbora ↔ Pasta de amendoim (1 colher de sopa de pasta ≈ 15g de oleaginosas)."
  },

  {
    name: "Cardápio 5 – Mulheres – 1500 kcal",
    gender: "feminino",
    calorie_level: 1500,
    total_calories: 1500,
    protein_grams: 0,
    carb_grams: 0,
    fat_grams: 0,
    meals: [
      {
        name: "Café da Manhã",
        items: [
          { name: "Iogurte natural", grams: 170, categoria: "proteínas" },
          { name: "Granola sem açúcar", grams: 30, categoria: "carboidratos" },
          { name: "Manga picada", grams: 80, categoria: "frutas" }
        ],
        approximate_calories: 350
      },
      {
        name: "Almoço",
        items: [
          { name: "Bisteca de porco magra (lombo)", grams: 120, categoria: "proteínas" },
          { name: "Arroz branco", grams: 100, categoria: "carboidratos" },
          { name: "Brócolis refogado com alho", grams: 120, categoria: "vegetais" },
          { name: "Azeite de oliva", grams: 5, categoria: "gorduras" }
        ],
        approximate_calories: 460
      },
      {
        name: "Lanche da Tarde",
        items: [
          { name: "Milho verde cozido", grams: 150, categoria: "carboidratos" },
          { name: "Manteiga", grams: 5, categoria: "gorduras" }
        ],
        approximate_calories: 240
      },
      {
        name: "Jantar",
        items: [
          { name: "Ovos", grams: 100, categoria: "proteínas" },
          { name: "Queijo fresco", grams: 30, categoria: "proteínas" },
          { name: "Espinafre", grams: 50, categoria: "vegetais" },
          { name: "Tomate", grams: 100, categoria: "vegetais" }
        ],
        approximate_calories: 350
      },
      {
        name: "Ceia",
        items: [
          { name: "Sementes de chia", grams: 15, categoria: "gorduras" },
          { name: "Leite de amêndoas", grams: 100, categoria: "proteínas" }
        ],
        approximate_calories: 100
      }
    ],
    smart_substitutions: "Arepa / Tortilla de milho ↔ Pão integral (2 fatias) ↔ Cuscuz de milho (4 col. sopa) ↔ Batata doce (100g). Feijão preto (frijoles) ↔ Lentilhas (lentejas) ↔ Grão-de-bico (garbanzos) ↔ Feijão fradinho (mesma quantidade cozida). Peito de frango ↔ Pescado branco (tilápia) ↔ Lombo de porco ↔ Carne bovina magra (lomo, patinho) ↔ Salmão (mesmo peso). Arroz (integral ou branco) ↔ Quinoa ↔ Mandioca (yuca) ↔ Plátano macho verde cozido (respeitar a quantidade em gramas). Iogurte grego/natural ↔ Queijo cottage (requesón) ↔ Kefir natural (mesma quantidade). Abacate ↔ Azeite de oliva (2 colheres de sopa de abacate ≈ 1 colher de chá de azeite) ↔ Pasta de amendoim (1 colher de sopa). Amêndoas/Nozes ↔ Sementes de girassol/abóbora ↔ Pasta de amendoim (1 colher de sopa de pasta ≈ 15g de oleaginosas)."
  }
];

// Função para calcular macros estimados (valores aproximados baseados em dados nutricionais médios)
function calculateMacros(meals) {
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFats = 0;

  meals.forEach(meal => {
    meal.items.forEach(item => {
      // Valores nutricionais aproximados por categoria (por 100g)
      const nutritionData = {
        'proteínas': { protein: 20, carbs: 2, fat: 8 },
        'carboidratos': { protein: 8, carbs: 70, fat: 2 },
        'frutas': { protein: 1, carbs: 15, fat: 0.5 },
        'vegetais': { protein: 2, carbs: 8, fat: 0.5 },
        'leguminosas': { protein: 8, carbs: 20, fat: 1 },
        'gorduras': { protein: 2, carbs: 5, fat: 80 },
        'outros': { protein: 5, carbs: 10, fat: 2 }
      };

      const nutrition = nutritionData[item.categoria] || nutritionData['outros'];
      const factor = item.grams / 100;

      totalProtein += nutrition.protein * factor;
      totalCarbs += nutrition.carbs * factor;
      totalFats += nutrition.fat * factor;
    });
  });

  return {
    protein: Math.round(totalProtein),
    carbs: Math.round(totalCarbs),
    fats: Math.round(totalFats)
  };
}

// Atualizar os macros calculados para cada cardápio
cardapios1500.forEach(cardapio => {
  const macros = calculateMacros(cardapio.meals);
  cardapio.protein_grams = macros.protein;
  cardapio.carb_grams = macros.carbs;
  cardapio.fat_grams = macros.fats;
});

module.exports = { cardapios1500 };

console.log("Cardápios de 1500 kcal estruturados:", JSON.stringify(cardapios1500, null, 2));