import { Application, Router, Context } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { connectDB } from "./db/db.ts";
import userRouter from "./routes/userRoutes.ts";
import cardRoutes from "./routes/cardRoutes.ts";
import uploadRouter from "./routes/upload.ts";
import collectionRouter from "./routes/collectionRoutres.ts";
import { createStatsRoutes } from "./routes/statRoutes.ts";

// 🔧 Puerto dinámico para producción
const PORT = Number(Deno.env.get("PORT")) || 8000;
const FRONTEND_ORIGIN = Deno.env.get("FRONTEND_ORIGIN") || "*";

const app = new Application();

// ✅ Middleware CORS (permitir origen configurable)
app.use(
  oakCors({
    origin: FRONTEND_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
  })
);

// ✅ Middleware para responder OPTIONS (preflight)
app.use(async (ctx, next) => {
  console.log(`METHOD: ${ctx.request.method} URL: ${ctx.request.url}`);
  if (ctx.request.method === "OPTIONS") {
    ctx.response.status = 204;
    return;
  }
  await next();
});

// ✅ Middleware de autenticación (puedes ajustar o hacer condicional por ruta)
app.use(async (ctx: Context, next) => {
  const authHeader = ctx.request.headers.get("Authorization");
  if (!authHeader) {
    await next(); // permite acceso a rutas públicas
    return;
  }

  if (!authHeader.startsWith("Bearer ")) {
    ctx.response.status = 401;
    ctx.response.body = { error: "Token inválido" };
    return;
  }

  const token = authHeader.substring(7);
  try {
    // Aquí deberías verificar tu JWT real (usando djwt o similar)
    // const payload = await verify(token, secretKey, "HS256");
    ctx.state.user = { id: 6 }; // reemplazar con el payload real
    await next();
  } catch (_e) {
    ctx.response.status = 401;
    ctx.response.body = { error: "Token inválido o expirado" };
  }
});

// ✅ Conexión a la base de datos (usa DATABASE_URL como variable de entorno)
await connectDB();

// ✅ Rutas
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());

app.use(cardRoutes.routes());
app.use(cardRoutes.allowedMethods());

app.use(uploadRouter.routes());
app.use(uploadRouter.allowedMethods());

app.use(collectionRouter.routes());
app.use(collectionRouter.allowedMethods());

app.use(createStatsRoutes().routes());
app.use(createStatsRoutes().allowedMethods());

// ✅ Inicio del servidor
console.log(`Servidor corriendo en http://localhost:${PORT}`);
await app.listen({ port: PORT });

