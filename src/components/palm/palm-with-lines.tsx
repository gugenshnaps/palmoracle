"use client";

import Image from "next/image";

const LINE_COLORS = {
  heart: "#c45c5c",
  head: "#5b8fd4",
  life: "#5ba86a",
  fate: "#d4a84b",
} as const;

interface PalmWithLinesProps {
  imageSrc: string;
  className?: string;
}

/** Стилизованные линии поверх фото ладони */
export function PalmWithLines({ imageSrc, className }: PalmWithLinesProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-[#f5f0e8] ${className ?? ""}`}
    >
      <div className="relative aspect-[4/5] w-full">
        <Image
          src={imageSrc}
          alt="Ваша ладонь"
          fill
          className="object-cover"
          unoptimized
        />
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 200 250"
          fill="none"
          aria-hidden
        >
          <path
            d="M 45 200 Q 55 140 50 85 Q 48 55 52 35"
            stroke={LINE_COLORS.life}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M 35 175 Q 95 155 155 168"
            stroke={LINE_COLORS.heart}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M 40 150 Q 100 145 145 155"
            stroke={LINE_COLORS.head}
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M 100 220 Q 98 150 102 70"
            stroke={LINE_COLORS.fate}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.75"
          />
          {(
            [
              [50, 35, "1", LINE_COLORS.life],
              [155, 168, "2", LINE_COLORS.heart],
              [145, 155, "3", LINE_COLORS.head],
              [102, 70, "4", LINE_COLORS.fate],
            ] as const
          ).map(([cx, cy, num, color]) => (
            <g key={num}>
              <circle cx={cx} cy={cy} r="10" fill={color} opacity="0.9" />
              <text
                x={cx}
                y={cy + 4}
                textAnchor="middle"
                fill="#fff"
                fontSize="10"
                fontWeight="600"
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
