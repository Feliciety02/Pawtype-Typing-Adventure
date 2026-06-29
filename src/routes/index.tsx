import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bell, Settings } from "lucide-react";
import { TypingArena } from "@/components/TypingArena";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PixelMascot } from "@/components/PixelMascot";
import { PixelPet } from "@/components/PixelPet";
import { WorldSwitcher } from "@/components/WorldSwitcher";
import { AdventureMap } from "@/components/AdventureMap";
import { Shop } from "@/components/Shop";
import { StatsView } from "@/components/StatsView";
import { useWorld, WORLDS, type WorldId } from "@/components/WorldTheme";
import { useGame } from "@/lib/game/store";
import { xpForLevel, getDailyReward } from "@/lib/game/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pawtype — Cozy Pixel Typing Tutor" },
      { name: "description", content: "Master touch typing in a cozy pixel world. Practice with adventure mode, daily quests, a pixel mascot, and beautiful retro stats." },
      { property: "og:title", content: "Pawtype — Cozy Pixel Typing Tutor" },
      { property: "og:description", content: "Master touch typing in a cozy pixel world. Adventure mode, mascot, retro stats." },
    ],
  }),
  component: Index,
});

type View =
  | "hub"
  | "practice"
  | "adventure"
  | "lessons"
  | "shop"
  | "achievements"
  | "stats";

const THEME_PREVIEW_ASSETS: Record<WorldId, string> = {
  cafe: "/Cozy%20Caf%C3%A9.png",
  forest: encodeURI("/Mossy Forest.png"),
  ocean: encodeURI("/Tide Pool.png"),
  sakura: encodeURI("/Sakura Park.png"),
  castle: encodeURI("/Royal Castle.png"),
  space: encodeURI("/Stardust.png"),
};

function useQuests() {
  const { state } = useGame();
  const { player } = state;
  const needed = xpForLevel(player.level);
  return [
    { icon: "🔥", title: "Daily Streak", value: `${player.streak} days`, bar: Math.min(player.streak * 14, 100), color: "var(--color-primary)" },
    { icon: "🪙", title: "Coins", value: player.coins.toLocaleString(), bar: Math.min(player.coins / 20, 100), color: "var(--coin)" },
    { icon: "⭐", title: `Level ${player.level}`, value: `${player.xp} / ${needed} XP`, bar: needed > 0 ? Math.round((player.xp / needed) * 100) : 0, color: "var(--leaf)" },
  ];
}

const LESSONS = [
  { emoji: "🌱", title: "Home Row Basics", meta: "Beginner · 4 min", stars: 3, locked: false },
  { emoji: "🌲", title: "Forest of Vowels", meta: "Beginner · 6 min", stars: 2, locked: false },
  { emoji: "☕", title: "Café Punctuation", meta: "Intermediate · 8 min", stars: 1, locked: false },
  { emoji: "🏰", title: "Castle of Symbols", meta: "Advanced · 12 min", stars: 0, locked: true },
];

const ACHIEVEMENTS = [
  { emoji: "🐾", title: "First Steps", unlocked: true },
  { emoji: "⚡", title: "Speed Demon", unlocked: true },
  { emoji: "🎯", title: "Sharpshooter", unlocked: true },
  { emoji: "🌙", title: "Night Owl", unlocked: false },
  { emoji: "👑", title: "Typing Royalty", unlocked: false },
  { emoji: "🌸", title: "Sakura Master", unlocked: false },
];

