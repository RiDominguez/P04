import { Router } from "https://deno.land/x/oak/mod.ts";
import { 
  getUserCards,
  addUserCard,
  //updateUserCard,
  //deleteUserCard
} from "../controllers/userCardController.ts";
import { authMiddleware } from "../middleware/auth.ts";
import { cardOwnership } from "../middleware/cardOwnership.ts";
import { getCardsFromAPI } from "../services/pokemon.ts"; // Importar la función para obtener cartas de Pokémon TCG

const cardRoutes = new Router();


cardRoutes
  .get("/users/:userId/cards", getUserCards)
  .post("/users/:userId/cards", addUserCard)
  .get("/cards", getCardsFromAPI) // Ruta para obtener cartas de Pokémon TCG
  .put(
    "/users/:userId/cards/:cardId",
    authMiddleware,
    cardOwnership, // Middleware específico
    //updateUserCard
  )
  .delete(
    "/users/:userId/cards/:cardId",
    cardOwnership, // Middleware específico
    //deleteUserCard
  );

export default cardRoutes;