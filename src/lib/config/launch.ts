export const BOT_USERNAME = process.env.NEXT_PUBLIC_BOT_USERNAME ?? "";

/** Доп. линии всегда с замком; paywall-экран доступен из гида */
export const ENABLE_PAYWALL =
  process.env.NEXT_PUBLIC_ENABLE_PAYWALL !== "false";

export const BOT_DEEP_LINK = BOT_USERNAME
  ? `https://t.me/${BOT_USERNAME}`
  : null;
