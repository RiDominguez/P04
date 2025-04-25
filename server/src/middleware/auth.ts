import { Context, Next } from "https://deno.land/x/oak/mod.ts";
import { verify } from "https://deno.land/x/djwt@v2.8/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

const env = config();

const secretKey = env.JWT_SECRET_KEY || "defaultSecret";

export const authMiddleware = async (ctx: Context, next: Next) => {
  const authHeader = ctx.request.headers.get("Authorization");
  
  if (!authHeader) {
    ctx.throw(401, "Token de autorización requerido");
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>

  try {
    const payload = await verify(token, secretKey, "HS256");
    ctx.state.userId = payload.userId; // Disponible en los controladores
    await next();
  } catch {
    ctx.throw(401, "Token inválido o expirado");
  }
};