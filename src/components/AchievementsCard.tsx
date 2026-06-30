import { useGame } from "../lib/game/store";
import { computeAchievements, CATEGORY_META, type BadgeCategory } from "../lib/game/achievements";

const CATEGORIES: BadgeCategory[] = ["speed", "accuracy", "combo", "pet", "adventure", "learning", "streak", "challenge"];

const BADGE_BASE = "/Badge Collection";

const TIER_COLORS: Record<number, string> = {
  1: "#b0b0b0",
  2: "#4ade80",
  3: "#60a5fa",
  4: "#a78bfa",
  5: "#fbbf24",
  6: "#fb923c",
  7: "#22d3ee",
  8: "#facc15",
  9: "#f472b6",
  10: "#ef4444",
  11: "#a855f7",
};

function BadgeIcon({ assetName, category, unlocked, tier }: { assetName: string; category: string; unlocked: boolean; tier: number }) {
  return (
    <div
      style={{
        width: 180,
        height: 180,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {unlocked ? (
        <img
          src={`${BADGE_BASE}/${category}/${assetName}`}
          alt={`${category} badge tier ${tier}`}
          style={{ width: "100%", height: "100%", objectFit: "contain", imageRendering: "pixelated" }}
        />
      ) : (
        <img
          src={`${BADGE_BASE}/${category}/${assetName}`}
          alt={`${category} badge tier ${tier} (locked)`}
          style={{
            width: "100%", height: "100%", objectFit: "contain", imageRendering: "pixelated",
            filter: "brightness(0.15) saturate(0.2)",
            opacity: 0.6,
          }}
        />
      )}
    </div>
  );
}

export function AchievementsCard() {
  const { state } = useGame();
  const achievements = computeAchievements(state);
  const unlocked = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="pixel-card p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-3xl leading-none">🏆 Badges</h2>
        <p className="font-pixel text-[0.65rem] text-muted-foreground mt-1">
          Collect them all — {unlocked} / {achievements.length} unlocked.
        </p>

      </div>

      <div className="space-y-8">
        {CATEGORIES.map((cat) => {
          const catBadges = achievements.filter((a) => a.category === cat).sort((a, b) => a.tier - b.tier);
          const catUnlocked = catBadges.filter((a) => a.unlocked).length;
          const meta = CATEGORY_META[cat];

          return (
            <section key={cat}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{meta.emoji}</span>
                <h3 className="font-pixel text-[0.75rem] leading-tight">{meta.label}</h3>
                <span className="font-pixel text-[0.5rem] text-muted-foreground ml-auto">
                  {catUnlocked}/{catBadges.length}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {catBadges.map((a) => {
                  const pct =
                    a.progress && a.progress.goal > 0
                      ? Math.min(100, Math.round((a.progress.current / a.progress.goal) * 100))
                      : a.unlocked
                        ? 100
                        : 0;

                  return (
                    <div
                      key={a.id}
                      className="flex flex-col items-center gap-1.5"
                      title={a.description}
                      style={a.unlocked ? undefined : { opacity: 0.85 }}
                    >
                      <BadgeIcon assetName={a.assetName} category={a.category} unlocked={a.unlocked} tier={a.tier} />
                      <div className="font-pixel text-[0.75rem] leading-tight text-center font-bold">
                        {a.title}
                      </div>
                      <span className="font-pixel text-[0.5rem]" style={{ color: a.unlocked ? TIER_COLORS[a.tier] ?? "#888" : "var(--muted-foreground)" }}>
                        {a.rarity}
                      </span>
                      {a.progress && !a.unlocked && (
                        <>
                          <div className="pixel-bar" style={{ height: 4, width: "80%" }}>
                            <div
                              className="h-full transition-all"
                              style={{ width: `${pct}%`, background: TIER_COLORS[a.tier] ?? "var(--coin)" }}
                            />
                          </div>
                          <span className="font-pixel text-[0.4rem] text-muted-foreground">
                            {a.progress.current} / {a.progress.goal}
                          </span>
                        </>
                      )}
                      {a.unlocked && (
                        <span className="font-pixel text-[0.5rem]" style={{ color: TIER_COLORS[a.tier] ?? "var(--leaf)" }}>
                          ✓ Unlocked
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
