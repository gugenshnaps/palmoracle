export type AppScreen =
  | "welcome"
  | "upload"
  | "analysis"
  | "free-result"
  | "paywall"
  | "full-reading";

/** Бесплатный результат — одна инфографика (как в референсе) */
export interface PalmInfographicResult {
  /** data:image/... или CDN URL */
  imageUrl: string;
  rareSignTeaser: string;
}

export interface FreeReadingSection {
  id: "character" | "relationships" | "money" | "life-path";
  title: string;
  summary: string;
  icon: string;
}

export interface FullReadingCard {
  id: string;
  title: string;
  content: string;
  highlight?: string;
}

export interface PalmReadingResult {
  /** Главный артефакт бесплатного анализа */
  infographic: PalmInfographicResult;
  /** Устаревшие текстовые карточки — можно убрать после согласования paywall */
  free?: FreeReadingSection[];
  full?: FullReadingCard[];
}

export interface AnalysisProgress {
  phase: "scan" | "lines" | "interpret";
  progress: number;
}
