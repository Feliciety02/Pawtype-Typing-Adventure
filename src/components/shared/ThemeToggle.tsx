import { useEffect, useState } from "react";

const THEME_KEY = "theme";

function readThemeMode() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(THEME_KEY) === "dark";
}

function applyThemeMode(isDark: boolean) {
  document.documentElement.classList.toggle("dark", isDark);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  }
}

export function ThemeToggle() {
  const [dark, setDark] = useState(readThemeMode);

  useEffect(() => {
    const sync = () => {
      const isDark = readThemeMode();
      setDark(isDark);
      document.documentElement.classList.toggle("dark", isDark);
    };

    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    applyThemeMode(next);
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <button onClick={toggle} className="pixel-btn pixel-btn-secondary" aria-label="Toggle theme">
      {dark ? "🌙 Night" : "☀ Day"}
    </button>
  );
}
