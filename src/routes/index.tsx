import { createFileRoute } from "@tanstack/react-router";
import { TypingArena } from "@/components/TypingArena";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PixelMascot } from "@/components/PixelMascot";
import { WorldSwitcher } from "@/components/WorldSwitcher";
import { AdventureMap } from "@/components/AdventureMap";
import { useWorld, WORLDS } from "@/components/WorldTheme";

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

const QUESTS = [
  { icon: "🔥", title: "Daily Streak", value: "7 days", bar: 70, color: "var(--color-primary)" },
  { icon: "🪙", title: "Coins", value: "1,284", bar: 60, color: "var(--coin)" },
  { icon: "⭐", title: "Level 12", value: "320 / 500 XP", bar: 64, color: "var(--leaf)" },
];

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
  return (
    <main className="min-h-dvh px-4 sm:px-6 lg:px-10 py-6 max-w-[1400px] mx-auto">
      <Header />

      <section className="grid lg:grid-cols-[1fr_280px] gap-6 mt-8">
        <Hero />
        <QuestsCard />
      </section>

      <section className="mt-10">
        <SectionHeader title="Today's Quest" subtitle="Type, earn coins, level up your kitty." />
        <TypingArena />
      </section>

      <section className="mt-12 grid lg:grid-cols-[1.4fr_1fr] gap-6">
        <LessonsCard />
        <AchievementsCard />
      </section>

      <footer className="mt-16 mb-6 text-center font-pixel text-[0.65rem] text-muted-foreground">
        Made with 🌸 in a cozy pixel cabin · Pawtype v0.1
      </footer>
    </main>
  );
}

function Header() {
  return (
    <header className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-3">
        <div
          className="grid place-items-center pixel-card-sm"
          style={{ width: 48, height: 48, background: "var(--color-primary)" }}
        >
          <span className="font-pixel text-lg" style={{ color: "var(--color-primary-foreground)" }}>P</span>
        </div>
        <div>
          <h1 className="text-3xl leading-none">Pawtype</h1>
          <p className="font-pixel text-[0.6rem] text-muted-foreground mt-1">Cozy pixel typing tutor</p>
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-1">
        {["Practice", "Adventure", "Lessons", "Stats", "Shop"].map((n, i) => (
          <button
            key={n}
            className="pixel-btn pixel-btn-ghost"
            style={i === 0 ? { background: "var(--color-card)", boxShadow: "var(--shadow-pixel-sm)" } : undefined}
          >
            {n}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <div className="pixel-chip" title="Coins">🪙 1,284</div>
        <div className="pixel-chip" title="Streak">🔥 7</div>
        <ThemeToggle />
      </div>
    </header>
  );
}

function Hero() {
  return (
    <div className="pixel-card p-6 sm:p-8 relative overflow-hidden">
      <div className="absolute -right-2 -bottom-2 opacity-90 hidden sm:block">
        <PixelMascot mood="idle" size={140} />
      </div>
      <div className="pixel-chip mb-3">🌸 New Adventure Available</div>
      <h2 className="text-4xl sm:text-5xl max-w-[20ch] leading-[1.05]">
        Learn to type inside a cozy pixel world.
      </h2>
      <p className="mt-3 max-w-[48ch] text-muted-foreground">
        Practice with adventures, quests, and a sleepy pixel cat. Beautiful retro
        stats, dozens of themes, and lessons from beginner to pro.
      </p>
      <div className="flex flex-wrap gap-2 mt-5">
        <button className="pixel-btn">▶ Start Quest</button>
        <button className="pixel-btn pixel-btn-secondary">🗺 Adventure Map</button>
      </div>

      {/* floating pixel particles */}
      {[...Array(6)].map((_, i) => (
        <span
          key={i}
          className="absolute font-pixel text-xs animate-sparkle"
          style={{
            left: `${10 + i * 14}%`,
            top: `${20 + (i % 3) * 18}%`,
            color: i % 2 ? "var(--coin)" : "var(--sakura)",
            animationDelay: `${i * 0.25}s`,
            textShadow: "1px 1px 0 var(--color-border)",
          }}
        >
          {i % 2 ? "✦" : "❀"}
        </span>
      ))}
    </div>
  );
}

function QuestsCard() {
  return (
    <aside className="pixel-card p-5 flex flex-col gap-4">
      <h3 className="text-2xl">Today</h3>
      {QUESTS.map((q) => (
        <div key={q.title}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-pixel text-[0.7rem]">{q.icon} {q.title}</span>
            <span className="font-pixel text-[0.65rem] text-muted-foreground">{q.value}</span>
          </div>
          <div className="pixel-bar">
            <div
              className="h-full transition-all"
              style={{ width: `${q.bar}%`, background: q.color }}
            />
          </div>
        </div>
      ))}
      <div
        className="mt-2 p-3 rounded-md font-pixel text-[0.65rem] leading-relaxed"
        style={{ background: "color-mix(in oklab, var(--accent) 30%, transparent)", border: "2px dashed var(--color-border)" }}
      >
        🎁 Daily reward in <b>3h 21m</b>. Don't break the streak!
      </div>
    </aside>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-4">
      <div>
        <h2 className="text-3xl">{title}</h2>
        <p className="font-pixel text-[0.65rem] text-muted-foreground mt-1">{subtitle}</p>
      </div>
      <button className="pixel-btn pixel-btn-secondary hidden sm:inline-flex">View all →</button>
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
