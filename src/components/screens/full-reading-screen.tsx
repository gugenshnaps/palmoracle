"use client";

import { motion } from "framer-motion";
import { GoldCard } from "@/components/ui/gold-card";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store/app-context";
import { MOCK_PAID_LINES } from "@/lib/mock/palm-analysis";

export function FullReadingScreen() {
  const { reading, goTo } = useApp();
  const paidLines = reading?.paidAdditionalLines ?? MOCK_PAID_LINES;

  return (
    <div className="flex flex-1 flex-col">
      <h2 className="font-display text-2xl text-[#f5f0e8]">
        Дополнительные линии
      </h2>
      <p className="mt-2 text-sm text-[#9a9288]">Полный Premium-разбор</p>

      <div className="mt-6 flex flex-1 flex-col gap-4 overflow-y-auto pb-4">
        {paidLines.map((line, i) => (
          <GoldCard key={line.name} title={line.name} delay={i * 0.06}>
            {line.summary}
          </GoldCard>
        ))}
      </div>

      <motion.div className="mt-4">
        <Button variant="secondary" fullWidth onClick={() => goTo("free-result")}>
          Вернуться к гиду
        </Button>
      </motion.div>
    </div>
  );
}
