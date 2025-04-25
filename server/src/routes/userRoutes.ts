import { Router } from "https://deno.land/x/oak/mod.ts";
import {
  getUsers,
  getUserById,
  createUser,
  deleteUser,
} from "../controllers/userController.ts";

const userRouter = new Router();

// Configuración correcta con métodos encadenados
userRouter
  .get("/users", getUsers)          // GET /users
  .get("/users/:id", getUserById)   // GET /users/:id
  .post("/users", createUser)       // POST /users
  .delete("/users/:id", deleteUser); // DELETE /users/:id

export default userRouter;