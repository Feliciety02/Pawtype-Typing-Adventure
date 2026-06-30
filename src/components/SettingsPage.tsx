import { useEffect, useState } from "react";
import { useGame } from "../lib/game/store";
import { useAuth } from "../hooks/use-auth";
import { AuthForm } from "./AuthForm";
import { useWorld, WORLDS, type WorldId } from "./WorldTheme";
import { DocsViewer } from "./DocsViewer";

const CRT_KEY = "pawtype-crt-on";
const SPARKLE_KEY = "pawtype-sparkle-on";
const THEME_KEY = "theme";
const FOCUS_GLOW_KEY = "pawtype-focus-glow";
const REDUCE_MOTION_KEY = "pawtype-reduce-motion";

type SettingsTab = "general" | "library";

const TABS: { id: SettingsTab; label: string; emoji: string }[] = [
  { id: "general", label: "General", emoji: "⚙" },
  { id: "library", label: "Library", emoji: "📖" },
];

const BASE_WORLD_IDS: WorldId[] = ["cafe", "forest", "ocean", "sakura", "castle", "space"];

function readStoredFlag(key: string) {
  return typeof window !== "undefined" && window.localStorage.getItem(key) === "1";
}

function readThemeMode() {
  return typeof window !== "undefined" && window.localStorage.getItem(THEME_KEY) === "dark";
}

