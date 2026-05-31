"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import type { PalmAnalysisResult } from "@/lib/types/palm-analysis";
import { PalmWithLines } from "@/components/palm/palm-with-lines";

const LINE_META = [
  { key: "heart" as const, num: 1, color: "#c45c5c" },
  { key: "head" as const, num: 2, color: "#5b8fd4" },
  { key: "life" as const, num: 3, color: "#5ba86a" },
  { key: "fate" as const, num: 4, color: "#d4a84b" },
];

interface PalmGuidePosterProps {
  palmImage: string;
  analysis: PalmAnalysisResult;
  onUnlockAdditional?: () => void;
}

function CreamCard({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-2xl border border-[#e5e0d6] bg-[#fdfaf5] p-4 shadow-sm"
    >
      {children}
    </motion.article>
  );
}

export function PalmGuidePoster({
  palmImage,
  analysis,
  onUnlockAdditional,
}: PalmGuidePosterProps) {
  const { lines, additionalLines, rareSign } = analysis;

  return (
    <div
      id="palm-guide-poster"
      className="space-y-4 rounded-3xl bg-[#fdfaf5] p-4 text-[#2a2620]"
    >
      <header className="border-b border-[#e8e4dc] pb-4 text-center">
        <p className="text-[10px] tracking-[0.25em] text-[#8a8278] uppercase">
          PalmOracle AI
        </p>
        <h3 className="font-display mt-1 text-2xl font-light">Гид по хиромантии</h3>
        <p className="mt-1 text-xs text-[#8a7a4a]">✦ Ваша ладонь ✦</p>
      </header>

      <div className="grid gap-4">
        <PalmWithLines imageSrc={palmImage} />
        <div className="space-y-3">
          {LINE_META.map(({ key, num, color }, i) => {
            const line = lines[key];
            return (
              <CreamCard key={key} delay={i * 0.06}>
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: color }}
                  >
                    {num}
                  </span>
                  <h4 className="font-medium">{line.title}</h4>
                </div>
                <p className="text-[13px] leading-relaxed text-[#4a4540]">
                  {line.summary}
                </p>
                <p className="mt-2 text-[11px] text-[#8a8278]">
                  {line.keywords.join(" · ")}
                </p>
              </CreamCard>
            );
          })}
        </div>
      </div>

      <CreamCard delay={0.3}>
        <div className="relative overflow-hidden rounded-xl">
          <div className="space-y-2 blur-[3px] select-none">
            <p className="text-sm font-medium text-[#4a4540]">
              Дополнительные линии обнаружены
            </p>
            <ul className="text-[12px] text-[#6a645c]">
              {additionalLines.detected.map((name) => (
                <li key={name}>• {name}</li>
              ))}
            </ul>
            <p className="text-[12px]">{additionalLines.teaser}</p>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#fdfaf5]/75">
            <Lock className="text-[#c9a962]" size={28} />
            <p className="mt-2 text-center text-sm font-medium text-[#3d3830]">
              Полный разбор доп. линий — Premium
            </p>
            {onUnlockAdditional && (
              <button
                type="button"
                onClick={onUnlockAdditional}
                className="mt-3 rounded-full border border-[#c9a962] px-5 py-2 text-xs font-medium text-[#8a7a4a]"
              >
                Открыть
              </button>
            )}
          </div>
        </div>
      </CreamCard>

      <footer className="border-t border-[#e8e4dc] pt-3 text-center">
        <p className="text-[11px] italic text-[#8a8278]">
          ✦ {rareSign.teaser}
        </p>
        <p className="mt-2 text-[9px] tracking-widest text-[#b8b0a4] uppercase">
          Хиромантия — искусство понимания себя
        </p>
      </footer>
    </div>
  );
}
