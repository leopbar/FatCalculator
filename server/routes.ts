import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authRoutes, authenticateJWT } from "./routes/auth";
import {
  insertBodyMetricsSchema,
  insertCalculationSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup JWT authentication routes
  app.use('/api', authRoutes);

  // Dashboard summary endpoint
  app.get("/api/me/summary", authenticateJWT, async (req: any, res) => {
    try {
      const summary = await storage.getUserSummary(req.user.id);
      res.json(summary);
    } catch (error) {
      console.error("Error getting user summary:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Body metrics endpoints
  app.get("/api/body-metrics", authenticateJWT, async (req: any, res) => {
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

  app.post("/api/body-metrics", authenticateJWT, async (req: any, res) => {
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
  app.get("/api/calculation", authenticateJWT, async (req: any, res) => {
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

  app.post("/api/calculation", authenticateJWT, async (req: any, res) => {
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

  // Clear all user data (for recalculation)
  app.delete("/api/clear-data", authenticateJWT, async (req: any, res) => {
    try {
      await storage.clearAllUserData(req.user.id);
      res.json({ message: "Todos os dados foram limpos com sucesso" });
    } catch (error) {
      console.error("Error clearing user data:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });



  const httpServer = createServer(app);

  return httpServer;
}