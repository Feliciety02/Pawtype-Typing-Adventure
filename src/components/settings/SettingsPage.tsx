import { useEffect, useState, type KeyboardEvent } from "react";
import { PixelIcon } from "../../lib/icons/PixelIcon";
import { useGame } from "../../lib/game/store";
import { useAuth } from "../../hooks/use-auth";
import { AuthForm } from "../auth/AuthForm";
import { useWorld, WORLDS, type WorldId } from "../shared/WorldTheme";
import { DocsViewer } from "../shared/DocsViewer";
import { useThemeMode } from "../../hooks/use-theme-mode";
import { Button } from "../ui/button";

const CRT_KEY = "pawtype-crt-on";
const SPARKLE_KEY = "pawtype-sparkle-on";
const FOCUS_GLOW_KEY = "pawtype-focus-glow";
const REDUCE_MOTION_KEY = "pawtype-reduce-motion";
const HIGH_CONTRAST_KEY = "pawtype-high-contrast";

type SettingsTab = "general" | "library";

const TABS: { id: SettingsTab; label: string; emoji: string }[] = [
  { id: "general", label: "General", emoji: "⚙" },
  { id: "library", label: "Library", emoji: "📖" },
];

const BASE_WORLD_IDS: WorldId[] = ["cafe", "forest", "ocean", "sakura", "castle", "space"];

function readStoredFlag(key: string) {
  return typeof window !== "undefined" && window.localStorage.getItem(key) === "1";
}

