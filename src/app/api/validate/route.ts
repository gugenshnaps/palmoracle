import { NextResponse } from "next/server";
import { validatePalmPhoto } from "@/lib/api/openrouter-vision";
import { mergeValidation } from "@/lib/api/merge-validation";
import { decodeBase64Image } from "@/lib/image/decode-base64-image";
import { analyzeImageMetrics } from "@/lib/image/quality-metrics";
import { normalizePalmImage } from "@/lib/image/normalize-palm-server";
import { resolveTrustedUserId } from "@/lib/telegram/validate-init-data";
import type { PalmTransform } from "@/lib/types/palm-analysis";

export const maxDuration = 45;

const DEFAULT_TRANSFORM: PalmTransform = {
  centerX: 0.5,
  centerY: 0.5,
  width: 0.8,
  height: 0.85,
  rotationDeg: 0,
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageBase64, mimeType, initData, userId } = body as {
      imageBase64?: string;
      mimeType?: string;
      initData?: string;
      userId?: number;
    };

    if (!imageBase64) {
      return NextResponse.json({ error: "imageBase64 required" }, { status: 400 });
    }

    const trusted = resolveTrustedUserId(initData, userId);
    if (trusted.error) {
      return NextResponse.json({ error: trusted.error }, { status: 401 });
    }

    const buffer = decodeBase64Image(imageBase64);
    const metrics = await analyzeImageMetrics(buffer);
    const ai = await validatePalmPhoto(imageBase64, mimeType);
    let result = mergeValidation(ai, metrics);

    if (result.valid) {
      const transform = result.palmTransform ?? DEFAULT_TRANSFORM;
      try {
        result = {
          ...result,
          normalizedImageBase64: await normalizePalmImage(buffer, transform),
        };
      } catch (e) {
        console.error("[validate] normalize failed", e);
        result = {
          ...result,
          valid: false,
          message: "Не удалось обработать кадр. Снимите ладонь ровнее, при свете.",
          rejectReason: "Ошибка выравнивания фото",
        };
      }
    }

    if (result.valid && !result.normalizedImageBase64) {
      result = {
        ...result,
        valid: false,
        message: "Снимите ладонь ровнее: пальцы вверх, раскрытая ладонь.",
        rejectReason: "Нет выровненного кадра",
      };
    }

    return NextResponse.json(result);
  } catch (e) {
    console.error("[validate]", e);
    return NextResponse.json({ error: "Validation failed" }, { status: 500 });
  }
}
