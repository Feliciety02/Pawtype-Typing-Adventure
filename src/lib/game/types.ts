// Which pet types are available in the game
export type PetType = "cat" | "dog" | "fox" | "rabbit" | "panda" | "penguin" | "dragon";

// State for a single pet — levels up with typing practice
export type PetState = {
  type: PetType;
  name: string;
  xp: number;
  level: number;
  adoptedAt: number;
};

// Everything about the human player: currency, XP, streaks, lifetime stats
export type PlayerState = {
  coins: number;
  xp: number;
  level: number;
  streak: number;
  lastLoginDate: string | null;
  dailyRewardClaimed: boolean;
  totalTestsCompleted: number;
  totalCorrectChars: number;
  totalMistakes: number;
};

// A single keypress recorded during a typing test (used for detailed analysis)
export type KeystrokeEvent = {
  charIndex: number;
  char: string;
  target: string;
  correct: boolean;
  timestamp: number;
};

// A completed typing session — saved to history for stats and coach analysis
export type TypingSession = {
  id?: number;
  timestamp: number;
  duration: number;
  wpm: number;
  accuracy: number;
  correctChars: number;
  mistakes: number;
  bestCombo: number;
  keystrokes: KeystrokeEvent[];
};

// Map of world name → list of completed stage IDs (e.g., { "forest": [1, 2, 3] })
export type AdventureProgress = Record<string, number[]>;

// Everything a player owns: items, pets collection, and the currently active pet
export type Inventory = {
  items: string[];
  pets: PetState[];
  activePet: PetType | null;
};

// The complete game state — the single source of truth for the whole app
export type GameState = {
  player: PlayerState;
  inventory: Inventory;
  adventures: AdventureProgress;
  sessions: TypingSession[];
};

// We keep only the 100 most recent sessions in memory
const MAX_SESSIONS = 100;

// Fresh-start player values (level 1, no coins, no streak)
export const DEFAULT_PLAYER: PlayerState = {
  coins: 0,
  xp: 0,
  level: 1,
  streak: 0,
  lastLoginDate: null,
  dailyRewardClaimed: false,
  totalTestsCompleted: 0,
  totalCorrectChars: 0,
  totalMistakes: 0,
};

// The cat "Whiskers" is gifted to every new player
export const DEFAULT_STARTER_PET: PetState = {
  type: "cat",
  name: "Whiskers",
  xp: 0,
  level: 1,
  adoptedAt: 0,
};

// New players start with 3 theme items and Whiskers
export const DEFAULT_INVENTORY: Inventory = {
  items: ["theme-autumn", "theme-mushroom", "theme-sunflower"],
  pets: [DEFAULT_STARTER_PET],
  activePet: DEFAULT_STARTER_PET.type,
};

// The blank slate game state for a brand-new player
export const DEFAULT_GAME_STATE: GameState = {
  player: DEFAULT_PLAYER,
  inventory: DEFAULT_INVENTORY,
  adventures: {},
  sessions: [],
};

export { MAX_SESSIONS };

export type DailyReward = {
  day: number;
  coins: number;
  item?: string;
  label: string;
};

// 7-day reward cycle: items and coins get better as streak grows (loops after day 7)
export const DAILY_REWARDS: DailyReward[] = [
  { day: 1, coins: 100, label: "100 Coins" },
  { day: 2, coins: 0, item: "theme-day-2", label: "Secret Theme" },
  { day: 3, coins: 200, item: "furniture-day-3", label: "Cozy Chair" },
  { day: 4, coins: 0, item: "xp-boost-day-4", label: "2x XP Boost (1 test)" },
  { day: 5, coins: 150, item: "pet-food-day-5", label: "Pet Treat" },
  { day: 6, coins: 500, item: "rare-item-day-6", label: "Rare Wallpaper" },
  { day: 7, coins: 1000, item: "legendary-day-7", label: "Legendary Crown" },
];

// XP needed to reach the next player level (scales linearly)
export function xpForLevel(level: number): number {
  return level * 100;
}

// XP needed for a pet to reach its next level (pets level faster than players)
export function petXpForLevel(level: number): number {
  return level * 50;
}

export type EvolutionStage = "baby" | "adult" | "evolved" | "legendary";

// Pets visually evolve as they gain levels: baby → adult → evolved → legendary
export function petEvolutionStage(level: number): EvolutionStage {
  if (level >= 10) return "legendary";
  if (level >= 6) return "evolved";
  if (level >= 3) return "adult";
  return "baby";
}

// Default name suggestions for each pet type
export const PET_NAMES: Record<PetType, string> = {
  cat: "Whiskers",
  dog: "Barkley",
  fox: "Sly",
  rabbit: "Flopsy",
  panda: "Bamboo",
  penguin: "Chilly",
  dragon: "Ember",
};

// Get the reward for the current streak day (cycles after 7 days)
export function getDailyReward(streakDay: number): DailyReward {
  const idx = (streakDay - 1) % DAILY_REWARDS.length;
  return DAILY_REWARDS[idx];
}
