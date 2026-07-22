import type { WorldId } from "@/components/shared/WorldTheme";

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

export const LOCK_ICON = "/shared/icons/lock.webp";
export const NODE_IMAGE_BOUNDS_CACHE = new Map<string, VisibleImageBounds>();

export const NODE_IMAGES: Partial<Record<WorldId, string[]>> = {
  cafe: [
    "/worlds/cozy-cafe/cozy-cafe-01-cafe-corner.webp",
    "/worlds/cozy-cafe/cozy-cafe-02-roast-ridge.webp",
    "/worlds/cozy-cafe/cozy-cafe-03-latte-lake.webp",
    "/worlds/cozy-cafe/cozy-cafe-04-bean-garden.webp",
    "/worlds/cozy-cafe/cozy-cafe-05-mocha-manor.webp",
  ],
  forest: [
    "/worlds/mossy-forest/mossy-forest-01-mossy-trail.webp",
    "/worlds/mossy-forest/mossy-forest-02-fern-grove.webp",
    "/worlds/mossy-forest/mossy-forest-03-fox-hollow.webp",
    "/worlds/mossy-forest/mossy-forest-04-whisper-woods.webp",
    "/worlds/mossy-forest/mossy-forest-05-elder-tree.webp",
  ],
  ocean: [
    "/worlds/underwater-kingdom/underwater-kingdom-01-tide-pool.webp",
    "/worlds/underwater-kingdom/underwater-kingdom-02-coral-reef.webp",
    "/worlds/underwater-kingdom/underwater-kingdom-03-pearl-grotto.webp",
    "/worlds/underwater-kingdom/underwater-kingdom-04-deep-abyss.webp",
    "/worlds/underwater-kingdom/underwater-kingdom-05-sea-palace.webp",
  ],
  sakura: [
    "/worlds/sakura-garden/sakura-garden-01-blossom-path.webp",
    "/worlds/sakura-garden/sakura-garden-02-lotus-pond.webp",
    "/worlds/sakura-garden/sakura-garden-03-tea-garden.webp",
    "/worlds/sakura-garden/sakura-garden-04-shrine-hill.webp",
    "/worlds/sakura-garden/sakura-garden-05-sakura-sanctuary.webp",
  ],
  castle: [
    "/worlds/medieval-castle/medieval-castle-01-castle-gate.webp",
    "/worlds/medieval-castle/medieval-castle-02-royal-courtyard.webp",
    "/worlds/medieval-castle/medieval-castle-03-knights-hall.webp",
    "/worlds/medieval-castle/medieval-castle-04-kings-keep.webp",
    "/worlds/medieval-castle/medieval-castle-05-crown-citadel.webp",
  ],
  space: [
    "/worlds/cosmic-observatory/cosmic-observatory-01-star-glade.webp",
    "/worlds/cosmic-observatory/cosmic-observatory-02-nebula-grove.webp",
    "/worlds/cosmic-observatory/cosmic-observatory-03-galaxy-pool.webp",
    "/worlds/cosmic-observatory/cosmic-observatory-04-cosmic-ruins.webp",
    "/worlds/cosmic-observatory/cosmic-observatory-05-astral-observatory.webp",
  ],
  autumn: [
    "/worlds/cozy-campsite/cozy-campsite-01-camp-entrance.webp",
    "/worlds/cozy-campsite/cozy-campsite-02-pine-camp.webp",
    "/worlds/cozy-campsite/cozy-campsite-03-campfire-circle.webp",
    "/worlds/cozy-campsite/cozy-campsite-04-bear-ridge.webp",
    "/shared/scenes/cozy-campsite-rangers-lookout.webp",
  ],
  mushroom: [
    "/worlds/fairy-mushroom-village/fairy-mushroom-village-01-mushroom-trail.webp",
    "/worlds/fairy-mushroom-village/fairy-mushroom-village-02-fairy-hollow.webp",
    "/worlds/fairy-mushroom-village/fairy-mushroom-village-03-glow-grove.webp",
    "/worlds/fairy-mushroom-village/fairy-mushroom-village-04-crystal-thicket.webp",
    "/worlds/fairy-mushroom-village/fairy-mushroom-village-05-fairy-queens-tree.webp",
  ],
  sunflower: [
    "/worlds/sunflower-meadow/sunflower-meadow-01-sunpetal-path.webp",
    "/worlds/sunflower-meadow/sunflower-meadow-02-golden-bloom-field.webp",
    "/worlds/sunflower-meadow/sunflower-meadow-03-sunwheel-windmill.webp",
    "/worlds/sunflower-meadow/sunflower-meadow-04-sunspire-fields.webp",
    "/worlds/sunflower-meadow/sunflower-meadow-05-sunheart-sanctuary.webp",
  ],
  "volcanic-forge": [
    "/worlds/volcanic-forge/volcanic-forge-01-ember-trail.webp",
    "/worlds/volcanic-forge/volcanic-forge-02-lava-cavern.webp",
    "/worlds/volcanic-forge/volcanic-forge-03-molten-crossing.webp",
    "/worlds/volcanic-forge/volcanic-forge-04-magma-summit.webp",
    "/worlds/volcanic-forge/volcanic-forge-05-inferno-forge.webp",
  ],
  "desert-oasis": [
    "/worlds/desert-oasis/desert-oasis-01-sandy-trail.webp",
    "/worlds/desert-oasis/desert-oasis-02-cactus-camp.webp",
    "/worlds/desert-oasis/desert-oasis-03-oasis-spring.webp",
    "/worlds/desert-oasis/desert-oasis-04-sunstone-dunes.webp",
    "/worlds/desert-oasis/desert-oasis-05-golden-pyramid.webp",
  ],
  "steam-punk-workshop": [
    "/worlds/steam-punk-workshop/steam-punk-workshop-01-gear-yard.webp",
    "/worlds/steam-punk-workshop/steam-punk-workshop-02-boiler-room.webp",
    "/worlds/steam-punk-workshop/steam-punk-workshop-03-copper-works.webp",
    "/worlds/steam-punk-workshop/steam-punk-workshop-04-steam-forge.webp",
    "/worlds/steam-punk-workshop/steam-punk-workshop-05-clockwork-core.webp",
  ],
  "frostveil-kingdom": [
    "/worlds/frostveil-kingdom/frostveil-kingdom-01-frost-path.webp",
    "/worlds/frostveil-kingdom/frostveil-kingdom-02-crystal-grove.webp",
    "/worlds/frostveil-kingdom/frostveil-kingdom-03-frozen-falls.webp",
    "/worlds/frostveil-kingdom/frostveil-kingdom-04-ice-citadel.webp",
    "/worlds/frostveil-kingdom/frostveil-kingdom-05-frostveil-palace.webp",
  ],
};

