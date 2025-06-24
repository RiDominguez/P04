import { config } from "https://deno.land/x/dotenv/mod.ts";
import { Client } from "https://deno.land/x/postgres/mod.ts";

const env = config(); // Carga .env en desarrollo

// Usa DATABASE_URL si está definida (preferido en producción)
const dbUrl = Deno.env.get("DATABASE_URL") || env.DATABASE_URL;

if (!dbUrl) {
  throw new Error("Falta la variable DATABASE_URL");
}

export const client = new Client(dbUrl);

export const connectDB = async () => {
  try {
    await client.connect();
    console.log("✅ Conexión exitosa a PostgreSQL");
  } catch (error) {
    console.error("❌ Error al conectar a PostgreSQL:", error);
    throw error;
  }
};

export const closeDB = async () => {
  try {
    await client.end();
    console.log("🔌 Conexión cerrada");
  } catch (error) {
    console.error("❌ Error al cerrar la conexión:", error);
  }
};
