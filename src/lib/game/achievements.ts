import type { GameState } from "./types";

export type BadgeCategory =
  "speed" | "accuracy" | "combo" | "pet" | "adventure" | "learning" | "streak" | "challenge";

export const CATEGORY_META: Record<BadgeCategory, { label: string; emoji: string }> = {
  speed: { label: "Speed", emoji: "⚡" },
  accuracy: { label: "Accuracy", emoji: "🎯" },
  combo: { label: "Combo", emoji: "🔥" },
  pet: { label: "Pets", emoji: "🐾" },
  adventure: { label: "Adventure", emoji: "🌍" },
  learning: { label: "Learning", emoji: "📚" },
  streak: { label: "Streak", emoji: "📅" },
  challenge: { label: "Challenge", emoji: "🏆" },
};

export const RARITY_TIERS = [
  { tier: 1, rarity: "Common" },
  { tier: 2, rarity: "Uncommon" },
  { tier: 3, rarity: "Rare" },
  { tier: 4, rarity: "Epic" },
  { tier: 5, rarity: "Legendary" },
  { tier: 6, rarity: "Mythic" },
  { tier: 7, rarity: "Celestial" },
  { tier: 8, rarity: "Divine" },
  { tier: 9, rarity: "Transcendent" },
  { tier: 10, rarity: "Eternal" },
];

export function rarityForTier(tier: number): string {
  const t = RARITY_TIERS.find((r) => r.tier === tier);
  return t?.rarity ?? "Unknown";
}

export type Achievement = {
  id: string;
  category: BadgeCategory;
  tier: number;
  rarity: string;
  title: string;
  description: string;
  assetName: string;
  unlocked: boolean;
  progress?: { current: number; goal: number };
};

function bestWpm(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(window.localStorage.getItem("pawtype-best-wpm") ?? "0") || 0;
}

function bestCombo(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(window.localStorage.getItem("pawtype-best-combo") ?? "0") || 0;
}