export function SettingsPage() {
  const { state, dispatch } = useGame();
  const { user, isDemo, accountLabel, isLoading: authLoading, logout, isLoggingOut } = useAuth();
  const { world, setWorld } = useWorld();
  const currentWorld = WORLDS.find((w) => w.id === world)!;
  const { player, inventory } = state;
  const [showAuth, setShowAuth] = useState(false);
  const { dark, setThemeMode } = useThemeMode();

  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [crt, setCrt] = useState(() => readStoredFlag(CRT_KEY));
  const [sparkle, setSparkle] = useState(() => readStoredFlag(SPARKLE_KEY));
  const [focusGlow, setFocusGlow] = useState(() => readStoredFlag(FOCUS_GLOW_KEY));
  const [reduceMotion, setReduceMotion] = useState(() => readStoredFlag(REDUCE_MOTION_KEY));
  const [highContrast, setHighContrast] = useState(() => readStoredFlag(HIGH_CONTRAST_KEY));

  const ownsCrt = inventory.items.includes("crt-shader");
  const ownsSparkle = inventory.items.includes("sparkle-trail");
  const unlockedWorlds = WORLDS.filter(
    (item) => BASE_WORLD_IDS.includes(item.id) || inventory.items.includes(`theme-${item.id}`),
  );

  useEffect(() => {
    document.documentElement.classList.toggle("pawtype-focus-glow", focusGlow);
    if (typeof window !== "undefined")
      window.localStorage.setItem(FOCUS_GLOW_KEY, focusGlow ? "1" : "0");
  }, [focusGlow]);

  useEffect(() => {
    document.documentElement.classList.toggle("pawtype-reduce-motion", reduceMotion);
    if (typeof window !== "undefined")
      window.localStorage.setItem(REDUCE_MOTION_KEY, reduceMotion ? "1" : "0");
  }, [reduceMotion]);

  useEffect(() => {
    document.documentElement.classList.toggle("pawtype-high-contrast", highContrast);
    if (typeof window !== "undefined")
      window.localStorage.setItem(HIGH_CONTRAST_KEY, highContrast ? "1" : "0");
  }, [highContrast]);

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

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % TABS.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + TABS.length) % TABS.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = TABS.length - 1;
    }

    if (nextIndex === null) return;

    event.preventDefault();
    const nextTab = TABS[nextIndex];
    setActiveTab(nextTab.id);
    requestAnimationFrame(() => document.getElementById(`settings-tab-${nextTab.id}`)?.focus());
  };

  return (
    <div className="settings-page">
      <div className="settings-layout">
        <aside className="settings-sidebar" aria-label="Settings sections">
          <div className="settings-tabs pixel-card" role="tablist" aria-label="Settings sections">
            {TABS.map((tab, index) => (
              <button
                key={tab.id}
                id={`settings-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`settings-panel-${tab.id}`}
                tabIndex={activeTab === tab.id ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                className={`settings-tab-button ${activeTab === tab.id ? "is-active" : ""}`}
              >
                <span className="settings-tab-emoji">{tab.emoji}</span>
                <span className="settings-tab-label">{tab.label}</span>
              </button>
            ))}
          </div>
        </aside>

        <div className="settings-content">
          {activeTab === "general" && (
            <div
              id="settings-panel-general"
              className="settings-general-panel pixel-card"
              role="tabpanel"
              aria-labelledby="settings-tab-general"
            >
              <div className="settings-page-head">
                <h2 className="text-3xl leading-none">⚙ Settings</h2>
                <p className="font-pixel text-[0.65rem] text-muted-foreground mt-1">
                  Tweak your cozy typing den.
                </p>
              </div>

              {/* World */}
              <div className="settings-panel pixel-card-sm">
                <div className="settings-panel-head">
                  <div>
                    <span className="settings-kicker">World Wardrobe</span>
                    <h3>
                      {currentWorld.emoji} {currentWorld.name}
                    </h3>
                  </div>
                  <span className="settings-chip">
                    {unlockedWorlds.length}/{WORLDS.length} unlocked
                  </span>
                </div>
                <p className="settings-help">
                  Only unlocked worlds appear here. Buy more worlds in the shop to expand this list.
                </p>
                <div className="settings-world-grid">
                  {unlockedWorlds.map((item) => {
                    const active = item.id === world;
                    return (
                      <button
                        key={item.id}
                        className={`settings-world-card ${active ? "is-active" : ""}`}
                        onClick={() => setWorld(item.id)}
                        type="button"
                        aria-pressed={active}
                      >
                        <span className="settings-world-emoji">
                          {item.emoji === "☕" ? (
                            <PixelIcon emoji="☕" />
                          ) : item.emoji === "🌲" ? (
                            <PixelIcon emoji="🌲" />
                          ) : item.emoji === "🌊" ? (
                            <PixelIcon emoji="🌊" />
                          ) : item.emoji === "🌸" ? (
                            <PixelIcon emoji="🌸" />
                          ) : item.emoji === "🌻" ? (
                            <PixelIcon emoji="🌻" />
                          ) : item.emoji === "🍂" ? (
                            <PixelIcon emoji="🍂" />
                          ) : (
                            item.emoji
                          )}
                        </span>
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
                    <span className="settings-kicker">Display Mode</span>
                    <h3>{dark ? "Night Cabin" : "Day Cabin"}</h3>
                  </div>
                  <span className="settings-chip">Manual</span>
                </div>
                <p className="settings-help">
                  Pawtype now uses your saved choice only. It will not auto-switch from system dark
                  mode.
                </p>
                <div className="settings-segment" role="group" aria-label="Display mode">
                  <button
                    className={!dark ? "is-active" : ""}
                    onClick={() => setThemeMode("light")}
                    type="button"
                    aria-pressed={!dark}
                  >
                    Day
                  </button>
                  <button
                    className={dark ? "is-active" : ""}
                    onClick={() => setThemeMode("dark")}
                    type="button"
                    aria-pressed={dark}
                  >
                    Night
                  </button>
                </div>
              </div>

              <div className="settings-panel pixel-card-sm">
                <div className="settings-panel-head">
                  <div>
                    <span className="settings-kicker">Game Feel</span>
                    <h3>Comfort & Effects</h3>
                  </div>
                  <span className="settings-chip">HUD</span>
                </div>
                <div className="settings-toggle-grid">
                  <SettingsToggle
                    label="CRT Filter"
                    active={crt}
                    locked={!ownsCrt}
                    onClick={toggleCrt}
                  />
                  <SettingsToggle
                    label="Sparkle Trail"
                    active={sparkle}
                    locked={!ownsSparkle}
                    onClick={toggleSparkle}
                  />
                  <SettingsToggle
                    label="Focus Glow"
                    active={focusGlow}
                    onClick={() => setFocusGlow((value) => !value)}
                  />
                  <SettingsToggle
                    label="Reduce Motion"
                    active={reduceMotion}
                    onClick={() => setReduceMotion((value) => !value)}
                  />
                  <SettingsToggle
                    label="High Contrast"
                    active={highContrast}
                    onClick={() => setHighContrast((value) => !value)}
                  />
                </div>
              </div>

              {/* Account */}
              <div className="settings-account-panel pixel-card-sm">
                <span className="settings-kicker">Account</span>
                <div className="settings-account-details">
                  <div className="flex items-center gap-3 text-[0.65rem] font-pixel">
                    <span className="text-muted-foreground w-20">Level</span>
                    <strong>{player.level}</strong>
                  </div>
                  <div className="flex items-center gap-3 text-[0.65rem] font-pixel">
                    <span className="text-muted-foreground w-20">Coins</span>
                    <strong suppressHydrationWarning>
                      <PixelIcon emoji="🪙" /> {player.coins.toLocaleString()}
                    </strong>
                  </div>
                  <div className="flex items-center gap-3 text-[0.65rem] font-pixel">
                    <span className="text-muted-foreground w-20">Streak</span>
                    <strong>
                      <PixelIcon emoji="🔥" /> {player.streak}
                    </strong>
                  </div>
                  {authLoading ? null : user || isDemo ? (
                    <div className="flex items-center gap-3 text-[0.65rem] font-pixel pt-1 border-t border-[var(--color-border)]">
                      <span className="text-muted-foreground w-20">
                        {isDemo ? "Mode" : "Signed in"}
                      </span>
                      <span
                        className="text-foreground truncate max-w-[140px]"
                        title={accountLabel ?? ""}
                      >
                        {accountLabel}
                      </span>
                    </div>
                  ) : null}
                </div>
                <div className="settings-account-actions">
                  {user || isDemo ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        try {
                          await logout();
                        } catch {
                          /* ignore */
                        }
                      }}
                      disabled={isLoggingOut}
                      type="button"
                    >
                      {isLoggingOut ? "Signing out..." : "🚪 Sign Out"}
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => setShowAuth(true)} type="button">
                      🔑 Sign In
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (confirm("Reset ALL progress? This cannot be undone!")) {
                        dispatch({ type: "RESET" });
                      }
                    }}
                    type="button"
                  >
                    🗑 Reset Data
                  </Button>
                </div>
                {showAuth && (
                  <div className="settings-auth-panel">
                    <AuthForm />
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "library" && (
            <div
              id="settings-panel-library"
              className="settings-library-panel"
              role="tabpanel"
              aria-labelledby="settings-tab-library"
            >
              <DocsViewer />
            </div>
          )}
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
      aria-pressed={active}
    >
      <span className="settings-toggle-orb" aria-hidden="true">
        {locked ? <PixelIcon emoji="🔒" className="inline-lock-icon" /> : active ? "ON" : "OFF"}
      </span>
      <span>
        <strong>{label}</strong>
        <small>{locked ? "Unlock in shop" : active ? "Enabled" : "Disabled"}</small>
      </span>
    </button>
  );
}
