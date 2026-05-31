import type { PalmAnalysisResult, PalmValidationResult } from "./palm-analysis";

export type AppScreen =
  | "welcome"
  | "upload"
  | "quality-check"
  | "analysis"
  | "free-result"
  | "paywall"
  | "full-reading";

/** @deprecated — платный разбор, позже */
export interface FullReadingCard {
  id: string;
  title: string;
  content: string;
  highlight?: string;
}

export interface PalmReadingResult {
  validation?: PalmValidationResult;
  analysis: PalmAnalysisResult;
  /** Платный: полный разбор доп. линий */
  paidAdditionalLines?: LineReadingPaid[];
}

export interface LineReadingPaid {
  name: string;
  summary: string;
}
