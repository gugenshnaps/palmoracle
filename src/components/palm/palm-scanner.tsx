"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { PalmLinesSvg } from "@/components/palm/palm-lines-svg";

interface PalmScannerProps {
  imageSrc: string;
  progress: number;
}

export function PalmScanner({ imageSrc, progress }: PalmScannerProps) {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[280px] overflow-hidden rounded-3xl border border-[#c9a962]/25 bg-[#fdfaf5]">
      <Image
        src={imageSrc}
        alt="Ваша ладонь"
        fill
        className="object-contain"
        unoptimized
      />
      <div className="absolute inset-0 bg-[#070605]/25" />

      <motion.div
        className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#e8d5a3] to-transparent shadow-[0_0_12px_#c9a962]"
        animate={{ top: ["8%", "92%", "8%"] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />

      <PalmLinesSvg progress={progress} variant="scan" />

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#070605]/80 to-transparent p-4">
        <div className="h-1 overflow-hidden rounded-full bg-[#1a1714]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#8a7a4a] to-[#e8d5a3]"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}
