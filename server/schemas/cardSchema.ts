import { z } from "https://deno.land/x/zod/mod.ts";

export const cardSchema = z.object({
  card_id: z.number().optional(),
  official_id: z.string().optional(),
  condition: z.string(),
  is_for_trade: z.boolean(),
});
