import type { WorldId } from "../shared/WorldTheme";

export type Difficulty = "Easy" | "Normal" | "Hard" | "Boss";

export type Stage = {
  id: number;
  name: string;
  emoji: string;
  difficulty: Difficulty;
  goal: number;
  words: string[];
};

export type Status = "locked" | "available" | "complete";

export type VisibleImageBounds = {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
  naturalWidth: number;
  naturalHeight: number;
};

export const LOCK_ICON = "/Icons/lock.png";
export const NODE_IMAGE_BOUNDS_CACHE = new Map<string, VisibleImageBounds>();

export const NODE_IMAGES: Partial<Partial<Record<WorldId, string[]>>> = {
  cafe: [
    "/node-level/cozy-cafe/cozy-cafe-01-cafe-corner.png",
    "/node-level/cozy-cafe/cozy-cafe-02-roast-ridge.png",
    "/node-level/cozy-cafe/cozy-cafe-03-latte-lake.png",
    "/node-level/cozy-cafe/cozy-cafe-04-bean-garden.png",
    "/node-level/cozy-cafe/cozy-cafe-05-mocha-manor.png",
  ],
  forest: [
    "/node-level/mossy-forest/mossy-forest-01-mossy-trail.png",
    "/node-level/mossy-forest/mossy-forest-02-fern-grove.png",
    "/node-level/mossy-forest/mossy-forest-03-fox-hollow.png",
    "/node-level/mossy-forest/mossy-forest-04-whisper-woods.png",
    "/node-level/mossy-forest/mossy-forest-05-elder-tree.png",
  ],
  ocean: [
    "/node-level/underwater-kingdom/underwater-kingdom-01-tide-pool.png",
    "/node-level/underwater-kingdom/underwater-kingdom-02-coral-reef.png",
    "/node-level/underwater-kingdom/underwater-kingdom-03-pearl-grotto.png",
    "/node-level/underwater-kingdom/underwater-kingdom-04-deep-abyss.png",
    "/node-level/underwater-kingdom/underwater-kingdom-05-sea-palace.png",
  ],
  sakura: [
    "/node-level/sakura-garden/sakura-garden-01-blossom-path.png",
    "/node-level/sakura-garden/sakura-garden-02-lotus-pond.png",
    "/node-level/sakura-garden/sakura-garden-03-tea-garden.png",
    "/node-level/sakura-garden/sakura-garden-04-shrine-hill.png",
    "/node-level/sakura-garden/sakura-garden-05-sakura-sanctuary.png",
  ],
  castle: [
    "/node-level/medieval-castle/medieval-castle-01-castle-gate.png",
    "/node-level/medieval-castle/medieval-castle-02-royal-courtyard.png",
    "/node-level/medieval-castle/medieval-castle-03-knights-hall.png",
    "/node-level/medieval-castle/medieval-castle-04-kings-keep.png",
    "/node-level/medieval-castle/medieval-castle-05-crown-citadel.png",
  ],
  space: [
    "/node-level/cosmic-observatory/cosmic-observatory-01-star-glade.png",
    "/node-level/cosmic-observatory/cosmic-observatory-02-nebula-grove.png",
    "/node-level/cosmic-observatory/cosmic-observatory-03-galaxy-pool.png",
    "/node-level/cosmic-observatory/cosmic-observatory-04-cosmic-ruins.png",
    "/node-level/cosmic-observatory/cosmic-observatory-05-astral-observatory.png",
  ],
  autumn: [
    "/node-level/cozy-campsite/cozy-campsite-01-camp-entrance.png",
    "/node-level/cozy-campsite/cozy-campsite-02-pine-camp.png",
    "/node-level/cozy-campsite/cozy-campsite-03-campfire-circle.png",
    "/node-level/cozy-campsite/cozy-campsite-04-bear-ridge.png",
    "/node-level/cozy-campsite/cozy-campsite-05-rangers-lookout.png",
  ],
  mushroom: [
    "/node-level/fairy-mushroom-village/fairy-mushroom-village-01-mushroom-trail.png",
    "/node-level/fairy-mushroom-village/fairy-mushroom-village-02-fairy-hollow.png",
    "/node-level/fairy-mushroom-village/fairy-mushroom-village-03-glow-grove.png",
    "/node-level/fairy-mushroom-village/fairy-mushroom-village-04-crystal-thicket.png",
    "/node-level/fairy-mushroom-village/fairy-mushroom-village-05-fairy-queens-tree.png",
  ],
  sunflower: [
    "/node-level/sunflower-meadow/sunflower-meadow-01-daisy-path.png",
    "/node-level/sunflower-meadow/sunflower-meadow-02-sunflower-field.png",
    "/node-level/sunflower-meadow/sunflower-meadow-03-windmill-hill.png",
    "/node-level/sunflower-meadow/sunflower-meadow-04-golden-harvest.png",
    "/node-level/sunflower-meadow/sunflower-meadow-05-harvest-haven.png",
  ],
  "volcanic-forge": [
    "/node-level/volcanic-forge/volcanic-forge-01-ember-trail.png",
    "/node-level/volcanic-forge/volcanic-forge-02-lava-cavern.png",
    "/node-level/volcanic-forge/volcanic-forge-03-molten-crossing.png",
    "/node-level/volcanic-forge/volcanic-forge-04-magma-summit.png",
    "/node-level/volcanic-forge/volcanic-forge-05-inferno-forge.png",
  ],
  "desert-oasis": [
    "/node-level/desert-oasis/desert-oasis-01-sandy-trail.png",
    "/node-level/desert-oasis/desert-oasis-02-cactus-camp.png",
    "/node-level/desert-oasis/desert-oasis-03-oasis-spring.png",
    "/node-level/desert-oasis/desert-oasis-04-sunstone-dunes.png",
    "/node-level/desert-oasis/desert-oasis-05-golden-pyramid.png",
  ],
  "steam-punk-workshop": [
    "/node-level/steam-punk-workshop/steam-punk-workshop-01-gear-yard.png",
    "/node-level/steam-punk-workshop/steam-punk-workshop-02-boiler-room.png",
    "/node-level/steam-punk-workshop/steam-punk-workshop-03-copper-works.png",
    "/node-level/steam-punk-workshop/steam-punk-workshop-04-steam-forge.png",
    "/node-level/steam-punk-workshop/steam-punk-workshop-05-clockwork-core.png",
  ],
  "frostveil-kingdom": [
    "/node-level/frostveil-kingdom/frostveil-kingdom-01-frost-path.png",
    "/node-level/frostveil-kingdom/frostveil-kingdom-02-crystal-grove.png",
    "/node-level/frostveil-kingdom/frostveil-kingdom-03-frozen-falls.png",
    "/node-level/frostveil-kingdom/frostveil-kingdom-04-ice-citadel.png",
    "/node-level/frostveil-kingdom/frostveil-kingdom-05-frostveil-palace.png",
  ],
};

