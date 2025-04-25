import { RouterContext } from "https://deno.land/x/oak/mod.ts";
import { cardSchema } from "../../schemas/cardSchema.ts";
import { client } from "../db/db.ts";

// Obtener todas las cartas de un usuario
export const getUserCards = async (ctx: RouterContext<"/users/:userId/cards">) => {
  const { userId } = ctx.params;

  try {
    const result = await client.queryObject<{
      id: number;
      card_id: number;
      condition: string;
      is_for_trade: boolean;
    }>(
      `SELECT uc.id, uc.card_id, uc.condition, uc.is_for_trade, pc.name, pc.type 
       FROM user_cards uc
       JOIN pokemon_cards pc ON uc.card_id = pc.id
       WHERE uc.user_id = $1`,
      [userId]
    );

    ctx.response.body = result.rows;
  } catch (error) {
    ctx.throw(500, "Error al obtener las cartas del usuario");
  }
};

// Añadir carta a un usuario
export const addUserCard = async (ctx: RouterContext<"/users/:userId/cards">) => {
  const { userId } = ctx.params;
  const currentUserId = ctx.state.userId; // Del middleware auth

  if (Number(userId) !== currentUserId) {
    ctx.throw(403, "Solo puedes añadir cartas a tu propia colección");
  }

  try {
    const body = await ctx.request.body.json();
    const validatedData = cardSchema.parse(body);

    const result = await client.queryObject<{ id: number }>(
      `INSERT INTO user_cards 
       (user_id, card_id, condition, is_for_trade) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id`,
      [userId, validatedData.card_id, validatedData.condition, validatedData.is_for_trade]
    );

    ctx.response.status = 201;
    ctx.response.body = {
      id: result.rows[0].id,
      message: "Carta añadida a la colección"
    };
  } catch (error) {
    if (error.message.includes("foreign key constraint")) {
      ctx.throw(404, "La carta especificada no existe");
    }
    ctx.throw(500, error.message);
  }
};