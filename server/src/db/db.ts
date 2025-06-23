import { Client } from "https://deno.land/x/postgres/mod.ts";

const user = Deno.env.get("DB_USER");
const database = Deno.env.get("DB_NAME");
const password = Deno.env.get("DB_PASSWORD");
const hostname = Deno.env.get("DB_HOST");
const port = Number(Deno.env.get("DB_PORT") ?? 5432);

// Validación
if (!user || !database || !hostname || !password) {
  throw new Error("Faltan variables de entorno requeridas (DB_USER, DB_NAME, etc.)");
}

export const client = new Client({
  user,
  database,
  password,
  hostname,
  port,
});

export const connectDB = async () => {
  try {
    await client.connect();
    console.log("Conexión exitosa a PostgreSQL");
  } catch (error) {
    console.error("Error al conectar a PostgreSQL:", error instanceof Error ? error.message : error);
    throw error;
  }
};

export const closeDB = async () => {
  try {
    await client.end();
    console.log("Conexión cerrada");
  } catch (error) {
    console.error("Error al cerrar la conexión:", error instanceof Error ? error.message : error);
  }
};

