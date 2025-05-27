import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import userRouter from "./routes/userRoutes.ts";
import cardRoutes from "./routes/cardRoutes.ts";
import { connectDB } from "./db/db.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import uploadrouter from "./routes/upload.ts";

const PORT = 8000;
const app = new Application();

//app.use(async (ctx, next) => {
  //ctx.response.headers.set("Content-Type", "application/json");
  //await next();
//});

//app.use(
  //oakCors({
    //origin: ['http://localhost:5173'],
    //allowedHeaders: ['Content-Type', 'Authorization'],
    //methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE', 'HEAD'],
    //credentials: true, 
  //})
//);

app.use((ctx, next) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "http://localhost:5173");
  ctx.response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  ctx.response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  ctx.response.headers.set("Access-Control-Allow-Credentials", "true");
  if (ctx.request.method === "OPTIONS") {
    ctx.response.status = 204;
    return;
  }
  return next();
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


console.log(`Servidor en http://localhost:${PORT}`);
await app.listen({ port: PORT });
