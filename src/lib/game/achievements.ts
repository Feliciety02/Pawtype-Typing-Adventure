import type { GameState } from "./types";

export type Achievement = {
  id: string;
  emoji: string;
  title: string;
  description: string;
  unlocked: boolean;
  progress?: { current: number; goal: number };
};

function bestWpm(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(window.localStorage.getItem("pawtype-best-wpm") ?? "0") || 0;
}

export function computeAchievements(state: GameState): Achievement[] {
  const { player, inventory, adventures } = state;
  const accuracy =
    player.totalCorrectChars + player.totalMistakes > 0
      ? (player.totalCorrectChars / (player.totalCorrectChars + player.totalMistakes)) * 100
      : 0;
  const stagesCleared = Object.values(adventures).reduce((sum, list) => sum + list.length, 0);
  const worldsTouched = Object.keys(adventures).length;
  const wpm = bestWpm();

  return [
    {
      id: "first-steps",
      emoji: "🐾",
      title: "First Steps",
      description: "Finish your first typing test.",
      unlocked: player.totalTestsCompleted >= 1,
      progress: { current: Math.min(player.totalTestsCompleted, 1), goal: 1 },
    },
    {
      id: "speed-demon",
      emoji: "⚡",
      title: "Speed Demon",
      description: "Reach 40 WPM in a single test.",
      unlocked: wpm >= 40,
      progress: { current: Math.min(wpm, 40), goal: 40 },
    },
    {
      id: "sharpshooter",
      emoji: "🎯",
      title: "Sharpshooter",
      description: "Maintain 95%+ overall accuracy.",
      unlocked: accuracy >= 95 && player.totalTestsCompleted >= 3,
      progress: { current: Math.round(accuracy), goal: 95 },
    },
    {
      id: "night-owl",
      emoji: "🌙",
      title: "Night Owl",
      description: "Complete 10 typing tests.",
      unlocked: player.totalTestsCompleted >= 10,
      progress: { current: Math.min(player.totalTestsCompleted, 10), goal: 10 },
    },
    {
      id: "typing-royalty",
      emoji: "👑",
      title: "Typing Royalty",
      description: "Reach level 10.",
      unlocked: player.level >= 10,
      progress: { current: Math.min(player.level, 10), goal: 10 },
    },
    {
      id: "sakura-master",
      emoji: "🌸",
      title: "World Wanderer",
      description: "Adventure in 3 different worlds.",
      unlocked: worldsTouched >= 3,
      progress: { current: Math.min(worldsTouched, 3), goal: 3 },
    },
    {
      id: "coin-hoarder",
      emoji: "🪙",
      title: "Coin Hoarder",
      description: "Stockpile 1,000 coins.",
      unlocked: player.coins >= 1000,
      progress: { current: Math.min(player.coins, 1000), goal: 1000 },
    },
    {
      id: "streak-keeper",
      emoji: "🔥",
      title: "Streak Keeper",
      description: "Log in 7 days in a row.",
      unlocked: player.streak >= 7,
      progress: { current: Math.min(player.streak, 7), goal: 7 },
    },
    {
      id: "pet-parent",
      emoji: "🐱",
      title: "Pet Parent",
      description: "Adopt your first fuzzy friend.",
      unlocked: inventory.pets.length >= 1,
      progress: { current: Math.min(inventory.pets.length, 1), goal: 1 },
    },
    {
      id: "quest-hero",
      emoji: "⚔",
      title: "Quest Hero",
      description: "Clear 5 adventure stages.",
      unlocked: stagesCleared >= 5,
      progress: { current: Math.min(stagesCleared, 5), goal: 5 },
    },
    {
      id: "boss-slayer",
      emoji: "🐉",
      title: "Boss Slayer",
      description: "Defeat a world boss (stage 4).",
      unlocked: Object.values(adventures).some((list) => list.includes(4)),
    },
    {
      id: "wordsmith",
      emoji: "✍",
      title: "Wordsmith",
      description: "Type 5,000 correct characters.",
      unlocked: player.totalCorrectChars >= 5000,
      progress: { current: Math.min(player.totalCorrectChars, 5000), goal: 5000 },
    },
  ];
}
