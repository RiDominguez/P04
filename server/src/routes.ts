import { Router } from "./deps.ts"; 
import { getCardsFromAPI } from "./services/pokemon.ts";

const router = new Router();

// ejemplo
router.get("/api/hello", (context) => {
  context.response.body = { message: "backend con deno" };
});

// rutas
router.get("/api/pokedex", (context) => {
  context.response.body = { message: "info pokdex" };
});

router.get("/api/pokemon/cards", getCardsFromAPI);

export { router };
