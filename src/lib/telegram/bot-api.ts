import { getTelegramBotToken } from "@/lib/telegram/bot-token";

const TELEGRAM_API = "https://api.telegram.org";

export interface SendMessageOptions {
  chatId: number;
  text: string;
  parseMode?: "HTML" | "MarkdownV2";
  /** Кнопка «Открыть Web App» */
  webAppUrl?: string;
}

/**
 * Отправка сообщения через Bot API.
 * TODO: использовать после /start, оплаты, уведомлений.
 */
export async function sendTelegramMessage(
  options: SendMessageOptions,
): Promise<{ ok: boolean; error?: string }> {
  const token = getTelegramBotToken();
  if (!token) {
    return { ok: false, error: "TELEGRAM_BOT_TOKEN not configured" };
  }

  const body: Record<string, unknown> = {
    chat_id: options.chatId,
    text: options.text,
    parse_mode: options.parseMode,
  };

  if (options.webAppUrl) {
    body.reply_markup = {
      inline_keyboard: [
        [
          {
            text: "Открыть PalmOracle AI",
            web_app: { url: options.webAppUrl },
          },
        ],
      ],
    };
  }

  const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    return { ok: false, error: err.slice(0, 200) };
  }

  return { ok: true };
}
