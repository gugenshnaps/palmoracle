"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface GoldCardProps {
  title: string;
  children: React.ReactNode;
  icon?: string;
  highlight?: string;
  className?: string;
  delay?: number;
}

export function GoldCard({
  title,
  children,
  icon,
  highlight,
  className,
  delay = 0,
}: GoldCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-[#c9a962]/20",
        "bg-gradient-to-br from-[#1a1714] to-[#0f0d0b] p-6",
        "shadow-[inset_0_1px_0_rgba(232,213,163,0.08)]",
        className,
      )}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#c9a962]/10 blur-2xl" />
      <div className="relative">
        <div className="mb-3 flex items-center gap-3">
          {icon && (
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c9a962]/30 bg-[#c9a962]/10 text-lg text-[#e8d5a3]">
              {icon}
            </span>
          )}
          <h3 className="font-display text-xl text-[#f5f0e8]">{title}</h3>
        </div>
        {highlight && (
          <p className="mb-3 text-sm font-medium tracking-wide text-[#c9a962]">
            {highlight}
          </p>
        )}
        <p className="text-[15px] leading-relaxed text-[#b8b0a4]">{children}</p>
      </div>
    </motion.article>
  );
}
