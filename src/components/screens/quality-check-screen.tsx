"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store/app-context";

const CHECKS = [
  { key: "palm", label: "Ладонь обнаружена" },
  { key: "quality", label: "Качество изображения" },
  { key: "lines", label: "Основные линии видны" },
] as const;

export function QualityCheckScreen() {
  const {
    validation,
    validationError,
    validatePhoto,
    goTo,
    resetForNewAnalysis,
    isProcessing,
  } = useApp();
  const [visibleChecks, setVisibleChecks] = useState(0);

  useEffect(() => {
    validatePhoto();
  }, [validatePhoto]);

  useEffect(() => {
    if (!validation?.valid) return;
    const t1 = setTimeout(() => setVisibleChecks(1), 400);
    const t2 = setTimeout(() => setVisibleChecks(2), 900);
    const t3 = setTimeout(() => setVisibleChecks(3), 1400);
    const t4 = setTimeout(() => goTo("analysis"), 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [validation?.valid, goTo]);

  if (validationError && !validation?.valid) {
    return (
      <div className="flex flex-1 flex-col justify-center text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10">
          <X className="text-red-400" size={32} />
        </div>
        <h2 className="font-display text-2xl text-[#f5f0e8]">Фото не подходит</h2>
        <p className="mt-4 text-[15px] leading-relaxed text-[#9a9288]">
          {validationError}
        </p>
        {validation?.rejectReason && (
          <p className="mt-2 text-sm text-[#8a7a4a]">{validation.rejectReason}</p>
        )}
        <div className="mt-8">
          <Button fullWidth onClick={resetForNewAnalysis}>
            Загрузить другое фото
          </Button>
        </div>
      </div>
    );
  }

  const score = validation?.qualityScore ?? 0;

  return (
    <div className="flex flex-1 flex-col justify-center">
      <h2 className="font-display text-center text-2xl text-[#f5f0e8]">
        Проверяем фото
      </h2>
      <p className="mt-2 text-center text-sm text-[#9a9288]">
        {isProcessing && !validation
          ? "AI сканирует ладонь…"
          : "Подготовка к анализу"}
      </p>

      <ul className="mt-10 space-y-4">
        {CHECKS.map((check, i) => {
          const show = visibleChecks > i && validation?.valid;
          return (
            <motion.li
              key={check.key}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: show ? 1 : 0.35, x: 0 }}
              className="flex items-center gap-4 rounded-2xl border border-[#c9a962]/15 bg-[#12100e]/80 px-4 py-3"
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  show ? "bg-[#c9a962]/20 text-[#c9a962]" : "bg-[#1a1714] text-[#6a645c]"
                }`}
              >
                {show ? <Check size={18} /> : "…"}
              </span>
              <span className="text-[15px] text-[#e8d5a3]">
                {check.key === "quality" && show
                  ? `${check.label}: ${score}%`
                  : check.label}
              </span>
            </motion.li>
          );
        })}
      </ul>

      {visibleChecks >= 3 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-center text-sm tracking-wide text-[#c9a962]"
        >
          Начинаем анализ…
        </motion.p>
      )}
    </div>
  );
}
