import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { StatsService } from "../services/statService.ts";

export class StatsController {
  constructor(private statsService: StatsService) {}

  // Distribución por tipo (Pie Chart)
  async getCardTypes(ctx: Context) {
    await this.handleRequest(ctx, this.statsService.getCardTypeDistribution.bind(this.statsService));
  }

  // Distribución por rareza (Bar Chart)
  async getRarities(ctx: Context) {
    await this.handleRequest(ctx, this.statsService.getRarityDistribution.bind(this.statsService));
  }

  // Progreso por set (Progress Bar)
  async getSetCompletion(ctx: Context) {
    await this.handleRequest(ctx, this.statsService.getSetCompletion.bind(this.statsService));
  }

  // Todas las estadísticas del usuario
  async getFullStats(ctx: Context) {
    await this.handleRequest(ctx, this.statsService.getUserCollectionStats.bind(this.statsService));
  }

  // --- Helpers ---

  private async handleRequest(ctx: Context, serviceMethod: (userId: number) => Promise<any>) {
    try {
      const userId = this.getUserId(ctx);
      const data = await serviceMethod(userId);
      ctx.response.body = { success: true, data };
    } catch (error) {
      this.handleError(ctx, error);
    }
  }

  private getUserId(ctx: Context): number {
    const userIdParam = ctx.request.url.searchParams.get("userId");
    const userId = userIdParam ? parseInt(userIdParam, 10) : NaN;

    if (isNaN(userId)) {
      throw new Error("ID de usuario inválido");
    }

    return userId;
  }

  private handleError(ctx: Context, error: Error) {
    const isClientError = error.message.includes("inválido") || error.message.includes("not found");
    ctx.response.status = isClientError ? 400 : 500;
    ctx.response.body = {
      success: false,
      error: error.message,
    };
    console.error(`❌ Error en StatsController: ${error.stack}`);
  }
}
