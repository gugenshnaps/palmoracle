/** Пороги метрик — подстроить по реальным тестам */
export const QUALITY_THRESHOLDS = {
  minBrightness: 58,
  minContrast: 22,
  maxDarkRatio: 0.42,
  minBlurVariance: 80,
  minQualityScore: 72,
  minPalmCoverage: 60,
} as const;
