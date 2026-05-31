"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
interface TelegramContextValue {
  webApp: TelegramWebApp;
  isReady: boolean;
  userId?: number;
  userName?: string;
}

function getWebApp(): TelegramWebApp {
  if (typeof window !== "undefined" && window.Telegram?.WebApp) {
    return window.Telegram.WebApp;
  }
  return {
    ready: () => {},
    expand: () => {},
    setHeaderColor: () => {},
    setBackgroundColor: () => {},
    initDataUnsafe: {},
    openTelegramLink: () => {},
  };
}

const TelegramContext = createContext<TelegramContextValue | null>(null);

export function TelegramProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  const [webApp] = useState(getWebApp);

  useEffect(() => {
    try {
      webApp.ready();
      webApp.expand();
      webApp.setHeaderColor("#070605");
      webApp.setBackgroundColor("#070605");
    } catch {
      /* Running outside Telegram — dev preview */
    }
    setIsReady(true);
  }, [webApp]);

  const user = webApp.initDataUnsafe?.user;

  return (
    <TelegramContext.Provider
      value={{
        webApp,
        isReady,
        userId: user?.id,
        userName: user?.first_name,
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
}

export function useTelegram() {
  const ctx = useContext(TelegramContext);
  if (!ctx) {
    throw new Error("useTelegram must be used within TelegramProvider");
  }
  return ctx;
}
