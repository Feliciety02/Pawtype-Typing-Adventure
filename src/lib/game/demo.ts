import {
  DEFAULT_GAME_STATE,
  PET_NAMES,
  type GameState,
} from "./types";

export function buildDemoGameState(): GameState {
  return {
    ...DEFAULT_GAME_STATE,
    player: {
      ...DEFAULT_GAME_STATE.player,
      coins: 2450,
      xp: 80,
      level: 6,
      streak: 5,
      totalTestsCompleted: 18,
      totalCorrectChars: 6920,
      totalMistakes: 123,
    },
    inventory: {
      items: [
        ...DEFAULT_GAME_STATE.inventory.items,
        "crt-shader",
        "sparkle-trail",
        "theme-castle",
        "theme-space",
      ],
      pets: [
        {
          type: "cat",
          name: PET_NAMES.cat,
          xp: 40,
          level: 4,
          adoptedAt: 0,
        },
        {
          type: "fox",
          name: PET_NAMES.fox,
          xp: 15,
          level: 2,
          adoptedAt: 0,
        },
      ],
      activePet: "fox",
    },
    adventures: {
      cafe: [1, 2, 3],
      forest: [1, 2],
      ocean: [1],
    },
  };
}
