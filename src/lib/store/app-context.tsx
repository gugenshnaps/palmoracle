"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { PalmValidationResult } from "@/lib/types/palm-analysis";
import type { AppScreen, PalmReadingResult } from "@/lib/types/reading";
import { MOCK_ANALYSIS } from "@/lib/mock/palm-analysis";
import { initiatePayment } from "@/lib/api/payments";
import { useTelegram } from "@/lib/telegram/provider";

function imageToBase64(dataUrl: string) {
  return dataUrl.split(",")[1] ?? dataUrl;
}

interface AppContextValue {
  screen: AppScreen;
  palmImage: string | null;
  /** Кадр после выравнивания (пальцы вверх) — для UI и analyze */
  displayPalmImage: string | null;
  validation: PalmValidationResult | null;
  reading: PalmReadingResult | null;
  isPaid: boolean;
  isProcessing: boolean;
  validationError: string | null;
  analysisError: string | null;
  goTo: (screen: AppScreen) => void;
  setPalmImage: (dataUrl: string) => void;
  validatePhoto: () => Promise<boolean>;
  startAnalysis: () => Promise<void>;
  resetForNewAnalysis: () => void;
  completePayment: () => Promise<boolean>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { userId, initData } = useTelegram();
  const [screen, setScreen] = useState<AppScreen>("welcome");
  const [palmImage, setPalmImageState] = useState<string | null>(null);
  const [validation, setValidation] = useState<PalmValidationResult | null>(
    null,
  );
  const [reading, setReading] = useState<PalmReadingResult | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const goTo = useCallback((s: AppScreen) => setScreen(s), []);

  const setPalmImage = useCallback((dataUrl: string) => {
    setValidationError(null);
    setAnalysisError(null);
    setValidation(null);
    setReading(null);
    setPalmImageState(dataUrl);
    setScreen("quality-check");
  }, []);

  const resetForNewAnalysis = useCallback(() => {
    setValidationError(null);
    setAnalysisError(null);
    setValidation(null);
    setReading(null);
    setPalmImageState(null);
    setIsPaid(false);
    setScreen("upload");
  }, []);

  const validatePhoto = useCallback(async (): Promise<boolean> => {
    if (!palmImage) return false;
    setIsProcessing(true);
    setValidationError(null);
    try {
      const base64 = palmImage.split(",")[1] ?? palmImage;
      const res = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, userId, initData }),
      });
      if (!res.ok) throw new Error("validate failed");
      const result = (await res.json()) as PalmValidationResult;
      setValidation(result);
      if (!result.valid) {
        setValidationError(result.message || "Фото не подходит для анализа");
        return false;
      }
      return true;
    } catch {
      setValidationError("Не удалось проверить фото. Попробуйте ещё раз.");
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [palmImage, userId, initData]);

  const displayPalmImage =
    validation?.normalizedImageBase64 ?? palmImage;

  const startAnalysis = useCallback(async () => {
    const src = validation?.normalizedImageBase64 ?? palmImage;
    if (!src) return;
    setIsProcessing(true);
    setAnalysisError(null);
    try {
      const base64 = imageToBase64(src);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 90_000);
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64,
          userId,
          initData,
          includePaidLines: false,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!res.ok) throw new Error("analyze failed");
      const data = (await res.json()) as {
        analysis: PalmReadingResult["analysis"];
      };
      setReading({ analysis: data.analysis });
      setScreen("free-result");
    } catch {
      setAnalysisError(
        "Не удалось завершить анализ. Проверьте интернет и попробуйте снова.",
      );
    } finally {
      setIsProcessing(false);
    }
  }, [palmImage, validation?.normalizedImageBase64, userId, initData]);

  const completePayment = useCallback(async () => {
    const src = validation?.normalizedImageBase64 ?? palmImage;
    if (!src) return false;
    setIsProcessing(true);
    try {
      const { success } = await initiatePayment("additional-lines", userId);
      if (!success) return false;

      const base64 = imageToBase64(src);
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64,
          userId,
          initData,
          includePaidLines: true,
        }),
      });
      if (!res.ok) throw new Error("paid analyze failed");
      const data = (await res.json()) as {
        analysis: PalmReadingResult["analysis"];
        paidAdditionalLines?: PalmReadingResult["paidAdditionalLines"];
      };
      setReading({
        analysis: data.analysis ?? reading?.analysis ?? MOCK_ANALYSIS,
        paidAdditionalLines: data.paidAdditionalLines,
      });
      setIsPaid(true);
      setScreen("full-reading");
      return true;
    } catch {
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [
    palmImage,
    validation?.normalizedImageBase64,
    userId,
    initData,
    reading?.analysis,
  ]);

  return (
    <AppContext.Provider
      value={{
        screen,
        palmImage,
        displayPalmImage,
        validation,
        reading,
        isPaid,
        isProcessing,
        validationError,
        analysisError,
        goTo,
        setPalmImage,
        validatePhoto,
        startAnalysis,
        resetForNewAnalysis,
        completePayment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
