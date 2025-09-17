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

  // Generate menu plan with AI
  app.post("/api/generate-menu-ai", requireAuth, async (req: any, res) => {
    try {
      const { calories, protein, carb, fat, category } = req.body;

      if (!calories || !protein || !carb || !fat || !category) {
        return res.status(400).json({ error: "Parâmetros de macros obrigatórios" });
      }

      // Ollama runs locally, no API key needed
      console.log("Using Ollama (local AI) - no API key required");

      // Assuming you have a local Ollama setup and a model that can generate meal plans.
      // You'll need to adjust the import path and function call based on your Ollama integration.
      // For demonstration, let's assume a function `generateMealPlanWithOllama` exists.
      // You would likely use a library like `ollama` or `axios` to interact with the Ollama API.
      
      // Example using a hypothetical ollama client:
      // const ollama = require('ollama'); // if you install ollama npm package
      // const aiGeneratedMenu = await ollama.chat({
      //   model: 'llama3', // or your preferred model
      //   messages: [{ role: 'user', content: `Generate a meal plan with ${calories} calories, ${protein}g protein, ${carb}g carbs, ${fat}g fat, for a ${category} diet.` }],
      // });
      // const menuContent = aiGeneratedMenu.message.content;

      // Placeholder for actual Ollama integration:
      const menuContent = "Placeholder for AI generated menu using Ollama."; 

      res.json({ menuContent });
    } catch (error) {
      console.error("Error generating AI menu with Ollama:", error);
      res.status(500).json({ error: "Erro ao gerar cardápio com IA via Ollama" });
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
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}