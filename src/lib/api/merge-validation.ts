import type { ImageQualityMetrics, PalmValidationResult } from "@/lib/types/palm-analysis";
import { QUALITY_THRESHOLDS } from "@/lib/image/quality-thresholds";

export function mergeValidation(
  ai: PalmValidationResult,
  metrics: ImageQualityMetrics,
): PalmValidationResult {
  const merged = { ...ai, metrics };

  if (!metrics.pass) {
    return {
      ...merged,
      valid: false,
      qualityScore: Math.min(merged.qualityScore, 40),
      message: metrics.failReason ?? "Фото не подходит",
      rejectReason: metrics.failReason,
    };
  }

  const cupped =
    ai.isFistOrCupped === true ||
    ai.isOpenPalm === false ||
    ai.fingersExtended === false;

  const aiFlagsFail =
    !ai.isPalm ||
    !ai.fullyVisible ||
    !ai.allFingersVisible ||
    cupped ||
    ai.palmCoverage < QUALITY_THRESHOLDS.minPalmCoverage ||
    ai.lighting === "poor" ||
    ai.blur ||
    ai.qualityScore < QUALITY_THRESHOLDS.minQualityScore;

  if (aiFlagsFail) {
    const cuppedMsg =
      "Раскройте ладонь полностью: разведите пальцы, ладонь к камере. Кулак и полузакрытая ладонь не подходят.";
    return {
      ...merged,
      valid: false,
      message: ai.message || ai.rejectReason || "Фото не подходит для анализа",
      rejectReason: cupped
        ? cuppedMsg
        : (ai.rejectReason ??
          "Снимите ладонь при хорошем свете, пальцами вверх, ближе к камере."),
    };
  }

  return {
    ...merged,
    valid: true,
    message: ai.message || "Фото подходит для анализа",
    rejectReason: null,
  };
}
