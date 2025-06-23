import { Application, Router, Context } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

import { connectDB } from "./db/db.ts";
import userRouter from "./routes/userRoutes.ts";
import cardRoutes from "./routes/cardRoutes.ts";
import uploadRouter from "./routes/upload.ts";
import collectionRouter from "./routes/collectionRoutres.ts";
import { createStatsRoutes } from "./routes/statRoutes.ts";

const app = new Application();

// CORS
app.use(
  oakCors({
    origin: "*", // cambia a tu dominio frontend si lo necesitas
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
  })
);

// OPTIONS preflight
app.use(async (ctx, next) => {
  if (ctx.request.method === "OPTIONS") {
    ctx.response.status = 204;
    return;
  }
  await next();
});

// Autenticación (simple)
app.use(async (ctx: Context, next) => {
  const authHeader = ctx.request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    await next(); // permitir si no hay token
    return;
  }

  const token = authHeader.slice(7);
  try {
    ctx.state.user = { id: 6 }; // simulado
    await next();
  } catch {
    ctx.response.status = 401;
    ctx.response.body = { error: "Token inválido" };
  }
});

// DB
await connectDB();

// Rutas
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

// 🔁 para Deno Deploy
console.log("Servidor corriendo en Deno Deploy");
serve(app.handle);
