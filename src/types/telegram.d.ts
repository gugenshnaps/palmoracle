interface TelegramWebAppUser {
  id: number;
  first_name?: string;
}

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  /** Подписанная строка для проверки на сервере */
  initData?: string;
  initDataUnsafe: { user?: TelegramWebAppUser };
  openTelegramLink?: (url: string) => void;
}

interface Window {
  Telegram?: { WebApp: TelegramWebApp };
}
