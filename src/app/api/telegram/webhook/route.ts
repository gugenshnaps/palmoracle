import { NextResponse } from "next/server";
import { getTelegramBotToken } from "@/lib/telegram/bot-token";
import { sendTelegramMessage } from "@/lib/telegram/bot-api";

const WEB_APP_URL =
  process.env.OPENROUTER_SITE_URL ?? "https://palmoracle.vercel.app";

/**
 * Webhook для команд бота (опционально).
 * BotFather: /setwebhook → https://palmoracle.vercel.app/api/telegram/webhook
 */
export async function POST(request: Request) {
  const token = getTelegramBotToken();
  if (!token) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  try {
    const update = (await request.json()) as {
      message?: { chat?: { id?: number }; text?: string };
    };

    const chatId = update.message?.chat?.id;
    const text = update.message?.text?.trim();

    if (chatId && text === "/start") {
      await sendTelegramMessage({
        chatId,
        text: "Добро пожаловать в PalmOracle AI.\n\nЗагрузите фото ладони — AI соберёт персональный гид по линиям.",
        webAppUrl: WEB_APP_URL,
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
