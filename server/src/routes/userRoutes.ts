import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import {
  getUsers,
  getUserById,
  createUser,
  deleteUser,
  loginUser,
  registerUser,
} from "../controllers/userController.ts";

const userRouter = new Router();

// Configuración correcta con métodos encadenados
userRouter
  .get("/users", getUsers)          // GET /users
  .get("/users/:id", getUserById)   // GET /users/:id
  .post("/users", createUser)       // POST /users
  .delete("/users/:id", deleteUser) // DELETE /users/:id
  .post("/login", loginUser) // POST /login
  .post("/register", registerUser); // POST /register

export default userRouter;