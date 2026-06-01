"use client";

import { motion } from "framer-motion";

const LINE_COLORS = {
  life: "#5ba86a",
  heart: "#c45c5c",
  head: "#5b8fd4",
  fate: "#d4a84b",
  scan: "#c9a962",
  scanLight: "#e8d5a3",
} as const;

interface PalmLinesSvgProps {
  /** 0–100 для анимации сканирования */
  progress?: number;
  variant?: "scan" | "result";
}

/** Линии для кадра 4:5, пальцы вверх (после normalize) */
export function PalmLinesSvg({
  progress = 100,
  variant = "result",
}: PalmLinesSvgProps) {
  const isScan = variant === "scan";
  const life = isScan ? LINE_COLORS.scan : LINE_COLORS.life;
  const heart = isScan ? LINE_COLORS.scanLight : LINE_COLORS.heart;
  const head = isScan ? LINE_COLORS.scan : LINE_COLORS.head;
  const fate = isScan ? LINE_COLORS.scanLight : LINE_COLORS.fate;
  const p = progress / 100;

  return (
    <svg
      className="absolute inset-0 h-full w-full pointer-events-none"
      viewBox="0 0 200 250"
      fill="none"
      aria-hidden
    >
      <motion.path
        d="M 58 218 Q 68 155 64 95 Q 62 58 68 32"
        stroke={life}
        strokeWidth={isScan ? 1.5 : 2.2}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: p }}
        opacity={isScan ? 0.7 : 0.88}
      />
      <motion.path
        d="M 38 98 Q 100 88 162 98"
        stroke={heart}
        strokeWidth={isScan ? 1.2 : 2}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: Math.min(1, p * 1.1) }}
        opacity={isScan ? 0.7 : 0.88}
      />
      <motion.path
        d="M 42 128 Q 100 122 158 130"
        stroke={head}
        strokeWidth={isScan ? 1 : 1.8}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: Math.min(1, p * 1.2) }}
        opacity={isScan ? 0.7 : 0.88}
      />
      <motion.path
        d="M 100 215 Q 100 145 100 48"
        stroke={fate}
        strokeWidth={isScan ? 1 : 1.6}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: Math.min(1, p * 0.9) }}
        opacity={isScan ? 0.65 : 0.8}
      />
      {!isScan &&
        (
          [
            [68, 32, "1", life],
            [162, 98, "2", heart],
            [158, 130, "3", head],
            [100, 48, "4", fate],
          ] as const
        ).map(([cx, cy, num, color]) => (
          <g key={num}>
            <circle cx={cx} cy={cy} r="9" fill={color} />
            <text
              x={cx}
              y={cy + 3.5}
              textAnchor="middle"
              fill="#fff"
              fontSize="9"
              fontWeight="700"
            >
              {num}
            </text>
          </g>
        ))}
    </svg>
  );
}