export const DIFFICULTY_TIME_LIMITS: Record<Difficulty, number> = {
  Easy: 35,
  Normal: 40,
  Hard: 45,
  Boss: 55,
};

const DIFFICULTY_GOALS: Record<Difficulty, number> = {
  Easy: 20,
  Normal: 30,
  Hard: 40,
  Boss: 50,
};

const WORLD_WORDS: Partial<Record<WorldId, string[]>> = {
  cafe: ["latte", "mocha", "cocoa", "cream", "sugar", "beans", "mug", "warm", "brew", "sip", "roast", "coffee", "manor", "garden", "corner", "velvet", "caramel", "vanilla", "aroma", "steam"],
  forest: ["fern", "moss", "oak", "pine", "leaf", "root", "bark", "seed", "vine", "sap", "grove", "fox", "woods", "elder", "tree", "willow", "cedar", "brook", "branch", "hollow"],
  ocean: ["wave", "salt", "sand", "reef", "fish", "kelp", "tide", "foam", "crab", "shell", "coral", "pearl", "grotto", "abyss", "palace", "current", "lagoon", "oyster", "anchor", "harbor"],
  sakura: ["bloom", "petal", "pink", "park", "wind", "pond", "koi", "lotus", "tea", "garden", "shrine", "hill", "sakura", "sanctuary", "lantern", "mochi", "ribbon", "spring", "temple", "blossom"],
  castle: ["gate", "royal", "court", "knight", "hall", "king", "keep", "crown", "citadel", "sword", "shield", "armor", "banner", "castle", "dragon", "wizard", "scroll", "gold", "gem", "throne"],
  space: ["star", "glade", "nebula", "grove", "galaxy", "pool", "cosmic", "ruins", "astral", "observatory", "comet", "planet", "orbit", "quasar", "cosmos", "gravity", "stellar", "photon", "void", "moon"],
  autumn: ["camp", "pine", "fire", "circle", "bear", "ridge", "ranger", "lookout", "trail", "ember", "tent", "lantern", "bridge", "watchtower", "cliff", "lodge", "summit", "forest", "signal", "campfire"],
  mushroom: ["mushroom", "fairy", "hollow", "glow", "grove", "crystal", "thicket", "queen", "tree", "spore", "cap", "root", "fern", "twinkle", "sprite", "moss", "dew", "petal", "magic", "village"],
  "volcanic-forge": ["ember", "lava", "magma", "ash", "cinder", "forge", "crater", "volcano", "smoke", "vent", "boulder", "crystal", "basalt", "stone", "bridge", "river", "pool", "peak", "core", "erupt"],
  sunflower: ["daisy", "path", "sunflower", "field", "windmill", "hill", "golden", "harvest", "haven", "meadow", "bee", "seed", "petal", "wheat", "farm", "breeze", "barn", "honey", "bright", "summer"],
  "desert-oasis": ["sand", "cactus", "oasis", "palm", "dune", "ruin", "pyramid", "sphinx", "sun", "heat", "stone", "temple", "gold", "pharaoh", "scroll", "caravan", "storm", "mirage", "silk", "camel"],
  "steam-punk-workshop": ["gear", "steam", "copper", "pipe", "valve", "boiler", "forge", "anvil", "brass", "piston", "cog", "wheel", "clock", "spring", "metal", "iron", "furnace", "chain", "belt", "bolt"],
  "frostveil-kingdom": ["frost", "ice", "crystal", "snow", "glacier", "palace", "frozen", "winter", "cold", "gem", "shard", "sleet", "snowflake", "blizzard", "north", "frost", "spire", "glow", "chill", "magic"]
};

