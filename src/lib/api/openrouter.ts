import type { PalmReadingResult } from "@/lib/types/reading";
import { MOCK_READING } from "@/lib/mock/reading-data";
import { PALM_INFOGRAPHIC_PROMPT } from "@/lib/prompts/palm-infographic";
import { getStyleReferenceDataUrl } from "@/lib/api/load-style-reference";
import {
  INFOGRAPHIC_IMAGE_CONFIG,
  INFOGRAPHIC_MODEL_FALLBACK,
  INFOGRAPHIC_MODEL_PRIMARY,
} from "@/lib/api/openrouter-models";

export interface AnalyzePalmOptions {
  imageBase64: string;
  mimeType?: string;
  userId?: number;
}

interface OpenRouterImageMessage {
  type: "image_url";
  image_url: { url: string };
}

interface OpenRouterChatResponse {
  choices?: Array<{
    message?: {
      content?: string | unknown[];
      images?: Array<{
        type?: string;
        image_url?: { url?: string };
        imageUrl?: { url?: string };
      }>;
    };
  }>;
}

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

function buildImageDataUrl(base64: string, mimeType = "image/jpeg") {
  return base64.startsWith("data:")
    ? base64
    : `data:${mimeType};base64,${base64}`;
}

function extractImageUrl(response: OpenRouterChatResponse): string | null {
  const message = response.choices?.[0]?.message;
  if (!message) return null;

  const images = message.images;
  if (images?.length) {
    for (const img of images) {
      const url = img.image_url?.url ?? img.imageUrl?.url;
      if (url?.startsWith("data:image") || url?.startsWith("http")) return url;
    }
  }

  const content = message.content;
  if (Array.isArray(content)) {
    for (const part of content) {
      if (
        typeof part === "object" &&
        part !== null &&
        "type" in part &&
        (part as { type: string }).type === "image_url"
      ) {
        const url = (part as { image_url?: { url?: string } }).image_url?.url;
        if (url) return url;
      }
    }
  }

  if (typeof content === "string") {
    const dataMatch = content.match(/data:image\/[a-z+]+;base64,[A-Za-z0-9+/=]+/);
    if (dataMatch) return dataMatch[0];
  }

  return null;
}

async function requestInfographic(
  apiKey: string,
  model: string,
  palmDataUrl: string,
  styleDataUrl: string | null,
): Promise<string | null> {
  const userContent: Array<string | OpenRouterImageMessage> = [
    { type: "image_url", image_url: { url: palmDataUrl } },
  ];

  if (styleDataUrl) {
    userContent.push({
      type: "image_url",
      image_url: { url: styleDataUrl },
    });
  }

  userContent.push(PALM_INFOGRAPHIC_PROMPT);

  const isGemini = model.includes("gemini");

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer":
        process.env.OPENROUTER_SITE_URL ?? "https://palmoracle.vercel.app",
      "X-Title": "PalmOracle AI",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: userContent }],
      modalities: isGemini ? ["image", "text"] : ["image"],
      image_config: INFOGRAPHIC_IMAGE_CONFIG,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.error(`[openrouter] ${model} ${res.status}:`, errText.slice(0, 800));
    return null;
  }

  const data = (await res.json()) as OpenRouterChatResponse;
  const url = extractImageUrl(data);
  if (!url) {
    console.error(`[openrouter] ${model}: no image in response`);
  }
  return url;
}

/**
 * Генерация инфографики: ладонь + референс стиля → постер-гид.
 */
export async function generatePalmInfographic(
  options: AnalyzePalmOptions,
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return MOCK_READING.infographic.imageUrl;
  }

  const palmDataUrl = buildImageDataUrl(
    options.imageBase64,
    options.mimeType ?? "image/jpeg",
  );
  const styleDataUrl = await getStyleReferenceDataUrl();

  const models = [
    INFOGRAPHIC_MODEL_PRIMARY,
    INFOGRAPHIC_MODEL_FALLBACK,
    "google/gemini-2.5-flash-image",
  ].filter((m, i, arr) => arr.indexOf(m) === i);

  for (const model of models) {
    try {
      const url = await requestInfographic(
        apiKey,
        model,
        palmDataUrl,
        styleDataUrl,
      );
      if (url) {
        console.info(`[openrouter] success with ${model}`);
        return url;
      }
    } catch (e) {
      console.error(`[openrouter] ${model} error:`, e);
    }
  }

  console.error("[openrouter] all models failed, using mock");
  return MOCK_READING.infographic.imageUrl;
}

/** Полный цикл бесплатного анализа */
export async function analyzePalm(
  options: AnalyzePalmOptions,
): Promise<PalmReadingResult> {
  const imageUrl = await generatePalmInfographic(options);
  return {
    ...MOCK_READING,
    infographic: {
      imageUrl,
      rareSignTeaser: MOCK_READING.infographic.rareSignTeaser,
    },
  };
}
