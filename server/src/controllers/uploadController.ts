import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";

/* ─── Utilidades OCR  ────────────────────────────────────────────────── */
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
    headers: { apikey: "K82902711788957" }, // tu API-key
    body: formData,
  });

  const ocrData = await ocrResponse.json();
  const parsedText = ocrData?.ParsedResults?.[0]?.ParsedText || "";
  return parsedText.trim();
};

const getCardNameFromText = (ocrText: string): string => {
  const lines = ocrText.split("\n").map((l) => l.trim());
  for (const line of lines) {
    if (/^[A-Za-z\s\-]+$/.test(line) && line.length >= 3 && line.length <= 25) {
      const ignored = ["STAGE", "EVOLVES", "HP", "POKEMON", "ENERGY"];
      if (!ignored.some((w) => line.toUpperCase().includes(w))) return line;
    }
  }
  return lines[0] || "Unknown";
};

/* ─── Controlador principal  ─────────────────────────────────────────── */
export const uploadAndRecognizeCard = async (ctx: Context) => {
  try {
    /* 1️⃣  Leer multipart/form-data con Oak v12 */
    const body = ctx.request.body({ type: "form-data" });
    const { files } = await body.value.read({ maxSize: 10_000_000 }); // 10 MB

    if (!files || files.length === 0) {
      ctx.throw(400, "No se recibió ningún archivo.");
    }

    // Tomamos solo el primer archivo llamado "image"
    const first = files.find((f) => f.name === "image") ?? files[0];
    if (!first?.content) {
      ctx.throw(400, "Archivo inválido.");
    }

    /* 2️⃣  Convertimos a File para OCR.space */
    const file = new File([first.content], first.filename, {
      type: first.contentType ?? "image/png",
    });

    /* 3️⃣  Pasamos por OCR.space */
    const ocrText = await extractTextFromOCR(file);
    console.log("OCR text:", ocrText);

    const cardName = getCardNameFromText(ocrText);
    console.log("Card name:", cardName);

    /* 4️⃣  Consultamos Pokémon TCG API */
    const apiUrl = `https://api.pokemontcg.io/v2/cards?q=name:${encodeURIComponent(
      `*${cardName}*`,
    )}&pageSize=1`;

    const apiResp = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": "78489cba-a572-4c4f-b280-07faee60dd02",
      },
    });

    if (!apiResp.ok) {
      ctx.throw(500, `Pokémon TCG API error: ${apiResp.statusText}`);
    }

    const apiData = await apiResp.json();
    const card = apiData.data?.[0];

    if (!card) {
      ctx.response.status = 404;
      ctx.response.body = {
        success: false,
        message: `No se encontró la carta "${cardName}".`,
      };
      return;
    }

    /* 5️⃣  Éxito */
    ctx.response.status = 200;
    ctx.response.body = {
      success: true,
      card: {
        name: card.name,
        type: card.types?.[0] ?? null,
        rarity: card.rarity,
        expansion: card.set.name,
        image: card.images.large,
        officialId: card.id,
        marketPrice:
          card.cardmarket?.prices?.averageSellPrice ?? "Not available",
      },
    };
  } catch (err) {
    console.error("uploadAndRecognizeCard:", err);
    ctx.throw(
      500,
      err instanceof Error ? err.message : "Internal server error",
    );
  }
};