export const STAGE_DEFS: Partial<Record<WorldId, Array<{ name: string; emoji: string; difficulty: Difficulty }>>> = {
  cafe: [
    { name: "Cafe Corner", emoji: "☕", difficulty: "Easy" },
    { name: "Roast Ridge", emoji: "🫘", difficulty: "Easy" },
    { name: "Latte Lake", emoji: "🥛", difficulty: "Normal" },
    { name: "Bean Garden", emoji: "🌱", difficulty: "Hard" },
    { name: "Mocha Manor", emoji: "👑", difficulty: "Boss" },
  ],
  forest: [
    { name: "Mossy Trail", emoji: "🌿", difficulty: "Easy" },
    { name: "Fern Grove", emoji: "🌲", difficulty: "Easy" },
    { name: "Fox Hollow", emoji: "🦊", difficulty: "Normal" },
    { name: "Whisper Woods", emoji: "🍃", difficulty: "Hard" },
    { name: "Elder Tree", emoji: "🌳", difficulty: "Boss" },
  ],
  ocean: [
    { name: "Tide Pool", emoji: "🐚", difficulty: "Easy" },
    { name: "Coral Reef", emoji: "🪸", difficulty: "Easy" },
    { name: "Pearl Grotto", emoji: "🦪", difficulty: "Normal" },
    { name: "Deep Abyss", emoji: "🐙", difficulty: "Hard" },
    { name: "Sea Palace", emoji: "🐳", difficulty: "Boss" },
  ],
  sakura: [
    { name: "Blossom Path", emoji: "🌸", difficulty: "Easy" },
    { name: "Lotus Pond", emoji: "🪷", difficulty: "Easy" },
    { name: "Tea Garden", emoji: "🍵", difficulty: "Normal" },
    { name: "Shrine Hill", emoji: "⛩️", difficulty: "Hard" },
    { name: "Sakura Sanctuary", emoji: "👘", difficulty: "Boss" },
  ],
  castle: [
    { name: "Castle Gate", emoji: "🏰", difficulty: "Easy" },
    { name: "Royal Courtyard", emoji: "👑", difficulty: "Easy" },
    { name: "Knight's Hall", emoji: "⚔️", difficulty: "Normal" },
    { name: "King's Keep", emoji: "🛡️", difficulty: "Hard" },
    { name: "Crown Citadel", emoji: "🐉", difficulty: "Boss" },
  ],
  space: [
    { name: "Star Glade", emoji: "⭐", difficulty: "Easy" },
    { name: "Nebula Grove", emoji: "🌌", difficulty: "Easy" },
    { name: "Galaxy Pool", emoji: "🪐", difficulty: "Normal" },
    { name: "Cosmic Ruins", emoji: "☄️", difficulty: "Hard" },
    { name: "Astral Observatory", emoji: "👾", difficulty: "Boss" },
  ],
  mushroom: [
    { name: "Mushroom Trail", emoji: "🍄", difficulty: "Easy" },
    { name: "Fairy Hollow", emoji: "🧚", difficulty: "Easy" },
    { name: "Glow Grove", emoji: "✨", difficulty: "Normal" },
    { name: "Crystal Thicket", emoji: "💎", difficulty: "Hard" },
    { name: "Fairy Queen's Tree", emoji: "👑", difficulty: "Boss" },
  ],
  sunflower: [
    { name: "Daisy Path", emoji: "🌼", difficulty: "Easy" },
    { name: "Sunflower Field", emoji: "🌻", difficulty: "Easy" },
    { name: "Windmill Hill", emoji: "🌬️", difficulty: "Normal" },
    { name: "Golden Harvest", emoji: "🌾", difficulty: "Hard" },
    { name: "Harvest Haven", emoji: "🏡", difficulty: "Boss" },
  ],
  "volcanic-forge": [
    { name: "Ember Trail", emoji: "🔥", difficulty: "Easy" },
    { name: "Lava Cavern", emoji: "🌋", difficulty: "Easy" },
    { name: "Molten Crossing", emoji: "⚡", difficulty: "Normal" },
    { name: "Magma Summit", emoji: "⛰️", difficulty: "Hard" },
    { name: "Inferno Forge", emoji: "⚒️", difficulty: "Boss" },
  ],
  "desert-oasis": [
    { name: "Sandy Trail", emoji: "🏜️", difficulty: "Easy" },
    { name: "Cactus Camp", emoji: "🌵", difficulty: "Easy" },
    { name: "Oasis Spring", emoji: "🌴", difficulty: "Normal" },
    { name: "Sunstone Dunes", emoji: "☀️", difficulty: "Hard" },
    { name: "Golden Pyramid", emoji: "🔺", difficulty: "Boss" },
  ],
  autumn: [
    { name: "Camp Entrance", emoji: "🏕️", difficulty: "Easy" },
    { name: "Pine Camp", emoji: "🌲", difficulty: "Easy" },
    { name: "Campfire Circle", emoji: "🔥", difficulty: "Normal" },
    { name: "Bear Ridge", emoji: "🐻", difficulty: "Hard" },
    { name: "Ranger's Lookout", emoji: "🧭", difficulty: "Boss" },
  ],
  "steam-punk-workshop": [
    { name: "Gear Yard", emoji: "⚙️", difficulty: "Easy" },
    { name: "Boiler Room", emoji: "🏭", difficulty: "Easy" },
    { name: "Copper Works", emoji: "🔧", difficulty: "Normal" },
    { name: "Steam Forge", emoji: "⛓️", difficulty: "Hard" },
    { name: "Clockwork Core", emoji: "🕰️", difficulty: "Boss" },
  ],
  "frostveil-kingdom": [
    { name: "Frost Path", emoji: "❄️", difficulty: "Easy" },
    { name: "Crystal Grove", emoji: "💎", difficulty: "Easy" },
    { name: "Frozen Falls", emoji: "🏔️", difficulty: "Normal" },
    { name: "Ice Citadel", emoji: "🏰", difficulty: "Hard" },
    { name: "Frostveil Palace", emoji: "👑", difficulty: "Boss" },
  ],
};

