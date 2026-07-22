import { useState } from "react";

import { useThemeMode } from "@/hooks/use-theme-mode";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { dark, toggleThemeMode } = useThemeMode();
  const [failed, setFailed] = useState(false);

  return (
    <button
      type="button"
      className={className}
      aria-label={dark ? "Switch to day mode" : "Switch to night mode"}
      title={dark ? "Switch to day mode" : "Switch to night mode"}
      onClick={toggleThemeMode}
    >
      <div className="hud-theme-icon-wrap">
        {failed ? (
          <span
            className={`hud-theme-icon ${dark ? "is-active" : ""}`}
            role="img"
            aria-hidden="true"
          >
            🌙
          </span>
        ) : (
          <>
            <img
              src="/shared/icons/nav/sun.webp"
              className={`hud-theme-icon ${!dark ? "is-active" : ""}`}
              alt=""
              aria-hidden="true"
              onError={() => setFailed(true)}
            />
            <img
              src="/shared/icons/nav/moon.webp"
              className={`hud-theme-icon ${dark ? "is-active" : ""}`}
              alt=""
              aria-hidden="true"
              onError={() => setFailed(true)}
            />
          </>
        )}
      </div>
    </button>
  );
}
