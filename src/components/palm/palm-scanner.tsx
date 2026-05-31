"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface PalmScannerProps {
  imageSrc: string;
  progress: number;
}

export function PalmScanner({ imageSrc, progress }: PalmScannerProps) {
  return (
    <div className="relative mx-auto aspect-[3/4] w-full max-w-[280px] overflow-hidden rounded-3xl border border-[#c9a962]/25">
      <Image
        src={imageSrc}
        alt="Ваша ладонь"
        fill
        className="object-cover"
        unoptimized
      />
      <div className="absolute inset-0 bg-[#070605]/40" />

      {/* Scan line */}
      <motion.div
        className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#e8d5a3] to-transparent shadow-[0_0_12px_#c9a962]"
        animate={{ top: ["8%", "92%", "8%"] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Palm lines overlay */}
      <svg
        className="absolute inset-0 h-full w-full opacity-70"
        viewBox="0 0 200 280"
        fill="none"
      >
        <motion.path
          d="M 60 220 Q 80 160 70 100 Q 65 60 75 40"
          stroke="#c9a962"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: progress / 100 }}
          transition={{ duration: 1.2 }}
        />
        <motion.path
          d="M 40 200 Q 100 180 150 190 Q 170 195 175 210"
          stroke="#e8d5a3"
          strokeWidth="1.2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: Math.min(1, progress / 80) }}
          transition={{ duration: 1.4, delay: 0.2 }}
        />
        <motion.path
          d="M 90 240 Q 100 200 95 150 Q 92 120 98 80"
          stroke="#8a7a4a"
          strokeWidth="1"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: Math.min(1, progress / 60) }}
          transition={{ duration: 1.6, delay: 0.4 }}
        />
        <motion.circle
          cx="120"
          cy="75"
          r="4"
          fill="#c9a962"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: progress > 70 ? 1 : 0,
            scale: progress > 70 ? 1 : 0,
          }}
        />
      </svg>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#070605] to-transparent p-4">
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
