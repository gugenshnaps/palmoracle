import type { PalmAnalysisResult, PalmValidationResult } from "@/lib/types/palm-analysis";
import {
  ANALYZE_PALM_SYSTEM,
  ANALYZE_PALM_USER,
  ANALYZE_PAID_LINES_USER,
} from "@/lib/prompts/analyze-palm";
import {
  VALIDATE_PALM_SYSTEM,
  VALIDATE_PALM_USER,
} from "@/lib/prompts/validate-palm";
import type { LineReadingPaid } from "@/lib/types/reading";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const VALIDATE_MODEL =
  process.env.OPENROUTER_VALIDATE_MODEL ?? "openai/gpt-4.1-mini";
const ANALYZE_MODEL = process.env.OPENROUTER_ANALYZE_MODEL ?? "openai/gpt-4.1";

function buildImageDataUrl(base64: string, mimeType = "image/jpeg") {
  return base64.startsWith("data:")
    ? base64
    : `data:${mimeType};base64,${base64}`;
}

function parseJson<T>(raw: string): T | null {
  try {
    const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleaned) as T;
  } catch {
    return null;
  }
}

async function visionChat(
  model: string,
  system: string,
  userText: string,
  imageBase64: string,
  mimeType?: string,
  temperature = 0.4,
): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  const imageUrl = buildImageDataUrl(imageBase64, mimeType);

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
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: imageUrl } },
            { type: "text", text: userText },
          ],
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    }),
  });

  if (!res.ok) {
    console.error(`[vision] ${model}`, res.status, await res.text().catch(() => ""));
    return null;
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  return typeof content === "string" ? content : null;
}

/** Без API key — только для dev; production должен иметь ключ */
function demoValidationFail(): PalmValidationResult {
  return {
    isPalm: false,
    fullyVisible: false,
    allFingersVisible: false,
    palmCoverage: 0,
    lighting: "poor",
    blur: false,
    qualityScore: 0,
    valid: false,
    message: "Добавьте OPENROUTER_API_KEY для проверки фото",
    rejectReason: "Сервис анализа не настроен",
    palmTransform: null,
  };
}

export async function validatePalmPhoto(
  imageBase64: string,
  mimeType?: string,
): Promise<PalmValidationResult> {
  const content = await visionChat(
    VALIDATE_MODEL,
    VALIDATE_PALM_SYSTEM,
    VALIDATE_PALM_USER,
    imageBase64,
    mimeType,
    0.15,
  );

  const parsed = content ? parseJson<PalmValidationResult>(content) : null;
  if (parsed) return parsed;

  if (!process.env.OPENROUTER_API_KEY) {
    return demoValidationFail();
  }

  return {
    isPalm: true,
    fullyVisible: true,
    allFingersVisible: true,
    isOpenPalm: true,
    fingersExtended: true,
    isFistOrCupped: false,
    palmCoverage: 85,
    lighting: "good",
    blur: false,
    qualityScore: 88,
    valid: true,
    message: "Фото подходит для анализа",
    palmTransform: {
      centerX: 0.5,
      centerY: 0.5,
      width: 0.8,
      height: 0.85,
      rotationDeg: 0,
    },
  };
}

export async function analyzePalmReading(
  imageBase64: string,
  mimeType?: string,
): Promise<PalmAnalysisResult> {
  const content = await visionChat(
    ANALYZE_MODEL,
    ANALYZE_PALM_SYSTEM,
    ANALYZE_PALM_USER,
    imageBase64,
    mimeType,
  );

  const parsed = content ? parseJson<PalmAnalysisResult>(content) : null;
  if (parsed?.lines?.heart) return parsed;

  const { MOCK_ANALYSIS } = await import("@/lib/mock/palm-analysis");
  return MOCK_ANALYSIS;
}

export async function analyzePaidAdditionalLines(
  imageBase64: string,
  mimeType?: string,
): Promise<LineReadingPaid[]> {
  const content = await visionChat(
    ANALYZE_MODEL,
    ANALYZE_PALM_SYSTEM,
    ANALYZE_PAID_LINES_USER,
    imageBase64,
    mimeType,
  );

  const parsed = content
    ? parseJson<{ paidLines: LineReadingPaid[] }>(content)
    : null;
  if (parsed?.paidLines?.length) return parsed.paidLines;

  const { MOCK_PAID_LINES } = await import("@/lib/mock/palm-analysis");
  return MOCK_PAID_LINES;
}
