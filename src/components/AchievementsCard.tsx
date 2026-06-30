import { useGame } from "../lib/game/store";
import { computeAchievements, CATEGORY_META, rarityForTier, type BadgeCategory } from "../lib/game/achievements";

const CATEGORIES: BadgeCategory[] = ["speed", "accuracy", "combo", "pet", "adventure", "learning", "streak", "challenge"];

const BADGE_BASE = "/Badge Collection";

function BadgeIcon({ assetName, category, unlocked, tier }: { assetName: string; category: string; unlocked: boolean; tier: number }) {
  const hue = (tier * 36 + 200) % 360;
  const lightness = unlocked ? 40 + tier * 4 : 20;
  return (
    <div
      className="grid place-items-center"
      style={{
        width: 72,
        height: 72,
        background: unlocked
          ? `hsl(${hue}, 60%, ${lightness}%)`
          : "var(--color-muted)",
        border: "2px solid",
        borderColor: unlocked
          ? `hsl(${hue}, 70%, ${lightness + 20}%)`
          : "var(--color-border)",
        borderRadius: 6,
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
        <span style={{ opacity: 0.7, fontSize: "0.45rem", color: "#fff", textAlign: "center", lineHeight: 1.1 }}>
          🏅<br />
          <span style={{ fontSize: "0.35rem", opacity: 0.6 }}>T{tier}</span>
        </span>
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
        <p className="font-pixel text-[0.5rem] text-muted-foreground mt-0.5">
          🖼️ Badge images coming soon — placeholders shown for now.
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

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
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
                      className="pixel-card-sm p-3 text-center flex flex-col items-center gap-1.5"
                      style={a.unlocked ? undefined : { opacity: 0.5, filter: "grayscale(0.7)" }}
                      title={a.description}
                    >
                      <BadgeIcon assetName={a.assetName} category={a.category} unlocked={a.unlocked} tier={a.tier} />
                      <div className="font-pixel text-[0.6rem] leading-tight min-h-[2em]">
                        {a.title}
                      </div>
                      <span className="font-pixel text-[0.5rem] text-muted-foreground">
                        {a.rarity}
                      </span>
                      {a.progress && !a.unlocked && (
                        <>
                          <div className="pixel-bar w-full" style={{ height: 5 }}>
                            <div
                              className="h-full transition-all"
                              style={{ width: `${pct}%`, background: "var(--coin)" }}
                            />
                          </div>
                          <span className="font-pixel text-[0.45rem] text-muted-foreground">
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
            </section>
          );
        })}
      </div>
    </div>
  );
}
