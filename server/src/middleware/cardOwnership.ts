import { RouterMiddleware } from "https://deno.land/x/oak/mod.ts";
import { client } from "../db/db.ts";

export const cardOwnership: RouterMiddleware<"/users/:userId/cards/:cardId"> = async (ctx, next) => {
  const { userId: _userId, cardId } = ctx.params;
  const currentUserId = ctx.state.userId;

  const result = await client.queryObject(
    "SELECT 1 FROM user_cards WHERE id = $1 AND user_id = $2",
    [cardId, currentUserId]
  );

  if (result.rows.length === 0) {
    ctx.throw(403, "No tienes permiso para modificar esta carta");
  }

  await next();
};