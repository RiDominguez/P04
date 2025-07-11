import { config } from "https://deno.land/x/dotenv/mod.ts"; // Solo se usará en desarrollo
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { client } from "../db/db.ts";
import { z } from "https://deno.land/x/zod/mod.ts";
import { RouterContext } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { create, getNumericDate } from "https://deno.land/x/djwt@v3.0.2/mod.ts";

// Cargar variables del .env solo si no estás en producción
if (Deno.env.get("ENV") !== "production") {
  config();
}

const secretKey = Deno.env.get("JWT_SECRET_KEY")?.trim();
console.log("Clave secreta:", `"${secretKey}"`);
if (!secretKey) {
  console.error("❌ JWT_SECRET_KEY no está definida");
}

const userSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

export const getUsers = async (ctx: RouterContext<"/users">) => {
  try {
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
    const { value } = await ctx.request.body({ type: "json" });
    const validatedData = userSchema.parse(value);

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
    ctx.throw(500, error.message || "Internal Server Error");
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

const convertToCryptoKey = async (secretKey: string): Promise<CryptoKey> => {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secretKey);
  return await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
};

export const loginUser = async (ctx: RouterContext<"/login">) => {
  try {
    const body = ctx.request.body({ type: "json" });
    const value = await body.value;
    const { email, password } = loginSchema.parse(value);

    const result = await client.queryObject<{
      id: number;
      username: string;
      password_hash: string;
      email: string;
    }>(
      "SELECT id, username, password_hash, email FROM users WHERE email = $1 LIMIT 1",
      [email]
    );

    if (result.rows.length === 0) {
      ctx.throw(401, "Invalid email or password");
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      ctx.throw(401, "Invalid email or password");
    }

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      exp: getNumericDate(60 * 60), 
    };
    const cryptoKey = await convertToCryptoKey(secretKey!);
    const token = await create({ alg: "HS256", typ: "JWT" }, payload, cryptoKey);

    ctx.response.body = {
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      ctx.throw(400, error.errors.map(e => e.message).join(", "));
    }
    ctx.throw(500, error.message || "Internal Server Error");
  }
};



export const registerUser = async (ctx: RouterContext<"/register">) => {
  try {
    const { value } = await ctx.request.body({ type: "json" });
    const { username, email, password } = registerSchema.parse(value);

    const existing = await client.queryObject(
      "SELECT 1 FROM users WHERE username = $1 OR email = $2 LIMIT 1",
      [username, email]
    );

    if (existing.rows.length > 0) {
      ctx.throw(409, "Username or email already exists");
    }

    const hashedPassword = await bcrypt.hash(password);
    const result = await client.queryObject<{ id: number }>(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id",
      [username, email, hashedPassword]
    );

    ctx.response.status = 201;
    ctx.response.body = {
      id: result.rows[0].id,
      message: "User created successfully",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      ctx.throw(400, error.errors.map(e => e.message).join(", "));
    }
    ctx.throw(500, error.message || "Internal Server Error");
  }
};


