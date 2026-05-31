"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: Variant;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-[#a88b4a] via-[#c9a962] to-[#a88b4a] text-[#0a0806] font-medium shadow-[0_0_24px_rgba(201,169,98,0.35)]",
  secondary:
    "border border-[#c9a962]/40 bg-[#12100e]/80 text-[#e8d5a3] backdrop-blur-sm",
  ghost: "text-[#c9a962] hover:bg-[#c9a962]/10",
};

export function Button({
  variant = "primary",
  fullWidth,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={cn(
        "rounded-2xl px-6 py-4 text-base tracking-wide transition-colors",
        "disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
