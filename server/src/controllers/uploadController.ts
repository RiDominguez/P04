import { Context } from "https://deno.land/x/oak/mod.ts";

// OCR.Space: send image and extract text
const extractTextFromOCR = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const blob = new Blob([new Uint8Array(arrayBuffer)], { type: file.type });
  const formData = new FormData();

  formData.append("file", blob, file.name);
  formData.append("language", "eng");
  formData.append("scale", "true");
  formData.append("OCREngine", "2");

  const ocrResponse = await fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    headers: {
      apikey: "K82902711788957", // you can move this to env later
    },
    body: formData,
  });

  const ocrData = await ocrResponse.json();
  const parsedText = ocrData?.ParsedResults?.[0]?.ParsedText || "";
  return parsedText.trim();
};

// Tries to extract the card name from OCR text
const getCardNameFromText = (ocrText: string): string => {
  const lines = ocrText.split("\n").map((line) => line.trim());

  for (const line of lines) {
    if (/^[A-Za-z\s\-]+$/.test(line) && line.length >= 3 && line.length <= 25) {
      const ignoredWords = ["STAGE", "EVOLVES", "HP", "POKEMON", "ENERGY"];
      if (!ignoredWords.some((word) => line.toUpperCase().includes(word))) {
        return line;
      }
    }
  }

  return lines[0] || "Unknown";
};

export const uploadAndRecognizeCard = async (ctx: Context) => {
  try {
    const formData = await ctx.request.body.formData();
    const file = formData.get("image") as File;

    if (!file || !file.type?.startsWith("image/")) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        message: "No valid image received.",
      };
      return;
    }

    // Step 1: Extract text using OCR
    const ocrText = await extractTextFromOCR(file);
    console.log("Full OCR text:", ocrText);

    // Step 2: Extract the best possible card name
    const cardName = getCardNameFromText(ocrText);
    console.log("Recognized card name:", cardName);

    // Step 3: Query Pokémon TCG API
    const apiUrl = `https://api.pokemontcg.io/v2/cards?q=name:${encodeURIComponent(`*${cardName}*`)}&pageSize=1`;

    const apiResponse = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": "78489cba-a572-4c4f-b280-07faee60dd02",
      },
    });

    if (!apiResponse.ok) {
      throw new Error(`Pokémon TCG API Error: ${apiResponse.statusText}`);
    }

    const data = await apiResponse.json();
    const card = data.data?.[0];

    if (!card) {
      ctx.response.status = 404;
      ctx.response.body = {
        success: false,
        message: `No card found with the name "${cardName}".`,
      };
      return;
    }

    // Step 4: Return recognized card data
    ctx.response.status = 200;
    ctx.response.body = {
      success: true,
      card: {
        name: card.name,
        type: card.types?.[0] || null,
        rarity: card.rarity,
        expansion: card.set.name,
        image: card.images.large,
        officialId: card.id,
        marketPrice: card.cardmarket?.prices?.averageSellPrice || "Not available",
      },
    };
  } catch (err) {
    console.error("Error in uploadAndRecognizeCard:", err);
    ctx.response.status = 500;
    ctx.response.body = {
      success: false,
      message: "Internal server error.",
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
};