for (const paths of Object.values(NODE_IMAGES)) {
  paths?.forEach((path, index) => {
    paths[index] = path.replace("/worlds/", "/adventure/nodes/");
  });
}

const SCENE_BG_DIRS: Partial<Record<WorldId, string>> = {
  cafe: "cozy-cafe-background",
  forest: "mossy-forest-background",
  ocean: "tide-pool-background",
  sakura: "sakura-garden-background",
  castle: "medieval-castle-background",
  space: "stardust-background",
  mushroom: "fairy-mushroom-village-background",
  sunflower: "sunflower-meadow-background",
};

const SCENE_NAME_OVERRIDES: Record<string, string> = {
  "Mossy Trail": "moss-trail",
};

export function sceneImage(world: WorldId, stageName: string): string | undefined {
  const dir = SCENE_BG_DIRS[world];
  if (!dir) return undefined;
  const slug =
    SCENE_NAME_OVERRIDES[stageName] ??
    stageName
      .toLowerCase()
      .replace(/['']/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  return `/adventure/scenes/${dir}/${slug}.webp`;
}

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
  cafe: [
    "latte",
    "mocha",
    "cocoa",
    "cream",
    "sugar",
    "beans",
    "mug",
    "warm",
    "brew",
    "sip",
    "roast",
    "coffee",
    "manor",
    "garden",
    "corner",
    "velvet",
    "caramel",
    "vanilla",
    "aroma",
    "steam",
  ],
  forest: [
    "fern",
    "moss",
    "oak",
    "pine",
    "leaf",
    "root",
    "bark",
    "seed",
    "vine",
    "sap",
    "grove",
    "fox",
    "woods",
    "elder",
    "tree",
    "willow",
    "cedar",
    "brook",
    "branch",
    "hollow",
  ],
  ocean: [
    "wave",
    "salt",
    "sand",
    "reef",
    "fish",
    "kelp",
    "tide",
    "foam",
    "crab",
    "shell",
    "coral",
    "pearl",
    "grotto",
    "abyss",
    "palace",
    "current",
    "lagoon",
    "oyster",
    "anchor",
    "harbor",
  ],
  sakura: [
    "bloom",
    "petal",
    "pink",
    "park",
    "wind",
    "pond",
    "koi",
    "lotus",
    "tea",
    "garden",
    "shrine",
    "hill",
    "sakura",
    "sanctuary",
    "lantern",
    "mochi",
    "ribbon",
    "spring",
    "temple",
    "blossom",
  ],
  castle: [
    "gate",
    "royal",
    "court",
    "knight",
    "hall",
    "king",
    "keep",
    "crown",
    "citadel",
    "sword",
    "shield",
    "armor",
    "banner",
    "castle",
    "dragon",
    "wizard",
    "scroll",
    "gold",
    "gem",
    "throne",
  ],
  space: [
    "star",
    "glade",
    "nebula",
    "grove",
    "galaxy",
    "pool",
    "cosmic",
    "ruins",
    "astral",
    "observatory",
    "comet",
    "planet",
    "orbit",
    "quasar",
    "cosmos",
    "gravity",
    "stellar",
    "photon",
    "void",
    "moon",
  ],
  autumn: [
    "camp",
    "pine",
    "fire",
    "circle",
    "bear",
    "ridge",
    "ranger",
    "lookout",
    "trail",
    "ember",
    "tent",
    "lantern",
    "bridge",
    "watchtower",
    "cliff",
    "lodge",
    "summit",
    "forest",
    "signal",
    "campfire",
  ],
  mushroom: [
    "mushroom",
    "fairy",
    "hollow",
    "glow",
    "grove",
    "crystal",
    "thicket",
    "queen",
    "tree",
    "spore",
    "cap",
    "root",
    "fern",
    "twinkle",
    "sprite",
    "moss",
    "dew",
    "petal",
    "magic",
    "village",
  ],
  "volcanic-forge": [
    "ember",
    "lava",
    "magma",
    "ash",
    "cinder",
    "forge",
    "crater",
    "volcano",
    "smoke",
    "vent",
    "boulder",
    "crystal",
    "basalt",
    "stone",
    "bridge",
    "river",
    "pool",
    "peak",
    "core",
    "erupt",
  ],
  sunflower: [
    "daisy",
    "path",
    "sunflower",
    "field",
    "windmill",
    "hill",
    "golden",
    "harvest",
    "haven",
    "meadow",
    "bee",
    "seed",
    "petal",
    "wheat",
    "farm",
    "breeze",
    "barn",
    "honey",
    "bright",
    "summer",
  ],
  "desert-oasis": [
    "sand",
    "cactus",
    "oasis",
    "palm",
    "dune",
    "ruin",
    "pyramid",
    "sphinx",
    "sun",
    "heat",
    "stone",
    "temple",
    "gold",
    "pharaoh",
    "scroll",
    "caravan",
    "storm",
    "mirage",
    "silk",
    "camel",
  ],
  "steam-punk-workshop": [
    "gear",
    "steam",
    "copper",
    "pipe",
    "valve",
    "boiler",
    "forge",
    "anvil",
    "brass",
    "piston",
    "cog",
    "wheel",
    "clock",
    "spring",
    "metal",
    "iron",
    "furnace",
    "chain",
    "belt",
    "bolt",
  ],
  "frostveil-kingdom": [
    "frost",
    "ice",
    "crystal",
    "snow",
    "glacier",
    "palace",
    "frozen",
    "winter",
    "cold",
    "gem",
    "shard",
    "sleet",
    "snowflake",
    "blizzard",
    "north",
    "frost",
    "spire",
    "glow",
    "chill",
    "magic",
  ],
};

export const STAGE_DEFS: Partial<
  Record<WorldId, Array<{ name: string; emoji: string; difficulty: Difficulty }>>
> = {
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
    { name: "Sunpetal Path", emoji: "🌼", difficulty: "Easy" },
    { name: "Golden Bloom Field", emoji: "🌻", difficulty: "Easy" },
    { name: "Sunwheel Windmill", emoji: "🌬️", difficulty: "Normal" },
    { name: "Sunspire Fields", emoji: "🌾", difficulty: "Hard" },
    { name: "Sunheart Sanctuary", emoji: "🏡", difficulty: "Boss" },
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
