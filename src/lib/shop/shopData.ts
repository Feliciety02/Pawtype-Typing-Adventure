import type { WorldId } from "@/components/shared/WorldTheme";
import type { PetType } from "../../lib/game/types";

export type Rarity = "common" | "rare" | "epic" | "legendary" | "mythic";

export type PetSpecies = "cat" | "dog" | "rabbit" | "dragon" | "other";

export type PetItem = {
  id: string;
  petType: PetType;
  name: string;
  species: PetSpecies;
  emoji: string;
  price: number;
  rarity: Rarity;
  unlockLevel: number;
  description: string;
  addedAt: number;
};

export type ThemeCategory =
  "forest" | "beach" | "snow" | "castle" | "space" | "cafe" | "garden" | "special";

export type ThemeItem = {
  id: string;
  worldId: WorldId;
  name: string;
  emoji: string;
  price: number;
  category: ThemeCategory;
  description: string;
  unlockLevel: number;
};

export type DoodadCategory = "furniture" | "plants" | "lights" | "outdoor" | "decor" | "special";

export type DoodadItem = {
  id: string;
  name: string;
  emoji: string;
  price: number;
  category: DoodadCategory;
  description: string;
};

export type ShopTab = "pets" | "themes";

export type PetCategory = "all" | "cat" | "dog" | "rabbit" | "dragon";

export type PetSort = "newest" | "price" | "rarity" | "alpha";

export const PETS: PetItem[] = [
  {
    id: "pet-cat",
    petType: "cat",
    name: "Orange Tabby",
    species: "cat",
    emoji: "🐱",
    price: 0,
    rarity: "common",
    unlockLevel: 1,
    description: "Friendly explorer with a curious tail-flick.",
    addedAt: 1,
  },
  {
    id: "pet-dog",
    petType: "dog",
    name: "Pixel Pup",
    species: "dog",
    emoji: "🐶",
    price: 400,
    rarity: "common",
    unlockLevel: 1,
    description: "A wagging pixel pup who loves the keyboard.",
    addedAt: 2,
  },
  {
    id: "pet-rabbit",
    petType: "rabbit",
    name: "Flopsy",
    species: "rabbit",
    emoji: "🐰",
    price: 350,
    rarity: "common",
    unlockLevel: 2,
    description: "Fluffy pixel bunny with a hop in every combo.",
    addedAt: 3,
  },
  {
    id: "pet-fox",
    petType: "fox",
    name: "Sly",
    species: "other",
    emoji: "🦊",
    price: 500,
    rarity: "rare",
    unlockLevel: 4,
    description: "Clever fox that steals hearts and typos.",
    addedAt: 4,
  },
  {
    id: "pet-penguin",
    petType: "penguin",
    name: "Chilly",
    species: "other",
    emoji: "🐧",
    price: 450,
    rarity: "rare",
    unlockLevel: 5,
    description: "Waddling pixel penguin, cool under pressure.",
    addedAt: 5,
  },
  {
    id: "pet-panda",
    petType: "panda",
    name: "Bamboo",
    species: "other",
    emoji: "🐼",
    price: 600,
    rarity: "epic",
    unlockLevel: 8,
    description: "A roly-poly pixel panda who naps on your keys.",
    addedAt: 6,
  },
  {
    id: "pet-dragon",
    petType: "dragon",
    name: "Ember",
    species: "dragon",
    emoji: "🐉",
    price: 800,
    rarity: "legendary",
    unlockLevel: 12,
    description: "Tiny pixel dragon fueled by combo streaks.",
    addedAt: 7,
  },
];