export function SettingsPage() {
  const { state, dispatch } = useGame();
  const { user, isDemo, accountLabel, isLoading: authLoading, logout, isLoggingOut } = useAuth();
  const { world, setWorld } = useWorld();
  const currentWorld = WORLDS.find((w) => w.id === world)!;
  const { player, inventory } = state;
  const [showAuth, setShowAuth] = useState(false);

  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [dark, setDark] = useState(readThemeMode);
  const [crt, setCrt] = useState(() => readStoredFlag(CRT_KEY));
  const [sparkle, setSparkle] = useState(() => readStoredFlag(SPARKLE_KEY));
  const [focusGlow, setFocusGlow] = useState(() => readStoredFlag(FOCUS_GLOW_KEY));
  const [reduceMotion, setReduceMotion] = useState(() => readStoredFlag(REDUCE_MOTION_KEY));

  const ownsCrt = inventory.items.includes("crt-shader");
  const ownsSparkle = inventory.items.includes("sparkle-trail");
  const unlockedWorlds = WORLDS.filter((item) => BASE_WORLD_IDS.includes(item.id) || inventory.items.includes(`theme-${item.id}`));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    if (typeof window !== "undefined") window.localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    document.documentElement.classList.toggle("pawtype-focus-glow", focusGlow);
    if (typeof window !== "undefined") window.localStorage.setItem(FOCUS_GLOW_KEY, focusGlow ? "1" : "0");
  }, [focusGlow]);

  useEffect(() => {
    document.documentElement.classList.toggle("pawtype-reduce-motion", reduceMotion);
    if (typeof window !== "undefined") window.localStorage.setItem(REDUCE_MOTION_KEY, reduceMotion ? "1" : "0");
  }, [reduceMotion]);

  const toggleCrt = () => {
    const next = !crt;
    setCrt(next);
    document.documentElement.classList.toggle("crt-mode", next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CRT_KEY, next ? "1" : "0");
      window.dispatchEvent(new Event("storage"));
    }
  };

  const toggleSparkle = () => {
    const next = !sparkle;
    setSparkle(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(SPARKLE_KEY, next ? "1" : "0");
      window.dispatchEvent(new Event("storage"));
    }
  };

  const setThemeMode = (next: "light" | "dark") => {
    const isDark = next === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
      window.dispatchEvent(new Event("storage"));
    }
  };

  return (
    <div className="mt-8">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Sidebar */}
        <aside className="sm:w-44 flex-shrink-0 sm:sticky sm:top-24 sm:self-start">
          <div className="pixel-card p-3 flex sm:flex-col gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`font-pixel text-[0.6rem] px-3 py-2 rounded-md border transition-all text-left ${
                  activeTab === tab.id
                    ? "border-[var(--color-primary)] text-foreground bg-[var(--color-primary)]/10"
                    : "border-[var(--color-border)] text-muted-foreground hover:text-foreground hover:border-[var(--color-primary)]"
                }`}
              >
                <span className="mr-1.5">{tab.emoji}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === "general" && (
            <div className="pixel-card p-5 sm:p-6 space-y-5">
              <div>
                <h2 className="text-3xl leading-none">⚙ Settings</h2>
                <p className="font-pixel text-[0.65rem] text-muted-foreground mt-1">
                  Tweak your cozy typing den.
                </p>
              </div>

              {/* World */}
              <div className="settings-panel pixel-card-sm">
                <div className="settings-panel-head">
                  <div>
                    <label className="settings-kicker">World Wardrobe</label>
                    <h3>{currentWorld.emoji} {currentWorld.name}</h3>
                  </div>
                  <span className="settings-chip">{unlockedWorlds.length}/{WORLDS.length} unlocked</span>
                </div>
                <p className="settings-help">Only unlocked worlds appear here. Buy more worlds in the shop to expand this list.</p>
                <div className="settings-world-grid">
                  {unlockedWorlds.map((item) => {
                    const active = item.id === world;
                    return (
                      <button
                        key={item.id}
                        className={`settings-world-card ${active ? "is-active" : ""}`}
                        onClick={() => setWorld(item.id)}
                        type="button"
                      >
                        <span className="settings-world-emoji">{item.emoji}</span>
                        <span className="settings-world-name">{item.name}</span>
                        <span className="settings-world-blurb">{item.blurb}</span>
                        <span className="settings-swatches" aria-hidden="true">
                          {item.swatches.map((color) => (
                            <span key={color} style={{ background: color }} />
                          ))}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Appearance */}
              <div className="settings-panel pixel-card-sm">
                <div className="settings-panel-head">
                  <div>
                    <label className="settings-kicker">Display Mode</label>
                    <h3>{dark ? "Night Cabin" : "Day Cabin"}</h3>
                  </div>
                  <span className="settings-chip">Manual</span>
                </div>
                <p className="settings-help">Pawtype now uses your saved choice only. It will not auto-switch from system dark mode.</p>
                <div className="settings-segment" role="group" aria-label="Display mode">
                  <button className={!dark ? "is-active" : ""} onClick={() => setThemeMode("light")} type="button">Day</button>
                  <button className={dark ? "is-active" : ""} onClick={() => setThemeMode("dark")} type="button">Night</button>
                </div>
              </div>

              <div className="settings-panel pixel-card-sm">
                <div className="settings-panel-head">
                  <div>
                    <label className="settings-kicker">Game Feel</label>
                    <h3>Comfort & Effects</h3>
                  </div>
                  <span className="settings-chip">HUD</span>
                </div>
                <div className="settings-toggle-grid">
                  <SettingsToggle label="CRT Filter" active={crt} locked={!ownsCrt} onClick={toggleCrt} />
                  <SettingsToggle label="Sparkle Trail" active={sparkle} locked={!ownsSparkle} onClick={toggleSparkle} />
                  <SettingsToggle label="Focus Glow" active={focusGlow} onClick={() => setFocusGlow((value) => !value)} />
                  <SettingsToggle label="Reduce Motion" active={reduceMotion} onClick={() => setReduceMotion((value) => !value)} />
                </div>
              </div>

              {/* Account */}
              <div className="pixel-card-sm p-4 space-y-3">
                <label className="font-pixel text-[0.6rem] text-muted-foreground uppercase tracking-wider">Account</label>
                <div className="space-y-1">
                  <div className="flex items-center gap-3 text-[0.65rem] font-pixel">
                    <span className="text-muted-foreground w-20">Level</span>
                    <strong>{player.level}</strong>
                  </div>
                  <div className="flex items-center gap-3 text-[0.65rem] font-pixel">
                    <span className="text-muted-foreground w-20">Coins</span>
                    <strong suppressHydrationWarning>🪙 {player.coins.toLocaleString()}</strong>
                  </div>
                  <div className="flex items-center gap-3 text-[0.65rem] font-pixel">
                    <span className="text-muted-foreground w-20">Streak</span>
                    <strong>🔥 {player.streak}</strong>
                  </div>
                  {authLoading ? null : user || isDemo ? (
                    <div className="flex items-center gap-3 text-[0.65rem] font-pixel pt-1 border-t border-[var(--color-border)]">
                      <span className="text-muted-foreground w-20">{isDemo ? "Mode" : "Signed in"}</span>
                      <span className="text-foreground truncate max-w-[140px]" title={accountLabel ?? ""}>{accountLabel}</span>
                    </div>
                  ) : null}
                </div>
                {user || isDemo ? (
                  <button
                    className="pixel-btn pixel-btn-secondary text-[0.55rem]"
                    onClick={async () => {
                      try { await logout(); } catch {}
                    }}
                    disabled={isLoggingOut}
                    type="button"
                  >
                    {isLoggingOut ? "Signing out..." : "🚪 Sign Out"}
                  </button>
                ) : (
                  <button
                    className="pixel-btn pixel-btn-secondary text-[0.55rem]"
                    onClick={() => setShowAuth(true)}
                    type="button"
                  >
                    🔑 Sign In
                  </button>
                )}
                <button
                  className="pixel-btn pixel-btn-secondary text-[0.55rem]"
                  onClick={() => {
                    if (confirm("Reset ALL progress? This cannot be undone!")) {
                      dispatch({ type: "RESET" });
                    }
                  }}
                  type="button"
                >
                  🗑 Reset Data
                </button>
                {showAuth && (
                  <div className="pt-2">
                    <AuthForm />
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "library" && <DocsViewer />}
        </div>
      </div>
    </div>
  );
}

function SettingsToggle({
  label,
  active,
  locked = false,
  onClick,
}: {
  label: string;
  active: boolean;
  locked?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`settings-toggle-card ${active ? "is-active" : ""}`}
      disabled={locked}
      onClick={onClick}
      type="button"
    >
      <span className="settings-toggle-orb" aria-hidden="true">
        {locked ? (
          <img src="/Icons/lock.png" alt="" className="inline-lock-icon" draggable={false} />
        ) : active ? "ON" : "OFF"}
      </span>
      <span>
        <strong>{label}</strong>
        <small>{locked ? "Unlock in shop" : active ? "Enabled" : "Disabled"}</small>
      </span>
    </button>
  );
}
