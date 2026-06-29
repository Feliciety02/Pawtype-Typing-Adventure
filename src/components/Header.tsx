import { useEffect, useRef, useState } from "react";
import { Bell, Settings } from "lucide-react";
import { useGame } from "../lib/game/store";
import { useWorld, WORLDS } from "./WorldTheme";
import { WorldSwitcher } from "./WorldSwitcher";
import { ThemeToggle } from "./ThemeToggle";

export type View = "hub" | "practice" | "adventure" | "lessons" | "shop" | "achievements" | "stats" | "library";

export function Header({ view, onViewChange }: { view: View; onViewChange: (v: View) => void }) {
  const { state } = useGame();
  const { player } = state;
  const { world } = useWorld();
  const currentWorld = WORLDS.find((w) => w.id === world)!;
  const [crt, setCrt] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
  const sparkId = useRef(0);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("crt-mode", crt);
  }, [crt]);

  useEffect(() => {
    if (!settingsOpen) return;
    const closeSettings = (event: MouseEvent) => {
      if (!settingsRef.current?.contains(event.target as Node)) setSettingsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSettingsOpen(false);
    };
    document.addEventListener("mousedown", closeSettings);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeSettings);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [settingsOpen]);

  const NAV_ITEMS: { icon: string; label: string; view: View }[] = [
    { icon: "⌂", label: "Hub", view: "hub" },
    { icon: "⌨", label: "Practice", view: "practice" },
    { icon: "⚔", label: "Adventure", view: "adventure" },
    { icon: "▤", label: "Lessons", view: "lessons" },
    { icon: "◈", label: "Shop", view: "shop" },
    { icon: "★", label: "Achievements", view: "achievements" },
    { icon: "▥", label: "Stats", view: "stats" },
    { icon: "📖", label: "Library", view: "library" },
  ];

  const burstNavSparkles = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const batch = Array.from({ length: 3 }).map(() => ({
      id: sparkId.current++,
      x: rect.left + Math.random() * rect.width,
      y: rect.top + Math.random() * rect.height,
    }));
    setSparkles((s) => [...s, ...batch]);
    setTimeout(() => setSparkles((s) => s.slice(batch.length)), 600);
  };

  return (
    <header className="game-hud">
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="hud-nav-particle"
          style={{ left: s.x, top: s.y, "--dx": `${-6 + Math.random() * 12}px`, "--dy": `${-6 - Math.random() * 6}px` } as React.CSSProperties}
        />
      ))}
      <div className="hud-brand" aria-label="Pawtype">
        <div className="hud-logo"><span>P</span></div>
        <div className="min-w-0">
          <div className="hud-title">Pawtype</div>
          <div className="hud-subtitle">Cozy pixel typing tutor</div>
        </div>
      </div>
      <nav className="hud-menu" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.view}
            className={`hud-nav-item ${view === item.view ? "is-active" : ""}`}
            onClick={() => onViewChange(item.view)}
            onMouseEnter={burstNavSparkles}
            type="button"
          >
            <span className="hud-nav-icon" aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="hud-player">
        <div className="hud-stat-bar">
          <div className="hud-stat-item" title="Level">
            <span className="hud-stat-icon">⬆</span>
            <strong>{player.level}</strong>
          </div>
          <div className="hud-stat-divider" />
          <div className="hud-stat-item" title="Coins">
            <span className="hud-stat-icon">🪙</span>
            <strong>{player.coins.toLocaleString()}</strong>
          </div>
          <div className="hud-stat-divider" />
          <div className="hud-stat-item" title="Streak">
            <span className="hud-stat-icon">🔥</span>
            <strong>{player.streak}</strong>
          </div>
        </div>
        <button className="hud-icon-btn hud-icon-btn-soon" type="button" aria-label="Notifications coming soon" title="Notifications coming soon" disabled>
          <Bell size={14} />
          <span className="hud-soon-badge">Soon</span>
        </button>
        <div className="hud-settings" ref={settingsRef}>
          <button className={`hud-icon-btn ${settingsOpen ? "is-active" : ""}`} onClick={() => setSettingsOpen((o) => !o)} aria-label="Open settings" aria-expanded={settingsOpen} title="Settings" type="button">
            <Settings size={14} />
          </button>
          {settingsOpen && (
            <div className="hud-settings-panel animate-pixel-pop">
              <div className="hud-settings-title">Settings</div>
              <div className="hud-settings-row"><span>World</span><strong>{currentWorld.name}</strong></div>
              <WorldSwitcher />
              <ThemeToggle />
              <button className={`pixel-btn pixel-btn-secondary ${crt ? "is-active" : ""}`} onClick={() => setCrt((c) => !c)} type="button">
                CRT {crt ? "On" : "Off"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
