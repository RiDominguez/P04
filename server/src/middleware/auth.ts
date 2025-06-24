import { Context, Next } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { verify } from "https://deno.land/x/djwt@v3.0.2/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

/** Cargar variables del .env solo en desarrollo */
if (Deno.env.get("ENV") !== "production") {
  config();                // lee .env en local
}

const secretKey = Deno.env.get("JWT_SECRET_KEY")?.trim();
if (!secretKey) {
  console.error("❌ JWT_SECRET_KEY no está definida");
}

/** Middleware de autenticación JWT */
export const authMiddleware = async (ctx: Context, next: Next) => {
  const authHeader = ctx.request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ctx.throw(401, "Token no proporcionado");
  }

  const token = authHeader.replace("Bearer ", "");
  try {
    // Convertir clave a CryptoKey
    const keyBytes = new TextEncoder().encode(secretKey);
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyBytes,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );

    // Verificar y extraer payload
    const payload = await verify(token, cryptoKey);
    ctx.state.userId = (payload as { id: number }).id;

    await next(); // continuar a la siguiente ruta
  } catch (_err) {
    ctx.throw(401, "Token inválido o expirado");
  }
};
