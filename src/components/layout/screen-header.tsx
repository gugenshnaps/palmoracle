"use client";

import { motion } from "framer-motion";

interface ScreenHeaderProps {
  title?: string;
  subtitle?: string;
  centered?: boolean;
}

export function ScreenHeader({
  title,
  subtitle,
  centered = true,
}: ScreenHeaderProps) {
  return (
    <header className={centered ? "text-center" : ""}>
      {title && (
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl font-light tracking-tight text-[#f5f0e8] sm:text-4xl"
        >
          {title}
        </motion.h1>
      )}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-3 text-[15px] leading-relaxed text-[#9a9288]"
        >
          {subtitle}
        </motion.p>
      )}
    </header>
  );
}
