import { RouterContext } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { client } from "../db/db.ts";

// Crear nueva colección
export const createCollection = async (
  context: RouterContext<"/users/:userId/collections">
) => {
  const userId = context.params.userId;
  const { name } = await context.request.body.json();

  const result = await client.queryObject<{ id: number }>(
    "INSERT INTO collections (user_id, name) VALUES ($1, $2) RETURNING id",
    [userId, name]
  );

  context.response.status = 201;
  context.response.body = {
    message: "Colección creada",
    collectionId: result.rows[0].id,
  };
};

// Obtener todas las colecciones de un usuario
export const getUserCollections = async (
  context: RouterContext<"/users/:userId/collections">
) => {
  const userId = context.params.userId;

  const result = await client.queryObject<{
    id: number;
    name: string;
  }>(
    "SELECT id, name FROM collections WHERE user_id = $1",
    [userId]
  );

  context.response.body = result.rows;
};

// Agregar carta (de user_cards) a una colección
export const addCardToCollection = async (
  context: RouterContext<"/users/:userId/collections/:collectionId/cards">
) => {
  const userId = context.params.userId;
  const collectionId = context.params.collectionId;
  const { user_card_id } = await context.request.body.json();

  // Validar que esa carta es del usuario
  const check = await client.queryObject(
    "SELECT 1 FROM user_cards WHERE id = $1 AND user_id = $2",
    [user_card_id, userId]
  );

  if (check.rowCount === 0) {
    context.throw(403, "Esa carta no te pertenece");
  }

  // Insertar en la colección
  await client.queryObject(
    "INSERT INTO collection_cards (collection_id, user_card_id) VALUES ($1, $2)",
    [collectionId, user_card_id]
  );

  context.response.status = 201;
  context.response.body = { message: "Carta agregada a la colección" };
};

// Obtener cartas de una colección (con info personalizada)
export const getCollectionCards = async (
  context: RouterContext<"/collections/:collectionId/cards">
) => {
  const collectionId = context.params.collectionId;

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
    `SELECT uc.id, pc.name, pc.rarity, pc.type, pc.expansion, pc.official_id,
            uc.condition, uc.is_for_trade
     FROM collection_cards cc
     JOIN user_cards uc ON cc.user_card_id = uc.id
     JOIN pokemon_cards pc ON uc.card_id = pc.id
     WHERE cc.collection_id = $1`,
    [collectionId]
  );

  context.response.body = { cards: result.rows };
};

// Eliminar colección completa
export const deleteCollection = async (
  context: RouterContext<"/users/:userId/collections/:collectionId">
) => {
  const collectionId = context.params.collectionId;

  await client.queryObject(
    "DELETE FROM collection_cards WHERE collection_id = $1",
    [collectionId]
  );

  await client.queryObject(
    "DELETE FROM collections WHERE id = $1",
    [collectionId]
  );

  context.response.status = 200;
  context.response.body = { message: "Colección eliminada" };
};

// Eliminar carta de una colección
export const deleteCardFromCollection = async (
  context: RouterContext<"/users/:userId/collections/:collectionId/cards/:cardId">
) => {
  const { collectionId, cardId } = context.params;

  await client.queryObject(
    "DELETE FROM collection_cards WHERE collection_id = $1 AND user_card_id = $2",
    [collectionId, cardId]
  );

  context.response.status = 200;
  context.response.body = { message: "Carta eliminada de la colección" };
};
