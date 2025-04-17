import { Application } from "https://deno.land/x/oak/mod.ts";
import userRouter from "./routes/userRoutes.ts";
import { connectDB } from "./db/db.ts";

const PORT = 8000;
const app = new Application();

app.use(async (ctx, next) => {
  ctx.response.headers.set("Content-Type", "application/json");
  await next();
});

// Conexión a DB
await connectDB();

// Rutas
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());

// Ruta de prueba
app.use((ctx) => {
  if (ctx.request.url.pathname === "/") {
    ctx.response.body = { message: "API de Usuarios" };
  }
});

console.log(`Servidor en http://localhost:${PORT}`);
await app.listen({ port: PORT });
