// middleware/authMiddleware.ts
import { Context, Next } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { verify } from "https://deno.land/x/djwt/mod.ts"; // Asegúrate de usar una librería JWT válida
import { config } from "https://deno.land/x/dotenv/mod.ts";

const env = config();
const secretKey = env.JWT_SECRET_KEY?.trim();
console.log("Clave secreta:", `"${secretKey}"`);
export const authMiddleware = async (ctx: Context, next: Next) => {
  const authHeader = ctx.request.headers.get("Authorization");
  if (!authHeader) {
    ctx.throw(401, "Token no proporcionado");
  }
  console.log("Auth header:", authHeader);
  const token = authHeader.replace("Bearer ", "");
  
  try {
    const encoder = new TextEncoder();
    const keyBuf = encoder.encode(secretKey);
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyBuf,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const payload = await verify(token, cryptoKey); 
    ctx.state.userId = payload.id; 
    console.log("Middleware - userId en ctx.state:", ctx.state.userId);
    await next();
    console.log("AuthMiddleware: usuario autorizado, userId:", ctx.state.userId);
  } catch (_error) {
    ctx.throw(401, "Token inválido");
  }
};