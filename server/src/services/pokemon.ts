import { Context } from "https://deno.land/x/oak/mod.ts";

export const getCardsFromAPI = async ({ request, response }: Context) => {
  try {

    const page = parseInt(request.url.searchParams.get("page") || "1");
    const limit = parseInt(request.url.searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    const res = await fetch(`https://api.pokemontcg.io/v2/cards?pageSize=${limit}&page=${page}`, {
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
    response.body = {
      cards: data.data,   
      totalCards: data.totalCount, 
      currentPage: page,   
      totalPages: Math.ceil(data.totalCount / limit), 
    };
  } catch (error) {
    console.error("Error en la conexión con la API de Pokémon:", error);
    response.status = 500;
    response.body = { message: "Error de conexión con la API de Pokémon." };
  }
};
