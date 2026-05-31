import { BOT_DEEP_LINK } from "@/lib/config/launch";

export function getShareText(): string {
  return "Мой AI-гид по линиям ладони — PalmOracle AI";
}

export function getTelegramShareUrl(text?: string): string {
  const msg = encodeURIComponent(text ?? getShareText());
  const url = encodeURIComponent(BOT_DEEP_LINK ?? "https://t.me");
  return `https://t.me/share/url?url=${url}&text=${msg}`;
}
