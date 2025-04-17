import { z } from "https://deno.land/x/zod/mod.ts";

export const cardSchema = z.object({
  card_id: z.number().int().positive(),
  condition: z.enum(["mint", "near_mint", "played", "damaged"]),
  is_for_trade: z.boolean().default(false),
  collection_name: z.string().min(1).optional(),
});