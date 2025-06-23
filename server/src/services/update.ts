import { client } from "../db/db.ts";
import { TcgApiService } from "../services/tcgapi.ts";
import { StatsService } from "../services/statService.ts";

async function main() {
  const tcgApi = new TcgApiService();
  const statsService = new StatsService(tcgApi);

  await statsService.updateAllSetTotals();

  await client.end(); // Cierra conexión a la BD
}

main().catch((err) => {
  console.error("Error en script updateSetTotals:", err);
  client.end();
});