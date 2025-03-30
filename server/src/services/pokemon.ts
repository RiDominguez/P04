import { Context } from "https://deno.land/x/oak/mod.ts";

// Función para obtener cartas de la API de Pokémon
export const getCardsFromAPI = async ({ request, response }: Context) => {
  try {
    const res = await fetch("https://api.pokemontcg.io/v2/cards", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      response.status = 500;
      response.body = { message: "Error al obtener las cartas de la API de Pokémon." };
      return;
    }

    const data = await res.json();
    response.status = 200;
    response.body = data;  // Devolver los datos obtenidos de la API
  } catch (error) {
    console.error("Error en la conexión con la API de Pokémon:", error);
    response.status = 500;
    response.body = { message: "Error de conexión con la API de Pokémon." };
  }
};