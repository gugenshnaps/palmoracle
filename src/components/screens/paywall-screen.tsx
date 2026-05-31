"use client";

import { motion } from "framer-motion";
import { Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FULL_READING_PRODUCT } from "@/lib/api/payments";
import { useApp } from "@/lib/store/app-context";
import { MOCK_ANALYSIS } from "@/lib/mock/palm-analysis";

export function PaywallScreen() {
  const { completePayment, isProcessing, goTo, reading } = useApp();
  const detected =
    reading?.analysis.additionalLines.detected ??
    MOCK_ANALYSIS.additionalLines.detected;

  return (
    <div className="flex flex-1 flex-col">
      <button
        type="button"
        onClick={() => goTo("free-result")}
        className="mb-4 self-start text-sm text-[#8a7a4a]"
      >
        ← Назад
      </button>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <span className="inline-block rounded-full border border-[#c9a962]/30 px-4 py-1 text-xs tracking-widest text-[#c9a962] uppercase">
          Premium
        </span>
        <h2 className="font-display mt-4 text-3xl text-[#f5f0e8]">
          Дополнительные линии
        </h2>
        <p className="mt-3 text-[15px] text-[#9a9288]">
          AI обнаружил на вашей ладони скрытые линии — откройте полную
          расшифровку
        </p>
      </motion.div>

      <ul className="mt-8 flex flex-1 flex-col gap-3">
        {detected.map((name, i) => (
          <motion.li
            key={name}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-4 rounded-2xl border border-[#c9a962]/15 bg-[#12100e]/80 px-4 py-3"
          >
            <Lock className="shrink-0 text-[#c9a962]" size={18} />
            <span className="text-[15px] text-[#e8d5a3]">{name}</span>
          </motion.li>
        ))}
      </ul>

      <div className="mt-6 rounded-2xl border border-[#c9a962]/20 bg-[#c9a962]/5 p-4">
        <p className="flex items-start gap-2 text-sm text-[#e8d5a3]">
          <Sparkles className="mt-0.5 shrink-0 text-[#c9a962]" size={16} />
          {reading?.analysis.additionalLines.teaser ??
            MOCK_ANALYSIS.additionalLines.teaser}
        </p>
      </div>

      <div className="mt-6">
        <Button
          fullWidth
          disabled={isProcessing}
          onClick={() => completePayment()}
        >
          {isProcessing
            ? "Открываем…"
            : `Разблокировать · ${FULL_READING_PRODUCT.priceLabel}`}
        </Button>
        <p className="mt-3 text-center text-[11px] text-[#6a645c]">
          Демо: оплата имитируется
        </p>
      </div>
    </div>
  );
}
