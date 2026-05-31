"use client";

import { motion } from "framer-motion";
import { Share2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PalmGuidePoster } from "@/components/reading/palm-guide-poster";
import { useApp } from "@/lib/store/app-context";
import { MOCK_ANALYSIS } from "@/lib/mock/palm-analysis";
import { useTelegram } from "@/lib/telegram/provider";
import { getTelegramShareUrl } from "@/lib/telegram/share";

export function FreeResultScreen() {
  const { reading, palmImage, goTo, resetForNewAnalysis } = useApp();
  const { webApp } = useTelegram();

  const analysis = reading?.analysis ?? MOCK_ANALYSIS;
  if (!palmImage) return null;

  const handleShare = () => {
    const url = getTelegramShareUrl();
    if (webApp.openTelegramLink) webApp.openTelegramLink(url);
    else window.open(url, "_blank");
  };

  const handleSave = () => {
    const el = document.getElementById("palm-guide-poster");
    if (!el) return;
    import("html-to-image")
      .then(({ toPng }) => toPng(el, { pixelRatio: 2 }))
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "palm-oracle-guide.png";
        link.href = dataUrl;
        link.click();
      })
      .catch(() => {});
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
        4 основные линии · дополнительные в Premium
      </p>

      <div className="mt-4 flex-1 overflow-y-auto pb-4">
        <PalmGuidePoster
          palmImage={palmImage}
          analysis={analysis}
          onUnlockAdditional={() => goTo("paywall")}
        />
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <Button fullWidth onClick={handleShare}>
          <span className="flex items-center justify-center gap-2">
            <Share2 size={20} />
            Поделиться
          </span>
        </Button>
        <Button variant="secondary" fullWidth onClick={handleSave}>
          Сохранить для Stories
        </Button>
        <Button variant="ghost" fullWidth onClick={() => goTo("paywall")}>
          Открыть дополнительные линии
        </Button>
        <Button variant="ghost" fullWidth onClick={resetForNewAnalysis}>
          <span className="flex items-center justify-center gap-2">
            <RotateCcw size={18} />
            Новый анализ
          </span>
        </Button>
      </div>
    </div>
  );
}
