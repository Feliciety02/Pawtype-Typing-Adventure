import { useEffect, useState } from "react";

const THEME_KEY = "theme";
const THEME_CHANGE_EVENT = "pawtype-theme-change";

function canUseDOM() {
  return typeof window !== "undefined";
}

export function readThemeMode() {
  if (!canUseDOM()) return false;
  return window.localStorage.getItem(THEME_KEY) === "dark";
}

export function applyThemeMode(isDark: boolean) {
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", isDark);
  }

  if (!canUseDOM()) return;

  window.localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

export function useThemeMode() {
  const [dark, setDark] = useState(readThemeMode);

  useEffect(() => {
    const syncTheme = () => {
      const next = readThemeMode();
      setDark(next);
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", next);
      }
    };

    syncTheme();

    if (!canUseDOM()) return;

    window.addEventListener("storage", syncTheme);
    window.addEventListener(THEME_CHANGE_EVENT, syncTheme);

    return () => {
      window.removeEventListener("storage", syncTheme);
      window.removeEventListener(THEME_CHANGE_EVENT, syncTheme);
    };
  }, []);

  return {
    dark,
    mode: dark ? "dark" : "light",
    setThemeMode(next: "light" | "dark") {
      applyThemeMode(next === "dark");
    },
    toggleThemeMode() {
      applyThemeMode(!readThemeMode());
    },
  };
}
