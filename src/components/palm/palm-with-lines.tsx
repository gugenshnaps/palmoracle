"use client";

import Image from "next/image";
import { PalmLinesSvg } from "@/components/palm/palm-lines-svg";

interface PalmWithLinesProps {
  imageSrc: string;
  className?: string;
}

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
        <PalmLinesSvg variant="result" />
      </div>
    </div>
  );
}
