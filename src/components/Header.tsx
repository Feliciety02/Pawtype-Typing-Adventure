import { useEffect, useRef, useState } from "react";
import { Bell, Settings } from "lucide-react";
import { useGame } from "../lib/game/store";
import { NotificationsPanel } from "./NotificationsPanel";
import { SparkleTrail } from "./SparkleTrail";
import {
  getNotifications,
  subscribeNotifications,
} from "../lib/game/notifications";

export type View = "hub" | "practice" | "adventure" | "lessons" | "shop" | "achievements" | "stats" | "settings";

const CRT_KEY = "pawtype-crt-on";
const SPARKLE_KEY = "pawtype-sparkle-on";
const THEME_KEY = "theme";
const FOCUS_GLOW_KEY = "pawtype-focus-glow";
const REDUCE_MOTION_KEY = "pawtype-reduce-motion";

export function Header({ view, onViewChange }: { view: View; onViewChange: (v: View) => void }) {
  const { state } = useGame();
  const { player, inventory } = state;
  const [crt, setCrt] = useState(() =>
    typeof window !== "undefined" && window.localStorage.getItem(CRT_KEY) === "1"
  );
  const [sparkle, setSparkle] = useState(() =>
    typeof window !== "undefined" && window.localStorage.getItem(SPARKLE_KEY) === "1"
  );
  const [notifOpen, setNotifOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
  const sparkId = useRef(0);
  const notifRef = useRef<HTMLDivElement>(null);

  const ownsCrt = inventory.items.includes("crt-shader");
  const ownsSparkle = inventory.items.includes("sparkle-trail");

  useEffect(() => {
    const syncDisplayPrefs = () => {
      document.documentElement.classList.toggle("dark", localStorage.getItem(THEME_KEY) === "dark");
      document.documentElement.classList.toggle("pawtype-focus-glow", localStorage.getItem(FOCUS_GLOW_KEY) === "1");
      document.documentElement.classList.toggle("pawtype-reduce-motion", localStorage.getItem(REDUCE_MOTION_KEY) === "1");
    };

    syncDisplayPrefs();
    window.addEventListener("storage", syncDisplayPrefs);
    return () => window.removeEventListener("storage", syncDisplayPrefs);
  }, []);

  useEffect(() => {
    const isOn = ownsCrt && crt;
    document.documentElement.classList.toggle("crt-mode", isOn);
    if (typeof window !== "undefined") window.localStorage.setItem(CRT_KEY, crt ? "1" : "0");
  }, [crt, ownsCrt]);

  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem(SPARKLE_KEY, sparkle ? "1" : "0");
  }, [sparkle]);

  /** Sync from localStorage when settings page dispatches "storage" event */
  useEffect(() => {
    const handler = () => {
      setCrt(localStorage.getItem(CRT_KEY) === "1");
      setSparkle(localStorage.getItem(SPARKLE_KEY) === "1");
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  useEffect(() => {
    const refresh = () => setUnread(getNotifications().filter((n) => !n.read).length);
    refresh();
    return subscribeNotifications(refresh);
  }, []);

  useEffect(() => {
    if (!notifOpen) return;
    const closeOnClick = (event: MouseEvent) => {
      if (!notifRef.current?.contains(event.target as Node)) setNotifOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNotifOpen(false);
    };
    document.addEventListener("mousedown", closeOnClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [notifOpen]);

  const NAV_ITEMS: { icon: string; label: string; view: View }[] = [
    { icon: "⌂", label: "Hub", view: "hub" },
    { icon: "⌨", label: "Practice", view: "practice" },
    { icon: "⚔", label: "Adventure", view: "adventure" },
    { icon: "▤", label: "Lessons", view: "lessons" },
    { icon: "◈", label: "Shop", view: "shop" },
    { icon: "★", label: "Achievements", view: "achievements" },
    { icon: "▥", label: "Stats", view: "stats" },
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
        <img src="/Logo.png" alt="Pawtype" className="hud-logo-img" />
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
        <div className="hud-settings" ref={notifRef}>
          <button
            className={`hud-icon-btn ${notifOpen ? "is-active" : ""}`}
            type="button"
            aria-label="Notifications"
            title="Notifications"
            onClick={() => setNotifOpen((o) => !o)}
          >
            <Bell size={14} />
            {unread > 0 && (
              <span className="hud-soon-badge" style={{ background: "var(--color-destructive)" }}>
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>
          {notifOpen && <NotificationsPanel onClose={() => setNotifOpen(false)} />}
        </div>
        <div className="hud-settings">
          <button
            className={`hud-icon-btn ${view === "settings" ? "is-active" : ""}`}
            onClick={() => onViewChange("settings")}
            aria-label="Settings"
            title="Settings"
            type="button"
          >
            <Settings size={14} />
          </button>
        </div>
      </div>
      <SparkleTrail enabled={ownsSparkle && sparkle} />
    </header>
  );
}
