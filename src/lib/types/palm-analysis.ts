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
