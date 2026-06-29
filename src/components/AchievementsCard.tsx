import { SectionHeader } from "./SectionHeader";
import { useGame } from "../lib/game/store";
import { computeAchievements } from "../lib/game/achievements";

export function AchievementsCard() {
  const { state } = useGame();
  const achievements = computeAchievements(state);
  const unlocked = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="pixel-card p-5">
      <SectionHeader
        title="Badges"
        subtitle={`Collect them all — ${unlocked} / ${achievements.length} unlocked.`}
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {achievements.map((a) => {
          const pct =
            a.progress && a.progress.goal > 0
              ? Math.min(100, Math.round((a.progress.current / a.progress.goal) * 100))
              : a.unlocked
                ? 100
                : 0;
          return (
            <div
              key={a.id}
              className="pixel-card-sm p-3 text-center flex flex-col items-center gap-1.5"
              style={a.unlocked ? undefined : { opacity: 0.55, filter: "grayscale(0.7)" }}
              title={a.description}
            >
              <div
                className="grid place-items-center text-3xl"
                style={{
                  width: 56,
                  height: 56,
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
              <p className="font-pixel text-[0.5rem] text-muted-foreground leading-tight">
                {a.description}
              </p>
              {a.progress && !a.unlocked && (
                <>
                  <div className="pixel-bar w-full" style={{ height: 6 }}>
                    <div
                      className="h-full transition-all"
                      style={{ width: `${pct}%`, background: "var(--coin)" }}
                    />
                  </div>
                  <span className="font-pixel text-[0.5rem] text-muted-foreground">
                    {a.progress.current} / {a.progress.goal}
                  </span>
                </>
              )}
              {a.unlocked && (
                <span className="font-pixel text-[0.5rem]" style={{ color: "var(--leaf)" }}>
                  ✓ Unlocked
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
