// Camp progression tiers — pure helper. Derives what decor is visible based on player level.
// Modular: add new tiers here without touching CampScene composition beyond a conditional.

export type CampTier = {
  tier: number;
  label: string;
  hasTent: boolean;
  hasCampfire: boolean;
  hasFence: boolean;
  hasGarden: boolean;
  hasMailbox: boolean;
  hasCabin: boolean;
  hasBridge: boolean;
  hasLanterns: boolean;
  hasWindmill: boolean;
  hasPond: boolean;
  hasFlowerBeds: boolean;
  hasStonePaths: boolean;
  hasVisitors: boolean;
  hasDecorations: boolean;
  hasLodge: boolean;
  hasWatchtower: boolean;
  hasStatues: boolean;
  hasCrystals: boolean;
  hasSanctuary: boolean;
  decorLevel: number; // 0..6
};

const BASE: CampTier = {
  tier: 1,
  label: "Tiny Campsite",
  hasTent: true,
  hasCampfire: true,
  hasFence: false,
  hasGarden: false,
  hasMailbox: false,
  hasCabin: false,
  hasBridge: false,
  hasLanterns: false,
  hasWindmill: false,
  hasPond: false,
  hasFlowerBeds: false,
  hasStonePaths: false,
  hasVisitors: false,
  hasDecorations: false,
  hasLodge: false,
  hasWatchtower: false,
  hasStatues: false,
  hasCrystals: false,
  hasSanctuary: false,
  decorLevel: 0,
};

export function getCampTier(level: number): CampTier {
  const t = { ...BASE };
  if (level >= 10) { t.tier = 2; t.label = "Growing Camp"; t.hasFence = true; t.hasGarden = true; t.hasMailbox = true; t.decorLevel = 1; }
  if (level >= 20) { t.tier = 3; t.label = "Wooden Cabin"; t.hasCabin = true; t.hasBridge = true; t.hasLanterns = true; t.decorLevel = 2; }
  if (level >= 35) { t.tier = 4; t.label = "Homestead"; t.hasWindmill = true; t.hasPond = true; t.hasFlowerBeds = true; t.decorLevel = 3; }
  if (level >= 50) { t.tier = 5; t.label = "Village"; t.hasStonePaths = true; t.hasVisitors = true; t.hasDecorations = true; t.decorLevel = 4; }
  if (level >= 75) { t.tier = 6; t.label = "Great Lodge"; t.hasLodge = true; t.hasWatchtower = true; t.hasStatues = true; t.hasCrystals = true; t.decorLevel = 5; }
  if (level >= 100) { t.tier = 7; t.label = "Legendary Sanctuary"; t.hasSanctuary = true; t.decorLevel = 6; }
  return t;
}

export const TIER_MILESTONES = [1, 10, 20, 35, 50, 75, 100];

export function nextTierLevel(level: number): number | null {
  const next = TIER_MILESTONES.find((m) => m > level);
  return next ?? null;
}
