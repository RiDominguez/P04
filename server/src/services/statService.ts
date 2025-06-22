// src/services/stats.service.ts
import { client } from "../db/db.ts"; // Tu cliente PostgreSQL existente
import { TcgApiService } from "./tcgapi.ts";

interface CardTypeDistribution {
  type: string;
  count: number;
}

interface RarityDistribution {
  rarity: string;
  count: number;
}

interface SetCompletion {
  set_name: string;
  owned: number;
  total: number;
}

export class StatsService {
  private tcgApi: TcgApiService;

  constructor(tcgApi: TcgApiService) {
    this.tcgApi = tcgApi;
  }

  /**
   * Obtiene la distribución de tipos de cartas en la colección del usuario
   */
  async getCardTypeDistribution(userId: number): Promise<CardTypeDistribution[]> {
  try {
    const result = await client.queryObject<{ type: string; count: number }>(`
      SELECT pc.type, COUNT(uc.id)::int as count
      FROM user_cards uc
      JOIN pokemon_cards pc ON uc.card_id = pc.id
      WHERE uc.user_id = $1
      GROUP BY pc.type
    `, [userId]);

    const typeMap: Record<string, string> = {
      colorless: "Normal",
      lightning: "Eléctrico",
      fire: "Fuego",
      water: "Agua",
      psychic: "Psíquico",
      grass: "Planta",
      fighting: "Lucha",
      darkness: "Siniestro",
      metal: "Acero",
      dragon: "Dragón",
      fairy: "Hada",
    };

    // Mapeo y corrección de nombres de tipos
    return result.rows.map((row) => ({
      type: typeMap[row.type.toLowerCase()] ?? row.type,
      count: row.count,
    }));
  } catch (error) {
    console.error("Error en getCardTypeDistribution:", error);
    throw new Error("Failed to fetch card type distribution");
  }
}

  /**
   * Obtiene la distribución de rarezas en la colección del usuario
   */
  async getRarityDistribution(userId: number): Promise<RarityDistribution[]> {
  try {
    const result = await client.queryObject<{ rarity: string; count: number }>({
      text: `
        SELECT pc.rarity, COUNT(uc.id)::int as count
        FROM user_cards uc
        JOIN pokemon_cards pc ON uc.card_id = pc.id
        WHERE uc.user_id = $1
        GROUP BY pc.rarity
        ORDER BY count DESC
      `,
      args: [userId],
    });

    return result.rows;
  } catch (error) {
    console.error("Error en getRarityDistribution:", error);
    throw new Error("Failed to fetch rarity distribution");
  }
}


  /**
   * Calcula el progreso de completitud de cada set
   */
  async getSetCompletion(userId: number): Promise<SetCompletion[]> {
  try {
    const result = await client.queryObject<{
      set_name: string;
      owned: number;
      total: number;
    }>({
      text: `
        SELECT 
      pc.expansion AS set_name,
      COUNT(DISTINCT uc.card_id)::int AS owned,
      MAX(pc.set_total_cards)::int AS total
    FROM user_cards uc
    JOIN pokemon_cards pc ON uc.card_id = pc.id
    WHERE uc.user_id = $1
    GROUP BY pc.expansion
      `,
      args: [userId],
    });
    console.log("getSetCompletion result:", result.rows);
    // Si no hay filas, devolver array vacío (para evitar errores en frontend)
    return result.rows ?? [];
  } catch (error) {
    console.error("Error en getSetCompletion:", error);
    // En lugar de lanzar error, devolver array vacío para que frontend no falle
    return [];
  }
}


  /**
   * Obtiene estadísticas combinadas (para minimizar llamadas a la API)
   */
  async getUserCollectionStats(userId: number) {
    try {
      const [types, rarities, sets] = await Promise.all([
        this.getCardTypeDistribution(userId),
        this.getRarityDistribution(userId),
        this.getSetCompletion(userId),
      ]);

      return {
        cardTypes: types,
        rarities,
        setCompletion: sets,
      };
    } catch (error) {
      console.error("Error en getUserCollectionStats:", error);
      throw new Error("Failed to fetch collection statistics");
    }
  }

async updateAllSetTotals() {
  const cards = await client.queryObject<{ id: string }>(`
    SELECT id FROM pokemon_cards WHERE set_total_cards IS NULL
  `);

  for (const card of cards.rows) {
    try {
      const apiCard = await this.tcgApi.getCard(card.id);
      const setTotal = apiCard.set?.printedTotal ?? apiCard.set?.total ?? null;

      if (setTotal !== null) {
        await client.queryObject(`
          UPDATE pokemon_cards SET set_total_cards = $1 WHERE id = $2
        `, [setTotal, card.id]);
        console.log(`Updated set_total_cards for card ${card.id}: ${setTotal}`);
      } else {
        console.log(`No set total found for card ${card.id}`);
      }
    } catch (error) {
      console.error(`Error updating card ${card.id}:`, error);
    }
  }
}

  /**
   * Obtiene datos de una carta específica (con cache en PostgreSQL)
   */
  private async getCardData(cardId: string) {
  try {
    // 1. Intenta obtener de la base de datos local primero
    const localResult = await client.queryObject<{
      id: string;
      name: string;
      type: string;
      rarity: string;
      expansion: string;
      image_url: string;
      set_total_cards: number | null;
    }>({
      text: "SELECT * FROM pokemon_cards WHERE id = $1",
      args: [cardId],
    });

    if (localResult.rows.length > 0) {
      return localResult.rows[0];
    }

    // 2. Si no existe, consulta la API externa
    const apiCard = await this.tcgApi.getCard(cardId);

    // 3. Obtener total de cartas del set desde la API
    const setTotal = apiCard.set?.printedTotal ?? apiCard.set?.total ?? null;

    // 4. Guardar en base de datos
    await client.queryObject({
  text: `
    INSERT INTO pokemon_cards 
      (id, name, type, rarity, expansion, image_url, set_total_cards)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      type = EXCLUDED.type,
      rarity = EXCLUDED.rarity,
      expansion = EXCLUDED.expansion,
      image_url = EXCLUDED.image_url,
      set_total_cards = EXCLUDED.set_total_cards
  `,
  args: [
    apiCard.id,
    apiCard.name,
    apiCard.types?.join(", "),
    apiCard.rarity,
    apiCard.set?.name,
    apiCard.images?.small,
    setTotal,
  ],
});

    return {
      id: apiCard.id,
      name: apiCard.name,
      type: apiCard.types?.join(", "),
      rarity: apiCard.rarity,
      expansion: apiCard.set?.name,
      image_url: apiCard.images?.small,
      set_total_cards: setTotal,
    };
  } catch (error) {
    console.error(`Error fetching card ${cardId}:`, error);
    return null;
  }
}


}