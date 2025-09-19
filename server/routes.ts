import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import {
  insertBodyMetricsSchema,
  insertCalculationSchema,
  insertMenuPlanSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Based on javascript_auth_all_persistance blueprint
  // sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);

  // Helper to check authentication
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Autenticação necessária" });
    }
    next();
  };

  // Dashboard summary endpoint
  app.get("/api/me/summary", requireAuth, async (req: any, res) => {
    try {
      const summary = await storage.getUserSummary(req.user.id);
      res.json(summary);
    } catch (error) {
      console.error("Error getting user summary:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Body metrics endpoints
  app.get("/api/body-metrics", requireAuth, async (req: any, res) => {
    try {
      const bodyMetrics = await storage.getBodyMetrics(req.user.id);
      if (!bodyMetrics) {
        return res.status(404).json({ error: "Medidas corporais não encontradas" });
      }
      res.json(bodyMetrics);
    } catch (error) {
      console.error("Error getting body metrics:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  app.post("/api/body-metrics", requireAuth, async (req: any, res) => {
    try {
      const validation = insertBodyMetricsSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Dados inválidos", details: validation.error.issues });
      }

      const bodyMetrics = await storage.upsertBodyMetrics(req.user.id, validation.data);
      res.json(bodyMetrics);
    } catch (error) {
      console.error("Error saving body metrics:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Calculation endpoints
  app.get("/api/calculation", requireAuth, async (req: any, res) => {
    try {
      const calculation = await storage.getLatestCalculation(req.user.id);
      if (!calculation) {
        return res.status(404).json({ error: "Cálculo não encontrado" });
      }
      res.json(calculation);
    } catch (error) {
      console.error("Error getting calculation:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  app.post("/api/calculation", requireAuth, async (req: any, res) => {
    try {
      const validation = insertCalculationSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Dados inválidos", details: validation.error.issues });
      }

      const calculation = await storage.saveCalculation(req.user.id, validation.data);
      res.json(calculation);
    } catch (error) {
      console.error("Error saving calculation:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Menu plan endpoints
  app.get("/api/menu", requireAuth, async (req: any, res) => {
    try {
      const menuPlan = await storage.getLatestMenuPlan(req.user.id);
      if (!menuPlan) {
        return res.status(404).json({ error: "Cardápio não encontrado" });
      }
      res.json(menuPlan);
    } catch (error) {
      console.error("Error getting menu plan:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  app.post("/api/menu", requireAuth, async (req: any, res) => {
    try {
      const validation = insertMenuPlanSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Dados inválidos", details: validation.error.issues });
      }

      const menuPlan = await storage.saveMenuPlan(req.user.id, validation.data);
      res.json(menuPlan);
    } catch (error) {
      console.error("Error saving menu plan:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  app.delete("/api/menu", requireAuth, async (req: any, res) => {
    try {
      await storage.deleteMenuPlan(req.user.id);
      res.json({ message: "Cardápio deletado com sucesso" });
    } catch (error) {
      console.error("Error deleting menu plan:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Clear all user data (for recalculation)
  app.delete("/api/clear-data", requireAuth, async (req: any, res) => {
    try {
      await storage.clearAllUserData(req.user.id);
      res.json({ message: "Todos os dados foram limpos com sucesso" });
    } catch (error) {
      console.error("Error clearing user data:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Get alimentos hispanos
  app.get("/api/alimentos", requireAuth, async (req: any, res) => {
    try {
      const { categoria } = req.query;

      let alimentos;
      if (categoria) {
        alimentos = await storage.getAlimentosByCategoria(categoria as string);
      } else {
        alimentos = await storage.getAllAlimentos();
      }

      res.json(alimentos);
    } catch (error) {
      console.error("Error getting alimentos:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Seed alimentos hispanos (temporary endpoint)
  app.post("/api/seed-alimentos", requireAuth, async (req: any, res) => {
    try {
      // Check if alimentos already exist
      const existingAlimentos = await storage.getAllAlimentos();
      if (existingAlimentos.length > 0) {
        return res.json({
          message: "Alimentos ya existen en la base de datos",
          count: existingAlimentos.length
        });
      }

      // Hispanic foods nutritional data
      const alimentosData = [
        // A - CEREALES Y DERIVADOS
        { nombre: "Achita/Kiwicha/Amaranto", categoria: "A-Cereales", calorias_por_100g: 351, carbohidratos_por_100g: 69.1, proteinas_por_100g: 12.8, grasas_por_100g: 6.6 },
        { nombre: "Arroz pilado cocido", categoria: "A-Cereales", calorias_por_100g: 115, carbohidratos_por_100g: 25.2, proteinas_por_100g: 2.4, grasas_por_100g: 0.1 },
        { nombre: "Arroz blanco corriente", categoria: "A-Cereales", calorias_por_100g: 358, carbohidratos_por_100g: 77.6, proteinas_por_100g: 7.8, grasas_por_100g: 0.7 },
        { nombre: "Quinoa cocida", categoria: "A-Cereales", calorias_por_100g: 89, carbohidratos_por_100g: 16.3, proteinas_por_100g: 2.8, grasas_por_100g: 1.3 },
        { nombre: "Quinoa cruda", categoria: "A-Cereales", calorias_por_100g: 351, carbohidratos_por_100g: 66.6, proteinas_por_100g: 13.6, grasas_por_100g: 5.8 },
        { nombre: "Avena hojuela cruda", categoria: "A-Cereales", calorias_por_100g: 333, carbohidratos_por_100g: 72.2, proteinas_por_100g: 13.3, grasas_por_100g: 4.0 },
        { nombre: "Maíz choclo (grano fresco)", categoria: "A-Cereales", calorias_por_100g: 104, carbohidratos_por_100g: 27.8, proteinas_por_100g: 3.3, grasas_por_100g: 0.8 },

        // B - VERDURAS Y HORTALIZAS
        { nombre: "Brócoli", categoria: "B-Verduras", calorias_por_100g: 32, carbohidratos_por_100g: 4.0, proteinas_por_100g: 3.9, grasas_por_100g: 1.3 },
        { nombre: "Espinaca", categoria: "B-Verduras", calorias_por_100g: 23, carbohidratos_por_100g: 3.6, proteinas_por_100g: 2.9, grasas_por_100g: 0.4 },
        { nombre: "Lechuga", categoria: "B-Verduras", calorias_por_100g: 14, carbohidratos_por_100g: 2.9, proteinas_por_100g: 1.4, grasas_por_100g: 0.1 },
        { nombre: "Tomate", categoria: "B-Verduras", calorias_por_100g: 18, carbohidratos_por_100g: 3.9, proteinas_por_100g: 0.9, grasas_por_100g: 0.2 },
        { nombre: "Zanahoria", categoria: "B-Verduras", calorias_por_100g: 41, carbohidratos_por_100g: 9.6, proteinas_por_100g: 0.9, grasas_por_100g: 0.2 },
        { nombre: "Cebolla", categoria: "B-Verduras", calorias_por_100g: 40, carbohidratos_por_100g: 9.3, proteinas_por_100g: 1.1, grasas_por_100g: 0.1 },
        { nombre: "Pimiento rojo", categoria: "B-Verduras", calorias_por_100g: 31, carbohidratos_por_100g: 7.3, proteinas_por_100g: 1.0, grasas_por_100g: 0.3 },

        // C - FRUTAS Y DERIVADOS
        { nombre: "Banana/Plátano", categoria: "C-Frutas", calorias_por_100g: 89, carbohidratos_por_100g: 22.8, proteinas_por_100g: 1.1, grasas_por_100g: 0.3 },
        { nombre: "Manzana", categoria: "C-Frutas", calorias_por_100g: 52, carbohidratos_por_100g: 13.8, proteinas_por_100g: 0.3, grasas_por_100g: 0.2 },
        { nombre: "Naranja", categoria: "C-Frutas", calorias_por_100g: 47, carbohidratos_por_100g: 11.8, proteinas_por_100g: 0.9, grasas_por_100g: 0.1 },
        { nombre: "Aguacate", categoria: "C-Frutas", calorias_por_100g: 160, carbohidratos_por_100g: 8.5, proteinas_por_100g: 2.0, grasas_por_100g: 14.7 },
        { nombre: "Papaya", categoria: "C-Frutas", calorias_por_100g: 43, carbohidratos_por_100g: 10.8, proteinas_por_100g: 0.5, grasas_por_100g: 0.3 },
        { nombre: "Piña", categoria: "C-Frutas", calorias_por_100g: 50, carbohidratos_por_100g: 13.1, proteinas_por_100g: 0.5, grasas_por_100g: 0.1 },

        // D - GRASAS Y ACEITES
        { nombre: "Aceite de oliva", categoria: "D-Grasas", calorias_por_100g: 884, carbohidratos_por_100g: 0.0, proteinas_por_100g: 0.0, grasas_por_100g: 100.0 },
        { nombre: "Almendras", categoria: "D-Grasas", calorias_por_100g: 579, carbohidratos_por_100g: 21.6, proteinas_por_100g: 21.2, grasas_por_100g: 49.9 },
        { nombre: "Nueces", categoria: "D-Grasas", calorias_por_100g: 654, carbohidratos_por_100g: 13.7, proteinas_por_100g: 15.2, grasas_por_100g: 65.2 },

        // E - PESCADOS Y MARISCOS
        { nombre: "Tilapia", categoria: "E-Pescados", calorias_por_100g: 96, carbohidratos_por_100g: 0.0, proteinas_por_100g: 20.1, grasas_por_100g: 1.7 },
        { nombre: "Salmón", categoria: "E-Pescados", calorias_por_100g: 208, carbohidratos_por_100g: 0.0, proteinas_por_100g: 25.4, grasas_por_100g: 12.4 },
        { nombre: "Atún", categoria: "E-Pescados", calorias_por_100g: 280, carbohidratos_por_100g: 0.0, proteinas_por_100g: 25.0, grasas_por_100g: 19.0 },

        // F - CARNES Y DERIVADOS
        { nombre: "Pollo pechuga sin piel", categoria: "F-Carnes", calorias_por_100g: 165, carbohidratos_por_100g: 0.0, proteinas_por_100g: 31.0, grasas_por_100g: 3.6 },
        { nombre: "Res carne magra", categoria: "F-Carnes", calorias_por_100g: 250, carbohidratos_por_100g: 0.0, proteinas_por_100g: 26.0, grasas_por_100g: 15.0 },
        { nombre: "Cerdo lomo", categoria: "F-Carnes", calorias_por_100g: 131, carbohidratos_por_100g: 0.0, proteinas_por_100g: 22.2, grasas_por_100g: 4.1 },

        // G - LECHE Y DERIVADOS
        { nombre: "Leche entera", categoria: "G-Lacteos", calorias_por_100g: 61, carbohidratos_por_100g: 4.8, proteinas_por_100g: 3.2, grasas_por_100g: 3.3 },
        { nombre: "Yogur natural", categoria: "G-Lacteos", calorias_por_100g: 59, carbohidratos_por_100g: 4.7, proteinas_por_100g: 10.0, grasas_por_100g: 0.4 },
        { nombre: "Queso fresco", categoria: "G-Lacteos", calorias_por_100g: 264, carbohidratos_por_100g: 4.1, proteinas_por_100g: 18.0, grasas_por_100g: 19.0 },

        // T - LEGUMINOSAS
        { nombre: "Frijol negro", categoria: "T-Leguminosas", calorias_por_100g: 341, carbohidratos_por_100g: 62.4, proteinas_por_100g: 21.6, grasas_por_100g: 1.4 },
        { nombre: "Lenteja", categoria: "T-Leguminosas", calorias_por_100g: 353, carbohidratos_por_100g: 63.4, proteinas_por_100g: 24.6, grasas_por_100g: 1.1 },
        { nombre: "Garbanzo", categoria: "T-Leguminosas", calorias_por_100g: 364, carbohidratos_por_100g: 61.0, proteinas_por_100g: 19.3, grasas_por_100g: 6.0 },

        // U -TUBÉRCULOS
        { nombre: "Papa blanca", categoria: "U-Tuberculos", calorias_por_100g: 77, carbohidratos_por_100g: 17.5, proteinas_por_100g: 2.0, grasas_por_100g: 0.1 },
        { nombre: "Camote amarillo", categoria: "U-Tuberculos", calorias_por_100g: 86, carbohidratos_por_100g: 20.1, proteinas_por_100g: 1.6, grasas_por_100g: 0.1 },
        { nombre: "Yuca/Mandioca", categoria: "U-Tuberculos", calorias_por_100g: 160, carbohidratos_por_100g: 38.1, proteinas_por_100g: 1.4, grasas_por_100g: 0.3 },

        // J - HUEVOS
        { nombre: "Huevo de gallina", categoria: "J-Huevos", calorias_por_100g: 155, carbohidratos_por_100g: 0.9, proteinas_por_100g: 13.0, grasas_por_100g: 11.1 },
        { nombre: "Clara de huevo", categoria: "J-Huevos", calorias_por_100g: 17, carbohidratos_por_100g: 0.7, proteinas_por_100g: 3.6, grasas_por_100g: 0.1 }
      ];

      // Bulk insert alimentos
      await storage.bulkCreateAlimentos(alimentosData);

      res.json({
        message: "Alimentos hispanos insertados exitosamente",
        count: alimentosData.length
      });
    } catch (error) {
      console.error("Error seeding alimentos:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Template menu endpoints
  app.get("/api/template-menus", requireAuth, async (req: any, res) => {
    try {
      const { gender, calories } = req.query;

      let templates;
      if (gender && calories) {
        templates = await storage.getTemplateMenusByGenderAndCalories(gender as string, parseInt(calories as string));
      } else {
        templates = await storage.getAllTemplateMenus();
      }

      res.json(templates);
    } catch (error) {
      console.error("Error getting template menus:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Find best matching template
  app.post("/api/find-template", requireAuth, async (req: any, res) => {
    try {
      const { gender, targetCalories, targetProtein, targetCarb, targetFat } = req.body;

      if (!gender || !targetCalories || !targetProtein || !targetCarb || !targetFat) {
        return res.status(400).json({ error: "Parâmetros obrigatórios: gender, targetCalories, targetProtein, targetCarb, targetFat" });
      }

      const bestTemplate = await storage.findBestMatchingTemplate(
        gender,
        targetCalories,
        targetProtein,
        targetCarb,
        targetFat
      );

      if (!bestTemplate) {
        return res.status(404).json({ error: "Nenhum template encontrado para os critérios especificados" });
      }

      res.json(bestTemplate);
    } catch (error) {
      console.error("Error finding matching template:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Seed template menus (temporary endpoint)
  app.post("/api/seed-templates", async (req: any, res) => {
    try {
      // Check if templates already exist
      const existingTemplates = await storage.getAllTemplateMenus();
      if (existingTemplates.length > 0) {
        return res.json({
          message: "Templates já existem na base de dados",
          count: existingTemplates.length
        });
      }

      // Template data for all 30 menus - WOMEN ONLY
      const templatesData = [
        // MULHERES - 1200 kcal (5 cardápios)
        {
          name: "Cardápio 1 – Mulheres – 1200 kcal",
          gender: "feminino",
          calorie_level: 1200,
          total_calories: 1200,
          protein_grams: 87,
          carb_grams: 120,
          fat_grams: 40,
          meals: [
            {
              name: "Café da Manhã",
              approximate_calories: 280,
              items: [
                { name: "Ovos", grams: 100, categoria: "J-Huevos" },
                { name: "Tomate", grams: 50, categoria: "B-Verduras" },
                { name: "Cebola", grams: 20, categoria: "B-Verduras" },
                { name: "Arepa de milho integral", grams: 40, categoria: "A-Cereales" },
                { name: "Abacate", grams: 30, categoria: "C-Frutas" }
              ]
            },
            {
              name: "Almoço",
              approximate_calories: 350,
              items: [
                { name: "Peito de frango", grams: 120, categoria: "F-Carnes" },
                { name: "Arroz integral cozido", grams: 80, categoria: "A-Cereales" },
                { name: "Feijão preto cozido", grams: 70, categoria: "T-Leguminosas" },
                { name: "Alface e pepino", grams: 100, categoria: "B-Verduras" },
                { name: "Azeite de oliva", grams: 5, categoria: "D-Grasas" }
              ]
            },
            {
              name: "Lanche da Tarde",
              approximate_calories: 180,
              items: [
                { name: "Iogurte grego natural sem açúcar", grams: 150, categoria: "G-Lacteos" },
                { name: "Morangos ou goiaba picada", grams: 80, categoria: "C-Frutas" }
              ]
            },
            {
              name: "Jantar",
              approximate_calories: 290,
              items: [
                { name: "Tilápia", grams: 130, categoria: "E-Pescados" },
                { name: "Batata-doce cozida", grams: 100, categoria: "U-Tuberculos" },
                { name: "Brócolis no vapor", grams: 100, categoria: "B-Verduras" }
              ]
            },
            {
              name: "Ceia",
              approximate_calories: 100,
              items: [
                { name: "Queijo cottage", grams: 50, categoria: "G-Lacteos" },
                { name: "Sementes de abóbora", grams: 10, categoria: "D-Grasas" }
              ]
            }
          ],
          smart_substitutions: "Arepa de milho integral ↔ Tortilla de maíz integral (2 unidades) ↔ 1 fatia de pão integral. Feijão preto (frijoles negros) ↔ Lentilhas (lentejas) ↔ Grão-de-bico (garbanzos). Peito de frango ↔ Pescado branco ↔ Carne bovina magra. Arroz integral ↔ Quinoa ↔ Cuscuz integral. Batata-doce ↔ Mandioca cozida ↔ Plátano macho verde cozido. Iogurte grego ↔ Queijo cottage ↔ Kefir natural. Abacate ↔ Azeite de oliva."
        },
        {
          name: "Cardápio 2 – Mulheres – 1200 kcal",
          gender: "feminino",
          calorie_level: 1200,
          total_calories: 1200,
          protein_grams: 85,
          carb_grams: 125,
          fat_grams: 38,
          meals: [
            {
              name: "Café da Manhã",
              approximate_calories: 275,
              items: [
                { name: "Ovo", grams: 50, categoria: "J-Huevos" },
                { name: "Goma de tapioca", grams: 30, categoria: "A-Cereales" },
                { name: "Frango desfiado", grams: 50, categoria: "F-Carnes" },
                { name: "Tomate picado", grams: 30, categoria: "B-Verduras" }
              ]
            },
            {
              name: "Almoço",
              approximate_calories: 360,
              items: [
                { name: "Carne bovina magra", grams: 100, categoria: "F-Carnes" },
                { name: "Quinoa cozida", grams: 90, categoria: "A-Cereales" },
                { name: "Lentilhas cozidas", grams: 60, categoria: "T-Leguminosas" },
                { name: "Espinafre refogado", grams: 80, categoria: "B-Verduras" },
                { name: "Azeite", grams: 5, categoria: "D-Grasas" }
              ]
            },
            {
              name: "Lanche da Tarde",
              approximate_calories: 170,
              items: [
                { name: "Queijo cottage", grams: 100, categoria: "G-Lacteos" },
                { name: "Mamão papaya", grams: 100, categoria: "C-Frutas" }
              ]
            },
            {
              name: "Jantar",
              approximate_calories: 280,
              items: [
                { name: "Salmão grelhado", grams: 120, categoria: "E-Pescados" },
                { name: "Mandioca cozida", grams: 80, categoria: "U-Tuberculos" },
                { name: "Abobrinha refogada", grams: 100, categoria: "B-Verduras" }
              ]
            },
            {
              name: "Ceia",
              approximate_calories: 115,
              items: [
                { name: "Iogurte grego", grams: 80, categoria: "G-Lacteos" },
                { name: "Amêndoas", grams: 10, categoria: "D-Grasas" }
              ]
            }
          ],
          smart_substitutions: "Mesmas substituições do cardápio anterior"
        },
        {
          name: "Cardápio 3 – Mulheres – 1200 kcal",
          gender: "feminino",
          calorie_level: 1200,
          total_calories: 1200,
          protein_grams: 88,
          carb_grams: 118,
          fat_grams: 42,
          meals: [
            {
              name: "Café da Manhã",
              approximate_calories: 270,
              items: [
                { name: "Clara de ovos", grams: 120, categoria: "J-Huevos" },
                { name: "Aveia", grams: 30, categoria: "A-Cereales" },
                { name: "Banana", grams: 80, categoria: "C-Frutas" },
                { name: "Leite desnatado", grams: 100, categoria: "G-Lacteos" }
              ]
            },
            {
              name: "Almoço",
              approximate_calories: 340,
              items: [
                { name: "Peito de frango grelhado", grams: 110, categoria: "F-Carnes" },
                { name: "Arroz integral", grams: 75, categoria: "A-Cereales" },
                { name: "Grão-de-bico", grams: 65, categoria: "T-Leguminosas" },
                { name: "Salada mista", grams: 120, categoria: "B-Verduras" },
                { name: "Azeite", grams: 5, categoria: "D-Grasas" }
              ]
            },
            {
              name: "Lanche da Tarde",
              approximate_calories: 185,
              items: [
                { name: "Kefir natural", grams: 150, categoria: "G-Lacteos" },
                { name: "Abacaxi", grams: 100, categoria: "C-Frutas" }
              ]
            },
            {
              name: "Jantar",
              approximate_calories: 295,
              items: [
                { name: "Merluza assada", grams: 140, categoria: "E-Pescados" },
                { name: "Batata doce", grams: 90, categoria: "U-Tuberculos" },
                { name: "Brócolis e couve-flor", grams: 100, categoria: "B-Verduras" }
              ]
            },
            {
              name: "Ceia",
              approximate_calories: 110,
              items: [
                { name: "Queijo fresco", grams: 40, categoria: "G-Lacteos" },
                { name: "Nozes", grams: 8, categoria: "D-Grasas" }
              ]
            }
          ],
          smart_substitutions: "Mesmas substituições do cardápio anterior"
        },
        {
          name: "Cardápio 4 – Mulheres – 1200 kcal",
          gender: "feminino",
          calorie_level: 1200,
          total_calories: 1200,
          protein_grams: 86,
          carb_grams: 122,
          fat_grams: 39,
          meals: [
            {
              name: "Café da Manhã",
              approximate_calories: 285,
              items: [
                { name: "Ovo inteiro", grams: 100, categoria: "J-Huevos" },
                { name: "Tortilla de milho integral", grams: 40, categoria: "A-Cereales" },
                { name: "Abacate", grams: 25, categoria: "C-Frutas" },
                { name: "Tomate", grams: 40, categoria: "B-Verduras" }
              ]
            },
            {
              name: "Almoço",
              approximate_calories: 345,
              items: [
                { name: "Carne magra bovina", grams: 105, categoria: "F-Carnes" },
                { name: "Quinoa", grams: 85, categoria: "A-Cereales" },
                { name: "Feijão preto", grams: 70, categoria: "T-Leguminosas" },
                { name: "Vegetais salteados", grams: 100, categoria: "B-Verduras" },
                { name: "Azeite", grams: 5, categoria: "D-Grasas" }
              ]
            },
            {
              name: "Lanche da Tarde",
              approximate_calories: 175,
              items: [
                { name: "Iogurte natural", grams: 120, categoria: "G-Lacteos" },
                { name: "Manga", grams: 80, categoria: "C-Frutas" }
              ]
            },
            {
              name: "Jantar",
              approximate_calories: 285,
              items: [
                { name: "Pescado branco", grams: 135, categoria: "E-Pescados" },
                { name: "Inhame cozido", grams: 85, categoria: "U-Tuberculos" },
                { name: "Aspargos grelhados", grams: 100, categoria: "B-Verduras" }
              ]
            },
            {
              name: "Ceia",
              approximate_calories: 110,
              items: [
                { name: "Queijo cottage", grams: 60, categoria: "G-Lacteos" },
                { name: "Sementes de girassol", grams: 8, categoria: "D-Grasas" }
              ]
            }
          ],
          smart_substitutions: "Mesmas substituições do cardápio anterior"
        },
        {
          name: "Cardápio 5 – Mulheres – 1200 kcal",
          gender: "feminino",
          calorie_level: 1200,
          total_calories: 1200,
          protein_grams: 89,
          carb_grams: 116,
          fat_grams: 41,
          meals: [
            {
              name: "Café da Manhã",
              approximate_calories: 275,
              items: [
                { name: "Clara de ovos", grams: 100, categoria: "J-Huevos" },
                { name: "Pão integral", grams: 30, categoria: "A-Cereales" },
                { name: "Queijo fresco", grams: 30, categoria: "G-Lacteos" },
                { name: "Tomate", grams: 50, categoria: "B-Verduras" }
              ]
            },
            {
              name: "Almoço",
              approximate_calories: 355,
              items: [
                { name: "Frango desfiado", grams: 115, categoria: "F-Carnes" },
                { name: "Arroz integral", grams: 80, categoria: "A-Cereales" },
                { name: "Lentilhas", grams: 65, categoria: "T-Leguminosas" },
                { name: "Salada verde", grams: 100, categoria: "B-Verduras" },
                { name: "Azeite", grams: 5, categoria: "D-Grasas" }
              ]
            },
            {
              name: "Lanche da Tarde",
              approximate_calories: 180,
              items: [
                { name: "Smoothie de iogurte", grams: 120, categoria: "G-Lacteos" },
                { name: "Frutas vermelhas", grams: 80, categoria: "C-Frutas" }
              ]
            },
            {
              name: "Jantar",
              approximate_calories: 280,
              items: [
                { name: "Atum grelhado", grams: 130, categoria: "E-Pescados" },
                { name: "Batata doce assada", grams: 90, categoria: "U-Tuberculos" },
                { name: "Vagem refogada", grams: 100, categoria: "B-Verduras" }
              ]
            },
            {
              name: "Ceia",
              approximate_calories: 110,
              items: [
                { name: "Kefir", grams: 100, categoria: "G-Lacteos" },
                { name: "Castanhas", grams: 8, categoria: "D-Grasas" }
              ]
            }
          ],
          smart_substitutions: "Mesmas substituições do cardápio anterior"
        },

        // MULHERES - 1500 kcal (5 cardápios)
        {
          name: "Cardápio 1 – Mulheres – 1500 kcal",
          gender: "feminino",
          calorie_level: 1500,
          total_calories: 1500,
          protein_grams: 108,
          carb_grams: 150,
          fat_grams: 50,
          meals: [
            {
              name: "Café da Manhã",
              approximate_calories: 350,
              items: [
                { name: "Ovos", grams: 120, categoria: "J-Huevos" },
                { name: "Tomate", grams: 60, categoria: "B-Verduras" },
                { name: "Arepa de milho integral", grams: 50, categoria: "A-Cereales" },
                { name: "Abacate", grams: 40, categoria: "C-Frutas" }
              ]
            },
            {
              name: "Almoço",
              approximate_calories: 440,
              items: [
                { name: "Peito de frango", grams: 150, categoria: "F-Carnes" },
                { name: "Arroz integral cozido", grams: 100, categoria: "A-Cereales" },
                { name: "Feijão preto cozido", grams: 90, categoria: "T-Leguminosas" },
                { name: "Salada mista", grams: 120, categoria: "B-Verduras" },
                { name: "Azeite de oliva", grams: 8, categoria: "D-Grasas" }
              ]
            },
            {
              name: "Lanche da Tarde",
              approximate_calories: 220,
              items: [
                { name: "Iogurte grego", grams: 180, categoria: "G-Lacteos" },
                { name: "Frutas mistas", grams: 100, categoria: "C-Frutas" },
                { name: "Granola", grams: 15, categoria: "A-Cereales" }
              ]
            },
            {
              name: "Jantar",
              approximate_calories: 360,
              items: [
                { name: "Salmão", grams: 150, categoria: "E-Pescados" },
                { name: "Batata-doce", grams: 120, categoria: "U-Tuberculos" },
                { name: "Brócolis", grams: 120, categoria: "B-Verduras" }
              ]
            },
            {
              name: "Ceia",
              approximate_calories: 130,
              items: [
                { name: "Queijo cottage", grams: 70, categoria: "G-Lacteos" },
                { name: "Amêndoas", grams: 12, categoria: "D-Grasas" }
              ]
            }
          ],
          smart_substitutions: "Mesmas substituições anteriores"
        },
        {
          name: "Cardápio 2 – Mulheres – 1500 kcal",
          gender: "feminino",
          calorie_level: 1500,
          total_calories: 1500,
          protein_grams: 106,
          carb_grams: 155,
          fat_grams: 48,
          meals: [
            {
              name: "Café da Manhã",
              approximate_calories: 340,
              items: [
                { name: "Ovos mexidos", grams: 100, categoria: "J-Huevos" },
                { name: "Tortilla integral", grams: 60, categoria: "A-Cereales" },
                { name: "Queijo", grams: 30, categoria: "G-Lacteos" },
                { name: "Abacate", grams: 35, categoria: "C-Frutas" }
              ]
            },
            {
              name: "Almoço",
              approximate_calories: 450,
              items: [
                { name: "Carne bovina magra", grams: 130, categoria: "F-Carnes" },
                { name: "Quinoa", grams: 110, categoria: "A-Cereales" },
                { name: "Lentilhas", grams: 80, categoria: "T-Leguminosas" },
                { name: "Vegetais refogados", grams: 100, categoria: "B-Verduras" },
                { name: "Azeite", grams: 8, categoria: "D-Grasas" }
              ]
            },
            {
              name: "Lanche da Tarde",
              approximate_calories: 210,
              items: [
                { name: "Smoothie de frutas", grams: 200, categoria: "C-Frutas" },
                { name: "Proteína whey", grams: 20, categoria: "G-Lacteos" }
              ]
            },
            {
              name: "Jantar",
              approximate_calories: 370,
              items: [
                { name: "Tilápia", grams: 160, categoria: "E-Pescados" },
                { name: "Mandioca", grams: 100, categoria: "U-Tuberculos" },
                { name: "Aspargos", grams: 120, categoria: "B-Verduras" }
              ]
            },
            {
              name: "Ceia",
              approximate_calories: 130,
              items: [
                { name: "Iogurte natural", grams: 100, categoria: "G-Lacteos" },
                { name: "Nozes", grams: 10, categoria: "D-Grasas" }
              ]
            }
          ],
          smart_substitutions: "Mesmas substituições anteriores"
        },
        {
          name: "Cardápio 3 – Mulheres – 1500 kcal",
          gender: "feminino",
          calorie_level: 1500,
          total_calories: 1500,
          protein_grams: 110,
          carb_grams: 148,
          fat_grams: 52,
          meals: [
            {
              name: "Café da Manhã",
              approximate_calories: 345,
              items: [
                { name: "Omelete", grams: 120, categoria: "J-Huevos" },
                { name: "Pão integral", grams: 40, categoria: "A-Cereales" },
                { name: "Queijo cottage", grams: 50, categoria: "G-Lacteos" },
                { name: "Tomate", grams: 60, categoria: "B-Verduras" }
              ]
            },
            {
              name: "Almoço",
              approximate_calories: 445,
              items: [
                { name: "Frango grelhado", grams: 140, categoria: "F-Carnes" },
                { name: "Arroz integral", grams: 100, categoria: "A-Cereales" },
                { name: "Feijão carioca", grams: 85, categoria: "T-Leguminosas" },
                { name: "Salada colorida", grams: 120, categoria: "B-Verduras" },
                { name: "Azeite", grams: 8, categoria: "D-Grasas" }
              ]
            },
            {
              name: "Lanche da Tarde",
              approximate_calories: 215,
              items: [
                { name: "Vitamina de frutas", grams: 180, categoria: "C-Frutas" },
                { name: "Leite", grams: 150, categoria: "G-Lacteos" }
              ]
            },
            {
              name: "Jantar",
              approximate_calories: 365,
              items: [
                { name: "Merluza", grams: 155, categoria: "E-Pescados" },
                { name: "Batata doce", grams: 110, categoria: "U-Tuberculos" },
                { name: "Couve refogada", grams: 100, categoria: "B-Verduras" }
              ]
            },
            {
              name: "Ceia",
              approximate_calories: 130,
              items: [
                { name: "Kefir", grams: 120, categoria: "G-Lacteos" },
                { name: "Castanhas do Pará", grams: 8, categoria: "D-Grasas" }
              ]
            }
          ],
          smart_substitutions: "Mesmas substituições anteriores"
        },
        {
          name: "Cardápio 4 – Mulheres – 1500 kcal",
          gender: "feminino",
          calorie_level: 1500,
          total_calories: 1500,
          protein_grams: 107,
          carb_grams: 152,
          fat_grams: 49,
          meals: [
            {
              name: "Café da Manhã",
              approximate_calories: 350,
              items: [
                { name: "Panqueca de aveia", grams: 80, categoria: "A-Cereales" },
                { name: "Ovo", grams: 50, categoria: "J-Huevos" },
                { name: "Banana", grams: 100, categoria: "C-Frutas" },
                { name: "Mel", grams: 15, categoria: "C-Frutas" }
              ]
            },
            {
              name: "Almoço",
              approximate_calories: 440,
              items: [
                { name: "Carne suína magra", grams: 125, categoria: "F-Carnes" },
                { name: "Quinoa cozida", grams: 105, categoria: "A-Cereales" },
                { name: "Grão-de-bico", grams: 80, categoria: "T-Leguminosas" },
                { name: "Ratatouille", grams: 120, categoria: "B-Verduras" },
                { name: "Azeite", grams: 8, categoria: "D-Grasas" }
              ]
            },
            {
              name: "Lanche da Tarde",
              approximate_calories: 220,
              items: [
                { name: "Iogurte grego", grams: 150, categoria: "G-Lacteos" },
                { name: "Mix de frutas", grams: 100, categoria: "C-Frutas" },
                { name: "Granola", grams: 20, categoria: "A-Cereales" }
              ]
            },
            {
              name: "Jantar",
              approximate_calories: 360,
              items: [
                { name: "Atum", grams: 150, categoria: "E-Pescados" },
                { name: "Inhame", grams: 100, categoria: "U-Tuberculos" },
                { name: "Vagem e cenoura", grams: 120, categoria: "B-Verduras" }
              ]
            },
            {
              name: "Ceia",
              approximate_calories: 130,
              items: [
                { name: "Queijo ricotta", grams: 80, categoria: "G-Lacteos" },
                { name: "Sementes mistas", grams: 10, categoria: "D-Grasas" }
              ]
            }
          ],
          smart_substitutions: "Mesmas substituições anteriores"
        },
        {
          name: "Cardápio 5 – Mulheres – 1500 kcal",
          gender: "feminino",
          calorie_level: 1500,
          total_calories: 1500,
          protein_grams: 109,
          carb_grams: 150,
          fat_grams: 51,
          meals: [
            {
              name: "Café da Manhã",
              approximate_calories: 348,
              items: [
                { name: "Tapioca", grams: 50, categoria: "A-Cereales" },
                { name: "Frango desfiado", grams: 60, categoria: "F-Carnes" },
                { name: "Queijo", grams: 30, categoria: "G-Lacteos" },
                { name: "Tomate", grams: 40, categoria: "B-Verduras" }
              ]
            },
            {
              name: "Almoço",
              approximate_calories: 435,
              items: [
                { name: "Peixe grelhado", grams: 140, categoria: "E-Pescados" },
                { name: "Arroz integral", grams: 95, categoria: "A-Cereales" },
                { name: "Lentilha", grams: 85, categoria: "T-Leguminosas" },
                { name: "Salada tropical", grams: 110, categoria: "B-Verduras" },
                { name: "Azeite", grams: 8, categoria: "D-Grasas" }
              ]
            },
            {
              name: "Lanche da Tarde",
              approximate_calories: 225,
              items: [
                { name: "Acaí", grams: 100, categoria: "C-Frutas" },
                { name: "Granola", grams: 25, categoria: "A-Cereales" },
                { name: "Leite de coco", grams: 50, categoria: "G-Lacteos" }
              ]
            },
            {
              name: "Jantar",
              approximate_calories: 362,
              items: [
                { name: "Frango assado", grams: 145, categoria: "F-Carnes" },
                { name: "Batata doce", grams: 105, categoria: "U-Tuberculos" },
                { name: "Brócolis e couve-flor", grams: 120, categoria: "B-Verduras" }
              ]
            },
            {
              name: "Ceia",
              approximate_calories: 130,
              items: [
                { name: "Iogurte natural", grams: 100, categoria: "G-Lacteos" },
                { name: "Pistache", grams: 10, categoria: "D-Grasas" }
              ]
            }
          ],
          smart_substitutions: "Mesmas substituições anteriores"
        },

        // MULHERES - 1800 kcal (5 cardápios)
        {
          name: "Cardápio 1 – Mulheres – 1800 kcal",
          gender: "feminino",
          calorie_level: 1800,
          total_calories: 1800,
          protein_grams: 130,
          carb_grams: 180,
          fat_grams: 60,
          meals: [
            {
              name: "Café da Manhã",
              approximate_calories: 420,
              items: [
                { name: "Ovos", grams: 150, categoria: "J-Huevos" },
                { name: "Pão integral", grams: 60, categoria: "A-Cereales" },
                { name: "Abacate", grams: 50, categoria: "C-Frutas" },
                { name: "Tomate", grams: 60, categoria: "B-Verduras" }
              ]
            },
            {
              name: "Almoço",
              approximate_calories: 530,
              items: [
                { name: "Peito de frango", grams: 180, categoria: "F-Carnes" },
                { name: "Arroz integral", grams: 120, categoria: "A-Cereales" },
                { name: "Feijão preto", grams: 100, categoria: "T-Leguminosas" },
                { name: "Salada completa", grams: 150, categoria: "B-Verduras" },
                { name: "Azeite", grams: 10, categoria: "D-Grasas" }
              ]
            },
            {
              name: "Lanche da Tarde",
              approximate_calories: 270,
              items: [
                { name: "Iogurte grego", grams: 200, categoria: "G-Lacteos" },
                { name: "Frutas variadas", grams: 120, categoria: "C-Frutas" },
                { name: "Granola", grams: 25, categoria: "A-Cereales" },
                { name: "Mel", grams: 15, categoria: "C-Frutas" }
              ]
            },
            {
              name: "Jantar",
              approximate_calories: 430,
              items: [
                { name: "Salmão", grams: 180, categoria: "E-Pescados" },
                { name: "Batata doce", grams: 150, categoria: "U-Tuberculos" },
                { name: "Vegetais grelhados", grams: 150, categoria: "B-Verduras" }
              ]
            },
            {
              name: "Ceia",
              approximate_calories: 150,
              items: [
                { name: "Queijo cottage", grams: 90, categoria: "G-Lacteos" },
                { name: "Nozes", grams: 15, categoria: "D-Grasas" }
              ]
            }
          ],
          smart_substitutions: "Mesmas substituições anteriores"
        },
        {
          name: "Cardápio 2 – Mulheres – 1800 kcal",
          gender: "feminino",
          calorie_level: 1800,
          total_calories: 1800,
          protein_grams: 128,
          carb_grams: 185,
          fat_grams: 58,
          meals: [
            {
              name: "Café da Manhã",
              approximate_calories: 415,
              items: [
                { name: "Tapioca com ovo", grams: 120, categoria: "A-Cereales" },
                { name: "Frango desfiado", grams: 70, categoria: "F-Carnes" },
                { name: "Queijo", grams: 40, categoria: "G-Lacteos" },
                { name: "Suco natural", grams: 200, categoria: "C-Frutas" }
              ]
            },
            {
              name: "Almoço",
              approximate_calories: 525,
              items: [
                { name: "Carne bovina", grams: 160, categoria: "F-Carnes" },
                { name: "Quinoa", grams: 130, categoria: "A-Cereales" },
                { name: "Lentilhas", grams: 90, categoria: "T-Leguminosas" },
                { name: "Salada mista", grams: 140, categoria: "B-Verduras" },
                { name: "Azeite", grams: 10, categoria: "D-Grasas" }
              ]
            },
            {
              name: "Lanche da Tarde",
              approximate_calories: 275,
              items: [
                { name: "Smoothie proteico", grams: 250, categoria: "G-Lacteos" },
                { name: "Banana", grams: 100, categoria: "C-Frutas" },
                { name: "Aveia", grams: 30, categoria: "A-Cereales" }
              ]
            },
            {
              name: "Jantar",
              approximate_calories: 435,
              items: [
                { name: "Tilápia", grams: 170, categoria: "E-Pescados" },
                { name: "Mandioca", grams: 130, categoria: "U-Tuberculos" },
                { name: "Legumes refogados", grams: 140, categoria: "B-Verduras" }
              ]
            },
            {
              name: "Ceia",
              approximate_calories: 150,
              items: [
                { name: "Iogurte", grams: 120, categoria: "G-Lacteos" },
                { name: "Amêndoas", grams: 15, categoria: "D-Grasas" }
              ]
            }
          ],
          smart_substitutions: "Mesmas substituições anteriores"
        },
        {
          name: "Cardápio 3 – Mulheres – 1800 kcal",
          gender: "feminino",
          calorie_level: 1800,
          total_calories: 1800,
          protein_grams: 132,
          carb_grams: 178,
          fat_grams: 62,
          meals: [
            {
              name: "Café da Manhã",
              approximate_calories: 425,
              items: [
                { name: "Panqueca fitness", grams: 100, categoria: "A-Cereales" },
                { name: "Ovo", grams: 100, categoria: "J-Huevos" },
                { name: "Frutas vermelhas", grams: 80, categoria: "C-Frutas" },
                { name: "Iogurte", grams: 100, categoria: "G-Lacteos" }
              ]
            },
            {
              name: "Almoço",
              approximate_calories: 520,
              items: [
                { name: "Frango grelhado", grams: 170, categoria: "F-Carnes" },
                { name: "Arroz integral", grams: 115, categoria: "A-Cereales" },
                { name: "Feijão carioca", grams: 95, categoria: "T-Leguminosas" },
                { name: "Salada verde", grams: 130, categoria: "B-Verduras" },
                { name: "Azeite", grams: 10, categoria: "D-Grasas" }
              ]
            },
            {
              name: "Lanche da Tarde",
              approximate_calories: 280,
              items: [
                { name: "Vitamina", grams: 200, categoria: "C-Frutas" },
                { name: "Whey protein", grams: 30, categoria: "G-Lacteos" },
                { name: "Aveia", grams: 25, categoria: "A-Cereales" }
              ]
            },
            {
              name: "Jantar",
              approximate_calories: 425,
              items: [
                { name: "Merluza", grams: 175, categoria: "E-Pescados" },
                { name: "Batata doce", grams: 140, categoria: "U-Tuberculos" },
                { name: "Aspargos", grams: 150, categoria: "B-Verduras" }
              ]
            },
            {
              name: "Ceia",
              approximate_calories: 150,
              items: [
                { name: "Queijo cottage", grams: 100, categoria: "G-Lacteos" },
                { name: "Castanhas", grams: 12, categoria: "D-Grasas" }
              ]
            }
          ],
          smart_substitutions: "Mesmas substituições anteriores"
        },
        {
          name: "Cardápio 4 – Mulheres – 1800 kcal",
          gender: "feminino",
          calorie_level: 1800,
          total_calories: 1800,
          protein_grams: 129,
          carb_grams: 182,
          fat_grams: 59,
          meals: [
            {
              name: "Café da Manhã",
              approximate_calories: 420,
              items: [
                { name: "Arepa integral", grams: 70, categoria: "A-Cereales" },
                { name: "Ovos mexidos", grams: 120, categoria: "J-Huevos" },
                { name: "Queijo", grams: 35, categoria: "G-Lacteos" },
                { name: "Abacate", grams: 40, categoria: "C-Frutas" }
              ]
            },
            {
              name: "Almoço",
              approximate_calories: 530,
              items: [
                { name: "Carne suína", grams: 155, categoria: "F-Carnes" },
                { name: "Quinoa", grams: 125, categoria: "A-Cereales" },
                { name: "Grão-de-bico", grams: 90, categoria: "T-Leguminosas" },
                { name: "Vegetais salteados", grams: 140, categoria: "B-Verduras" },
                { name: "Azeite", grams: 10, categoria: "D-Grasas" }
              ]
            },
            {
              name: "Lanche da Tarde",
              approximate_calories: 270,
              items: [
                { name: "Iogurte grego", grams: 180, categoria: "G-Lacteos" },
                { name: "Mix de frutas", grams: 120, categoria: "C-Frutas" },
                { name: "Granola caseira", grams: 30, categoria: "A-Cereales" }
              ]
            },
            {
              name: "Jantar",
              approximate_calories: 430,
              items: [
                { name: "Atum", grams: 170, categoria: "E-Pescados" },
                { name: "Inhame", grams: 130, categoria: "U-Tuberculos" },
                { name: "Brócolis", grams: 150, categoria: "B-Verduras" }
              ]
            },
            {
              name: "Ceia",
              approximate_calories: 150,
              items: [
                { name: "Kefir", grams: 150, categoria: "G-Lacteos" },
                { name: "Nozes", grams: 12, categoria: "D-Grasas" }
              ]
            }
          ],
          smart_substitutions: "Mesmas substituições anteriores"
        },
        {
          name: "Cardápio 5 – Mulheres – 1800 kcal",
          gender: "feminino",
          calorie_level: 1800,
          total_calories: 1800,
          protein_grams: 131,
          carb_grams: 180,
          fat_grams: 61,
          meals: [
            {
              name: "Café da Manhã",
              approximate_calories: 418,
              items: [
                { name: "Crepioca", grams: 80, categoria: "A-Cereales" },
                { name: "Ovo", grams: 100, categoria: "J-Huevos" },
                { name: "Frango desfiado", grams: 50, categoria: "F-Carnes" },
                { name: "Suco de laranja", grams: 200, categoria: "C-Frutas" }
              ]
            },
            {
              name: "Almoço",
              approximate_calories: 535,
              items: [
                { name: "Peixe grelhado", grams: 175, categoria: "E-Pescados" },
                { name: "Arroz integral", grams: 120, categoria: "A-Cereales" },
                { name: "Lentilha", grams: 95, categoria: "T-Leguminosas" },
                { name: "Salada completa", grams: 145, categoria: "B-Verduras" },
                { name: "Azeite", grams: 10, categoria: "D-Grasas" }
              ]
            },
            {
              name: "Lanche da Tarde",
              approximate_calories: 275,
              items: [
                { name: "Açaí", grams: 120, categoria: "C-Frutas" },
                { name: "Granola", grams: 35, categoria: "A-Cereales" },
                { name: "Leite de coco", grams: 60, categoria: "G-Lacteos" }
              ]
            },
            {
              name: "Jantar",
              approximate_calories: 422,
              items: [
                { name: "Frango assado", grams: 165, categoria: "F-Carnes" },
                { name: "Batata doce", grams: 135, categoria: "U-Tuberculos" },
                { name: "Couve refogada", grams: 140, categoria: "B-Verduras" }
              ]
            },
            {
              name: "Ceia",
              approximate_calories: 150,
              items: [
                { name: "Queijo ricotta", grams: 120, categoria: "G-Lacteos" },
                { name: "Sementes", grams: 10, categoria: "D-Grasas" }
              ]
            }
          ],
          smart_substitutions: "Mesmas substituições anteriores"
        },

        // MULHERES - 2000 kcal (5 cardápios)
        {
          name: "Cardápio 1 – Mulheres – 2000 kcal",
          gender: "feminino",
          calorie_level: 2000,
          total_calories: 2000,
          protein_grams: 145,
          carb_grams: 200,
          fat_grams: 67,
          meals: [
            {
              name: "Café da Manhã",
              approximate_calories: 465,
              items: [
                { name: "Ovos", grams: 150, categoria: "J-Huevos" },
                { name: "Pão integral", grams: 80, categoria: "A-Cereales" },
                { name: "Abacate", grams: 60, categoria: "C-Frutas" },
                { name: "Queijo", grams: 40, categoria: "G-Lacteos" },
                { name: "Tomate", grams: 60, categoria: "B-Verduras" }
              ]
            },
            {
              name: "Almoço",
              approximate_calories: 590,
              items: [
                { name: "Peito de frango", grams: 200, categoria: "F-Carnes" },
                { name: "Arroz integral", grams: 140, categoria: "A-Cereales" },
                { name: "Feijão preto", grams: 110, categoria: "T-Leguminosas" },
                { name: "Salada completa", grams: 160, categoria: "B-Verduras" },
                { name: "Azeite", grams: 12, categoria: "D-Grasas" }
              ]
            },
            {
              name: "Lanche da Tarde",
              approximate_calories: 300,
              items: [
                { name: "Iogurte grego", grams: 200, categoria: "G-Lacteos" },
                { name: "Frutas variadas", grams: 140, categoria: "C-Frutas" },
                { name: "Granola", grams: 35, categoria: "A-Cereales" },
                { name: "Mel", grams: 20, categoria: "C-Frutas" }
              ]
            },
            {
              name: "Jantar",
              approximate_calories: 480,
              items: [
                { name: "Salmão", grams: 200, categoria: "E-Pescados" },
                { name: "Batata doce", grams: 160, categoria: "U-Tuberculos" },
                { name: "Vegetais grelhados", grams: 160, categoria: "B-Verduras" }
              ]
            },
            {
              name: "Ceia",
              approximate_calories: 165,
              items: [
                { name: "Queijo cottage", grams: 100, categoria: "G-Lacteos" },
                { name: "Nozes", grams: 18, categoria: "D-Grasas" }
              ]
            }
          ],
          smart_substitutions: "Mesmas substituições anteriores"
        },
        {
          name: "Cardápio 2 – Mulheres – 2000 kcal",
          gender: "feminino",
          calorie_level: 2000,
          total_calories: 2000,
          protein_grams: 142,
          carb_grams: 205,
          fat_grams: 65,
          meals: [
            {
              name: "Café da Manhã",
              approximate_calories: 460,
              items: [
                { name: "Tapioca", grams: 80, categoria: "A-Cereales" },
                { name: "Ovos", grams: 120, categoria: "J-Huevos" },
                { name: "Frango desfiado", grams: 80, categoria: "F-Carnes" },
                { name: "Queijo", grams: 45, categoria: "G-Lacteos" },
                { name: "Suco natural", grams: 250, categoria: "C-Frutas" }
              ]
            },
            {
              name: "Almoço",
              approximate_calories: 585,
              items: [
                { name: "Carne bovina", grams: 180, categoria: "F-Carnes" },
                { name: "Quinoa", grams: 150, categoria: "A-Cereales" },
                { name: "Lentilhas", grams: 100, categoria: "T-Leguminosas" },
                { name: "Salada mista", grams: 150, categoria: "B-Verduras" },
                { name: "Azeite", grams: 12, categoria: "D-Grasas" }
              ]
            },
            {
              name: "Lanche da Tarde",
              approximate_calories: 305,
              items: [
                { name: "Smoothie proteico", grams: 280, categoria: "G-Lacteos" },
                { name: "Banana", grams: 120, categoria: "C-Frutas" },
                { name: "Aveia", grams: 40, categoria: "A-Cereales" }
              ]
            },
            {
              name: "Jantar",
              approximate_calories: 485,
              items: [
                { name: "Tilápia", grams: 190, categoria: "E-Pescados" },
                { name: "Mandioca", grams: 150, categoria: "U-Tuberculos" },
                { name: "Legumes refogados", grams: 150, categoria: "B-Verduras" }
              ]
            },
            {
              name: "Ceia",
              approximate_calories: 165,
              items: [
                { name: "Iogurte", grams: 130, categoria: "G-Lacteos" },
                { name: "Amêndoas", grams: 18, categoria: "D-Grasas" }
              ]
            }
          ],
          smart_substitutions: "Mesmas substituições anteriores"
        },
        {
          name: "Cardápio 3 – Mulheres – 2000 kcal",
          gender: "feminino",
          calorie_level: 2000,
          total_calories: 2000,
          protein_grams: 147,
          carb_grams: 198,
          fat_grams: 69,
          meals: [
            {
              name: "Café da Manhã",
              approximate_calories: 470,
              items: [
                { name: "Panqueca fitness", grams: 120, categoria: "A-Cereales" },
                { name: "Ovo", grams: 120, categoria: "J-Huevos" },
                { name: "Frutas vermelhas", grams: 100, categoria: "C-Frutas" },
                { name: "Iogurte", grams: 120, categoria: "G-Lacteos" }
              ]
            },
            {
              name: "Almoço",
              approximate_calories: 580,
              items: [
                { name: "Frango grelhado", grams: 190, categoria: "F-Carnes" },
                { name: "Arroz integral", grams: 135, categoria: "A-Cereales" },
                { name: "Feijão carioca", grams: 105, categoria: "T-Leguminosas" },
                { name: "Salada verde", grams: 140, categoria: "B-Verduras" },
                { name: "Azeite", grams: 12, categoria: "D-Grasas" }
              ]
            },
            {
              name: "Lanche da Tarde",
              approximate_calories: 310,
              items: [
                { name: "Vitamina", grams: 250, categoria: "C-Frutas" },
                { name: "Whey protein", grams: 35, categoria: "G-Lacteos" },
                { name: "Aveia", grams: 35, categoria: "A-Cereales" }
              ]
            },
            {
              name: "Jantar",
              approximate_calories: 475,
              items: [
                { name: "Merluza", grams: 195, categoria: "E-Pescados" },
                { name: "Batata doce", grams: 155, categoria: "U-Tuberculos" },
                { name: "Aspargos", grams: 160, categoria: "B-Verduras" }
              ]
            },
            {
              name: "Ceia",
              approximate_calories: 165,
              items: [
                { name: "Queijo cottage", grams: 110, categoria: "G-Lacteos" },
                { name: "Castanhas", grams: 15, categoria: "D-Grasas" }
              ]
            }
          ],
          smart_substitutions: "Mesmas substituições anteriores"
        },
        {
          name: "Cardápio 4 – Mulheres – 2000 kcal",
          gender: "feminino",
          calorie_level: 2000,
          total_calories: 2000,
          protein_grams: 144,
          carb_grams: 202,
          fat_grams: 66,
          meals: [
            {
              name: "Café da Manhã",
              approximate_calories: 465,
              items: [
                { name: "Arepa integral", grams: 90, categoria: "A-Cereales" },
                { name: "Ovos mexidos", grams: 140, categoria: "J-Huevos" },
                { name: "Queijo", grams: 40, categoria: "G-Lacteos" },
                { name: "Abacate", grams: 50, categoria: "C-Frutas" }
              ]
            },
            {
              name: "Almoço",
              approximate_calories: 590,
              items: [
                { name: "Carne suína", grams: 175, categoria: "F-Carnes" },
                { name: "Quinoa", grams: 145, categoria: "A-Cereales" },
                { name: "Grão-de-bico", grams: 100, categoria: "T-Leguminosas" },
                { name: "Vegetais salteados", grams: 150, categoria: "B-Verduras" },
                { name: "Azeite", grams: 12, categoria: "D-Grasas" }
              ]
            },
            {
              name: "Lanche da Tarde",
              approximate_calories: 300,
              items: [
                { name: "Iogurte grego", grams: 200, categoria: "G-Lacteos" },
                { name: "Mix de frutas", grams: 140, categoria: "C-Frutas" },
                { name: "Granola caseira", grams: 40, categoria: "A-Cereales" }
              ]
            },
            {
              name: "Jantar",
              approximate_calories: 480,
              items: [
                { name: "Atum", grams: 190, categoria: "E-Pescados" },
                { name: "Inhame", grams: 145, categoria: "U-Tuberculos" },
                { name: "Brócolis", grams: 160, categoria: "B-Verduras" }
              ]
            },
            {
              name: "Ceia",
              approximate_calories: 165,
              items: [
                { name: "Kefir", grams: 160, categoria: "G-Lacteos" },
                { name: "Nozes", grams: 15, categoria: "D-Grasas" }
              ]
            }
          ],
          smart_substitutions: "Mesmas substituições anteriores"
        },
        {
          name: "Cardápio 5 – Mulheres – 2000 kcal",
          gender: "feminino",
          calorie_level: 2000,
          total_calories: 2000,
          protein_grams: 146,
          carb_grams: 200,
          fat_grams: 68,
          meals: [
            {
              name: "Café da Manhã",
              approximate_calories: 463,
              items: [
                { name: "Crepioca", grams: 100, categoria: "A-Cereales" },
                { name: "Ovo", grams: 120, categoria: "J-Huevos" },
                { name: "Frango desfiado", grams: 60, categoria: "F-Carnes" },
                { name: "Suco de laranja", grams: 250, categoria: "C-Frutas" }
              ]
            },
            {
              name: "Almoço",
              approximate_calories: 595,
              items: [
                { name: "Peixe grelhado", grams: 195, categoria: "E-Pescados" },
                { name: "Arroz integral", grams: 140, categoria: "A-Cereales" },
                { name: "Lentilha", grams: 105, categoria: "T-Leguminosas" },
                { name: "Salada completa", grams: 155, categoria: "B-Verduras" },
                { name: "Azeite", grams: 12, categoria: "D-Grasas" }
              ]
            },
            {
              name: "Lanche da Tarde",
              approximate_calories: 305,
              items: [
                { name: "Açaí", grams: 140, categoria: "C-Frutas" },
                { name: "Granola", grams: 45, categoria: "A-Cereales" },
                { name: "Leite de coco", grams: 70, categoria: "G-Lacteos" }
              ]
            },
            {
              name: "Jantar",
              approximate_calories: 472,
              items: [
                { name: "Frango assado", grams: 185, categoria: "F-Carnes" },
                { name: "Batata doce", grams: 150, categoria: "U-Tuberculos" },
                { name: "Couve refogada", grams: 150, categoria: "B-Verduras" }
              ]
            },
            {
              name: "Ceia",
              approximate_calories: 165,
              items: [
                { name: "Queijo ricotta", grams: 140, categoria: "G-Lacteos" },
                { name: "Sementes", grams: 12, categoria: "D-Grasas" }
              ]
            }
          ],
          smart_substitutions: "Mesmas substituições anteriores"
        },

        // MULHERES - 2300 kcal (5 cardápios)
        {
          name: "Cardápio 1 – Mulheres – 2300 kcal",
          gender: "feminino",
          calorie_level: 2300,
          total_calories: 2300,
          protein_grams: 167,
          carb_grams: 230,
          fat_grams: 77,
          meals: [
            {
              name: "Café da Manhã",
              approximate_calories: 535,
              items: [
                { name: "Ovos", grams: 180, categoria: "J-Huevos" },
                { name: "Pão integral", grams: 100, categoria: "A-Cereales" },
                { name: "Abacate", grams: 70, categoria: "C-Frutas" },
                { name: "Queijo", grams: 50, categoria: "G-Lacteos" },
                { name: "Tomate", grams: 70, categoria: "B-Verduras" }
              ]
            },
            {
              name: "Almoço",
              approximate_calories: 680,
              items: [
                { name: "Peito de frango", grams: 230, categoria: "F-Carnes" },
                { name: "Arroz integral", grams: 160, categoria: "A-Cereales" },
                { name: "Feijão preto", grams: 120, categoria: "T-Leguminosas" },
                { name: "Salada completa", grams: 180, categoria: "B-Verduras" },
                { name: "Azeite", grams: 15, categoria: "D-Grasas" }
              ]
            },
            {
              name: "Lanche da Tarde",
              approximate_calories: 345,
              items: [
                { name: "Iogurte grego", grams: 250, categoria: "G-Lacteos" },
                { name: "Frutas variadas", grams: 160, categoria: "C-Frutas" },
                { name: "Granola", grams: 45, categoria: "A-Cereales" },
                { name: "Mel", grams: 25, categoria: "C-Frutas" }
              ]
            },
            {
              name: "Jantar",
              approximate_calories: 550,
              items: [
                { name: "Salmão", grams: 230, categoria: "E-Pescados" },
                { name: "Batata doce", grams: 180, categoria: "U-Tuberculos" },
                { name: "Vegetais grelhados", grams: 180, categoria: "B-Verduras" }
              ]
            },
            {
              name: "Ceia",
              approximate_calories: 190,
              items: [
                { name: "Queijo cottage", grams: 120, categoria: "G-Lacteos" },
                { name: "Nozes", grams: 22, categoria: "D-Grasas" }
              ]
            }
          ],
          smart_substitutions: "Mesmas substituições anteriores"
        },
        {
          name: "Cardápio 2 – Mulheres – 2300 kcal",
          gender: "feminino",
          calorie_level: 2300,
          total_calories: 2300,
          protein_grams: 163,
          carb_grams: 236,
          fat_grams: 75,
          meals: [
            {
              name: "Café da Manhã",
              approximate_calories: 530,
              items: [
                { name: "Tapioca", grams: 100, categoria: "A-Cereales" },
                { name: "Ovos", grams: 150, categoria: "J-Huevos" },
                { name: "Frango desfiado", grams: 90, categoria: "F-Carnes" },
                { name: "Queijo", grams: 55, categoria: "G-Lacteos" },
                { name: "Suco natural", grams: 300, categoria: "C-Frutas" }
              ]
            },
            {
              name: "Almoço",
              approximate_calories: 675,
              items: [
                { name: "Carne bovina", grams: 210, categoria: "F-Carnes" },
                { name: "Quinoa", grams: 170, categoria: "A-Cereales" },
                { name: "Lentilhas", grams: 110, categoria: "T-Leguminosas" },
                { name: "Salada mista", grams: 170, categoria: "B-Verduras" },
                { name: "Azeite", grams: 15, categoria: "D-Grasas" }
              ]
            },
            {
              name: "Lanche da Tarde",
              approximate_calories: 350,
              items: [
                { name: "Smoothie proteico", grams: 320, categoria: "G-Lacteos" },
                { name: "Banana", grams: 140, categoria: "C-Frutas" },
                { name: "Aveia", grams: 50, categoria: "A-Cereales" }
              ]
            },
            {
              name: "Jantar",
              approximate_calories: 555,
              items: [
                { name: "Tilápia", grams: 220, categoria: "E-Pescados" },
                { name: "Mandioca", grams: 170, categoria: "U-Tuberculos" },
                { name: "Legumes refogados", grams: 170, categoria: "B-Verduras" }
              ]
            },
            {
              name: "Ceia",
              approximate_calories: 190,
              items: [
                { name: "Iogurte", grams: 150, categoria: "G-Lacteos" },
                { name: "Amêndoas", grams: 22, categoria: "D-Grasas" }
              ]
            }
          ],
          smart_substitutions: "Mesmas substituições anteriores"
        },
        {
          name: "Cardápio 3 – Mulheres – 2300 kcal",
          gender: "feminino",
          calorie_level: 2300,
          total_calories: 2300,
          protein_grams: 169,
          carb_grams: 228,
          fat_grams: 79,
          meals: [
            {
              name: "Café da Manhã",
              approximate_calories: 540,
              items: [
                { name: "Panqueca fitness", grams: 140, categoria: "A-Cereales" },
                { name: "Ovo", grams: 150, categoria: "J-Huevos" },
                { name: "Frutas vermelhas", grams: 120, categoria: "C-Frutas" },
                { name: "Iogurte", grams: 140, categoria: "G-Lacteos" }
              ]
            },
            {
              name: "Almoço",
              approximate_calories: 670,
              items: [
                { name: "Frango grelhado", grams: 220, categoria: "F-Carnes" },
                { name: "Arroz integral", grams: 155, categoria: "A-Cereales" },
                { name: "Feijão carioca", grams: 115, categoria: "T-Leguminosas" },
                { name: "Salada verde", grams: 160, categoria: "B-Verduras" },
                { name: "Azeite", grams: 15, categoria: "D-Grasas" }
              ]
            },
            {
              name: "Lanche da Tarde",
              approximate_calories: 355,
              items: [
                { name: "Vitamina", grams: 300, categoria: "C-Frutas" },
                { name: "Whey protein", grams: 40, categoria: "G-Lacteos" },
                { name: "Aveia", grams: 45, categoria: "A-Cereales" }
              ]
            },
            {
              name: "Jantar",
              approximate_calories: 545,
              items: [
                { name: "Merluza", grams: 225, categoria: "E-Pescados" },
                { name: "Batata doce", grams: 175, categoria: "U-Tuberculos" },
                { name: "Aspargos", grams: 180, categoria: "B-Verduras" }
              ]
            },
            {
              name: "Ceia",
              approximate_calories: 190,
              items: [
                { name: "Queijo cottage", grams: 130, categoria: "G-Lacteos" },
                { name: "Castanhas", grams: 18, categoria: "D-Grasas" }
              ]
            }
          ],
          smart_substitutions: "Mesmas substituições anteriores"
        },
        {
          name: "Cardápio 4 – Mulheres – 2300 kcal",
          gender: "feminino",
          calorie_level: 2300,
          total_calories: 2300,
          protein_grams: 166,
          carb_grams: 232,
          fat_grams: 76,
          meals: [
            {
              name: "Café da Manhã",
              approximate_calories: 535,
              items: [
                { name: "Arepa integral", grams: 110, categoria: "A-Cereales" },
                { name: "Ovos mexidos", grams: 160, categoria: "J-Huevos" },
                { name: "Queijo", grams: 50, categoria: "G-Lacteos" },
                { name: "Abacate", grams: 60, categoria: "C-Frutas" }
              ]
            },
            {
              name: "Almoço",
              approximate_calories: 680,
              items: [
                { name: "Carne suína", grams: 200, categoria: "F-Carnes" },
                { name: "Quinoa", grams: 165, categoria: "A-Cereales" },
                { name: "Grão-de-bico", grams: 110, categoria: "T-Leguminosas" },
                { name: "Vegetais salteados", grams: 170, categoria: "B-Verduras" },
                { name: "Azeite", grams: 15, categoria: "D-Grasas" }
              ]
            },
            {
              name: "Lanche da Tarde",
              approximate_calories: 345,
              items: [
                { name: "Iogurte grego", grams: 230, categoria: "G-Lacteos" },
                { name: "Mix de frutas", grams: 160, categoria: "C-Frutas" },
                { name: "Granola caseira", grams: 50, categoria: "A-Cereales" }
              ]
            },
            {
              name: "Jantar",
              approximate_calories: 550,
              items: [
                { name: "Atum", grams: 220, categoria: "E-Pescados" },
                { name: "Inhame", grams: 165, categoria: "U-Tuberculos" },
                { name: "Brócolis", grams: 180, categoria: "B-Verduras" }
              ]
            },
            {
              name: "Ceia",
              approximate_calories: 190,
              items: [
                { name: "Kefir", grams: 180, categoria: "G-Lacteos" },
                { name: "Nozes", grams: 18, categoria: "D-Grasas" }
              ]
            }
          ],
          smart_substitutions: "Mesmas substituições anteriores"
        },
        {
          name: "Cardápio 5 – Mulheres – 2300 kcal",
          gender: "feminino",
          calorie_level: 2300,
          total_calories: 2300,
          protein_grams: 168,
          carb_grams: 230,
          fat_grams: 78,
          meals: [
            {
              name: "Café da Manhã",
              approximate_calories: 533,
              items: [
                { name: "Crepioca", grams: 120, categoria: "A-Cereales" },
                { name: "Ovo", grams: 150, categoria: "J-Huevos" },
                { name: "Frango desfiado", grams: 70, categoria: "F-Carnes" },
                { name: "Suco de laranja", grams: 300, categoria: "C-Frutas" }
              ]
            },
            {
              name: "Almoço",
              approximate_calories: 685,
              items: [
                { name: "Peixe grelhado", grams: 225, categoria: "E-Pescados" },
                { name: "Arroz integral", grams: 160, categoria: "A-Cereales" },
                { name: "Lentilha", grams: 115, categoria: "T-Leguminosas" },
                { name: "Salada completa", grams: 175, categoria: "B-Verduras" },
                { name: "Azeite", grams: 15, categoria: "D-Grasas" }
              ]
            },
            {
              name: "Lanche da Tarde",
              approximate_calories: 350,
              items: [
                { name: "Açaí", grams: 160, categoria: "C-Frutas" },
                { name: "Granola", grams: 55, categoria: "A-Cereales" },
                { name: "Leite de coco", grams: 80, categoria: "G-Lacteos" }
              ]
            },
            {
              name: "Jantar",
              approximate_calories: 542,
              items: [
                { name: "Frango assado", grams: 215, categoria: "F-Carnes" },
                { name: "Batata doce", grams: 170, categoria: "U-Tuberculos" },
                { name: "Couve refogada", grams: 170, categoria: "B-Verduras" }
              ]
            },
            {
              name: "Ceia",
              approximate_calories: 190,
              items: [
                { name: "Queijo ricotta", grams: 160, categoria: "G-Lacteos" },
                { name: "Sementes", grams: 15, categoria: "D-Grasas" }
              ]
            }
          ],
          smart_substitutions: "Mesmas substituições anteriores"
        },

        // MULHERES - 2500 kcal (5 cardápios)
        {
          name: "Cardápio 1 – Mulheres – 2500 kcal",
          gender: "feminino",
          calorie_level: 2500,
          total_calories: 2500,
          protein_grams: 181,
          carb_grams: 250,
          fat_grams: 83,
          meals: [
            {
              name: "Café da Manhã",
              approximate_calories: 580,
              items: [
                { name: "Ovos", grams: 200, categoria: "J-Huevos" },
                { name: "Pão integral", grams: 120, categoria: "A-Cereales" },
                { name: "Abacate", grams: 80, categoria: "C-Frutas" },
                { name: "Queijo", grams: 60, categoria: "G-Lacteos" },
                { name: "Tomate", grams: 80, categoria: "B-Verduras" }
              ]
            },
            {
              name: "Almoço",
              approximate_calories: 740,
              items: [
                { name: "Peito de frango", grams: 250, categoria: "F-Carnes" },
                { name: "Arroz integral", grams: 180, categoria: "A-Cereales" },
                { name: "Feijão preto", grams: 130, categoria: "T-Leguminosas" },
                { name: "Salada completa", grams: 200, categoria: "B-Verduras" },
                { name: "Azeite", grams: 18, categoria: "D-Grasas" }
              ]
            },
            {
              name: "Lanche da Tarde",
              approximate_calories: 375,
              items: [
                { name: "Iogurte grego", grams: 280, categoria: "G-Lacteos" },
                { name: "Frutas variadas", grams: 180, categoria: "C-Frutas" },
                { name: "Granola", grams: 55, categoria: "A-Cereales" },
                { name: "Mel", grams: 30, categoria: "C-Frutas" }
              ]
            },
            {
              name: "Jantar",
              approximate_calories: 600,
              items: [
                { name: "Salmão", grams: 250, categoria: "E-Pescados" },
                { name: "Batata doce", grams: 200, categoria: "U-Tuberculos" },
                { name: "Vegetais grelhados", grams: 200, categoria: "B-Verduras" }
              ]
            },
            {
              name: "Ceia",
              approximate_calories: 205,
              items: [
                { name: "Queijo cottage", grams: 140, categoria: "G-Lacteos" },
                { name: "Nozes", grams: 25, categoria: "D-Grasas" }
              ]
            }
          ],
          smart_substitutions: "Mesmas substituições anteriores"
        },
        {
          name: "Cardápio 2 – Mulheres – 2500 kcal",
          gender: "feminino",
          calorie_level: 2500,
          total_calories: 2500,
          protein_grams: 177,
          carb_grams: 256,
          fat_grams: 81,
          meals: [
            {
              name: "Café da Manhã",
              approximate_calories: 575,
              items: [
                { name: "Tapioca", grams: 120, categoria: "A-Cereales" },
                { name: "Ovos", grams: 180, categoria: "J-Huevos" },
                { name: "Frango desfiado", grams: 100, categoria: "F-Carnes" },
                { name: "Queijo", grams: 65, categoria: "G-Lacteos" },
                { name: "Suco natural", grams: 350, categoria: "C-Frutas" }
              ]
            },
            {
              name: "Almoço",
              approximate_calories: 735,
              items: [
                { name: "Carne bovina", grams: 240, categoria: "F-Carnes" },
                { name: "Quinoa", grams: 190, categoria: "A-Cereales" },
                { name: "Lentilhas", grams: 120, categoria: "T-Leguminosas" },
                { name: "Salada mista", grams: 190, categoria: "B-Verduras" },
                { name: "Azeite", grams: 18, categoria: "D-Grasas" }
              ]
            },
            {
              name: "Lanche da Tarde",
              approximate_calories: 380,
              items: [
                { name: "Smoothie proteico", grams: 350, categoria: "G-Lacteos" },
                { name: "Banana", grams: 160, categoria: "C-Frutas" },
                { name: "Aveia", grams: 60, categoria: "A-Cereales" }
              ]
            },
            {
              name: "Jantar",
              approximate_calories: 605,
              items: [
                { name: "Tilápia", grams: 240, categoria: "E-Pescados" },
                { name: "Mandioca", grams: 190, categoria: "U-Tuberculos" },
                { name: "Legumes refogados", grams: 190, categoria: "B-Verduras" }
              ]
            },
            {
              name: "Ceia",
              approximate_calories: 205,
              items: [
                { name: "Iogurte", grams: 170, categoria: "G-Lacteos" },
                { name: "Amêndoas", grams: 25, categoria: "D-Grasas" }
              ]
            }
          ],
          smart_substitutions: "Mesmas substituições anteriores"
        },
        {
          name: "Cardápio 3 – Mulheres – 2500 kcal",
          gender: "feminino",
          calorie_level: 2500,
          total_calories: 2500,
          protein_grams: 183,
          carb_grams: 248,
          fat_grams: 85,
          meals: [
            {
              name: "Café da Manhã",
              approximate_calories: 585,
              items: [
                { name: "Panqueca fitness", grams: 160, categoria: "A-Cereales" },
                { name: "Ovo", grams: 180, categoria: "J-Huevos" },
                { name: "Frutas vermelhas", grams: 140, categoria: "C-Frutas" },
                { name: "Iogurte", grams: 160, categoria: "G-Lacteos" }
              ]
            },
            {
              name: "Almoço",
              approximate_calories: 730,
              items: [
                { name: "Frango grelhado", grams: 250, categoria: "F-Carnes" },
                { name: "Arroz integral", grams: 175, categoria: "A-Cereales" },
                { name: "Feijão carioca", grams: 125, categoria: "T-Leguminosas" },
                { name: "Salada verde", grams: 180, categoria: "B-Verduras" },
                { name: "Azeite", grams: 18, categoria: "D-Grasas" }
              ]
            },
            {
              name: "Lanche da Tarde",
              approximate_calories: 385,
              items: [
                { name: "Vitamina", grams: 350, categoria: "C-Frutas" },
                { name: "Whey protein", grams: 45, categoria: "G-Lacteos" },
                { name: "Aveia", grams: 55, categoria: "A-Cereales" }
              ]
            },
            {
              name: "Jantar",
              approximate_calories: 595,
              items: [
                { name: "Merluza", grams: 255, categoria: "E-Pescados" },
                { name: "Batata doce", grams: 195, categoria: "U-Tuberculos" },
                { name: "Aspargos", grams: 200, categoria: "B-Verduras" }
              ]
            },
            {
              name: "Ceia",
              approximate_calories: 205,
              items: [
                { name: "Queijo cottage", grams: 150, categoria: "G-Lacteos" },
                { name: "Castanhas", grams: 20, categoria: "D-Grasas" }
              ]
            }
          ],
          smart_substitutions: "Mesmas substituições anteriores"
        },
        {
          name: "Cardápio 4 – Mulheres – 2500 kcal",
          gender: "feminino",
          calorie_level: 2500,
          total_calories: 2500,
          protein_grams: 180,
          carb_grams: 252,
          fat_grams: 82,
          meals: [
            {
              name: "Café da Manhã",
              approximate_calories: 580,
              items: [
                { name: "Arepa integral", grams: 130, categoria: "A-Cereales" },
                { name: "Ovos mexidos", grams: 180, categoria: "J-Huevos" },
                { name: "Queijo", grams: 60, categoria: "G-Lacteos" },
                { name: "Abacate", grams: 70, categoria: "C-Frutas" }
              ]
            },
            {
              name: "Almoço",
              approximate_calories: 740,
              items: [
                { name: "Carne suína", grams: 230, categoria: "F-Carnes" },
                { name: "Quinoa", grams: 185, categoria: "A-Cereales" },
                { name: "Grão-de-bico", grams: 120, categoria: "T-Leguminosas" },
                { name: "Vegetais salteados", grams: 190, categoria: "B-Verduras" },
                { name: "Azeite", grams: 18, categoria: "D-Grasas" }
              ]
            },
            {
              name: "Lanche da Tarde",
              approximate_calories: 375,
              items: [
                { name: "Iogurte grego", grams: 260, categoria: "G-Lacteos" },
                { name: "Mix de frutas", grams: 180, categoria: "C-Frutas" },
                { name: "Granola caseira", grams: 60, categoria: "A-Cereales" }
              ]
            },
            {
              name: "Jantar",
              approximate_calories: 600,
              items: [
                { name: "Atum", grams: 250, categoria: "E-Pescados" },
                { name: "Inhame", grams: 185, categoria: "U-Tuberculos" },
                { name: "Brócolis", grams: 200, categoria: "B-Verduras" }
              ]
            },
            {
              name: "Ceia",
              approximate_calories: 205,
              items: [
                { name: "Kefir", grams: 200, categoria: "G-Lacteos" },
                { name: "Nozes", grams: 20, categoria: "D-Grasas" }
              ]
            }
          ],
          smart_substitutions: "Mesmas substituições anteriores"
        },
        {
          name: "Cardápio 5 – Mulheres – 2500 kcal",
          gender: "feminino",
          calorie_level: 2500,
          total_calories: 2500,
          protein_grams: 182,
          carb_grams: 250,
          fat_grams: 84,
          meals: [
            {
              name: "Café da Manhã",
              approximate_calories: 578,
              items: [
                { name: "Crepioca", grams: 140, categoria: "A-Cereales" },
                { name: "Ovo", grams: 180, categoria: "J-Huevos" },
                { name: "Frango desfiado", grams: 80, categoria: "F-Carnes" },
                { name: "Suco de laranja", grams: 350, categoria: "C-Frutas" }
              ]
            },
            {
              name: "Almoço",
              approximate_calories: 745,
              items: [
                { name: "Peixe grelhado", grams: 255, categoria: "E-Pescados" },
                { name: "Arroz integral", grams: 180, categoria: "A-Cereales" },
                { name: "Lentilha", grams: 125, categoria: "T-Leguminosas" },
                { name: "Salada completa", grams: 195, categoria: "B-Verduras" },
                { name: "Azeite", grams: 18, categoria: "D-Grasas" }
              ]
            },
            {
              name: "Lanche da Tarde",
              approximate_calories: 380,
              items: [
                { name: "Açaí", grams: 180, categoria: "C-Frutas" },
                { name: "Granola", grams: 65, categoria: "A-Cereales" },
                { name: "Leite de coco", grams: 90, categoria: "G-Lacteos" }
              ]
            },
            {
              name: "Jantar",
              approximate_calories: 592,
              items: [
                { name: "Frango assado", grams: 245, categoria: "F-Carnes" },
                { name: "Batata doce", grams: 190, categoria: "U-Tuberculos" },
                { name: "Couve refogada", grams: 190, categoria: "B-Verduras" }
              ]
            },
            {
              name: "Ceia",
              approximate_calories: 205,
              items: [
                { name: "Queijo ricotta", grams: 180, categoria: "G-Lacteos" },
                { name: "Sementes", grams: 18, categoria: "D-Grasas" }
              ]
            }
          ],
          smart_substitutions: "Mesmas substituições anteriores"
        }
      ];

      // Bulk insert templates
      await storage.bulkCreateTemplateMenus(templatesData);

      res.json({
        message: "Templates de cardápios inseridos com sucesso!",
        count: templatesData.length,
        details: "30 templates para mulheres (6 níveis calóricos x 5 cardápios cada)"
      });
    } catch (error) {
      console.error("Error seeding template menus:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}