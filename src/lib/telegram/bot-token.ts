/**
 * Серверный токен бота. Никогда не используйте NEXT_PUBLIC_ — токен только на сервере.
 * BotFather → /token
 */
export function getTelegramBotToken(): string | undefined {
  return process.env.TELEGRAM_BOT_TOKEN?.trim() || undefined;
}

export function isTelegramBotConfigured(): boolean {
  return Boolean(getTelegramBotToken());
}
