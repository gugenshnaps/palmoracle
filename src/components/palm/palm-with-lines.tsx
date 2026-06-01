"use client";

import Image from "next/image";

const LINE_COLORS = {
  life: "#5ba86a",
  heart: "#c45c5c",
  head: "#5b8fd4",
  fate: "#d4a84b",
} as const;

interface PalmWithLinesProps {
  imageSrc: string;
  className?: string;
}

/**
 * Линии для кадра 4:5 с пальцами вверх (после normalizePalmImage).
 */
export function PalmWithLines({ imageSrc, className }: PalmWithLinesProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-[#e5e0d6] bg-[#fdfaf5] ${className ?? ""}`}
    >
      <div className="relative aspect-[4/5] w-full">
        <Image
          src={imageSrc}
          alt="Ваша ладонь"
          fill
          className="object-contain"
          unoptimized
        />
        <svg
          className="absolute inset-0 h-full w-full pointer-events-none"
          viewBox="0 0 200 250"
          fill="none"
          aria-hidden
        >
          <path
            d="M 58 218 Q 68 155 64 95 Q 62 58 68 32"
            stroke={LINE_COLORS.life}
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.88"
          />
          <path
            d="M 38 98 Q 100 88 162 98"
            stroke={LINE_COLORS.heart}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.88"
          />
          <path
            d="M 42 128 Q 100 122 158 130"
            stroke={LINE_COLORS.head}
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.88"
          />
          <path
            d="M 100 215 Q 100 145 100 48"
            stroke={LINE_COLORS.fate}
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.8"
          />
          {(
            [
              [68, 32, "1", LINE_COLORS.life],
              [162, 98, "2", LINE_COLORS.heart],
              [158, 130, "3", LINE_COLORS.head],
              [100, 48, "4", LINE_COLORS.fate],
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
      </div>
    </div>
  );
}
