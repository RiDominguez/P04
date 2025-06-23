import { Router } from "https://deno.land/x/oak/mod.ts";
import { StatsController } from "../controllers/statController.ts";
import { StatsService } from "../services/statService.ts";
import { TcgApiService } from "../services/tcgapi.ts";

export function createStatsRoutes() {
  const router = new Router();
  const statsService = new StatsService(new TcgApiService());
  const controller = new StatsController(statsService);

  // Endpoints individuales
  router.get("/stats/types", (ctx) => controller.getCardTypes(ctx));
  router.get("/stats/rarities", (ctx) => controller.getRarities(ctx));
  router.get("/stats/set-completion", (ctx) => controller.getSetCompletion(ctx));

  // Endpoint combinado
  router.get("/stats/full", (ctx) => controller.getFullStats(ctx));

  return router;
}