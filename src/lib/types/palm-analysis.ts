export interface ImageQualityMetrics {
  brightness: number;
  contrast: number;
  darkRatio: number;
  blurVariance: number;
  pass: boolean;
  failReason: string | null;
}

/** Нормализованные координаты 0–1, rotationDeg — поворот по часовой до «пальцы вверх» */
export interface PalmTransform {
  centerX: number;
  centerY: number;
  width: number;
  height: number;
  rotationDeg: number;
}

export interface PalmValidationResult {
  isPalm: boolean;
  fullyVisible: boolean;
  allFingersVisible: boolean;
  palmCoverage: number;
  lighting: "good" | "ok" | "poor";
  blur: boolean;
  qualityScore: number;
  valid: boolean;
  message: string;
  rejectReason?: string | null;
  metrics?: ImageQualityMetrics;
  palmTransform?: PalmTransform | null;
  /** Кадр ладони: пальцы вверх, 4:5 — для UI и линий */
  normalizedImageBase64?: string | null;
}

export interface LineReading {
  title: string;
  summary: string;
  keywords: string[];
}

export interface PalmAnalysisResult {
  lines: {
    heart: LineReading;
    head: LineReading;
    life: LineReading;
    fate: LineReading;
  };
  additionalLines: {
    detected: string[];
    teaser: string;
  };
  rareSign: {
    teaser: string;
  };
}