function Index() {
  const [view, setView] = useState<View>("hub");

  return (
    <main className="min-h-dvh px-4 sm:px-6 lg:px-10 py-6 max-w-[1400px] mx-auto">
      <Header view={view} onViewChange={setView} />

      <div key={view} className="view-enter">
        {view === "hub" && <Hub onViewChange={setView} />}
        {view === "practice" && (
          <section className="mt-8">
            <TypingArena />
          </section>
        )}
        {view === "adventure" && (
          <section className="mt-8">
            <AdventureMap />
          </section>
        )}
        {view === "lessons" && (
          <section className="mt-8">
            <LessonsCard />
          </section>
        )}
        {view === "shop" && (
          <section className="mt-8">
            <Shop />
          </section>
        )}
        {view === "achievements" && (
          <section className="mt-8">
            <AchievementsCard />
          </section>
        )}
        {view === "stats" && (
          <section className="mt-8">
            <StatsView />
          </section>
        )}
      </div>

      <footer className="mt-16 mb-6 text-center font-pixel text-[0.65rem] text-muted-foreground">
        Made with 🌸 in a cozy pixel cabin · Pawtype v0.1
      </footer>
    </main>
  );
}

/* ─── Header ─── */

function Header({ view, onViewChange }: { view: View; onViewChange: (v: View) => void }) {
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
      if (!settingsRef.current?.contains(event.target as Node)) {
        setSettingsOpen(false);
      }
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
      {/* Hover sparkles */}
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="hud-nav-particle"
          style={{ left: s.x, top: s.y, "--dx": `${-6 + Math.random() * 12}px`, "--dy": `${-6 - Math.random() * 6}px` } as React.CSSProperties}
        />
      ))}

      {/* Left — Brand */}
      <div className="hud-brand" aria-label="Pawtype">
        <div className="hud-logo">
          <span>P</span>
        </div>
        <div className="min-w-0">
          <div className="hud-title">Pawtype</div>
          <div className="hud-subtitle">Cozy pixel typing tutor</div>
        </div>
      </div>

      {/* Center — Navigation */}
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
              {item.icon}
            </span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Right — Player HUD */}
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
        <button className="hud-icon-btn" type="button" aria-label="Notifications" title="Notifications">
          <Bell size={14} />
        </button>
        <div className="hud-settings" ref={settingsRef}>
          <button
            className={`hud-icon-btn ${settingsOpen ? "is-active" : ""}`}
            onClick={() => setSettingsOpen((open) => !open)}
            aria-label="Open settings"
            aria-expanded={settingsOpen}
            title="Settings"
            type="button"
          >
            <Settings size={14} />
          </button>

          {settingsOpen && (
            <div className="hud-settings-panel animate-pixel-pop">
              <div className="hud-settings-title">Settings</div>
              <div className="hud-settings-row">
                <span>World</span>
                <strong>{currentWorld.name}</strong>
              </div>
              <WorldSwitcher />
              <ThemeToggle />
              <button
                className={`pixel-btn pixel-btn-secondary ${crt ? "is-active" : ""}`}
                onClick={() => setCrt((c) => !c)}
                type="button"
              >
                CRT {crt ? "On" : "Off"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* ─── Hub View ─── */

function Hub({ onViewChange }: { onViewChange: (v: View) => void }) {
  const { state, dispatch } = useGame();
  const { world, setWorld } = useWorld();
  const { player, inventory } = state;
  const currentWorld = WORLDS.find((w) => w.id === world)!;
  const quests = useQuests();
  const needed = xpForLevel(player.level);

  const canClaim = !player.dailyRewardClaimed;
  const reward = canClaim ? getDailyReward(player.streak + 1) : null;

  const activePet = inventory.activePet
    ? inventory.pets.find((p) => p.type === inventory.activePet)
    : null;

  const QUICK_ACTIONS: { label: string; view: View; emoji: string }[] = [
    { label: "Practice", view: "practice", emoji: "⌨" },
    { label: "Adventure", view: "adventure", emoji: "🗺" },
    { label: "Lessons", view: "lessons", emoji: "📖" },
    { label: "Shop", view: "shop", emoji: "🛒" },
    { label: "Achievements", view: "achievements", emoji: "★" },
    { label: "Stats", view: "stats", emoji: "📊" },
  ];

  return (
    <div className="mt-8 space-y-6">
      {/* Character + Pet row */}
      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        {/* Pet card */}
        <div className="pixel-card p-5 flex flex-col items-center gap-2">
          {activePet ? (
            <>
              <PixelPet pet={activePet} size={100} />
              {inventory.pets.length > 1 && (
                <div className="flex gap-1 mt-1">
                  {inventory.pets.map((p) => (
                    <button
                      key={p.type}
                      className={`pixel-btn pixel-btn-secondary ${p.type === activePet.type ? "opacity-100" : "opacity-50"}`}
                      style={{ padding: "2px 6px", fontSize: "0.7rem" }}
                      onClick={() => dispatch({ type: "SET_ACTIVE_PET", petType: p.type })}
                    >
                      {p.type === "cat" ? "🐱" : p.type === "dog" ? "🐶" : p.type === "fox" ? "🦊" : p.type === "rabbit" ? "🐰" : p.type === "panda" ? "🐼" : p.type === "penguin" ? "🐧" : "🐉"}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <PixelMascot mood="idle" size={100} />
              <p className="font-pixel text-[0.6rem] text-muted-foreground text-center">
                Adopt a pet in the shop!
              </p>
            </>
          )}
        </div>

        {/* Player stats card */}
        <div className="pixel-card p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-display text-3xl leading-none">Level {player.level}</div>
              <p className="font-pixel text-[0.6rem] text-muted-foreground mt-1">
                {currentWorld.emoji} Exploring · {currentWorld.name}
              </p>
            </div>
            <div className="text-right">
              <div className="font-pixel text-[0.65rem] uppercase" style={{ color: "var(--muted-foreground)" }}>Typist</div>
              <div className="font-pixel text-sm">Rank #{player.totalTestsCompleted > 0 ? Math.max(1, 100 - player.totalTestsCompleted) : "-"}</div>
            </div>
          </div>

          {/* XP bar */}
          <div>
            <div className="flex justify-between font-pixel text-[0.6rem] mb-1">
              <span style={{ color: "var(--muted-foreground)" }}>XP to next level</span>
              <span>{player.xp} / {needed}</span>
            </div>
            <div className="pixel-bar">
              <div
                className="h-full transition-all"
                style={{ width: `${needed > 0 ? Math.round((player.xp / needed) * 100) : 0}%`, background: "var(--leaf)" }}
              />
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-1">
            <div className="pixel-card-sm p-2 text-center">
              <div className="font-pixel text-[0.55rem] text-muted-foreground uppercase">Tests</div>
              <div className="font-display text-lg" style={{ color: "var(--color-primary)" }}>{player.totalTestsCompleted}</div>
            </div>
            <div className="pixel-card-sm p-2 text-center">
              <div className="font-pixel text-[0.55rem] text-muted-foreground uppercase">Accuracy</div>
              <div className="font-display text-lg" style={{ color: "var(--leaf)" }}>
                {player.totalCorrectChars + player.totalMistakes > 0
                  ? `${Math.round((player.totalCorrectChars / (player.totalCorrectChars + player.totalMistakes)) * 100)}%`
                  : "-"}
              </div>
            </div>
            <div className="pixel-card-sm p-2 text-center">
              <div className="font-pixel text-[0.55rem] text-muted-foreground uppercase">Streak</div>
              <div className="font-display text-lg" style={{ color: "var(--coin)" }}>🔥 {player.streak}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily reward card */}
      <div
        className="pixel-card p-4 flex items-center justify-between cursor-pointer transition-opacity"
        style={{
          border: `2px dashed ${canClaim ? "var(--coin)" : "var(--color-border)"}`,
          opacity: canClaim ? 1 : 0.6,
        }}
        onClick={() => canClaim && dispatch({ type: "CLAIM_DAILY_REWARD" })}
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">{canClaim ? "🎁" : "✅"}</span>
          <div>
            <div className="font-pixel text-sm">
              {canClaim ? "Daily Reward Available!" : "Daily Reward Claimed"}
            </div>
            <p className="font-pixel text-[0.6rem] text-muted-foreground">
              {canClaim
                ? `Day ${player.streak + 1} — ${reward?.label}`
                : `Streak: ${player.streak} days — Come back tomorrow!`}
            </p>
          </div>
        </div>
        <div className="font-pixel text-[0.65rem]" style={{ color: "var(--coin)" }}>
          🪙 {reward?.coins ?? 0}
        </div>
      </div>

      {/* Quest stats row */}
      <div className="grid grid-cols-3 gap-4">
        {quests.map((q) => (
          <div key={q.title} className="pixel-card-sm p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-pixel text-[0.65rem]">{q.icon} {q.title}</span>
              <span className="font-pixel text-[0.6rem] text-muted-foreground">{q.value}</span>
            </div>
            <div className="pixel-bar">
              <div className="h-full transition-all" style={{ width: `${q.bar}%`, background: q.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick action grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.view}
            onClick={() => onViewChange(action.view)}
            className="pixel-card-sm p-4 text-center flex flex-col items-center gap-2 transition-transform hover:-translate-y-1"
          >
            <span className="text-3xl">{action.emoji}</span>
            <span className="font-pixel text-[0.7rem]">{action.label}</span>
          </button>
        ))}
      </div>

      <ThemeSetsSection activeWorld={world} onSelectWorld={setWorld} />
    </div>
  );
}

/* ─── Shared components ─── */

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-3xl">{title}</h2>
      <p className="font-pixel text-[0.65rem] text-muted-foreground mt-1">{subtitle}</p>
    </div>
  );
}

function ThemeSetsSection({
  activeWorld,
  onSelectWorld,
}: {
  activeWorld: WorldId;
  onSelectWorld: (world: WorldId) => void;
}) {
  return (
    <section className="pixel-card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
        <div>
          <div className="font-pixel text-[0.65rem] uppercase text-muted-foreground mb-2">
            World Preview
          </div>
          <h2 className="text-3xl leading-none">Theme Sets</h2>
          <p className="font-pixel text-[0.65rem] text-muted-foreground mt-2 max-w-[60ch]">
            Each world has its own colors, artwork, and mood. Pick a theme to
            change the full UI.
          </p>
        </div>
        <div className="pixel-card-sm px-3 py-2 max-w-sm">
          <div className="font-pixel text-[0.62rem] uppercase text-muted-foreground mb-1">
            How it works
          </div>
          <p className="font-pixel text-[0.58rem] leading-relaxed">
            Choose a world, the background preview changes, and the whole UI
            palette updates with it.
          </p>
        </div>
      </div>

      <div className="grid xl:grid-cols-3 md:grid-cols-2 gap-4">
        {WORLDS.map((theme) => {
          const isActive = theme.id === activeWorld;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onSelectWorld(theme.id)}
              className="pixel-card-sm p-3 text-left transition-transform hover:-translate-y-1"
              style={
                isActive
                  ? {
                      outline: "3px solid var(--color-primary)",
                      outlineOffset: 2,
                    }
                  : undefined
              }
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <div className="font-display text-3xl leading-none truncate">
                    {theme.emoji} {theme.name}
                  </div>
                  <p className="font-pixel text-[0.58rem] text-muted-foreground mt-1">
                    {theme.blurb}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  {theme.swatches.map((color, index) => (
                    <span
                      key={index}
                      style={{
                        width: 20,
                        height: 20,
                        background: color,
                        border: "2px solid var(--color-border)",
                        borderRadius: 4,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-[1fr_112px] gap-3 items-stretch">
                <div
                  className="rounded-md border-2 p-3"
                  style={{
                    borderColor: "var(--color-border)",
                    background: "color-mix(in oklab, var(--color-muted) 45%, transparent)",
                  }}
                >
                  <div className="pixel-bar mb-3" style={{ height: 12 }}>
                    <div
                      className="h-full"
                      style={{ width: "36%", background: "var(--color-primary)" }}
                    />
                  </div>
                  <div className="font-pixel text-[0.7rem] leading-7">
                    <div>
                      <span style={{ background: "color-mix(in oklab, var(--color-primary) 18%, transparent)" }}>
                        pixel
                      </span>{" "}
                      glow willow ivory
                    </div>
                    <div>garden cloud cinnamon moon</div>
                    <div>{theme.id === "forest" ? "forest moss leaf" : theme.id === "ocean" ? "ocean tide wave" : theme.id === "sakura" ? "sakura blossom petal" : theme.id === "castle" ? "castle king crown" : theme.id === "space" ? "stardust galaxy star" : "latte cozy brew"}</div>
                  </div>
                </div>

                <div
                  className="rounded-md border-2 overflow-hidden"
                  style={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-card)",
                  }}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      width: "100%",
                      aspectRatio: "1 / 1",
                      backgroundImage: `url("${THEME_PREVIEW_ASSETS[theme.id]}")`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mt-3">
                {[
                  { label: "WPM", value: "85" },
                  { label: "ACC", value: "96%" },
                  { label: "STREAK", value: "12" },
                  { label: "TIME", value: "12s" },
                ].map((stat) => (
                  <div key={stat.label} className="pixel-card-sm px-2 py-1.5 text-center">
                    <div className="font-display text-lg leading-none">{stat.value}</div>
                    <div className="font-pixel text-[0.5rem] text-muted-foreground mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="font-pixel text-[0.55rem] text-muted-foreground uppercase">
                  {isActive ? "Active world" : "Click to switch"}
                </span>
                <span className="pixel-btn pixel-btn-secondary" style={{ padding: "0.45rem 0.8rem", fontSize: "0.62rem" }}>
                  {isActive ? "Using Theme" : "Use Theme"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function LessonsCard() {
  return (
    <div className="pixel-card p-5">
      <SectionHeader title="Lessons" subtitle="A gentle path from sprout to scholar." />
      <ul className="flex flex-col gap-3">
        {LESSONS.map((l) => (
          <li
            key={l.title}
            className="pixel-card-sm p-3 flex items-center gap-3"
            style={l.locked ? { opacity: 0.55 } : undefined}
          >
            <div
              className="grid place-items-center text-2xl shrink-0"
              style={{ width: 48, height: 48, background: "var(--color-muted)", border: "2px solid var(--color-border)", borderRadius: 4 }}
            >
              {l.locked ? "🔒" : l.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-pixel text-sm truncate">{l.title}</div>
              <div className="font-pixel text-[0.6rem] text-muted-foreground mt-1">{l.meta}</div>
            </div>
            <div className="flex gap-0.5 mr-2">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="font-pixel text-sm"
                  style={{ color: i < l.stars ? "var(--coin)" : "var(--muted-foreground)" }}
                >
                  ★
                </span>
              ))}
            </div>
            <button className="pixel-btn" disabled={l.locked}>
              {l.locked ? "Locked" : "Play"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AchievementsCard() {
  return (
    <div className="pixel-card p-5">
      <SectionHeader title="Badges" subtitle="Collect them all." />
      <div className="grid grid-cols-3 gap-3">
        {ACHIEVEMENTS.map((a) => (
          <div
            key={a.title}
            className="pixel-card-sm p-3 text-center flex flex-col items-center gap-1.5"
            style={a.unlocked ? undefined : { opacity: 0.45, filter: "grayscale(0.8)" }}
          >
            <div
              className="grid place-items-center text-3xl"
              style={{
                width: 56, height: 56,
                background: a.unlocked
                  ? "color-mix(in oklab, var(--coin) 30%, var(--color-card))"
                  : "var(--color-muted)",
                border: "2px solid var(--color-border)",
                borderRadius: 6,
              }}
            >
              {a.unlocked ? a.emoji : "❔"}
            </div>
            <div className="font-pixel text-[0.6rem]">{a.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


