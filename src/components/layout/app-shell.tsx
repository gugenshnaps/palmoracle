"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
  screenKey: string;
}

export function AppShell({ children, screenKey }: AppShellProps) {
  return (
    <div className="relative mx-auto flex min-h-[100dvh] max-w-md flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(201,169,98,0.12),transparent)]" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#c9a962]/5 blur-3xl" />
      <AnimatePresence mode="wait">
        <motion.main
          key={screenKey}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex flex-1 flex-col px-6 pb-8 pt-6"
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
