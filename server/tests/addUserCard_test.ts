/// <reference lib="deno.ns" />

import {
  assertEquals,
  assertRejects,
} from "https://deno.land/std@0.224.0/testing/asserts.ts";
import { getCardsForTrade } from "../src/controllers/userCardController.ts";
import { createMockContext } from "./helpers/mockContext.ts";
import { client } from "../src/db/db.ts";

// Mock para datos de cartas
const mockCards = [
  {
    id: 1,
    name: "Pikachu",
    rarity: "Common",
    type: "Electric",
    expansion: "Base Set",
    official_id: "base1-58",
    condition: "good",
    is_for_trade: true,
  },
];

// Mock para query de base de datos
import * as db from "../src/db/db.ts";
const originalQueryObject = db.client.queryObject;
db.client.queryObject = async <T>() =>
  ({ rows: mockCards }) as any;

// Mock para tcgapi
import * as service from "../src/services/tcgapi.ts";
const originalGetCard = service.TcgApiService.prototype.getCard;
service.TcgApiService.prototype.getCard = async () =>
  ({ tcgplayer: { prices: { normal: { market: 1.9 } } } }) as any;

// Desactivamos limpieza automática de recursos
Deno.test({
  name: "Devuelve correctamente las cartas para intercambio con precios",
  sanitizeOps: false,
  sanitizeResources: false,
  fn: async () => {
    const ctx = createMockContext({
      userId: 6,
      params: { userId: "6" },
    });

    await getCardsForTrade(ctx);

    assertEquals(ctx.response.status, 200);
    assertEquals(Array.isArray(ctx.response.body.cards), true);
    assertEquals(ctx.response.body.cards[0].market_price, 1.9);
  },
});

Deno.test({
  name: "Lanza error si userId no coincide con token",
  fn: async () => {
    const ctx = createMockContext({
      userId: 6,
      params: { userId: "999" },
    });

    await assertRejects(
      () => getCardsForTrade(ctx),
      Error,
      "Solo puedes ver tus propias cartas para intercambio",
    );
  },
});

// Restaurar mocks después de todos los tests
db.client.queryObject = originalQueryObject;
service.TcgApiService.prototype.getCard = originalGetCard;
