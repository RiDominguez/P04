import { RouterContext } from "https://deno.land/x/oak/mod.ts";
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

// Agregar carta a una colección
export const addCardToCollection = async (
  context: RouterContext<"/users/:userId/collections/:collectionId/cards">
) => {
  const collectionId = context.params.collectionId;
  const { cardId } = await context.request.body.json();

  await client.queryObject(
    "INSERT INTO collection_cards (collection_id, card_id) VALUES ($1, $2)",
    [collectionId, cardId]
  );

  context.response.status = 201;
  context.response.body = { message: "Carta agregada a la colección" };
};

// Obtener cartas de una colección
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
    image_url: string;
  }>(
    `SELECT pc.* 
     FROM pokemon_cards pc
     JOIN collection_cards cc ON pc.id = cc.card_id
     WHERE cc.collection_id = $1`,
    [collectionId]
  );

  context.response.body = result.rows;
};

export const deleteCollection = async (
  context: RouterContext<"/users/:userId/collections/:collectionId">
) => {
  const collectionId = context.params.collectionId;

  // Primero eliminamos las relaciones en collection_cards
  await client.queryObject(
    "DELETE FROM collection_cards WHERE collection_id = $1",
    [collectionId]
  );

  // Luego eliminamos la colección
  await client.queryObject(
    "DELETE FROM collections WHERE id = $1",
    [collectionId]
  );

  context.response.status = 200;
  context.response.body = { message: "Colección eliminada" };
};

export const deleteCardFromCollection = async (
  context: RouterContext<"/users/:userId/collections/:collectionId/cards/:cardId">
) => {
  const { collectionId, cardId } = context.params;

  await client.queryObject(
    "DELETE FROM collection_cards WHERE collection_id = $1 AND card_id = $2",
    [collectionId, cardId]
  );

  context.response.status = 200;
  context.response.body = { message: "Carta eliminada de la colección" };
};