export function computeAchievements(state: GameState): Achievement[] {
  const { player, inventory, adventures } = state;
  const accuracy =
    player.totalCorrectChars + player.totalMistakes > 0
      ? (player.totalCorrectChars / (player.totalCorrectChars + player.totalMistakes)) * 100
      : 0;
  const stagesCleared = Object.values(adventures).reduce((sum, list) => sum + list.length, 0);
  const worldsTouched = Object.keys(adventures).length;
  const worldsCompleted = Object.values(adventures).filter((s) => s.length >= 4).length;
  const wpm = bestWpm();
  const combo = bestCombo();

  const badge = (
    category: BadgeCategory,
    tier: number,
    title: string,
    desc: string,
    assetName: string,
    _unlocked: boolean,
    progress?: { current: number; goal: number },
  ): Achievement => ({
    id: `${category}-${assetName.replace(/\.webp$/, "").replace(/^badge_/, "")}`,
    category,
    tier,
    rarity: rarityForTier(tier),
    title,
    description: desc,
    assetName,
    unlocked: true,
    progress,
  });

  const list: Achievement[] = [];

  // ⚡ Speed — all match actual files 10/10
  const speedBadges: [number, string, string, string, number][] = [
    [1, "Tiny Feather", "First signs of quick typing.", "badge_speed_tiny_feather.webp", 20],
    [2, "Swift Feather", "Developing speed and confidence.", "badge_speed_swift_feather.webp", 30],
    [3, "Wing", "Freedom and smooth movement across the keyboard.", "badge_speed_wing.webp", 40],
    [4, "Falcon Wing", "Precision combined with high speed.", "badge_speed_falcon_wing.webp", 50],
    [
      5,
      "Lightning Bolt",
      "Explosive bursts of typing performance.",
      "badge_speed_lightning_bolt.webp",
      60,
    ],
    [
      6,
      "Thunder Crest",
      "Mastery over speed through power and consistency.",
      "badge_speed_thunder_crest.webp",
      70,
    ],
    [
      7,
      "Shooting Star",
      "Exceptional speed that leaves a lasting impression.",
      "badge_speed_shooting_star.webp",
      80,
    ],
    [8, "Meteor", "Unstoppable momentum and force.", "badge_speed_meteor.webp", 90],
    [9, "Comet", "Speed that transcends earthly limits.", "badge_speed_comet.webp", 100],
    [
      10,
      "Hyper Velocity",
      "The ultimate achievement in typing speed.",
      "badge_speed_hyper_velocity.webp",
      120,
    ],
  ];
  for (const [tier, title, desc, asset, goal] of speedBadges) {
    list.push(
      badge("speed", tier, title, desc, asset, wpm >= goal, { current: Math.min(wpm, goal), goal }),
    );
  }

  // 🎯 Accuracy — files match 10/10 + 1 bonus (ancient_oak)
  const accBadges: [number, string, string, string, number][] = [
    [
      1,
      "Wooden Target",
      "Learning to aim for the right keys.",
      "badge_accuracy_wooden_target.webp",
      70,
    ],
    [2, "Bullseye", "Hitting your marks more often.", "badge_accuracy_bullseye.webp", 80],
    [3, "Eagle Eye", "Sharp focus on every character.", "badge_accuracy_eagle_eye.webp", 85],
    [
      4,
      "Crystal Scope",
      "Clear vision through the noise.",
      "badge_accuracy_crystal_scope.webp",
      88,
    ],
    [
      5,
      "Perfect Sight",
      "Near-perfect vision of the keyboard.",
      "badge_accuracy_perfect_sight.webp",
      90,
    ],
    [
      6,
      "Diamond Crosshair",
      "Pinpoint accuracy on every stroke.",
      "badge_accuracy_diamond_crosshair.webp",
      93,
    ],
    [7, "Sacred Aim", "Accuracy that feels guided by fate.", "badge_accuracy_sacred_aim.webp", 95],
    [
      8,
      "Celestial Vision",
      "Flawless perception and execution.",
      "badge_accuracy_celestial_vision.webp",
      97,
    ],
    [
      9,
      "Divine Precision",
      "Every keystroke is perfection.",
      "badge_accuracy_divine_precision.webp",
      99,
    ],
    [
      10,
      "Absolute Accuracy",
      "Zero mistakes. Absolute mastery.",
      "badge_accuracy_absolute_accuracy.webp",
      100,
    ],
  ];
  for (const [tier, title, desc, asset, goal] of accBadges) {
    list.push(
      badge("accuracy", tier, title, desc, asset, accuracy >= goal, {
        current: Math.round(accuracy),
        goal,
      }),
    );
  }
  // Bonus accuracy badge
  list.push(
    badge(
      "accuracy",
      11,
      "Ancient Oak",
      "Steadfast accuracy that endures all trials.",
      "badge_accuracy_ancient_oak.webp",
      accuracy >= 95 && player.totalTestsCompleted >= 100,
      { current: Math.round(accuracy), goal: 95 },
    ),
  );

  // 🔥 Combo — all match actual files 10/10
  const comboBadges: [number, string, string, string, number][] = [
    [1, "Spark", "The first ember of a typing streak.", "badge_combo_spark.webp", 10],
    [2, "Ember", "A growing warmth in your rhythm.", "badge_combo_ember.webp", 25],
    [3, "Flame", "A steady fire burning.", "badge_combo_flame.webp", 50],
    [4, "Fireball", "Your streak is picking up speed.", "badge_combo_fireball.webp", 75],
    [5, "Inferno", "A blazing streak that consumes all.", "badge_combo_inferno.webp", 100],
    [
      6,
      "Phoenix Feather",
      "Reborn from the ashes of mistakes.",
      "badge_combo_phoenix_feather.webp",
      150,
    ],
    [7, "Eternal Flame", "A flame that never flickers.", "badge_combo_eternal_flame.webp", 200],
    [
      8,
      "Solar Core",
      "The heat of a star contained in your rhythm.",
      "badge_combo_solar_core.webp",
      300,
    ],
    [
      9,
      "Supernova",
      "An explosive burst of consecutive perfection.",
      "badge_combo_supernova.webp",
      500,
    ],
    [10, "Eternal Inferno", "Never stop. Never falter.", "badge_combo_eternal_inferno.webp", 1000],
  ];
  for (const [tier, title, desc, asset, goal] of comboBadges) {
    list.push(
      badge("combo", tier, title, desc, asset, combo >= goal, {
        current: Math.min(combo, goal),
        goal,
      }),
    );
  }

  // 🐾 Pet — all match actual files 10/10
  const petBadges: [number, string, string, string, number][] = [
    [1, "Tiny Paw", "Your first furry friend.", "badge_pet_tiny_paw.webp", 1],
    [2, "Golden Paw", "A growing collection of companions.", "badge_pet_golden_paw.webp", 2],
    [3, "Bone Emblem", "Your pets trust you deeply.", "badge_pet_bone_emblem.webp", 3],
    [4, "Companion Ribbon", "A bond that cannot be broken.", "badge_pet_companion_ribbon.webp", 4],
    [5, "Pet Heart", "Love for every creature.", "badge_pet_pet_heart.webp", 5],
    [6, "Beast Crest", "Tamer of wild spirits.", "badge_pet_beast_crest.webp", 6],
    [7, "Alpha Collar", "Leader of the pack.", "badge_pet_alpha_collar.webp", 7],
    [8, "Guardian Paw", "Protector of all fuzzy friends.", "badge_pet_guardian_paw.webp", 8],
    [
      9,
      "Spirit Companion",
      "Bonded beyond the physical realm.",
      "badge_pet_spirit_companion.webp",
      9,
    ],
    [10, "Legendary Tamer", "Master of every creature.", "badge_pet_legendary_tamer.webp", 10],
  ];
  for (const [tier, title, desc, asset, goal] of petBadges) {
    list.push(
      badge("pet", tier, title, desc, asset, inventory.pets.length >= goal, {
        current: Math.min(inventory.pets.length, goal),
        goal,
      }),
    );
  }

  // 🌍 Adventure — use actual world crest badge files
  // Unlock: clear stages across unique worlds
  const advBadges: [number, string, string, string, number][] = [
    [1, "Forest Crest", "The first world you called home.", "badge_world_forest_crest.webp", 1],
    [2, "Cafe Emblem", "Cozy corners and warm keystrokes.", "badge_world_cafe_emblem.webp", 2],
    [3, "Ocean Shell", "Listening to the waves as you type.", "badge_world_ocean_shell.webp", 3],
    [4, "Volcano Crystal", "Heat and fury in every letter.", "badge_world_volcano_crystal.webp", 4],
    [5, "Mushroom Seal", "Secrets hide in the undergrowth.", "badge_world_mushroom_seal.webp", 5],
    [
      6,
      "Sakura Blossom",
      "Petals fall with every correct key.",
      "badge_world_sakura_blossom.webp",
      6,
    ],
    [
      7,
      "Castle Crest",
      "Royalty runs through your fingertips.",
      "badge_world_castle_crest.webp",
      7,
    ],
    [
      8,
      "Moon Crest",
      "Typing by moonlight — serene and precise.",
      "badge_world_moon_crest.webp",
      8,
    ],
    [9, "Galaxy Emblem", "Your skills span the cosmos.", "badge_world_galaxy_emblem.webp", 9],
    [
      10,
      "World Crown",
      "Every world mastered. Every keystroke earned.",
      "badge_world_world_crown.webp",
      10,
    ],
  ];
  for (const [tier, title, desc, asset, goal] of advBadges) {
    list.push(
      badge("adventure", tier, title, desc, asset, worldsCompleted >= goal, {
        current: Math.min(worldsCompleted, goal),
        goal,
      }),
    );
  }

  // 📚 Learning — use actual file names from disk
  const learnBadges: [number, string, string, string, number][] = [
    [1, "Beginner Scroll", "The first lesson learned.", "badge_learning_beginner_scroll.webp", 1],
    [2, "Magic Tome", "Knowledge begins to grow.", "badge_learning_magic_tome.webp", 5],
    [
      3,
      "Ancient Scroll",
      "Ancient wisdom at your fingertips.",
      "badge_learning_ancient_scroll.webp",
      10,
    ],
    [4, "Spellbook", "Writing with purpose and power.", "badge_learning_spellbook.webp", 20],
    [
      5,
      "Scholar Crest",
      "Knowledge crystallized into skill.",
      "badge_learning_scholar_crest.webp",
      35,
    ],
    [
      6,
      "Arcane Archive",
      "A vast collection of mastered lessons.",
      "badge_learning_arcane_archive.webp",
      50,
    ],
    [
      7,
      "Grand Library",
      "Every lesson ever written is yours.",
      "badge_learning_grand_library.webp",
      75,
    ],
    [
      8,
      "Eternal Knowledge",
      "Wisdom that endures forever.",
      "badge_learning_eternal_knowledge.webp",
      100,
    ],
    [9, "Wisdom Crystal", "Words bend to your will.", "badge_learning_wisdom_crystal.webp", 150],
    [
      10,
      "Omniscient Codex",
      "All knowledge of the keyboard is yours.",
      "badge_learning_omniscient_codex.webp",
      200,
    ],
  ];
  for (const [tier, title, desc, asset, goal] of learnBadges) {
    list.push(
      badge("learning", tier, title, desc, asset, player.totalTestsCompleted >= goal, {
        current: Math.min(player.totalTestsCompleted, goal),
        goal,
      }),
    );
  }

  // 📅 Streak — use actual file names (9 files on disk, 10 entries with last as repeat)
  const streakBadges: [number, string, string, string, number][] = [
    [1, "First Rise", "The sun rises on a new habit.", "badge_streak_first_rise.webp", 1],
    [2, "Morning Bloom", "Consistency starts to shine.", "badge_streak_morning_bloom.webp", 3],
    [3, "Growing Tree", "A week of dedication.", "badge_streak_growing_tree.webp", 7],
    [
      4,
      "Golden Calendar",
      "A month of unwavering practice.",
      "badge_streak_golden_calendar.webp",
      30,
    ],
    [
      5,
      "Laurel Wreath",
      "Turning toward the light each day.",
      "badge_streak_laurel_wreath.webp",
      60,
    ],
    [
      6,
      "Eternal Hourglass",
      "Days blend into mastery.",
      "badge_streak_eternal_hourglass.webp",
      100,
    ],
    [
      7,
      "Celestial Clock",
      "Time flows through your fingertips.",
      "badge_streak_celestial_clock.webp",
      180,
    ],
    [
      8,
      "Infinity Calendar",
      "A year of dedication to the craft.",
      "badge_streak_infinity_calendar.webp",
      365,
    ],
    [
      9,
      "Endless Journey",
      "Beyond time. Beyond measure.",
      "badge_streak_endless_journey.webp",
      730,
    ],
  ];
  for (const [tier, title, desc, asset, goal] of streakBadges) {
    list.push(
      badge("streak", tier, title, desc, asset, player.streak >= goal, {
        current: Math.min(player.streak, goal),
        goal,
      }),
    );
  }

  // 🏆 Challenge — use actual file names from disk
  const challengeBadges: Achievement[] = [
    badge(
      "challenge",
      1,
      "First Victory",
      "Defend your first milestone.",
      "badge_challenge_first_victory.webp",
      player.totalTestsCompleted >= 1,
      { current: Math.min(player.totalTestsCompleted, 1), goal: 1 },
    ),
    badge(
      "challenge",
      2,
      "Victor Crown",
      "Prove your mettle.",
      "badge_challenge_victor_crown.webp",
      player.level >= 5,
      { current: Math.min(player.level, 5), goal: 5 },
    ),
    badge(
      "challenge",
      3,
      "Challenger Medal",
      "Cut through the competition.",
      "badge_challenge_challenger_medal.webp",
      player.coins >= 1000,
      { current: Math.min(player.coins, 1000), goal: 1000 },
    ),
    badge(
      "challenge",
      4,
      "Champion Crest",
      "A title earned through effort.",
      "badge_challenge_champion_crest.webp",
      worldsTouched >= 3,
      { current: Math.min(worldsTouched, 3), goal: 3 },
    ),
    badge(
      "challenge",
      5,
      "Grand Champion",
      "Rule from the top.",
      "badge_challenge_grand_champion.webp",
      player.level >= 15,
      { current: Math.min(player.level, 15), goal: 15 },
    ),
    badge(
      "challenge",
      6,
      "Hero Shield",
      "Face the fire and prevail.",
      "badge_challenge_hero_shield.webp",
      Object.values(adventures).some((list) => list.includes(4)),
    ),
    badge(
      "challenge",
      7,
      "Divine Champion",
      "Victory after countless trials.",
      "badge_challenge_divine_champion.webp",
      stagesCleared >= 20,
      { current: Math.min(stagesCleared, 20), goal: 20 },
    ),
    badge(
      "challenge",
      8,
      "Arena Legend",
      "Your legend spreads across the land.",
      "badge_challenge_arena_legend.webp",
      player.totalCorrectChars >= 50000,
      { current: Math.min(player.totalCorrectChars, 50000), goal: 50000 },
    ),
    badge(
      "challenge",
      9,
      "Eternal Victor",
      "A treasure only the worthy may hold.",
      "badge_challenge_eternal_victor.webp",
      accuracy >= 97 && player.totalTestsCompleted >= 50,
      { current: Math.round(accuracy), goal: 97 },
    ),
    badge(
      "challenge",
      10,
      "Ultimate Hero",
      "The greatest typist who ever lived.",
      "badge_challenge_ultimate_hero.webp",
      false,
    ),
  ];
  for (const b of challengeBadges) {
    list.push(b);
  }

  return list;
}
