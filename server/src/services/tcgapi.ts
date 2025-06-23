export class TcgApiService {
  private readonly API_URL = 'https://api.pokemontcg.io/v2';
  private readonly API_KEY = '78489cba-a572-4c4f-b280-07faee60dd02';

  async getCards(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    type?: string;
    rarity?: string;
  }) {
    const { page = 1, pageSize = 10, search, type, rarity } = params;
    const queryParts = [];

    if (search) queryParts.push(`name:*${search}*`);
    if (type) queryParts.push(`types:${type}`);
    if (rarity) queryParts.push(`rarity:"${rarity}"`);

    const queryString = queryParts.length > 0 
      ? `q=${encodeURIComponent(queryParts.join(" AND "))}` 
      : "";

    const apiUrl = `${this.API_URL}/cards?${queryString}&page=${page}&pageSize=${Math.min(pageSize, 250)}`;

    const response = await fetch(apiUrl, {
      headers: { 
        "Content-Type": "application/json",
        "X-Api-Key": this.API_KEY 
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${await response.text()}`);
    }

    const data = await response.json();
    return {
      data: data.data,
      totalCount: data.totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(data.totalCount / pageSize),
    };
  }

  async getCard(cardId: string) {
    const response = await fetch(`${this.API_URL}/cards/${cardId}`, {
      headers: { 'X-Api-Key': this.API_KEY }
    });
    
    if (!response.ok) throw new Error(`Error fetching card ${cardId}`);
    return (await response.json()).data;
  }

  async getSets() {
    const response = await fetch(`${this.API_URL}/sets`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': this.API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching sets: ${await response.text()}`);
    }

    const data = await response.json();
    return data.data; // Aquí tienes el array de sets con su info, incluyendo 'total'
  }
}
