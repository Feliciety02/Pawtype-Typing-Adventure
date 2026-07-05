export type PetType = "cat" | "dog" | "fox" | "rabbit" | "panda" | "penguin" | "dragon";

export type PetState = {
  type: PetType;
  name: string;
  xp: number;
  level: number;
  adoptedAt: number;
};

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

export type AdventureProgress = Record<string, number[]>;

export type Inventory = {
  items: string[];
  pets: PetState[];
  activePet: PetType | null;
};

export type GameState = {
  player: PlayerState;
  inventory: Inventory;
  adventures: AdventureProgress;
};

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

export const DEFAULT_STARTER_PET: PetState = {
  type: "cat",
  name: "Whiskers",
  xp: 0,
  level: 1,
  adoptedAt: 0,
};

export const DEFAULT_INVENTORY: Inventory = {
  items: [
    "theme-autumn",
    "theme-mushroom",
    "theme-sunflower",
  ],
  pets: [DEFAULT_STARTER_PET],
  activePet: DEFAULT_STARTER_PET.type,
};

export const DEFAULT_GAME_STATE: GameState = {
  player: DEFAULT_PLAYER,
  inventory: DEFAULT_INVENTORY,
  adventures: {},
};

export type DailyReward = {
  day: number;
  coins: number;
  item?: string;
  label: string;
};

export const DAILY_REWARDS: DailyReward[] = [
  { day: 1, coins: 100, label: "100 Coins" },
  { day: 2, coins: 0, item: "theme-day-2", label: "Secret Theme" },
  { day: 3, coins: 200, item: "furniture-day-3", label: "Cozy Chair" },
  { day: 4, coins: 0, item: "xp-boost-day-4", label: "2x XP Boost (1 test)" },
  { day: 5, coins: 150, item: "pet-food-day-5", label: "Pet Treat" },
  { day: 6, coins: 500, item: "rare-item-day-6", label: "Rare Wallpaper" },
  { day: 7, coins: 1000, item: "legendary-day-7", label: "Legendary Crown" },
];

export function xpForLevel(level: number): number {
  return level * 100;
}

export function petXpForLevel(level: number): number {
  return level * 50;
}

export type EvolutionStage = "baby" | "adult" | "evolved" | "legendary";

export function petEvolutionStage(level: number): EvolutionStage {
  if (level >= 10) return "legendary";
  if (level >= 6) return "evolved";
  if (level >= 3) return "adult";
  return "baby";
}

export const PET_NAMES: Record<PetType, string> = {
  cat: "Whiskers",
  dog: "Barkley",
  fox: "Sly",
  rabbit: "Flopsy",
  panda: "Bamboo",
  penguin: "Chilly",
  dragon: "Ember",
};

export function getDailyReward(streakDay: number): DailyReward {
  const idx = ((streakDay - 1) % DAILY_REWARDS.length);
  return DAILY_REWARDS[idx];
}
