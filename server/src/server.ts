import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import userRouter from "./routes/userRoutes.ts";
import cardRoutes from "./routes/cardRoutes.ts";
import { connectDB } from "./db/db.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import uploadrouter from "./routes/upload.ts";



const PORT = 8000;
const app = new Application();

app.use(oakCors());

app.use(async (ctx, next) => {
  ctx.response.headers.set("Content-Type", "application/json");
  await next();
});

// Conexión a DB
await connectDB();


// Rutas
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());
app.use(cardRoutes.routes());
app.use(cardRoutes.allowedMethods());
app.use(uploadrouter.routes());
app.use(uploadrouter.allowedMethods());

// Ruta de prueba
app.use((ctx) => {
  if (ctx.request.url.pathname === "/") {
    ctx.response.body = { message: "API de Usuarios" };
  }
});

console.log(`Servidor en http://localhost:${PORT}`);
await app.listen({ port: PORT });
