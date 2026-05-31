"use client";

import { useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { GoldCard } from "@/components/ui/gold-card";
import { useApp } from "@/lib/store/app-context";
import { useTelegram } from "@/lib/telegram/provider";
import { MOCK_READING } from "@/lib/mock/reading-data";

const SWIPE_THRESHOLD = 50;

export function FullReadingScreen() {
  const { reading } = useApp();
  const { webApp } = useTelegram();
  const cards = reading?.full ?? MOCK_READING.full ?? [];
  const [index, setIndex] = useState(0);

  const go = (dir: 1 | -1) => {
    setIndex((i) => Math.max(0, Math.min(cards.length - 1, i + dir)));
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) go(1);
    else if (info.offset.x > SWIPE_THRESHOLD) go(-1);
  };

  const handleShare = () => {
    const text = `PalmOracle AI — мой разбор: «${cards[index].title}»`;
    if (webApp.openTelegramLink) {
      webApp.openTelegramLink!(
        `https://t.me/share/url?url=${encodeURIComponent("https://t.me")}&text=${encodeURIComponent(text)}`,
      );
    }
  };

  const card = cards[index];

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-[#9a9288]">
          {index + 1} / {cards.length}
        </p>
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1 text-sm text-[#c9a962]"
        >
          <Share2 size={16} />
          Поделиться
        </button>
      </div>

      <div className="relative flex flex-1 flex-col justify-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={card.id}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={onDragEnd}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
          >
            <GoldCard title={card.title} highlight={card.highlight}>
              {card.content}
            </GoldCard>
          </motion.div>
        </AnimatePresence>

        <p className="mt-4 text-center text-xs text-[#6a645c]">
          Листайте свайпом влево или вправо
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={index === 0}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[#c9a962]/30 text-[#c9a962] disabled:opacity-30"
          aria-label="Предыдущая карточка"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex flex-1 justify-center gap-1.5">
          {cards.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === index
                  ? "w-6 bg-[#c9a962]"
                  : "w-1.5 bg-[#c9a962]/30"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          disabled={index === cards.length - 1}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[#c9a962]/30 text-[#c9a962] disabled:opacity-30"
          aria-label="Следующая карточка"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
