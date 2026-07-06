import { useGame } from "./store";
import { xpForLevel } from "./types";

export function useQuests() {
  const { state } = useGame();
  const { player } = state;
  const needed = xpForLevel(player.level);
  return [
    {
      icon: "🔥",
      title: "Daily Streak",
      value: `${player.streak} days`,
      bar: Math.min(player.streak * 14, 100),
      color: "var(--color-primary)",
    },
    {
      icon: "🪙",
      title: "Coins",
      value: player.coins.toLocaleString(),
      bar: Math.min(player.coins / 20, 100),
      color: "var(--coin)",
    },
    {
      icon: "⭐",
      title: `Level ${player.level}`,
      value: `${player.xp} / ${needed} XP`,
      bar: needed > 0 ? Math.round((player.xp / needed) * 100) : 0,
      color: "var(--leaf)",
    },
  ];
}