const BOSS_PHASE_EMOJIS: Record<string, [string, string, string]> = {
  "👑": ["👑", "⚔️", "✨"],
  "🌳": ["🌳", "🍃", "🌕"],
  "🏔️": ["🏔️", "❄️", "💫"],
  "🐳": ["🐳", "🌊", "💫"],
  "👘": ["👘", "🎀", "🌸"],
  "🐉": ["🐉", "🔥", "⚡"],
  "👾": ["👾", "💥", "☄️"],
  "🏡": ["🏡", "🌾", "🌻"],
  "🔮": ["🔮", "📖", "✨"],
  "🧭": ["🧭", "🔥", "🌲"],
  "🏯": ["🏯", "🌙", "✨"],
};

function wordsFor(world: WorldId, stageId: number) {
  const words = WORLD_WORDS[world] ?? WORLD_WORDS.cafe ?? [];
  return Array.from({ length: 10 }, (_, index) => words[(stageId * 3 + index) % words.length]);
}

export { wordsFor };

export const STAGES_BY_WORLD: Partial<Record<WorldId, Stage[]>> = Object.fromEntries(
  Object.entries(STAGE_DEFS).map(([world, stages]) => [
    world,
    stages.map((stage, index) => ({
      id: index + 1,
      ...stage,
      goal: DIFFICULTY_GOALS[stage.difficulty] + (index === 1 ? 5 : 0),
      words: wordsFor(world as WorldId, index + 1),
    })),
  ]),
) as Partial<Record<WorldId, Stage[]>>;

