import { useEffect, useRef, useState } from "react";
import { LogIn, LogOut, Settings, BarChart3, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { useGame } from "../../lib/game/store";
import { useAuth } from "../../hooks/use-auth";
import { AuthForm } from "../auth/AuthForm";
import { NotificationsPanel } from "./NotificationsPanel";
import { SparkleTrail } from "../shared/SparkleTrail";
import { PixelPet } from "../coach/PixelPet";
import { xpForLevel } from "../../lib/game/types";
import { PixelIcon } from "../../lib/icons/PixelIcon";
import { getNotifications, subscribeNotifications } from "../../lib/game/notifications";
import { ThemeToggle } from "../ui/shared/ThemeToggle";
import { Button } from "../ui/button";

export type View =
  "hub" | "practice" | "adventure" | "lessons" | "shop" | "achievements" | "stats" | "settings" | "inventory";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { state } = useGame();
  const { player, inventory } = state;
  const activePet =
    inventory.pets.find((pet) => pet.type === inventory.activePet) ?? inventory.pets[0] ?? null;
  const playerXpNeeded = xpForLevel(player.level);
  const playerXpPct =
    playerXpNeeded > 0 ? Math.min(Math.round((player.xp / playerXpNeeded) * 100), 100) : 0;
  const { user, isDemo, accountLabel, isLoading: authLoading, logout, isLoggingOut } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
  const sparkId = useRef(0);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const refresh = () => setUnread(getNotifications().filter((n) => !n.read).length);
    refresh();
    return subscribeNotifications(refresh);
  }, []);

  useEffect(() => {
    if (!notifOpen) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent || !notifRef.current?.contains(e.target as Node))
        setNotifOpen(false);
    };
    const closeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNotifOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", closeKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", closeKey);
    };
  }, [notifOpen]);

  useEffect(() => {
    if (!profileOpen && !showAuth) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent || !profileRef.current?.contains(e.target as Node)) {
        setProfileOpen(false);
        setShowAuth(false);
      }
    };
    const closeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setProfileOpen(false);
        setShowAuth(false);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", closeKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", closeKey);
    };
  }, [profileOpen, showAuth]);

  const NAV_ITEMS: { emoji: string; label: string; path: string }[] = [
    { emoji: "🏡", label: "Camp", path: "/" },
    { emoji: "⌨", label: "Train", path: "/practice" },
    { emoji: "🗺", label: "Quest", path: "/adventure" },
    { emoji: "📖", label: "Learn", path: "/lessons" },
    { emoji: "🛒", label: "Shop", path: "/shop" },
    { emoji: "🎖️", label: "Awards", path: "/achievements" },
  ];

  const burstSparkles = (e: React.MouseEvent<HTMLButtonElement>) => {
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
        <span key={s.id} className="hud-particle" style={{ left: s.x, top: s.y }} />
      ))}
      <SparkleTrail enabled={inventory.items.includes("sparkle-trail")} />

      <div className="hud-left" ref={profileRef}>
        <button
          type="button"
          className={`hud-profile-btn ${profileOpen ? "is-active" : ""}`}
          aria-label={`Open profile menu for ${accountLabel ?? "Demo Adventurer"}`}
          aria-expanded={profileOpen}
          aria-controls="hud-profile-menu"
          onClick={() => {
            setProfileOpen((o) => !o);
            setShowAuth(false);
          }}
        >
          <div className="hud-avatar-wrap">
            <div className="hud-avatar">
              {activePet ? (
                <PixelPet pet={activePet} size={50} showDetails={false} />
              ) : (
                <div className="hud-avatar-fallback">P</div>
              )}
            </div>
            <span className="hud-level-badge">Lv.{player.level}</span>
          </div>
          <div className="hud-profile-body">
            <span className="hud-profile-name">{accountLabel ?? "Demo Adventurer"}</span>
            <span className="hud-profile-role">Forest Explorer</span>
            <div className="hud-xp-row">
              <div className="hud-xp-bar">
                <div style={{ width: `${playerXpPct}%` }} />
              </div>
              <span className="hud-xp-label">{playerXpPct}%</span>
            </div>
          </div>
          <ChevronDown size={14} className="hud-caret" />
        </button>

        {profileOpen && (
          <div className="hud-dropdown" id="hud-profile-menu">
            <div className="hud-dropdown-title">Profile</div>
            <div className="hud-dropdown-row">
              <span>Player</span>
              <strong>{accountLabel ?? "Guest Explorer"}</strong>
            </div>
            <div className="hud-dropdown-row">
              <span>Level</span>
              <strong>{player.level}</strong>
            </div>
            <div className="hud-dropdown-row">
              <span>Coins</span>
              <strong suppressHydrationWarning>{player.coins.toLocaleString()}</strong>
            </div>
            <div className="hud-dropdown-row">
              <span>Streak</span>
              <strong>{player.streak}</strong>
            </div>
            <div className="hud-dropdown-actions">
              <Button
                variant="secondary"
                onClick={() => {
                  navigate({ to: "/stats" });
                  setProfileOpen(false);
                }}
              >
                <BarChart3 size={14} />
                <span>Stats</span>
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  navigate({ to: "/settings" });
                  setProfileOpen(false);
                }}
              >
                <Settings size={14} />
                <span>Settings</span>
              </Button>
              {authLoading ? null : user || isDemo ? (
                <Button
                  variant="destructive"
                  disabled={isLoggingOut}
                  onClick={async () => {
                    await logout();
                    setProfileOpen(false);
                  }}
                >
                  <LogOut size={14} />
                  <span>{isLoggingOut ? "Leaving..." : "Sign Out"}</span>
                </Button>
              ) : (
                <Button onClick={() => setShowAuth((o) => !o)}>
                  <LogIn size={14} />
                  <span>Sign In</span>
                </Button>
              )}
            </div>
            {showAuth && (
              <div className="hud-dropdown-auth">
                <AuthForm />
              </div>
            )}
          </div>
        )}
      </div>

      <nav className="hud-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.path}
            type="button"
            className={`hud-nav-btn ${currentPath === item.path ? "is-active" : ""}`}
            aria-label={item.label}
            title={item.label}
            aria-current={currentPath === item.path ? "page" : undefined}
            onClick={() => navigate({ to: item.path })}
            onMouseEnter={burstSparkles}
          >
            <PixelIcon emoji={item.emoji} className="hud-nav-icon" />
            <span className="hud-nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="hud-right">
        <ThemeToggle className="hud-theme-btn" compact />
        <div className="hud-coins">
          <PixelIcon emoji="🪙" className="hud-coins-icon" />
          <strong className="hud-coins-value" suppressHydrationWarning>
            {player.coins.toLocaleString()}
          </strong>
        </div>
        <div className="hud-notif-wrap" ref={notifRef}>
          <button
            type="button"
            className={`hud-notif-btn ${notifOpen ? "is-active" : ""}`}
            aria-label="Notifications"
            aria-expanded={notifOpen}
            aria-controls="hud-notifications-panel"
            onClick={() => setNotifOpen((o) => !o)}
          >
            <PixelIcon emoji="🔔" className="hud-notif-icon" />
            {unread > 0 && <span className="hud-badge">{unread > 9 ? "9+" : unread}</span>}
          </button>
          {notifOpen && <NotificationsPanel onClose={() => setNotifOpen(false)} />}
        </div>
      </div>
    </header>
  );
}
