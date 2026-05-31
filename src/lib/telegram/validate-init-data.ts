import { createHmac, timingSafeEqual } from "crypto";
import { getTelegramBotToken } from "@/lib/telegram/bot-token";

export interface TelegramInitUser {
  id: number;
  first_name?: string;
  username?: string;
}

/**
 * Проверка подписи Telegram Web App initData.
 * @see https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export function validateTelegramInitData(
  initData: string,
  botToken: string,
): boolean {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return false;

  params.delete("hash");

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = createHmac("sha256", "WebAppData")
    .update(botToken)
    .digest();

  const calculated = createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  try {
    return timingSafeEqual(
      Buffer.from(calculated, "hex"),
      Buffer.from(hash, "hex"),
    );
  } catch {
    return calculated === hash;
  }
}

export function parseInitDataUser(initData: string): TelegramInitUser | null {
  const raw = new URLSearchParams(initData).get("user");
  if (!raw) return null;
  try {
    const user = JSON.parse(raw) as TelegramInitUser;
    return user?.id ? user : null;
  } catch {
    return null;
  }
}

/** Возвращает проверенный user id или null. Без токена — пропускает проверку. */
export function resolveTrustedUserId(
  initData: string | undefined,
  fallbackUserId?: number,
): { userId?: number; error?: string } {
  const token = getTelegramBotToken();
  if (!token) {
    return { userId: fallbackUserId };
  }

  if (!initData?.trim()) {
    return { userId: fallbackUserId };
  }

  if (!validateTelegramInitData(initData, token)) {
    return { error: "Invalid Telegram initData" };
  }

  const user = parseInitDataUser(initData);
  return { userId: user?.id ?? fallbackUserId };
}
