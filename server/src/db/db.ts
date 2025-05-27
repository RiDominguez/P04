import { config } from "https://deno.land/x/dotenv/mod.ts";
import { Client } from "https://deno.land/x/postgres/mod.ts";

const env = config(); //si falta el .env

const requiredVars = ["DB_USER", "DB_NAME", "DB_HOST"];
for (const varName of requiredVars) {
  if (!env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
}

export const client = new Client({
  user: env.DB_USER,
  database: env.DB_NAME,
  password: env.DB_PASSWORD,
  hostname: env.DB_HOST,
  port: env.DB_PORT ? Number(env.DB_PORT) : 5432,
});

export const connectDB = async () => {
  try {
    await client.connect();
    console.log("Conexión exitosa a PostgreSQL");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error al conectar a PostgreSQL:", error.message);
    } else {
      console.error("Error al conectar a PostgreSQL:", String(error));
    }
    throw error; 
  }
};

export const closeDB = async () => {
  try {
    await client.end();
    console.log("Conexión cerrada");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error al cerrar la conexión:", error.message);
    } else {
      console.error("Error al cerrar la conexión:", error);
    }
  }
};
