import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import {
  addUserCard,
  updateUserCard,
  deleteUserCard,
  getUserCards,
  getCardsForTrade,
} from "../controllers/userCardController.ts";
import { authMiddleware } from "../middleware/auth.ts";
import { getCardsFromAPI } from "../services/pokemon.ts";

const cardRouter = new Router();


cardRouter
  .post("/users/:userId/cards", authMiddleware, addUserCard)
  .put("/users/:userId/cards/:cardId",authMiddleware, updateUserCard)
  .delete("/users/:userId/cards/:cardId", authMiddleware, deleteUserCard)
  .get("/users/:userId/cards",authMiddleware, getUserCards)
  .get("/users/:userId/trade-cards", authMiddleware, getCardsForTrade)
  .get("/cards", getCardsFromAPI);

export default cardRouter;