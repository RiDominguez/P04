import { RouterContext } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { cardSchema } from "../../schemas/cardSchema.ts";
import { client } from "../db/db.ts";
import { TcgApiService } from "../services/tcgapi.ts";

const tcgService = new TcgApiService();
const API_KEY = "78489cba-a572-4c4f-b280-07faee60dd02";

export const addUserCard = async (ctx: RouterContext<"/users/:userId/cards">) => {
  const { userId } = ctx.params;
  const currentUserId = ctx.state.userId;

  if (Number(userId) !== currentUserId) {
    ctx.throw(403, "Solo puedes añadir cartas a tu propia colección");
  }

  try {
    const body = ctx.request.body({ type: "json" });
    const value = await body.value;
    const validatedData = cardSchema.parse(value);

    let cardId: number;

    if (validatedData.official_id) {
      const result = await client.queryObject<{ id: number }>(
        `SELECT id FROM pokemon_cards WHERE official_id = $1`,
        [validatedData.official_id]
      );

      if (result.rows.length > 0) {
        cardId = result.rows[0].id;
      } else {
        const apiRes = await fetch(`https://api.pokemontcg.io/v2/cards/${validatedData.official_id}`, {
          headers: { "X-Api-Key": API_KEY },
        });

        if (!apiRes.ok) ctx.throw(400, "No se pudo obtener la carta de la API");

        const apiData = await apiRes.json();
        const card = apiData.data;

        const insertRes = await client.queryObject<{ id: number }>(
          `INSERT INTO pokemon_cards (name, rarity, type, expansion, official_id)
           VALUES ($1, $2, $3, $4, $5) RETURNING id`,
          [card.name, card.rarity, card.types?.[0], card.set.name, validatedData.official_id]
        );

        cardId = insertRes.rows[0].id;
      }
    } else {
      if (validatedData.card_id === undefined) {
        ctx.throw(400, "El campo card_id es requerido si no se proporciona official_id");
      }
      cardId = validatedData.card_id;
    }

    const insertUserCard = await client.queryObject<{ id: number }>(
      `INSERT INTO user_cards (user_id, card_id, condition, is_for_trade)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [userId, cardId, validatedData.condition, validatedData.is_for_trade]
    );

    ctx.response.status = 201;
    ctx.response.body = {
      id: insertUserCard.rows[0].id,
      message: "Carta añadida correctamente al inventario",
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes("foreign key constraint")) {
      ctx.throw(404, "La carta especificada no existe");
    }
    ctx.throw(500, error instanceof Error ? error.message : "Unknown error");
  }
};

export const updateUserCard = async (ctx: RouterContext<"/users/:userId/cards/:cardId">) => {
  const { userId, cardId } = ctx.params;
  const currentUserId = ctx.state.userId;

  if (Number(userId) !== currentUserId) {
    ctx.throw(403, "Solo puedes modificar cartas de tu propia colección");
  }

  try {
    const body = ctx.request.body({ type: "json" });
    const value = await body.value;
    const validatedData = cardSchema.partial().parse(value);

    const userCardCheck = await client.queryObject<{ id: number }>(
      `SELECT id FROM user_cards WHERE id = $1 AND user_id = $2`,
      [cardId, userId]
    );

    if (userCardCheck.rows.length === 0) {
      ctx.throw(404, "La carta no existe en tu colección");
    }

    const updateFields = [];
    const updateValues = [];
    let paramCount = 1;

    if (validatedData.condition !== undefined) {
      updateFields.push(`condition = $${paramCount++}`);
      updateValues.push(validatedData.condition);
    }
    if (validatedData.is_for_trade !== undefined) {
      updateFields.push(`is_for_trade = $${paramCount++}`);
      updateValues.push(validatedData.is_for_trade);
    }

    if (updateFields.length === 0) {
      ctx.throw(400, "No se proporcionaron campos para actualizar");
    }

    updateValues.push(cardId, userId);

    await client.queryObject(
      `UPDATE user_cards 
       SET ${updateFields.join(", ")} 
       WHERE id = $${paramCount++} AND user_id = $${paramCount++}`,
      updateValues
    );

    ctx.response.status = 200;
    ctx.response.body = { message: "Carta actualizada correctamente" };
  } catch (error) {
    ctx.throw(500, error instanceof Error ? error.message : "Unknown error");
  }
};

export const deleteUserCard = async (ctx: RouterContext<"/users/:userId/cards/:cardId">) => {
  const { userId, cardId } = ctx.params;
  const currentUserId = ctx.state.userId;

  if (Number(userId) !== currentUserId) {
    ctx.throw(403, "Solo puedes eliminar cartas de tu propia colección");
  }

  try {
    const userCardCheck = await client.queryObject<{ id: number }>(
      `SELECT id FROM user_cards WHERE id = $1 AND user_id = $2`,
      [cardId, userId]
    );

    if (userCardCheck.rows.length === 0) {
      ctx.throw(404, "La carta no existe en tu colección");
    }

    await client.queryObject(
      `DELETE FROM user_cards WHERE id = $1 AND user_id = $2`,
      [cardId, userId]
    );

    ctx.response.status = 200;
    ctx.response.body = { message: "Carta eliminada correctamente de tu colección" };
  } catch (error) {
    ctx.throw(500, error instanceof Error ? error.message : "Unknown error");
  }
};

export const getUserCards = async (ctx: RouterContext<"/users/:userId/cards">) => {
  const { userId } = ctx.params;
  const currentUserId = ctx.state.userId;

  if (Number(userId) !== currentUserId) {
    ctx.throw(403, "Solo puedes ver tu propio inventario");
  }

  try {
    const result = await client.queryObject<{
      id: number;
      name: string;
      rarity: string;
      type: string;
      expansion: string;
      official_id: string;
      condition: string;
      is_for_trade: boolean;
    }>(
      `SELECT uc.id, pc.name, pc.rarity, pc.type, pc.expansion, pc.official_id, uc.condition, uc.is_for_trade
       FROM user_cards uc
       JOIN pokemon_cards pc ON uc.card_id = pc.id
       WHERE uc.user_id = $1`,
      [userId]
    );

    const cardsWithPrices = await Promise.all(result.rows.map(async (card) => {
      let price = null;
      try {
        const apiCard = await tcgService.getCard(card.official_id);
        price = apiCard.tcgplayer?.prices?.holofoil?.market
             ?? apiCard.tcgplayer?.prices?.normal?.market
             ?? apiCard.tcgplayer?.prices?.reverseHolofoil?.market
             ?? null;
      } catch (_) {}
      return { ...card, market_price: price };
    }));

    ctx.response.status = 200;
    ctx.response.body = { cards: cardsWithPrices };
  } catch (error) {
    console.error(error);
    ctx.throw(500, "Error al obtener las cartas");
  }
};

export const getCardsForTrade = async (ctx: RouterContext<"/users/:userId/trade-cards">) => {
  const { userId } = ctx.params;
  const currentUserId = ctx.state.userId;

  if (Number(userId) !== currentUserId) {
    ctx.throw(403, "Solo puedes ver tus propias cartas para intercambio");
  }

  try {
    const result = await client.queryObject<{
      id: number;
      name: string;
      rarity: string;
      type: string;
      expansion: string;
      official_id: string;
      condition: string;
      is_for_trade: boolean;
    }>(
      `SELECT uc.id, pc.name, pc.rarity, pc.type, pc.expansion, pc.official_id, uc.condition, uc.is_for_trade
       FROM user_cards uc
       JOIN pokemon_cards pc ON uc.card_id = pc.id
       WHERE uc.user_id = $1 AND uc.is_for_trade = true`,
      [userId]
    );

    const cardsWithPrices = await Promise.all(result.rows.map(async (card) => {
      let price = null;
      try {
        const apiCard = await tcgService.getCard(card.official_id);
        price = apiCard.tcgplayer?.prices?.holofoil?.market
             ?? apiCard.tcgplayer?.prices?.normal?.market
             ?? apiCard.tcgplayer?.prices?.reverseHolofoil?.market
             ?? null;
      } catch (_) {}
      return { ...card, market_price: price };
    }));

    ctx.response.status = 200;
    ctx.response.body = { cards: cardsWithPrices };
  } catch (error) {
    console.error(error);
    ctx.throw(500, "Error al obtener cartas para intercambio");
  }
};

