"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Download, Share2 } from "lucide-react";
import { useTelegram } from "@/lib/telegram/provider";

interface InfographicViewerProps {
  imageUrl: string;
  onShare?: () => void;
}

export function InfographicViewer({ imageUrl, onShare }: InfographicViewerProps) {
  const { webApp } = useTelegram();

  const handleShare = () => {
    if (onShare) {
      onShare();
      return;
    }
    const text = encodeURIComponent("Мой разбор ладони — PalmOracle AI");
    webApp.openTelegramLink?.(
      `https://t.me/share/url?url=${encodeURIComponent("https://t.me")}&text=${text}`,
    );
  };

  const handleSave = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "palm-oracle-guide.png";
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-[#e8e4dc] bg-[#fdfaf5] shadow-[0_8px_40px_rgba(0,0,0,0.35)]"
    >
      <div className="relative aspect-[3/4] w-full">
        <Image
          src={imageUrl}
          alt="Гид по хиромантии — ваша ладонь"
          fill
          className="object-contain object-top"
          unoptimized
          priority
        />
      </div>
      <div className="flex gap-2 border-t border-[#e8e4dc] bg-[#fdfaf5] p-3">
        <button
          type="button"
          onClick={handleShare}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#d4cfc4] py-2.5 text-sm text-[#3d3830]"
        >
          <Share2 size={16} />
          Поделиться
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#d4cfc4] py-2.5 text-sm text-[#3d3830]"
        >
          <Download size={16} />
          Сохранить
        </button>
      </div>
    </motion.div>
  );
}
