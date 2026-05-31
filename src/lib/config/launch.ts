export const BOT_USERNAME = process.env.NEXT_PUBLIC_BOT_USERNAME ?? "";

export const ENABLE_PAYWALL =
  process.env.NEXT_PUBLIC_ENABLE_PAYWALL === "true";

export const BOT_DEEP_LINK = BOT_USERNAME
  ? `https://t.me/${BOT_USERNAME}`
  : null;