export function bossEmojis(emoji: string): [string, string, string] {
  return BOSS_PHASE_EMOJIS[emoji] ?? [emoji, "💢", "💫"];
}

export function rewardsFor(stage: Stage): { xp: number; coins: number } {
  if (stage.difficulty === "Boss") return { xp: stage.goal * 6, coins: stage.goal * 2 };
  return { xp: stage.goal * 3, coins: stage.goal };
}

export function expandWords(words: string[], targetCount: number) {
  if (words.length === 0) return [];
  return Array.from({ length: targetCount }, (_, index) => words[index % words.length]);
}

export async function measureVisibleImageBounds(src: string): Promise<VisibleImageBounds> {
  const cached = NODE_IMAGE_BOUNDS_CACHE.get(src);
  if (cached) return cached;

  const image = new Image();
  image.decoding = "async";
  image.src = src;

  if (typeof image.decode === "function") {
    await image.decode().catch(() => undefined);
  } else {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    });
  }

  const naturalWidth = image.naturalWidth || image.width;
  const naturalHeight = image.naturalHeight || image.height;
  const canvas = document.createElement("canvas");
  canvas.width = naturalWidth;
  canvas.height = naturalHeight;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    const fallback = {
      top: 0,
      left: 0,
      right: naturalWidth - 1,
      bottom: naturalHeight - 1,
      width: naturalWidth,
      height: naturalHeight,
      naturalWidth,
      naturalHeight,
    };
    NODE_IMAGE_BOUNDS_CACHE.set(src, fallback);
    return fallback;
  }

  context.clearRect(0, 0, naturalWidth, naturalHeight);
  context.drawImage(image, 0, 0);
  const { data } = context.getImageData(0, 0, naturalWidth, naturalHeight);

  let top = naturalHeight;
  let left = naturalWidth;
  let right = -1;
  let bottom = -1;

  for (let y = 0; y < naturalHeight; y += 1) {
    for (let x = 0; x < naturalWidth; x += 1) {
      const alpha = data[(y * naturalWidth + x) * 4 + 3];
      if (alpha <= 8) continue;
      if (x < left) left = x;
      if (x > right) right = x;
      if (y < top) top = y;
      if (y > bottom) bottom = y;
    }
  }

  const bounds =
    right === -1 || bottom === -1
      ? {
          top: 0,
          left: 0,
          right: naturalWidth - 1,
          bottom: naturalHeight - 1,
          width: naturalWidth,
          height: naturalHeight,
          naturalWidth,
          naturalHeight,
        }
      : {
          top,
          left,
          right,
          bottom,
          width: right - left + 1,
          height: bottom - top + 1,
          naturalWidth,
          naturalHeight,
        };

  NODE_IMAGE_BOUNDS_CACHE.set(src, bounds);
  return bounds;
}
