import { Context } from "https://deno.land/x/oak/mod.ts";

export const getCardsFromAPI = async ({ request, response }: Context) => {
  try {
    const page = parseInt(request.url.searchParams.get("page") || "1");
    const pageSize = Math.min(
      parseInt(request.url.searchParams.get("pageSize") || "10"),
      250
    );

    const search = request.url.searchParams.get("search") || "";
    const type = request.url.searchParams.get("type") || "";
    const rarity = request.url.searchParams.get("rarity") || "";

    // Construir query dinámica
    const queryParts = [];

    if (search) {
      queryParts.push(`name:*${search}*`);
    }
    if (type) {
      queryParts.push(`types:${type}`);
    }
    if (rarity) {
      queryParts.push(`rarity:"${rarity}"`);
    }


    const queryString = queryParts.length > 0 ? `q=${encodeURIComponent(queryParts.join(" AND "))}` : "";

    // Construir URL final
    const apiUrl = `https://api.pokemontcg.io/v2/cards?${queryString}&page=${page}&pageSize=${pageSize}`;

    console.log("API URL construida:", apiUrl);

    const apiResponse = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": "78489cba-a572-4c4f-b280-07faee60dd02",
      },
    });

    if (!apiResponse.ok) {
      response.status = apiResponse.status;
      response.body = {
        success: false,
        message: "Error al obtener datos de la API de Pokémon TCG",
        error: await apiResponse.text(),
      };
      return;
    }

    const apiData = await apiResponse.json();

    response.status = 200;
    response.body = {
      success: true,
      data: apiData.data,
      totalCount: apiData.totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(apiData.totalCount / pageSize),
    };
  } catch (error) {
    console.error("Error en getCardsFromAPI:", error);
    response.status = 500;
    response.body = {
      success: false,
      message: "Error interno del servidor",
      error: (error instanceof Error ? error.message : "Unknown error"),
    };
  }
};
