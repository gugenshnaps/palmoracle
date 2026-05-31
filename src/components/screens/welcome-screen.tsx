"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store/app-context";

export function WelcomeScreen() {
  const { goTo } = useApp();

  return (
    <div className="flex flex-1 flex-col items-center justify-between py-8">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-10 flex h-24 w-24 items-center justify-center rounded-full border border-[#c9a962]/30 bg-[#c9a962]/5"
        >
          <span className="font-display text-4xl text-[#c9a962]">☽</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="font-display text-4xl font-light tracking-wide text-[#f5f0e8]"
        >
          PalmOracle AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-5 max-w-xs text-[16px] leading-relaxed text-[#9a9288]"
        >
          Узнай, что твоя ладонь может рассказать о тебе
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-8 text-xs tracking-widest text-[#8a7a4a] uppercase"
        >
          Развлекательный AI-оракул
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full"
      >
        <Button fullWidth onClick={() => goTo("upload")}>
          Начать анализ
        </Button>
        <p className="mt-4 text-center text-[11px] text-[#6a645c]">
          Не является медицинской или научной консультацией
        </p>
      </motion.div>
    </div>
  );
}
