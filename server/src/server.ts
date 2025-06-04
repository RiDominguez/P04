import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import userRouter from "./routes/userRoutes.ts";
import cardRoutes from "./routes/cardRoutes.ts";
import { connectDB } from "./db/db.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import uploadrouter from "./routes/upload.ts";
import collectionRouter from "./routes/collectionRoutres.ts";

const PORT = 8000;
const app = new Application();

app.use(
  oakCors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Conexión a DB
await connectDB();


// Rutas
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());
app.use(cardRoutes.routes());
app.use(cardRoutes.allowedMethods());
app.use(uploadrouter.routes());
app.use(uploadrouter.allowedMethods());
app.use(collectionRouter.routes());
app.use(collectionRouter.allowedMethods());

console.log(`Servidor en http://localhost:${PORT}`);
await app.listen({ port: PORT });
