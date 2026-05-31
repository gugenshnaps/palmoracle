"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PalmScanner } from "@/components/palm/palm-scanner";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store/app-context";

const PHASES = [
  { label: "Сканирование ладони", until: 35 },
  { label: "Чтение линий", until: 70 },
  { label: "Создание гида", until: 95 },
];

export function AnalysisScreen() {
  const {
    palmImage,
    startAnalysis,
    reading,
    isProcessing,
    analysisError,
    resetForNewAnalysis,
  } = useApp();
  const [progress, setProgress] = useState(0);
  const [phaseLabel, setPhaseLabel] = useState(PHASES[0].label);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) {
      setStarted(true);
      startAnalysis();
    }
  }, [started, startAnalysis]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        const cap = reading ? 100 : 95;
        const next = Math.min(p + 1, cap);
        const phase = PHASES.find((ph) => next <= ph.until);
        if (phase) setPhaseLabel(phase.label);
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [reading]);

  useEffect(() => {
    if (reading && !isProcessing) setProgress(100);
  }, [reading, isProcessing]);

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
      <motion.p className="mb-2 text-center text-xs tracking-[0.2em] text-[#c9a962] uppercase">
        {phaseLabel}
      </motion.p>
      <PalmScanner imageSrc={palmImage} progress={progress} />
      <motion.p className="mt-8 max-w-xs text-center text-[15px] leading-relaxed text-[#9a9288]">
        AI интерпретирует линии вашей ладони
      </motion.p>
      <p className="mt-2 text-center text-xs text-[#6a645c]">
        Обычно 10–30 секунд
      </p>
    </div>
  );
}
