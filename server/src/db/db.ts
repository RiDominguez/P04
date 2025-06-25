/// <reference lib="deno.ns" />
import "https://deno.land/std@0.224.0/dotenv/load.ts"; // ✅ Carga automática del .env

import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const dbUrl = Deno.env.get("DATABASE_URL");

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
