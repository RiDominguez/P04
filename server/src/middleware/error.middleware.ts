import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";

export async function errorMiddleware(
  ctx: Context,
  next: () => Promise<unknown>
) {
  try {
    await next();
  } catch (err) {
    if (err instanceof Error) {
      const status = (err as { status?: number }).status || 500;
      ctx.response.status = status;
      ctx.response.body = {
        error: err.message || "Error interno del servidor",
      };
    } else {
      ctx.response.status = 500;
      ctx.response.body = {
        error: "Error interno del servidor",
      };
    }
    console.error("Error:", err);
  }
}