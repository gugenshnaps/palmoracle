"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { AppScreen, PalmReadingResult } from "@/lib/types/reading";
import { initiatePayment } from "@/lib/api/payments";
import { useTelegram } from "@/lib/telegram/provider";

interface AppContextValue {
  screen: AppScreen;
  palmImage: string | null;
  reading: PalmReadingResult | null;
  isPaid: boolean;
  isProcessing: boolean;
  analysisError: string | null;
  goTo: (screen: AppScreen) => void;
  setPalmImage: (dataUrl: string) => void;
  startAnalysis: () => Promise<void>;
  resetForNewAnalysis: () => void;
  completePayment: () => Promise<boolean>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { userId, initData } = useTelegram();
  const [screen, setScreen] = useState<AppScreen>("welcome");
  const [palmImage, setPalmImageState] = useState<string | null>(null);
  const [reading, setReading] = useState<PalmReadingResult | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const goTo = useCallback((s: AppScreen) => setScreen(s), []);

  const setPalmImage = useCallback((dataUrl: string) => {
    setAnalysisError(null);
    setReading(null);
    setPalmImageState(dataUrl);
    setScreen("analysis");
  }, []);

  const resetForNewAnalysis = useCallback(() => {
    setAnalysisError(null);
    setReading(null);
    setPalmImageState(null);
    setScreen("upload");
  }, []);

  const startAnalysis = useCallback(async () => {
    if (!palmImage) return;
    setIsProcessing(true);
    setAnalysisError(null);
    try {
      const base64 = palmImage.split(",")[1] ?? palmImage;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 120_000);
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, userId }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!res.ok) throw new Error("analyze failed");
      const result = (await res.json()) as PalmReadingResult;
      setReading(result);
    } catch {
      setAnalysisError(
        "Не удалось создать гид. Проверьте интернет и попробуйте другое фото.",
      );
    } finally {
      setIsProcessing(false);
    }
  }, [palmImage, userId, initData]);

  const completePayment = useCallback(async () => {
    setIsProcessing(true);
    try {
      const { success } = await initiatePayment("full-reading", userId);
      if (success) {
        setIsPaid(true);
        setScreen("full-reading");
      }
      return success;
    } finally {
      setIsProcessing(false);
    }
  }, [userId]);

  return (
    <AppContext.Provider
      value={{
        screen,
        palmImage,
        reading,
        isPaid,
        isProcessing,
        analysisError,
        goTo,
        setPalmImage,
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
