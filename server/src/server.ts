import { Application } from "./deps.ts";  
import { oakCors } from "./deps.ts";    
import { router } from "./routes.ts";    

const app = new Application();

// CORS para hacer peticiones a otros lados
app.use(oakCors()); 

// router para las rutas
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Servidor corriendo en http://localhost:8000");

// servidor en el puerto 8000
await app.listen({ port: 8000 });