export const THEMES: ThemeItem[] = [
  {
    id: "theme-cafe-preview",
    worldId: "cafe",
    name: "Cozy Café",
    emoji: "☕",
    price: 0,
    category: "cafe",
    unlockLevel: 1,
    description: "Warm terracotta & cream. Your starting hearth.",
  },
  {
    id: "theme-forest-preview",
    worldId: "forest",
    name: "Mossy Forest",
    emoji: "🌲",
    price: 0,
    category: "forest",
    unlockLevel: 1,
    description: "Ferns, dew, and dappled light.",
  },
  {
    id: "theme-ocean-preview",
    worldId: "ocean",
    name: "Tide Pool",
    emoji: "🌊",
    price: 0,
    category: "beach",
    unlockLevel: 1,
    description: "Salt breeze and seafoam.",
  },
  {
    id: "theme-sakura-preview",
    worldId: "sakura",
    name: "Sakura Park",
    emoji: "🌸",
    price: 0,
    category: "garden",
    unlockLevel: 1,
    description: "Petals drift in the wind.",
  },
  {
    id: "theme-castle-preview",
    worldId: "castle",
    name: "Royal Castle",
    emoji: "🏰",
    price: 0,
    category: "castle",
    unlockLevel: 1,
    description: "Velvet drapes & gold trim.",
  },
  {
    id: "theme-space-preview",
    worldId: "space",
    name: "Stardust",
    emoji: "🌌",
    price: 0,
    category: "space",
    unlockLevel: 1,
    description: "Neon comets in deep night.",
  },
  {
    id: "theme-autumn",
    worldId: "autumn",
    name: "Autumn Cottage",
    emoji: "🍂",
    price: 150,
    category: "forest",
    unlockLevel: 3,
    description: "Crisp air & golden leaves.",
  },
  {
    id: "theme-mushroom",
    worldId: "mushroom",
    name: "Mushroom Village",
    emoji: "🍄",
    price: 150,
    category: "forest",
    unlockLevel: 5,
    description: "Glowing spores & twisted roots.",
  },
  {
    id: "theme-sunflower",
    worldId: "sunflower",
    name: "Sunflower Meadow",
    emoji: "🌻",
    price: 150,
    category: "garden",
    unlockLevel: 3,
    description: "Golden fields & buzzing bees.",
  },
];

export const DOODADS: DoodadItem[] = [
  {
    id: "doodad-bookshelf",
    name: "Bookshelf",
    emoji: "📚",
    price: 120,
    category: "furniture",
    description: "Stacked with dog-eared favorites.",
  },
  {
    id: "doodad-bench",
    name: "Wooden Bench",
    emoji: "🪑",
    price: 100,
    category: "furniture",
    description: "A cozy perch for your pet.",
  },
  {
    id: "doodad-picnic",
    name: "Picnic Basket",
    emoji: "🧺",
    price: 90,
    category: "furniture",
    description: "Snacks and stitched blankets.",
  },
  {
    id: "doodad-flowerpot",
    name: "Flower Pot",
    emoji: "🪴",
    price: 60,
    category: "plants",
    description: "A cheerful desk companion.",
  },
  {
    id: "doodad-tree",
    name: "Potted Tree",
    emoji: "🌳",
    price: 180,
    category: "plants",
    description: "A tiny forest in your room.",
  },
  {
    id: "doodad-cactus",
    name: "Cactus",
    emoji: "🌵",
    price: 70,
    category: "plants",
    description: "Prickly but polite.",
  },
  {
    id: "doodad-lantern",
    name: "Paper Lantern",
    emoji: "🏮",
    price: 130,
    category: "lights",
    description: "Warm amber glow at dusk.",
  },
  {
    id: "doodad-campfire",
    name: "Campfire",
    emoji: "🔥",
    price: 200,
    category: "outdoor",
    description: "Crackle, spark, cozy.",
  },
  {
    id: "doodad-mailbox",
    name: "Mailbox",
    emoji: "📮",
    price: 110,
    category: "outdoor",
    description: "For pixel-pal postcards.",
  },
  {
    id: "doodad-star",
    name: "Star Garland",
    emoji: "⭐",
    price: 80,
    category: "decor",
    description: "Twinkles softly overhead.",
  },
  {
    id: "doodad-crt",
    name: "CRT Filter",
    emoji: "📺",
    price: 150,
    category: "special",
    description: "Retro scanline shader for the whole app.",
  },
  {
    id: "doodad-sparkle",
    name: "Sparkle Trail",
    emoji: "✨",
    price: 200,
    category: "special",
    description: "Particles follow your typing.",
  },
];

export const RARITY_COLOR: Record<Rarity, string> = {
  common: "var(--muted-foreground)",
  rare: "#3aa0d8",
  epic: "#a06bff",
  legendary: "#e0a020",
  mythic: "#e04a80",
};

export const RARITY_ORDER: Record<Rarity, number> = {
  common: 0,
  rare: 1,
  epic: 2,
  legendary: 3,
  mythic: 4,
};

export const THEME_CATEGORIES: { id: ThemeCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "forest", label: "Forest" },
  { id: "beach", label: "Beach" },
  { id: "snow", label: "Snow" },
  { id: "castle", label: "Castle" },
  { id: "space", label: "Space" },
  { id: "cafe", label: "Cafe" },
  { id: "garden", label: "Garden" },
  { id: "special", label: "Special" },
];

export const DOODAD_CATEGORIES: { id: DoodadCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "furniture", label: "Furniture" },
  { id: "plants", label: "Plants" },
  { id: "lights", label: "Lights" },
  { id: "outdoor", label: "Outdoor" },
  { id: "decor", label: "Decor" },
  { id: "special", label: "Special" },
];
