import { Client } from "https://deno.land/x/postgres/mod.ts";

const client = new Client({
  user: "postgres",
  database: "poke04",
  hostname: "localhost",
  password: "cardito001",
  port: 5432,
});

await client.connect();

const apiKey = "78489cba-a572-4c4f-b280-07faee60dd02";

const cards = await client.queryObject<{ id: number; official_id: string }>(
  "SELECT id, official_id FROM pokemon_cards WHERE image_url IS NULL OR image_url = ''"
);

for (const card of cards.rows) {
  try {
    const res = await fetch(`https://api.pokemontcg.io/v2/cards/${card.official_id}`, {
      headers: { "X-Api-Key": apiKey },
    });

    if (!res.ok) {
      console.error(`Error fetching card ${card.official_id}: ${res.statusText}`);
      continue;
    }

    const data = await res.json();

    const imageUrl = data?.data?.images?.small ?? null;

    if (imageUrl) {
      await client.queryObject(
        "UPDATE pokemon_cards SET image_url = $1 WHERE id = $2",
        [imageUrl, card.id]
      );
      console.log(`Updated card ${card.official_id} with image URL.`);
    } else {
      console.warn(`No image found for card ${card.official_id}`);
    }
  } catch (error) {
    console.error(`Error processing card ${card.official_id}:`, error);
  }
}

await client.end();
console.log("Image URLs sync complete.");
