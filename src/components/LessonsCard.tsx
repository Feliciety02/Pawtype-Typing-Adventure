import { SectionHeader } from "./SectionHeader";

const LESSONS = [
  { emoji: "🌱", title: "Home Row Basics", meta: "Beginner · 4 min", stars: 3, locked: false },
  { emoji: "🌲", title: "Forest of Vowels", meta: "Beginner · 6 min", stars: 2, locked: false },
  { emoji: "☕", title: "Café Punctuation", meta: "Intermediate · 8 min", stars: 1, locked: false },
  { emoji: "🏰", title: "Castle of Symbols", meta: "Advanced · 12 min", stars: 0, locked: true },
];

export function LessonsCard() {
  return (
    <div className="pixel-card p-5">
      <SectionHeader title="Lessons" subtitle="A gentle path from sprout to scholar." comingSoon />
      <ul className="flex flex-col gap-3">
        {LESSONS.map((l) => (
          <li key={l.title} className="pixel-card-sm p-3 flex items-center gap-3" style={l.locked ? { opacity: 0.55 } : undefined}>
            <div className="grid place-items-center text-2xl shrink-0" style={{ width: 48, height: 48, background: "var(--color-muted)", border: "2px solid var(--color-border)", borderRadius: 4 }}>
              {l.locked ? "🔒" : l.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-pixel text-sm truncate">{l.title}</div>
              <div className="font-pixel text-[0.6rem] text-muted-foreground mt-1">{l.meta}</div>
            </div>
            <div className="flex gap-0.5 mr-2">
              {[0, 1, 2].map((i) => (
                <span key={i} className="font-pixel text-sm" style={{ color: i < l.stars ? "var(--coin)" : "var(--muted-foreground)" }}>★</span>
              ))}
            </div>
            <button className="pixel-btn" disabled title={l.locked ? "Lesson locked" : "Lessons are coming soon"}>
              {l.locked ? "Locked" : "Soon"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
