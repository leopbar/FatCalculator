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

  const httpServer = createServer(app);

  return httpServer;
}
