import { useEffect, useState } from "react";
import { useGame } from "../lib/game/store";
import { useWorld, WORLDS } from "./WorldTheme";
import { xpForLevel, getDailyReward } from "../lib/game/types";
import { useQuests } from "../lib/game/quests";
import { PixelMascot } from "./PixelMascot";
import { PixelPet } from "./PixelPet";
import { ThemeSetsSection } from "./ThemeSetsSection";
import { dailySuggestion } from "../lib/game/ai/difficulty";
import type { View } from "./Header";
import type { DailySuggestion } from "../lib/game/ai/difficulty";

export function Hub({ onViewChange }: { onViewChange: (v: View) => void }) {
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

  const [suggestion, setSuggestion] = useState<DailySuggestion | null>(null);
  useEffect(() => { dailySuggestion().then(setSuggestion).catch(() => {}); }, []);

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
        <div className="pixel-card p-5 flex flex-col items-center gap-2">
          {activePet ? (
            <>
              <PixelPet pet={activePet} size={100} />
              {inventory.pets.length > 1 && (
                <div className="flex gap-1 mt-1">
                  {inventory.pets.map((p) => (
                    <button key={p.type}
                      className={`pixel-btn pixel-btn-secondary ${p.type === activePet.type ? "opacity-100" : "opacity-50"}`}
                      style={{ padding: "2px 6px", fontSize: "0.7rem" }}
                      onClick={() => dispatch({ type: "SET_ACTIVE_PET", petType: p.type })}>
                      {p.type === "cat" ? "🐱" : p.type === "dog" ? "🐶" : p.type === "fox" ? "🦊" : p.type === "rabbit" ? "🐰" : p.type === "panda" ? "🐼" : p.type === "penguin" ? "🐧" : "🐉"}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <PixelMascot mood="idle" size={100} />
              <p className="font-pixel text-[0.6rem] text-muted-foreground text-center">Adopt a pet in the shop!</p>
            </>
          )}
        </div>
        <div className="pixel-card p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-display text-3xl leading-none" suppressHydrationWarning>Level {player.level}</div>
              <p className="font-pixel text-[0.6rem] text-muted-foreground mt-1">{currentWorld.emoji} Exploring · {currentWorld.name}</p>
            </div>
            <div className="text-right">
              <div className="font-pixel text-[0.65rem] uppercase" style={{ color: "var(--muted-foreground)" }}>Typist</div>
              <div className="font-pixel text-sm" suppressHydrationWarning>Rank #{player.totalTestsCompleted > 0 ? Math.max(1, 100 - player.totalTestsCompleted) : "-"}</div>
            </div>
          </div>
          <div>
            <div className="flex justify-between font-pixel text-[0.6rem] mb-1">
              <span style={{ color: "var(--muted-foreground)" }}>XP to next level</span>
              <span suppressHydrationWarning>{player.xp} / {needed}</span>
            </div>
            <div className="pixel-bar">
              <div className="h-full transition-all" style={{ width: `${needed > 0 ? Math.round((player.xp / needed) * 100) : 0}%`, background: "var(--leaf)" }} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-1">
            <div className="pixel-card-sm p-2 text-center">
              <div className="font-pixel text-[0.55rem] text-muted-foreground uppercase">Tests</div>
              <div className="font-display text-lg" style={{ color: "var(--color-primary)" }} suppressHydrationWarning>{player.totalTestsCompleted}</div>
            </div>
            <div className="pixel-card-sm p-2 text-center">
              <div className="font-pixel text-[0.55rem] text-muted-foreground uppercase">Accuracy</div>
              <div className="font-display text-lg" style={{ color: "var(--leaf)" }} suppressHydrationWarning>
                {player.totalCorrectChars + player.totalMistakes > 0 ? `${Math.round((player.totalCorrectChars / (player.totalCorrectChars + player.totalMistakes)) * 100)}%` : "-"}
              </div>
            </div>
            <div className="pixel-card-sm p-2 text-center">
              <div className="font-pixel text-[0.55rem] text-muted-foreground uppercase">Streak</div>
              <div className="font-display text-lg" style={{ color: "var(--coin)" }} suppressHydrationWarning>🔥 {player.streak}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily reward */}
      <div className="pixel-card p-4 flex items-center justify-between cursor-pointer transition-opacity"
        style={{ border: `2px dashed ${canClaim ? "var(--coin)" : "var(--color-border)"}`, opacity: canClaim ? 1 : 0.6 }}
        onClick={() => canClaim && dispatch({ type: "CLAIM_DAILY_REWARD" })}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{canClaim ? "🎁" : "✅"}</span>
          <div>
            <div className="font-pixel text-sm">{canClaim ? "Daily Reward Available!" : "Daily Reward Claimed"}</div>
            <p className="font-pixel text-[0.6rem] text-muted-foreground">
              {canClaim ? `Day ${player.streak + 1} — ${reward?.label}` : `Streak: ${player.streak} days — Come back tomorrow!`}
            </p>
          </div>
        </div>
        <div className="font-pixel text-[0.65rem]" style={{ color: "var(--coin)" }}>🪙 {reward?.coins ?? 0}</div>
      </div>

      {/* AI Suggestion */}
      {suggestion && (
        <div className="pixel-card p-4 flex items-center gap-4"
          style={{
            borderLeft: `4px solid ${
              suggestion.type === "speed" ? "var(--color-primary)" :
              suggestion.type === "accuracy" ? "var(--leaf)" :
              suggestion.type === "weakness" ? "var(--color-destructive)" :
              suggestion.type === "warmup" ? "var(--coin)" :
              "var(--muted-foreground)"
            }`
          }}>
          <span className="text-3xl">
            {suggestion.type === "speed" ? "⚡" :
             suggestion.type === "accuracy" ? "🎯" :
             suggestion.type === "weakness" ? "💪" :
             suggestion.type === "warmup" ? "🔥" : "💡"}
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-pixel text-sm">{suggestion.title}</div>
            <p className="font-pixel text-[0.6rem] text-muted-foreground mt-0.5">{suggestion.description}</p>
          </div>
        </div>
      )}

      {/* Quest stats */}
      <div className="grid grid-cols-3 gap-4">
        {quests.map((q) => (
          <div key={q.title} className="pixel-card-sm p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-pixel text-[0.65rem]">{q.icon} {q.title}</span>
              <span className="font-pixel text-[0.6rem] text-muted-foreground">{q.value}</span>
            </div>
            <div className="pixel-bar"><div className="h-full transition-all" style={{ width: `${q.bar}%`, background: q.color }} /></div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {QUICK_ACTIONS.map((action) => (
          <button key={action.view} onClick={() => onViewChange(action.view)}
            className="pixel-card-sm p-4 text-center flex flex-col items-center gap-2 transition-transform hover:-translate-y-1">
            <span className="text-3xl">{action.emoji}</span>
            <span className="font-pixel text-[0.7rem]">{action.label}</span>
          </button>
        ))}
      </div>

      <ThemeSetsSection activeWorld={world} onSelectWorld={setWorld} />
    </div>
  );
}
