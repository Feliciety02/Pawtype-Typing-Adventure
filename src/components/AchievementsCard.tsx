import { SectionHeader } from "./SectionHeader";

const ACHIEVEMENTS = [
  { emoji: "🐾", title: "First Steps", unlocked: true },
  { emoji: "⚡", title: "Speed Demon", unlocked: true },
  { emoji: "🎯", title: "Sharpshooter", unlocked: true },
  { emoji: "🌙", title: "Night Owl", unlocked: false },
  { emoji: "👑", title: "Typing Royalty", unlocked: false },
  { emoji: "🌸", title: "Sakura Master", unlocked: false },
];

export function AchievementsCard() {
  return (
    <div className="pixel-card p-5">
      <SectionHeader title="Badges" subtitle="Collect them all." comingSoon />
      <div className="grid grid-cols-3 gap-3">
        {ACHIEVEMENTS.map((a) => (
          <div key={a.title} className="pixel-card-sm p-3 text-center flex flex-col items-center gap-1.5" style={a.unlocked ? undefined : { opacity: 0.45, filter: "grayscale(0.8)" }}>
            <div className="grid place-items-center text-3xl" style={{
              width: 56, height: 56,
              background: a.unlocked ? "color-mix(in oklab, var(--coin) 30%, var(--color-card))" : "var(--color-muted)",
              border: "2px solid var(--color-border)", borderRadius: 6,
            }}>
              {a.unlocked ? a.emoji : "❔"}
            </div>
            <div className="font-pixel text-[0.6rem]">{a.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
