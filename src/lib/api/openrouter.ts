import type { PalmReadingResult } from "@/lib/types/reading";
import { MOCK_READING } from "@/lib/mock/reading-data";
import { PALM_INFOGRAPHIC_PROMPT } from "@/lib/prompts/palm-infographic";
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
      images?: Array<{
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
  const images = response.choices?.[0]?.message?.images;
  if (!images?.length) return null;
  const first = images[0];
  return first.image_url?.url ?? first.imageUrl?.url ?? null;
}

/**
 * Генерация инфографики: фото ладони + промпт → одна картинка-гид.
 * Модель по умолчанию: openai/gpt-5-image (GPT Image на OpenRouter).
 */
export async function generatePalmInfographic(
  options: AnalyzePalmOptions,
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return MOCK_READING.infographic.imageUrl;
  }

  const imageUrl = buildImageDataUrl(
    options.imageBase64,
    options.mimeType ?? "image/jpeg",
  );

  const userContent: Array<string | OpenRouterImageMessage> = [
    { type: "image_url", image_url: { url: imageUrl } },
    PALM_INFOGRAPHIC_PROMPT,
  ];

  const models = [INFOGRAPHIC_MODEL_PRIMARY, INFOGRAPHIC_MODEL_FALLBACK];

  for (const model of models) {
    try {
      const res = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.OPENROUTER_SITE_URL ?? "https://palmoracle.ai",
          "X-Title": "PalmOracle AI",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: userContent }],
          modalities: ["image", "text"],
          image_config: INFOGRAPHIC_IMAGE_CONFIG,
        }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        console.error(`[openrouter] ${model} ${res.status}:`, errText.slice(0, 500));
        continue;
      }

      const data = (await res.json()) as OpenRouterChatResponse;
      const url = extractImageUrl(data);
      if (url) return url;
    } catch {
      continue;
    }
  }

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
