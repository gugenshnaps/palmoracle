"use client";

import { AppShell } from "@/components/layout/app-shell";
import { WelcomeScreen } from "@/components/screens/welcome-screen";
import { UploadScreen } from "@/components/screens/upload-screen";
import { AnalysisScreen } from "@/components/screens/analysis-screen";
import { FreeResultScreen } from "@/components/screens/free-result-screen";
import { PaywallScreen } from "@/components/screens/paywall-screen";
import { FullReadingScreen } from "@/components/screens/full-reading-screen";
import { AppProvider, useApp } from "@/lib/store/app-context";
import type { AppScreen } from "@/lib/types/reading";

function ScreenRouter() {
  const { screen } = useApp();

  const screens: Record<AppScreen, React.ReactNode> = {
    welcome: <WelcomeScreen />,
    upload: <UploadScreen />,
    analysis: <AnalysisScreen />,
    "free-result": <FreeResultScreen />,
    paywall: <PaywallScreen />,
    "full-reading": <FullReadingScreen />,
  };

  return <AppShell screenKey={screen}>{screens[screen]}</AppShell>;
}

export function PalmOracleApp() {
  return (
    <AppProvider>
      <ScreenRouter />
    </AppProvider>
  );
}
