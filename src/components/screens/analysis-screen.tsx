"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PalmScanner } from "@/components/palm/palm-scanner";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store/app-context";

const PHASES = [
  { label: "Сканирование ладони", until: 30 },
  { label: "Анализ линий", until: 65 },
  { label: "Создание инфографики", until: 95 },
];

export function AnalysisScreen() {
  const {
    palmImage,
    startAnalysis,
    reading,
    isProcessing,
    analysisError,
    goTo,
    resetForNewAnalysis,
  } = useApp();
  const [progress, setProgress] = useState(0);
  const [phaseLabel, setPhaseLabel] = useState(PHASES[0].label);

  useEffect(() => {
    startAnalysis();
  }, [startAnalysis]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        const cap = reading ? 100 : 95;
        const next = Math.min(p + 1, cap);
        const phase = PHASES.find((ph) => next <= ph.until);
        if (phase) setPhaseLabel(phase.label);
        return next;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [reading]);

  useEffect(() => {
    if (reading && !isProcessing) {
      setProgress(100);
      const t = setTimeout(() => goTo("free-result"), 500);
      return () => clearTimeout(t);
    }
  }, [reading, isProcessing, goTo]);

  if (!palmImage) return null;

  if (analysisError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <p className="text-[#e8d5a3]">{analysisError}</p>
        <div className="mt-6 w-full">
          <Button fullWidth onClick={resetForNewAnalysis}>
            Попробовать снова
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-2 text-center text-xs tracking-[0.2em] text-[#c9a962] uppercase"
      >
        {phaseLabel}
      </motion.p>

      <PalmScanner imageSrc={palmImage} progress={progress} />

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 max-w-xs text-center text-[15px] leading-relaxed text-[#9a9288]"
      >
        Искусственный интеллект анализирует линии вашей ладони
      </motion.p>
      <p className="mt-2 text-center text-xs text-[#6a645c]">
        Обычно 30–90 секунд — не закрывайте приложение
      </p>

      <motion.div
        className="mt-6 flex gap-1"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-[#c9a962]"
          />
        ))}
      </motion.div>
    </div>
  );
}
