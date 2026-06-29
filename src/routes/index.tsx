import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TypingArena } from "@/components/TypingArena";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PixelMascot } from "@/components/PixelMascot";
import { PixelPet } from "@/components/PixelPet";
import { WorldSwitcher } from "@/components/WorldSwitcher";
import { AdventureMap } from "@/components/AdventureMap";
import { Shop } from "@/components/Shop";
import { StatsView } from "@/components/StatsView";
import { useWorld, WORLDS } from "@/components/WorldTheme";
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

type View = "hub" | "practice" | "adventure" | "lessons" | "shop" | "stats";

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
    <main className="min-h-dvh px-4 sm:px-6 lg:px-10 py-6 max-w-[1400px] mx-auto flex flex-col">
      <Header view={view} onViewChange={setView} />

      <div className="flex-1">
        {view === "hub" && <Hub onViewChange={setView} />}
        {view === "practice" && (
          <section className="mt-6">
            <TypingArena />
          </section>
        )}
        {view === "adventure" && (
          <section className="mt-8">
            <AdventureMap />
          </section>
        )}
        {view === "lessons" && (
          <section className="mt-8 grid lg:grid-cols-[1.4fr_1fr] gap-6">
            <LessonsCard />
            <AchievementsCard />
          </section>
        )}
        {view === "shop" && (
          <section className="mt-8">
            <Shop />
          </section>
        )}
        {view === "stats" && (
          <section className="mt-8">
            <StatsView />
          </section>
        )}
      </div>

      <div className="footer-cozy">
        Made with <span className="animate-sparkle">🌸</span> in a cozy pixel cabin · Pawtype v0.1
      </div>
    </main>
  );
}

/* ─── Header ─── */

function Header({ view, onViewChange }: { view: View; onViewChange: (v: View) => void }) {
  const { state } = useGame();
  const { player } = state;
  const [crt, setCrt] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("crt-mode", crt);
  }, [crt]);

  const NAV_ITEMS: { label: string; view: View }[] = [
    { label: "Practice", view: "practice", icon: "⌨" },
    { label: "Adventure", view: "adventure", icon: "🗺" },
    { label: "Lessons", view: "lessons", icon: "📖" },
    { label: "Hub", view: "hub", icon: "🏠" },
    { label: "Shop", view: "shop", icon: "🛒" },
    { label: "Stats", view: "stats", icon: "📊" },
  ];

  return (
    <header>
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="grid place-items-center"
            style={{
              width: 40, height: 40,
              background: "var(--color-primary)",
              border: "2px solid var(--color-border)",
              borderRadius: 6,
            }}
          >
            <span className="font-pixel text-base" style={{ color: "var(--color-primary-foreground)" }}>P</span>
          </div>
          <div>
            <h1 className="text-2xl leading-none">Pawtype</h1>
            <p className="font-pixel text-[0.5rem] text-muted-foreground">Cozy pixel typing tutor</p>
          </div>
        </div>

        {/* Top controls */}
        <div className="flex items-center gap-1.5">
          <div className="hidden sm:flex items-center gap-1.5">
            <div className="pixel-chip text-[0.6rem]">🪙 {player.coins.toLocaleString()}</div>
            <div className="pixel-chip text-[0.6rem]">🔥 {player.streak}</div>
          </div>
          <WorldSwitcher />
          <ThemeToggle />
          <button
            className="font-pixel text-[0.55rem] px-1.5 py-1 border-2 rounded"
            style={{ borderColor: "var(--color-border)", background: "transparent", color: "var(--muted-foreground)" }}
            onClick={() => setCrt((c) => !c)}
            aria-label="Toggle CRT effect"
            title="CRT shader"
          >
            {crt ? "📺" : "📺"}
          </button>
          {/* Mobile nav toggle */}
          <button
            className="md:hidden font-pixel text-sm px-2 py-1 border-2 rounded"
            style={{ borderColor: "var(--color-border)" }}
            onClick={() => setMobileNav((o) => !o)}
            aria-label="Toggle navigation"
          >
            {mobileNav ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Desktop nav row */}
      <nav className="hidden md:flex items-center justify-center gap-1 py-1.5" style={{ borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.view}
            className="font-pixel text-[0.65rem] px-3 py-1.5 rounded transition-all"
            style={{
              background: view === item.view ? "var(--color-card)" : "transparent",
              color: view === item.view ? "var(--color-foreground)" : "var(--muted-foreground)",
              boxShadow: view === item.view ? "var(--shadow-pixel-sm)" : "none",
            }}
            onClick={() => onViewChange(item.view)}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </nav>

      {/* Mobile nav */}
      {mobileNav && (
        <nav className="md:hidden flex flex-col gap-1 mt-2 py-2" style={{ borderTop: "1px solid var(--color-border)" }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.view}
              className="font-pixel text-[0.65rem] px-3 py-2 rounded text-left"
              style={{
                background: view === item.view ? "var(--color-card)" : "transparent",
                color: view === item.view ? "var(--color-foreground)" : "var(--muted-foreground)",
              }}
              onClick={() => { onViewChange(item.view); setMobileNav(false); }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}

/* ─── Hub View ─── */

function Hub({ onViewChange }: { onViewChange: (v: View) => void }) {
  const { state, dispatch } = useGame();
  const { world } = useWorld();
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
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


