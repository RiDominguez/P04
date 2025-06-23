// src/controllers/stats.controller.ts
import { Context } from "https://deno.land/x/oak/mod.ts";
import { StatsService } from "../services/statService.ts"

export class StatsController {
  constructor(private statsService: StatsService) {}

  // Obtiene distribución de tipos de carta (Para Pie Chart)
  async getCardTypes(ctx: Context) {
    try {
      const userId = this.getUserId(ctx);
      const data = await this.statsService.getCardTypeDistribution(userId);
      ctx.response.body = {
        success: true,
        data,
      };
    } catch (error) {
      this.handleError(ctx, error);
    }
  }

  // Obtiene distribución de rarezas (Para Bar Chart)
  async getRarities(ctx: Context) {
    try {
      const userId = this.getUserId(ctx);
      const data = await this.statsService.getRarityDistribution(userId);
      ctx.response.body = {
        success: true,
        data,
      };
    } catch (error) {
      this.handleError(ctx, error);
    }
  }

  // Obtiene progreso de sets (Para Progress Bars)
  async getSetCompletion(ctx: Context) {
    try {
      const userId = this.getUserId(ctx);
      const data = await this.statsService.getSetCompletion(userId);
      ctx.response.body = {
        success: true,
        data,
      };
    } catch (error) {
      this.handleError(ctx, error);
    }
  }

  // Método combinado (Para dashboard)
  async getFullStats(ctx: Context) {
    try {
      const userId = this.getUserId(ctx);
      const data = await this.statsService.getUserCollectionStats(userId);
      ctx.response.body = {
        success: true,
        data,
      };
    } catch (error) {
      this.handleError(ctx, error);
    }
  }

  // --- Helpers ---
  private getUserId(ctx: Context): number {
    const userId = parseInt(ctx.request.url.searchParams.get("userId") || "");
    if (isNaN(userId)) {
      throw new Error("ID de usuario inválido");
    }
    return userId;
  }

  private handleError(ctx: Context, error: Error) {
    ctx.response.status = error.message.includes("inválido") ? 400 : 500;
    ctx.response.body = {
      success: false,
      error: error.message,
    };
    console.error(`Error en StatsController: ${error.stack}`);
  }
}