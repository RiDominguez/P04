import { RouterContext } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { client } from "../db/db.ts";

/* Crear nueva colección */
export const createCollection = async (ctx: RouterContext<"/users/:userId/collections">) => {
  try {
    const userId = Number(ctx.params.userId);
    if (isNaN(userId)) ctx.throw(400, "ID de usuario inválido");

    /* 🔑 leer body correctamente */
    const body = ctx.request.body({ type: "json" });
    const { name } = await body.value;
    if (!name) ctx.throw(400, "Nombre requerido");

    const result = await client.queryObject<{ id: number }>(
      "INSERT INTO collections (user_id, name) VALUES ($1, $2) RETURNING id",
      [userId, name],
    );

    ctx.response.status = 201;
    ctx.response.body = { message: "Colección creada", collectionId: result.rows[0].id };
  } catch (err) {
    ctx.throw(500, err.message || "Error al crear colección");
  }
};

/* Obtener colecciones del usuario */
export const getUserCollections = async (ctx: RouterContext<"/users/:userId/collections">) => {
  try {
    const userId = Number(ctx.params.userId);
    if (isNaN(userId)) ctx.throw(400, "ID de usuario inválido");

    const result = await client.queryObject<{ id: number; name: string }>(
      "SELECT id, name FROM collections WHERE user_id = $1",
      [userId],
    );

    ctx.response.body = result.rows;
  } catch (err) {
    ctx.throw(500, err.message || "Error al obtener colecciones");
  }
};

/* Agregar carta a colección */
export const addCardToCollection = async (
  ctx: RouterContext<"/users/:userId/collections/:collectionId/cards">,
) => {
  try {
    const userId = Number(ctx.params.userId);
    const collectionId = Number(ctx.params.collectionId);
    if (isNaN(userId) || isNaN(collectionId)) ctx.throw(400, "IDs inválidos");

    const body = ctx.request.body({ type: "json" });
    const { user_card_id } = await body.value;
    if (!user_card_id) ctx.throw(400, "user_card_id requerido");

    /* Validar pertenencia */
    const check = await client.queryObject(
      "SELECT 1 FROM user_cards WHERE id = $1 AND user_id = $2",
      [user_card_id, userId],
    );
    if (check.rowCount === 0) ctx.throw(403, "Esa carta no te pertenece");

    await client.queryObject(
      "INSERT INTO collection_cards (collection_id, user_card_id) VALUES ($1, $2)",
      [collectionId, user_card_id],
    );

    ctx.response.status = 201;
    ctx.response.body = { message: "Carta agregada a la colección" };
  } catch (err) {
    ctx.throw(500, err.message || "Error al agregar carta");
  }
};

/* Obtener cartas de una colección */
export const getCollectionCards = async (ctx: RouterContext<"/collections/:collectionId/cards">) => {
  try {
    const collectionId = Number(ctx.params.collectionId);
    if (isNaN(collectionId)) ctx.throw(400, "ID de colección inválido");

    const result = await client.queryObject<{
      id: number; name: string; rarity: string; type: string;
      expansion: string; official_id: string; condition: string; is_for_trade: boolean;
    }>(
      `SELECT uc.id, pc.name, pc.rarity, pc.type, pc.expansion, pc.official_id,
              uc.condition, uc.is_for_trade
       FROM collection_cards cc
       JOIN user_cards uc ON cc.user_card_id = uc.id
       JOIN pokemon_cards pc ON uc.card_id = pc.id
       WHERE cc.collection_id = $1`,
      [collectionId],
    );

    ctx.response.body = { cards: result.rows };
  } catch (err) {
    ctx.throw(500, err.message || "Error al obtener cartas");
  }
};

/* Eliminar colección completa */
export const deleteCollection = async (
  ctx: RouterContext<"/users/:userId/collections/:collectionId">,
) => {
  try {
    const collectionId = Number(ctx.params.collectionId);
    if (isNaN(collectionId)) ctx.throw(400, "ID de colección inválido");

    await client.queryObject("DELETE FROM collection_cards WHERE collection_id = $1", [collectionId]);
    await client.queryObject("DELETE FROM collections WHERE id = $1", [collectionId]);

    ctx.response.status = 200;
    ctx.response.body = { message: "Colección eliminada" };
  } catch (err) {
    ctx.throw(500, err.message || "Error al eliminar colección");
  }
};

/* Eliminar carta de una colección */
export const deleteCardFromCollection = async (
  ctx: RouterContext<"/users/:userId/collections/:collectionId/cards/:cardId">,
) => {
  try {
    const collectionId = Number(ctx.params.collectionId);
    const cardId = Number(ctx.params.cardId);
    if (isNaN(collectionId) || isNaN(cardId)) ctx.throw(400, "IDs inválidos");

    await client.queryObject(
      "DELETE FROM collection_cards WHERE collection_id = $1 AND user_card_id = $2",
      [collectionId, cardId],
    );

    ctx.response.status = 200;
    ctx.response.body = { message: "Carta eliminada de la colección" };
  } catch (err) {
    ctx.throw(500, err.message || "Error al eliminar carta de la colección");
  }
};
