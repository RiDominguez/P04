import { RouterContext } from "https://deno.land/x/oak/mod.ts";
import { z } from "https://deno.land/x/zod/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { client } from "../db/db.ts";

const userSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

export const getUsers = async (ctx: RouterContext<"/users">) => {
  try {
    // Tipado del resultado: array de objetos con id (number), username y email (strings)
    const result = await client.queryObject<{ 
      id: number; 
      username: string; 
      email: string;
    }>(
      "SELECT id, username, email FROM users ORDER BY id DESC LIMIT 100"
    );

    ctx.response.body = result.rows;
  } catch (error) {
    console.error("Error en getUsers:", error);
    ctx.throw(500, "Error al obtener usuarios");
  }
};

export const getUserById = async (ctx: RouterContext<"/users/:id">) => {
  const { id } = ctx.params;
  
  if (!id || isNaN(Number(id))) {
    ctx.throw(400, "ID de usuario inválido");
  }

  try {
    const result = await client.queryObject<{
      id: number;
      username: string;
      email: string;
    }>(
      "SELECT id, username, email FROM users WHERE id = $1",
      [id]
    );
    
    if (result.rows.length === 0) {
      ctx.throw(404, "Usuario no encontrado");
    }
    
    ctx.response.body = result.rows[0]; 
  } catch (error) {
    console.error(`Error en getUserById (ID: ${id}):`, error);
    ctx.throw(500, "Error al obtener usuario");
  }
};

export const createUser = async (ctx: RouterContext<"/users">) => {
  try {
    const body = await ctx.request.body.json();
    const validatedData = userSchema.parse(body);

  
    const existing = await client.queryObject(
      "SELECT 1 FROM users WHERE username = $1 OR email = $2 LIMIT 1",
      [validatedData.username, validatedData.email]
    );

    if (existing.rows.length > 0) {
      ctx.throw(409, "Usuario o email ya existente");
    }

    const result = await client.queryObject<{ id: number }>(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id",
      [validatedData.username, validatedData.email, await bcrypt.hash(validatedData.password)]
    );

    ctx.response.status = 201;
    ctx.response.body = {
      id: Number(result.rows[0].id), 
      message: "Usuario creado"
    };

  } catch (error) {
    if (error instanceof z.ZodError) {
      ctx.throw(400, error.errors.map(e => e.message).join(", "));
    }
    ctx.throw(500, error.message);
  }
};

export const deleteUser = async (ctx: RouterContext<"/users/:id">) => {
  const { id } = ctx.params;
  
  if (!id || isNaN(Number(id))) {
    ctx.throw(400, "ID de usuario inválido");
  }

  try {
    const result = await client.queryObject<{ id: number }>(
      "DELETE FROM users WHERE id = $1 RETURNING id",
      [id]
    );
    
    if (result.rows.length === 0) {
      ctx.throw(404, "Usuario no encontrado");
    }
    
    ctx.response.status = 204; 
  } catch (error) {
    console.error(`Error en deleteUser (ID: ${id}):`, error);
    ctx.throw(500, "Error al eliminar usuario");
  }
};
