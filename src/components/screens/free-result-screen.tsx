"use client";

import { motion } from "framer-motion";
import { Share2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfographicViewer } from "@/components/reading/infographic-viewer";
import { useApp } from "@/lib/store/app-context";
import { MOCK_READING } from "@/lib/mock/reading-data";
import { ENABLE_PAYWALL } from "@/lib/config/launch";
import { useTelegram } from "@/lib/telegram/provider";
import { getTelegramShareUrl } from "@/lib/telegram/share";

export function FreeResultScreen() {
  const { reading, goTo, resetForNewAnalysis } = useApp();
  const { webApp } = useTelegram();
  const data = reading ?? MOCK_READING;
  const infographic = data.infographic;

  const handleShare = () => {
    const url = getTelegramShareUrl();
    if (webApp.openTelegramLink) {
      webApp.openTelegramLink(url);
    } else {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-display text-2xl text-[#f5f0e8]"
      >
        Ваш гид по ладони
      </motion.h2>
      <p className="mt-2 text-sm text-[#9a9288]">
        Сохраните или поделитесь — идеально для Stories и рилсов
      </p>

      <div className="mt-4 flex-1 overflow-y-auto pb-4">
        <InfographicViewer
          imageUrl={infographic.imageUrl}
          onShare={handleShare}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-4 rounded-2xl border border-[#c9a962]/25 bg-[#c9a962]/5 p-4"
      >
        <p className="text-center text-sm leading-relaxed text-[#e8d5a3]">
          ✦ {infographic.rareSignTeaser}
        </p>
      </motion.div>

      <div className="mt-6 flex flex-col gap-3">
        <Button fullWidth onClick={handleShare}>
          <span className="flex items-center justify-center gap-2">
            <Share2 size={20} />
            Поделиться в Telegram
          </span>
        </Button>
        <Button variant="secondary" fullWidth onClick={resetForNewAnalysis}>
          <span className="flex items-center justify-center gap-2">
            <RotateCcw size={18} />
            Новый анализ
          </span>
        </Button>
        {ENABLE_PAYWALL && (
          <Button variant="ghost" fullWidth onClick={() => goTo("paywall")}>
            Открыть полный разбор
          </Button>
        )}
      </div>
    </div>
  );
}
