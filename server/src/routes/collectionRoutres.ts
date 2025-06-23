  import { Router } from "https://deno.land/x/oak/mod.ts";
  import {
    createCollection,
    getUserCollections,
    deleteCollection,
    addCardToCollection,
    deleteCardFromCollection,
    getCollectionCards,
  } from "../controllers/collectionController.ts";
  import { authMiddleware } from "../middleware/auth.ts";

  const collectionRouter = new Router();

  collectionRouter
    .post("/users/:userId/collections", authMiddleware, createCollection)
    .get("/users/:userId/collections", authMiddleware, getUserCollections)
    .delete("/users/:userId/collections/:collectionId", authMiddleware, deleteCollection)
    .post("/users/:userId/collections/:collectionId/cards", authMiddleware, addCardToCollection)
    .delete("/users/:userId/collections/:collectionId/cards/:cardId", authMiddleware, deleteCardFromCollection)
    .get("/collections/:collectionId/cards", authMiddleware, getCollectionCards);
  export default collectionRouter;