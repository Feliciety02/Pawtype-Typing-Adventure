import { useEffect, useRef, useState } from "react";
import { Bell, LogIn, LogOut, Settings, BarChart3, ChevronDown } from "lucide-react";
import { useGame } from "../lib/game/store";
import { useAuth } from "../hooks/use-auth";
import { AuthForm } from "./AuthForm";
import { NotificationsPanel } from "./NotificationsPanel";
import { SparkleTrail } from "./SparkleTrail";
import { PixelPet } from "./PixelPet";
import { xpForLevel } from "../lib/game/types";
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
  const activePet = inventory.pets.find((pet) => pet.type === inventory.activePet) ?? inventory.pets[0] ?? null;
  const playerXpNeeded = xpForLevel(player.level);
  const playerXpPct = playerXpNeeded > 0 ? Math.min(Math.round((player.xp / playerXpNeeded) * 100), 100) : 0;
  const [crt, setCrt] = useState(() =>
    typeof window !== "undefined" && window.localStorage.getItem(CRT_KEY) === "1"
  );
  const [sparkle, setSparkle] = useState(() =>
    typeof window !== "undefined" && window.localStorage.getItem(SPARKLE_KEY) === "1"
  );
  const {
    user,
    isDemo,
    accountLabel,
    isLoading: authLoading,
    logout,
    isLoggingOut,
  } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [showAuth, setShowAuth] = useState(false);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
  const sparkId = useRef(0);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!profileOpen && !showAuth) return;
    const closeOnClick = (event: MouseEvent) => {
      if (!profileRef.current?.contains(event.target as Node)) {
        setProfileOpen(false);
        setShowAuth(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setShowAuth(false);
      }
    };
    document.addEventListener("mousedown", closeOnClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [profileOpen, showAuth]);

  const NAV_ITEMS: { iconSrc: string; label: string; view: Exclude<View, "stats" | "settings"> }[] = [
    { iconSrc: "/Icons/nav/hub.png", label: "Home", view: "hub" },
    { iconSrc: "/Icons/nav/practice.png", label: "Practice", view: "practice" },
    { iconSrc: "/Icons/nav/adventure.png", label: "Adventure", view: "adventure" },
    { iconSrc: "/Icons/nav/lessons.png", label: "Lessons", view: "lessons" },
    { iconSrc: "/Icons/nav/shop.png", label: "Shop", view: "shop" },
    { iconSrc: "/Icons/nav/achievements.png", label: "Achievements", view: "achievements" },
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

  const openProfileView = (nextView: Extract<View, "stats" | "settings">) => {
    onViewChange(nextView);
    setProfileOpen(false);
    setShowAuth(false);
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

      <div className="hud-profile-wrap" ref={profileRef}>
        <button
          type="button"
          className={`hud-profile hud-profile-button ${profileOpen ? "is-active" : ""}`}
          aria-label="Open profile menu"
          aria-expanded={profileOpen}
          onClick={() => {
            setProfileOpen((open) => !open);
            setShowAuth(false);
          }}
        >
          <div className="hud-profile-avatar">
            {activePet ? <PixelPet pet={activePet} size={44} showDetails={false} /> : <div className="hud-profile-fallback">P</div>}
          </div>
          <div className="hud-profile-copy">
            <div className="hud-profile-name">{accountLabel ?? "Guest Explorer"}</div>
            <div className="hud-profile-meta">
              <span className="hud-profile-title">Forest Explorer</span>
            </div>
            <div className="hud-profile-xp-row">
              <span className="hud-profile-xp-tag">XP</span>
              <div className="hud-profile-xp-bar" aria-hidden="true">
                <div style={{ width: `${playerXpPct}%` }} />
              </div>
              <span className="hud-profile-xp-value">{playerXpPct}%</span>
            </div>
          </div>
          <span className="hud-profile-caret" aria-hidden="true">
            <ChevronDown size={14} />
          </span>
        </button>

        {profileOpen && (
          <div className="hud-settings-panel hud-profile-panel">
            <div className="hud-settings-title">Profile Menu</div>
            <div className="hud-settings-row">
              <span>Player</span>
              <strong>{accountLabel ?? "Guest Explorer"}</strong>
            </div>
            <div className="hud-settings-row">
              <span>Level</span>
              <strong>{player.level}</strong>
            </div>
            <div className="hud-settings-row">
              <span>Coins</span>
              <strong suppressHydrationWarning>{player.coins.toLocaleString()}</strong>
            </div>
            <div className="hud-settings-row">
              <span>Streak</span>
              <strong>{player.streak}</strong>
            </div>

            <button
              type="button"
              className={`pixel-btn ${view === "stats" ? "is-active" : ""}`}
              onClick={() => openProfileView("stats")}
            >
              <BarChart3 size={14} />
              <span>Stats</span>
            </button>
            <button
              type="button"
              className={`pixel-btn ${view === "settings" ? "is-active" : ""}`}
              onClick={() => openProfileView("settings")}
            >
              <Settings size={14} />
              <span>Settings</span>
            </button>

            {authLoading ? null : user || isDemo ? (
              <button
                type="button"
                className="pixel-btn"
                disabled={isLoggingOut}
                onClick={async () => {
                  await logout();
                  setProfileOpen(false);
                }}
              >
                <LogOut size={14} />
                <span>{isLoggingOut ? "Leaving..." : "Sign Out"}</span>
              </button>
            ) : (
              <button
                type="button"
                className={`pixel-btn ${showAuth ? "is-active" : ""}`}
                onClick={() => setShowAuth((open) => !open)}
              >
                <LogIn size={14} />
                <span>Sign In</span>
              </button>
            )}

            {showAuth && (
              <div className="hud-profile-auth">
                <AuthForm />
              </div>
            )}
          </div>
        )}
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
            <span className="hud-nav-icon" aria-hidden="true">
              <img src={item.iconSrc} alt="" className="hud-nav-icon-img" draggable={false} />
            </span>
            <span className="hud-nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="hud-utility">
        <div className="hud-stat-bar">
          <div className="hud-stat-item" title="Level">
            <span className="hud-stat-copy">
              <small>Level</small>
              <strong>{player.level}</strong>
            </span>
          </div>
          <div className="hud-stat-divider" />
          <div className="hud-stat-item" title="Coins">
            <span className="hud-stat-icon">🪙</span>
            <span className="hud-stat-copy">
              <small>Coins</small>
              <strong suppressHydrationWarning>{player.coins.toLocaleString()}</strong>
            </span>
          </div>
          <div className="hud-stat-divider" />
          <div className="hud-stat-item" title="Streak">
            <span className="hud-stat-icon">🔥</span>
            <span className="hud-stat-copy">
              <small>Streak</small>
              <strong>{player.streak}</strong>
            </span>
          </div>
        </div>

        <div className="hud-utility-divider" aria-hidden="true" />

        <div className="hud-utility-actions">
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
        </div>
      </div>

      <SparkleTrail enabled={ownsSparkle && sparkle} />
    </header>
  );
}
