"use client";

import { motion } from "framer-motion";
import { Sparkles, Lock, Zap, Star, Gem, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FULL_READING_PRODUCT } from "@/lib/api/payments";
import { useApp } from "@/lib/store/app-context";

const BENEFITS = [
  { icon: Sparkles, text: "Подробный анализ личности" },
  { icon: Eye, text: "Скрытые таланты" },
  { icon: Gem, text: "Денежный потенциал" },
  { icon: Star, text: "Архетип личности" },
  { icon: Zap, text: "Энергия будущего" },
  { icon: Lock, text: "Редкие знаки на ладони" },
];

export function PaywallScreen() {
  const { completePayment, isProcessing, goTo } = useApp();

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
          Полный разбор
        </h2>
        <p className="mt-3 text-[15px] text-[#9a9288]">
          8 персональных карт с глубоким AI-анализом вашей ладони
        </p>
      </motion.div>

      <ul className="mt-8 flex flex-1 flex-col gap-4">
        {BENEFITS.map(({ icon: Icon, text }, i) => (
          <motion.li
            key={text}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-4 rounded-2xl border border-[#c9a962]/10 bg-[#12100e]/80 px-4 py-3"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#c9a962]/10 text-[#c9a962]">
              <Icon size={18} />
            </span>
            <span className="text-[15px] text-[#e8d5a3]">{text}</span>
          </motion.li>
        ))}
      </ul>

      <div className="mt-6">
        <Button
          fullWidth
          disabled={isProcessing}
          onClick={() => completePayment()}
        >
          {isProcessing
            ? "Обработка…"
            : `Оплатить ${FULL_READING_PRODUCT.priceLabel}`}
        </Button>
        <p className="mt-3 text-center text-[11px] text-[#6a645c]">
          Демо-режим: оплата имитируется без списания средств
        </p>
      </div>
    </div>
  );
}
