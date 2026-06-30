import { useState } from "react";
import { useGame } from "../lib/game/store";
import { useWorld, WORLDS } from "./WorldTheme";
import { WorldSwitcher } from "./WorldSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { DocsViewer } from "./DocsViewer";

const CRT_KEY = "pawtype-crt-on";
const SPARKLE_KEY = "pawtype-sparkle-on";

type SettingsTab = "general" | "library";

const TABS: { id: SettingsTab; label: string; emoji: string }[] = [
  { id: "general", label: "General", emoji: "⚙" },
  { id: "library", label: "Library", emoji: "📖" },
];

export function SettingsPage() {
  const { state, dispatch } = useGame();
  const { world } = useWorld();
  const currentWorld = WORLDS.find((w) => w.id === world)!;
  const { player, inventory } = state;

  const [activeTab, setActiveTab] = useState<SettingsTab>("general");

  const [crt, setCrt] = useState(() =>
    typeof window !== "undefined" && window.localStorage.getItem(CRT_KEY) === "1"
  );
  const [sparkle, setSparkle] = useState(() =>
    typeof window !== "undefined" && window.localStorage.getItem(SPARKLE_KEY) === "1"
  );

  const ownsCrt = inventory.items.includes("crt-shader");
  const ownsSparkle = inventory.items.includes("sparkle-trail");

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
              <div className="pixel-card-sm p-4 space-y-2">
                <label className="font-pixel text-[0.6rem] text-muted-foreground uppercase tracking-wider">Current World</label>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{currentWorld.emoji}</span>
                  <strong className="font-pixel text-[0.7rem]">{currentWorld.name}</strong>
                </div>
                <WorldSwitcher />
              </div>

              {/* Appearance */}
              <div className="pixel-card-sm p-4 space-y-3">
                <label className="font-pixel text-[0.6rem] text-muted-foreground uppercase tracking-wider">Appearance</label>
                <div className="flex flex-wrap gap-2">
                  <ThemeToggle />
                  <button
                    className={`pixel-btn pixel-btn-secondary ${crt ? "is-active" : ""}`}
                    onClick={toggleCrt}
                    disabled={!ownsCrt}
                    title={ownsCrt ? "Toggle CRT scanlines" : "Buy CRT Filter in the shop"}
                    type="button"
                  >
                    📺 CRT {ownsCrt ? (crt ? "On" : "Off") : "🔒"}
                  </button>
                  <button
                    className={`pixel-btn pixel-btn-secondary ${sparkle ? "is-active" : ""}`}
                    onClick={toggleSparkle}
                    disabled={!ownsSparkle}
                    title={ownsSparkle ? "Toggle sparkle trail while typing" : "Buy Sparkle Trail in the shop"}
                    type="button"
                  >
                    ✨ Sparkle {ownsSparkle ? (sparkle ? "On" : "Off") : "🔒"}
                  </button>
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
                    <strong>🪙 {player.coins.toLocaleString()}</strong>
                  </div>
                  <div className="flex items-center gap-3 text-[0.65rem] font-pixel">
                    <span className="text-muted-foreground w-20">Streak</span>
                    <strong>🔥 {player.streak}</strong>
                  </div>
                </div>
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
              </div>
            </div>
          )}

          {activeTab === "library" && <DocsViewer />}
        </div>
      </div>
    </div>
  );
}
