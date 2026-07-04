import { useEffect, useRef, useState } from "react";
import { LogIn, LogOut, Settings, BarChart3, ChevronDown } from "lucide-react";
import { useGame } from "../lib/game/store";
import { useAuth } from "../hooks/use-auth";
import { AuthForm } from "./AuthForm";
import { NotificationsPanel } from "./NotificationsPanel";
import { SparkleTrail } from "./SparkleTrail";
import { PixelPet } from "./PixelPet";
import { xpForLevel } from "../lib/game/types";
import { getNotifications, subscribeNotifications } from "../lib/game/notifications";

export type View = "hub" | "practice" | "adventure" | "lessons" | "shop" | "achievements" | "stats" | "settings";

export function Header({ view, onViewChange }: { view: View; onViewChange: (v: View) => void }) {
  const { state } = useGame();
  const { player, inventory } = state;
  const activePet = inventory.pets.find((pet) => pet.type === inventory.activePet) ?? inventory.pets[0] ?? null;
  const playerXpNeeded = xpForLevel(player.level);
  const playerXpPct = playerXpNeeded > 0 ? Math.min(Math.round((player.xp / playerXpNeeded) * 100), 100) : 0;
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
      if (e instanceof KeyboardEvent || !notifRef.current?.contains(e.target as Node)) setNotifOpen(false);
    };
    const closeKey = (e: KeyboardEvent) => { if (e.key === "Escape") setNotifOpen(false); };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", closeKey);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", closeKey); };
  }, [notifOpen]);

  useEffect(() => {
    if (!profileOpen && !showAuth) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent || !profileRef.current?.contains(e.target as Node)) {
        setProfileOpen(false); setShowAuth(false);
      }
    };
    const closeKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setProfileOpen(false); setShowAuth(false); } };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", closeKey);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", closeKey); };
  }, [profileOpen, showAuth]);

  const NAV_ITEMS: { iconSrc: string; label: string; view: Exclude<View, "stats" | "settings"> }[] = [
    { iconSrc: "/Icons/nav/home.png", label: "Camp", view: "hub" },
    { iconSrc: "/Icons/nav/keyboard.png", label: "Train", view: "practice" },
    { iconSrc: "/Icons/nav/map.png", label: "Quest", view: "adventure" },
    { iconSrc: "/Icons/nav/book.png", label: "Learn", view: "lessons" },
    { iconSrc: "/Icons/nav/cart.png", label: "Shop", view: "shop" },
    { iconSrc: "/Icons/nav/achievements.png", label: "Awards", view: "achievements" },
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
          className={`hud-profile-btn ${profileOpen ? "is-active" : ""}`}
          onClick={() => { setProfileOpen((o) => !o); setShowAuth(false); }}
        >
          <div className="hud-avatar-wrap">
            <div className="hud-avatar">
              {activePet ? <PixelPet pet={activePet} size={50} showDetails={false} /> : <div className="hud-avatar-fallback">P</div>}
            </div>
            <span className="hud-level-badge">Lv.{player.level}</span>
          </div>
          <div className="hud-profile-body">
            <span className="hud-profile-name">{accountLabel ?? "Demo Adventurer"}</span>
            <span className="hud-profile-role">Forest Explorer</span>
            <div className="hud-xp-row">
              <div className="hud-xp-bar"><div style={{ width: `${playerXpPct}%` }} /></div>
              <span className="hud-xp-label">{playerXpPct}%</span>
            </div>
          </div>
          <ChevronDown size={14} className="hud-caret" />
        </button>

        {profileOpen && (
          <div className="hud-dropdown">
            <div className="hud-dropdown-title">Profile</div>
            <div className="hud-dropdown-row"><span>Player</span><strong>{accountLabel ?? "Guest Explorer"}</strong></div>
            <div className="hud-dropdown-row"><span>Level</span><strong>{player.level}</strong></div>
            <div className="hud-dropdown-row"><span>Coins</span><strong suppressHydrationWarning>{player.coins.toLocaleString()}</strong></div>
            <div className="hud-dropdown-row"><span>Streak</span><strong>{player.streak}</strong></div>
            <div className="hud-dropdown-actions">
              <button className="pixel-btn" onClick={() => { onViewChange("stats"); setProfileOpen(false); }}><BarChart3 size={14} /><span>Stats</span></button>
              <button className="pixel-btn" onClick={() => { onViewChange("settings"); setProfileOpen(false); }}><Settings size={14} /><span>Settings</span></button>
              {authLoading ? null : user || isDemo ? (
                <button className="pixel-btn" disabled={isLoggingOut} onClick={async () => { await logout(); setProfileOpen(false); }}>
                  <LogOut size={14} /><span>{isLoggingOut ? "Leaving..." : "Sign Out"}</span>
                </button>
              ) : (
                <button className="pixel-btn" onClick={() => setShowAuth((o) => !o)}><LogIn size={14} /><span>Sign In</span></button>
              )}
            </div>
            {showAuth && <div className="hud-dropdown-auth"><AuthForm /></div>}
          </div>
        )}
      </div>

      <nav className="hud-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.view}
            className={`hud-nav-btn ${view === item.view ? "is-active" : ""}`}
            onClick={() => onViewChange(item.view)}
            onMouseEnter={burstSparkles}
          >
            <img src={item.iconSrc} alt="" className="hud-nav-icon" draggable={false} />
            <span className="hud-nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="hud-right">
        <div className="hud-coins">
          <img src="/Icons/coin.png" alt="" className="hud-coins-icon" />
          <strong className="hud-coins-value" suppressHydrationWarning>{player.coins.toLocaleString()}</strong>
        </div>
        <div className="hud-notif-wrap" ref={notifRef}>
          <button className={`hud-notif-btn ${notifOpen ? "is-active" : ""}`} onClick={() => setNotifOpen((o) => !o)}>
            <img src="/Icons/bell.png" alt="" className="hud-notif-icon" />
            {unread > 0 && <span className="hud-badge">{unread > 9 ? "9+" : unread}</span>}
          </button>
          {notifOpen && <NotificationsPanel onClose={() => setNotifOpen(false)} />}
        </div>
      </div>
    </header>
  );
}
