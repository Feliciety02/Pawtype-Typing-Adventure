import { type ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useWorld, WORLDS, type WorldId } from "./WorldTheme";
import { useGame } from "../lib/game/store";
import { generateAdventureWords, generateQuestText } from "../lib/game/textGenerator";
import { precomputeGoals, getCachedGoals } from "../lib/game/ai/difficulty";

type Difficulty = "Easy" | "Normal" | "Hard" | "Boss";

type Stage = {
  id: number;
  name: string;
  emoji: string;
  difficulty: Difficulty;
  goal: number;
  words: string[];
};

type Status = "locked" | "available" | "complete";

type VisibleImageBounds = {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
  naturalWidth: number;
  naturalHeight: number;
};

const LOCK_ICON = "/Icons/lock.png";
const NODE_IMAGE_BOUNDS_CACHE = new Map<string, VisibleImageBounds>();

const NODE_IMAGES: Partial<Partial<Record<WorldId, string[]>>> = {
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

const DIFFICULTY_GOALS: Record<Difficulty, number> = {
  Easy: 20,
  Normal: 30,
  Hard: 40,
  Boss: 50,
};

const DIFFICULTY_TIME_LIMITS: Record<Difficulty, number> = {
  Easy: 35,
  Normal: 40,
  Hard: 45,
  Boss: 55,
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

const STAGE_DEFS: Partial<Record<WorldId, Array<{ name: string; emoji: string; difficulty: Difficulty }>>> = {
  cafe: [
    { name: "Cafe Corner", emoji: "â˜•", difficulty: "Easy" },
    { name: "Roast Ridge", emoji: "ðŸ«˜", difficulty: "Easy" },
    { name: "Latte Lake", emoji: "ðŸ¥›", difficulty: "Normal" },
    { name: "Bean Garden", emoji: "ðŸŒ±", difficulty: "Hard" },
    { name: "Mocha Manor", emoji: "ðŸ‘‘", difficulty: "Boss" },
  ],
  forest: [
    { name: "Mossy Trail", emoji: "ðŸŒ¿", difficulty: "Easy" },
    { name: "Fern Grove", emoji: "ðŸŒ²", difficulty: "Easy" },
    { name: "Fox Hollow", emoji: "ðŸ¦Š", difficulty: "Normal" },
    { name: "Whisper Woods", emoji: "ðŸƒ", difficulty: "Hard" },
    { name: "Elder Tree", emoji: "🌳", difficulty: "Boss" },
  ],
  ocean: [
    { name: "Tide Pool", emoji: "ðŸš", difficulty: "Easy" },
    { name: "Coral Reef", emoji: "ðŸª¸", difficulty: "Easy" },
    { name: "Pearl Grotto", emoji: "ðŸ¦ª", difficulty: "Normal" },
    { name: "Deep Abyss", emoji: "ðŸ™", difficulty: "Hard" },
    { name: "Sea Palace", emoji: "ðŸ³", difficulty: "Boss" },
  ],
  sakura: [
    { name: "Blossom Path", emoji: "ðŸŒ¸", difficulty: "Easy" },
    { name: "Lotus Pond", emoji: "ðŸª·", difficulty: "Easy" },
    { name: "Tea Garden", emoji: "ðŸµ", difficulty: "Normal" },
    { name: "Shrine Hill", emoji: "â›©ï¸", difficulty: "Hard" },
    { name: "Sakura Sanctuary", emoji: "ðŸ‘˜", difficulty: "Boss" },
  ],
  castle: [
    { name: "Castle Gate", emoji: "ðŸ°", difficulty: "Easy" },
    { name: "Royal Courtyard", emoji: "ðŸ‘‘", difficulty: "Easy" },
    { name: "Knight's Hall", emoji: "âš”ï¸", difficulty: "Normal" },
    { name: "King's Keep", emoji: "ðŸ›¡ï¸", difficulty: "Hard" },
    { name: "Crown Citadel", emoji: "ðŸ‰", difficulty: "Boss" },
  ],
  space: [
    { name: "Star Glade", emoji: "â­", difficulty: "Easy" },
    { name: "Nebula Grove", emoji: "ðŸŒŒ", difficulty: "Easy" },
    { name: "Galaxy Pool", emoji: "ðŸª", difficulty: "Normal" },
    { name: "Cosmic Ruins", emoji: "â˜„ï¸", difficulty: "Hard" },
    { name: "Astral Observatory", emoji: "ðŸ‘¾", difficulty: "Boss" },
  ],
  mushroom: [
    { name: "Mushroom Trail", emoji: "ðŸ„", difficulty: "Easy" },
    { name: "Fairy Hollow", emoji: "ðŸ§š", difficulty: "Easy" },
    { name: "Glow Grove", emoji: "âœ¨", difficulty: "Normal" },
    { name: "Crystal Thicket", emoji: "ðŸ’Ž", difficulty: "Hard" },
    { name: "Fairy Queen's Tree", emoji: "ðŸ‘‘", difficulty: "Boss" },
  ],
  sunflower: [
    { name: "Daisy Path", emoji: "ðŸŒ¼", difficulty: "Easy" },
    { name: "Sunflower Field", emoji: "ðŸŒ»", difficulty: "Easy" },
    { name: "Windmill Hill", emoji: "ðŸŒ¬ï¸", difficulty: "Normal" },
    { name: "Golden Harvest", emoji: "ðŸŒ¾", difficulty: "Hard" },
    { name: "Harvest Haven", emoji: "ðŸ¡", difficulty: "Boss" },
  ],
  "volcanic-forge": [
    { name: "Ember Trail", emoji: "🔥", difficulty: "Easy" },
    { name: "Lava Cavern", emoji: "🕳️", difficulty: "Easy" },
    { name: "Molten Crossing", emoji: "🌊", difficulty: "Normal" },
    { name: "Magma Summit", emoji: "⛰️", difficulty: "Hard" },
    { name: "Inferno Forge", emoji: "⚒️", difficulty: "Boss" },
  ],
  "desert-oasis": [
    { name: "Sandy Trail", emoji: "🐪", difficulty: "Easy" },
    { name: "Cactus Camp", emoji: "⛺", difficulty: "Easy" },
    { name: "Oasis Spring", emoji: "🌴", difficulty: "Normal" },
    { name: "Sunstone Dunes", emoji: "🏜️", difficulty: "Hard" },
    { name: "Golden Pyramid", emoji: "🔺", difficulty: "Boss" },
  ],
  autumn: [
    { name: "Camp Entrance", emoji: "ðŸ•ï¸", difficulty: "Easy" },
    { name: "Pine Camp", emoji: "ðŸŒ²", difficulty: "Easy" },
    { name: "Campfire Circle", emoji: "ðŸ”¥", difficulty: "Normal" },
    { name: "Bear Ridge", emoji: "ðŸ»", difficulty: "Hard" },
    { name: "Ranger's Lookout", emoji: "ðŸ§­", difficulty: "Boss" },
  ],

  "steam-punk-workshop": [
    { name: "Gear Yard", emoji: "⚙️", difficulty: "Easy" },
    { name: "Boiler Room", emoji: "🛡️", difficulty: "Easy" },
    { name: "Copper Works", emoji: "⚙️", difficulty: "Normal" },
    { name: "Steam Forge", emoji: "🔥", difficulty: "Hard" },
    { name: "Clockwork Core", emoji: "⏰", difficulty: "Boss" },
  ],
  "frostveil-kingdom": [
    { name: "Frost Path", emoji: "❄️", difficulty: "Easy" },
    { name: "Crystal Grove", emoji: "💎", difficulty: "Easy" },
    { name: "Frozen Falls", emoji: "💧", difficulty: "Normal" },
    { name: "Ice Citadel", emoji: "🏰", difficulty: "Hard" },
    { name: "Frostveil Palace", emoji: "👑", difficulty: "Boss" },
  ],
};

const STAGES_BY_WORLD: Partial<Record<WorldId, Stage[]>> = Object.fromEntries(
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

const BOSS_PHASE_EMOJIS: Record<string, [string, string, string]> = {
  "ðŸ‘‘": ["ðŸ‘‘", "âš”ï¸", "âœ¨"],
  "ðŸŒ³": ["ðŸŒ³", "ðŸƒ", "ðŸŒ•"],
  "ðŸ”ï¸": ["ðŸ”ï¸", "â„ï¸", "ðŸ’«"],
  "ðŸ³": ["ðŸ³", "ðŸŒŠ", "ðŸ’«"],
  "ðŸ‘˜": ["ðŸ‘˜", "ðŸŽ€", "ðŸŒ¸"],
  "ðŸ‰": ["ðŸ‰", "ðŸ”¥", "âš¡"],
  "ðŸ‘¾": ["ðŸ‘¾", "ðŸ’¥", "â˜„ï¸"],
  "ðŸ¡": ["ðŸ¡", "ðŸŒ¾", "ðŸŒ»"],
  "ðŸ”®": ["ðŸ”®", "ðŸ“–", "âœ¨"],
  "ðŸ§­": ["ðŸ§­", "ðŸ”¥", "ðŸŒ²"],
  "ðŸ¯": ["ðŸ¯", "ðŸŒ™", "âœ¨"],
};

function wordsFor(world: WorldId, stageId: number) {
  const words = WORLD_WORDS[world] ?? WORLD_WORDS.cafe ?? [];
  return Array.from({ length: 10 }, (_, index) => words[(stageId * 3 + index) % words.length]);
}

function bossEmojis(emoji: string): [string, string, string] {
  return BOSS_PHASE_EMOJIS[emoji] ?? [emoji, "ðŸ’¢", "ðŸ’«"];
}

function rewardsFor(stage: Stage): { xp: number; coins: number } {
  if (stage.difficulty === "Boss") return { xp: stage.goal * 6, coins: stage.goal * 2 };
  return { xp: stage.goal * 3, coins: stage.goal };
}

function expandWords(words: string[], targetCount: number) {
  if (words.length === 0) return [];
  return Array.from({ length: targetCount }, (_, index) => words[index % words.length]);
}

async function measureVisibleImageBounds(src: string): Promise<VisibleImageBounds> {
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

function AdventureNodeImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [bounds, setBounds] = useState<VisibleImageBounds | null>(NODE_IMAGE_BOUNDS_CACHE.get(src) ?? null);
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    let cancelled = false;

    measureVisibleImageBounds(src)
      .then((nextBounds) => {
        if (!cancelled) setBounds(nextBounds);
      })
      .catch(() => {
        if (!cancelled) setBounds(null);
      });

    return () => {
      cancelled = true;
    };
  }, [src]);

  useEffect(() => {
    const image = imageRef.current;
    const frame = image?.parentElement;
    if (!frame || typeof ResizeObserver === "undefined") return;

    const updateSize = () =>
      setFrameSize({
        width: frame.clientWidth,
        height: frame.clientHeight,
      });

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  const measuredStyle = useMemo(() => {
    if (!bounds || frameSize.width === 0 || frameSize.height === 0) return undefined;

    const scale = Math.min(frameSize.width / bounds.naturalWidth, frameSize.height / bounds.naturalHeight);
    const width = bounds.naturalWidth * scale;
    const height = bounds.naturalHeight * scale;
    const left = (frameSize.width - width) / 2;
    const top = -bounds.top * scale;

    return {
      width: `${width}px`,
      height: `${height}px`,
      left: `${left}px`,
      top: `${top}px`,
    } as Record<string, string>;
  }, [bounds, frameSize.height, frameSize.width]);

  return (
    <img
      ref={imageRef}
      src={src}
      alt={alt}
      className={`${className} ${measuredStyle ? "adventure-node-img-measured" : ""}`}
      style={measuredStyle}
      draggable={false}
      loading="lazy"
      decoding="async"
    />
  );
}

export function AdventureMap() {
  const { world } = useWorld();
  const { state, dispatch } = useGame();
  const [adaptiveGoals, setAdaptiveGoals] = useState<Record<Difficulty, number> | null>(null);

  useEffect(() => {
    precomputeGoals().then(setAdaptiveGoals).catch(() => {});
  }, []);

  const goals = adaptiveGoals ?? getCachedGoals();
  const stagesForWorld = useCallback((worldId: WorldId): Stage[] =>
    (STAGE_DEFS[worldId] ?? STAGE_DEFS.cafe ?? []).map((stage, index) => ({
      id: index + 1,
      ...stage,
      goal: goals[stage.difficulty] + (index === 1 ? 5 : 0),
      words: wordsFor(worldId, index + 1),
    })),
  [goals]);

  const orderedWorlds = [
    ...WORLDS.filter((item) => item.id === world),
    ...WORLDS.filter((item) => item.id !== world),
  ];
  const allStages = useMemo(() => orderedWorlds.flatMap((item) => stagesForWorld(item.id)), [orderedWorlds, stagesForWorld]);
  const totalCleared = orderedWorlds.reduce((sum, item) => sum + (state.adventures[item.id]?.length ?? 0), 0);
  const [active, setActive] = useState<{ stage: Stage; world: WorldId } | null>(null);

  const statusOf = (worldId: WorldId, stage: Stage, index: number): Status => {
    const stages = stagesForWorld(worldId);
    const completed = state.adventures[worldId] ?? [];
    if (completed.includes(stage.id)) return "complete";
    if (index === 0) return "available";
    return completed.includes(stages[index - 1].id) ? "available" : "locked";
  };

  const clearedPercent = Math.round((totalCleared / allStages.length) * 100);
  const nextWorld = orderedWorlds.find((item) =>
    stagesForWorld(item.id).some((stage, index) => statusOf(item.id, stage, index) === "available"),
  );
  const nextStage = nextWorld
    ? stagesForWorld(nextWorld.id).find((stage, index) => statusOf(nextWorld.id, stage, index) === "available")
    : undefined;

  return (
    <div className="adventure-shell pixel-card p-5 sm:p-6 relative overflow-hidden">
      <div className="adventure-header">
        <div className="adventure-title-block">
          <div className="adventure-kicker">World Quest</div>
          <h2 className="text-4xl leading-none">Adventure Map</h2>
          <p className="font-pixel text-[0.65rem] text-muted-foreground mt-2">
            Clear each cozy typing stage to unlock the next path.
          </p>
        </div>

        <div className="adventure-progress-card">
          <div className="flex items-center justify-between gap-3">
            <span className="font-pixel text-[0.55rem] uppercase text-muted-foreground">All Worlds</span>
            <strong className="font-display text-2xl leading-none">{totalCleared}/{allStages.length}</strong>
          </div>
          <div className="pixel-bar adventure-progress-bar">
            <div style={{ width: `${clearedPercent}%` }} />
          </div>
          <div className="adventure-next-line">
            <span>{nextStage ? "Next stage" : "All clear"}</span>
            <strong>{nextStage ? `${nextWorld?.name}: ${nextStage.name}` : "All worlds complete"}</strong>
          </div>
        </div>
      </div>

      <div className="adventure-world-list">
        {orderedWorlds.map((theme) => {
          const stages = stagesForWorld(theme.id);
          const completed = state.adventures[theme.id] ?? [];
          const worldClearedPercent = Math.round((completed.length / stages.length) * 100);

          return (
            <section
              className="adventure-world-section"
              key={theme.id}
              style={{ "--stage-accent": theme.swatches[1] } as Record<string, string>}
            >
              <div className="adventure-world-header">
                <div>
                  <h3>{theme.name} Quest</h3>
                  <p>{theme.blurb}</p>
                </div>
                <div className="adventure-world-progress">
                  <strong>{completed.length}/{stages.length}</strong>
                  <span>cleared</span>
                  <div className="pixel-bar adventure-progress-bar">
                    <div style={{ width: `${worldClearedPercent}%` }} />
                  </div>
                </div>
              </div>

              <div className="adventure-map-board">
                <div className="adventure-map-glow" aria-hidden="true" />
                <div className="adventure-node-grid">
                  {stages.map((stage, index) => {
                    const status = statusOf(theme.id, stage, index);
                    const image = NODE_IMAGES[theme.id]?.[index];
                    return (
                      <StageNode
                        key={`${theme.id}-${stage.id}`}
                        stage={stage}
                        index={index}
                        status={status}
                        image={image}
                        onPlay={() => status !== "locked" && setActive({ stage, world: theme.id })}
                      />
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {active && (
        <StageRunner
          stage={active.stage}
          world={active.world}
          alreadyCompleted={(state.adventures[active.world] ?? []).includes(active.stage.id)}
          onClose={() => setActive(null)}
          onWin={() => {
            const alreadyCompleted = (state.adventures[active.world] ?? []).includes(active.stage.id);
            if (!alreadyCompleted) {
              const { xp, coins } = rewardsFor(active.stage);
              dispatch({ type: "ADD_XP", amount: xp });
              dispatch({ type: "EARN_COINS", amount: coins });
              dispatch({ type: "ADD_PET_XP", amount: coins });
            }
            dispatch({ type: "COMPLETE_STAGE", world: active.world, stageId: active.stage.id });
          }}
        />
      )}
    </div>
  );
}

function StageNode({
  stage,
  index,
  status,
  image,
  onPlay,
}: {
  stage: Stage;
  index: number;
  status: Status;
  image?: string;
  onPlay: () => void;
}) {
  const accent =
    stage.difficulty === "Boss"
      ? "var(--color-primary)"
      : stage.difficulty === "Hard"
        ? "var(--coin)"
        : stage.difficulty === "Normal"
          ? "var(--leaf)"
          : "var(--sky)";
  const { xp, coins } = rewardsFor(stage);
  const actionLabel =
    status === "complete"
      ? "Completed"
      : status === "locked"
        ? `Complete Stage ${index}`
        : "Start Quest";

  return (
    <button
      onClick={onPlay}
      disabled={status === "locked"}
      className={`adventure-node pixel-card-sm adventure-node-${status} adventure-node-${stage.difficulty.toLowerCase()} ${index % 2 === 0 ? "adventure-node-low" : "adventure-node-high"}`}
      style={{ "--stage-accent": accent } as Record<string, string>}
      type="button"
    >
      <div className="adventure-stage-ribbon">Stage {index + 1}</div>
      <div className="adventure-node-visual" data-has-image={Boolean(image)}>
        {image ? (
          <AdventureNodeImage src={image} alt={`${stage.name} node`} className="adventure-node-img" />
        ) : (
          <span className="adventure-node-fallback">{stage.emoji}</span>
        )}
        {status === "locked" && (
          <span className="adventure-node-overlay">
            <img src={LOCK_ICON} alt="Locked" className="adventure-lock-img" draggable={false} />
          </span>
        )}

      </div>
      <div className="adventure-node-name-plaque">{stage.name}</div>
      <div className="adventure-node-meta">
        <span className="adventure-difficulty-pill">{stage.difficulty}</span>
        <span className="adventure-wpm-pill">{stage.goal} WPM</span>
      </div>
      {status !== "complete" && (
        <div className="adventure-node-reward">
          <span>+{xp} XP</span>
          <span>+{coins} Coins</span>
        </div>
      )}
      <div className="adventure-node-action">{actionLabel}</div>
    </button>
  );
}

function StageRunner({
  stage,
  world,
  alreadyCompleted,
  onClose,
  onWin,
}: {
  stage: Stage;
  world: WorldId;
  alreadyCompleted: boolean;
  onClose: () => void;
  onWin: () => void;
}) {
  const [targetWords, setTargetWords] = useState(() => expandWords(stage.words, 72));
  const [isGeneratingWords, setIsGeneratingWords] = useState(false);
  const target = useMemo(() => targetWords.join(" "), [targetWords]);
  const wordEntries = useMemo(() => {
    let offset = 0;
    return targetWords.map((word) => {
      const entry = { word, start: offset, end: offset + word.length };
      offset += word.length + 1;
      return entry;
    });
  }, [targetWords]);
  const isBoss = stage.difficulty === "Boss";
  const minAcc = isBoss ? 85 : 80;
  const phaseEmojis = useMemo(() => bossEmojis(stage.emoji), [stage.emoji]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { xp: xpReward, coins: coinReward } = rewardsFor(stage);

  const [typed, setTyped] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [done, setDone] = useState<null | "win" | "lose">(null);
  const [bossIntro, setBossIntro] = useState(isBoss);
  const [questText, setQuestText] = useState<string | null>(null);
  const [winHandled, setWinHandled] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
    if (!isBoss) return;
    const timer = setTimeout(() => setBossIntro(false), 1600);
    return () => clearTimeout(timer);
  }, [isBoss]);

  useEffect(() => {
    generateQuestText(stage.name, world).then(setQuestText);
  }, [stage.name, world]);

  useEffect(() => {
    setTargetWords(expandWords(stage.words, 72));
    setTyped("");
    setStartedAt(null);
    setNow(0);
    setCorrect(0);
    setWrong(0);
    setDone(null);
    setBossIntro(isBoss);
    setIsGeneratingWords(false);
    setWinHandled(false);
  }, [isBoss, stage.id, stage.words]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  useEffect(() => {
    if (!startedAt || done) return;
    const timer = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(timer);
  }, [startedAt, done]);

  useEffect(() => {
    if (done || bossIntro || isGeneratingWords) return;

    const remainingChars = target.length - typed.length;
    if (remainingChars > 180) return;

    let cancelled = false;
    setIsGeneratingWords(true);
    generateAdventureWords(stage.name, world, stage.words, 40)
      .then((words) => {
        if (cancelled) return;
        setTargetWords((current) => [...current, ...(words ?? expandWords(stage.words, 40))]);
      })
      .finally(() => {
        if (!cancelled) setIsGeneratingWords(false);
      });

    return () => {
      cancelled = true;
    };
  }, [bossIntro, done, isGeneratingWords, stage.name, stage.words, target.length, typed.length, world]);

  const elapsed = startedAt ? (now - startedAt) / 1000 : 0;
  const wpm = Math.round(correct / 5 / Math.max(elapsed / 60, 1 / 60));
  const acc = correct + wrong === 0 ? 100 : Math.round((correct / (correct + wrong)) * 100);
  const totalTarget = target.length;
  const typedLen = typed.length;
  const currentWordIndex = wordEntries.findIndex((entry) => typedLen <= entry.end);
  const safeCurrentWordIndex = currentWordIndex === -1 ? wordEntries.length - 1 : Math.max(0, currentWordIndex);
  const visibleWordStart = Math.max(0, safeCurrentWordIndex - 2);
  const visibleWords = wordEntries.slice(visibleWordStart, visibleWordStart + 12);
  const timeLimit = DIFFICULTY_TIME_LIMITS[stage.difficulty];
  const timeRemaining = startedAt ? Math.max(0, Math.ceil(timeLimit - elapsed)) : timeLimit;
  const timePercent = startedAt ? Math.min(100, (elapsed / timeLimit) * 100) : 0;
  const targetCharsForClear = Math.max(1, Math.ceil((stage.goal * timeLimit * 5) / 60));
  const clearPercent = Math.min(100, (typedLen / targetCharsForClear) * 100);
  const bossHp = isBoss ? Math.max(0, 100 - clearPercent) : 0;
  const hpColor = bossHp > 66 ? "var(--leaf)" : bossHp > 33 ? "var(--coin)" : "var(--color-destructive)";
  const currentPhase = isBoss ? Math.min(Math.floor(clearPercent / 34), 2) : 0;

  useEffect(() => {
    if (!startedAt || done || elapsed < timeLimit) return;
    const passed = wpm >= stage.goal && acc >= minAcc;
    setDone(passed ? "win" : "lose");
    if (passed && !winHandled) {
      onWin();
      setWinHandled(true);
    }
  }, [acc, done, elapsed, minAcc, onWin, stage.goal, startedAt, timeLimit, winHandled, wpm]);

  const reset = () => {
    setTyped("");
    setStartedAt(null);
    setNow(0);
    setCorrect(0);
    setWrong(0);
    setDone(null);
    setTargetWords(expandWords(stage.words, 72));
    setIsGeneratingWords(false);
    setWinHandled(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (done || bossIntro) return;
    const next = event.target.value.slice(0, totalTarget);

    if (!startedAt && next.length > 0) {
      setStartedAt(Date.now());
      setNow(Date.now());
    }

    if (next.length > typed.length) {
      const char = next[next.length - 1];
      const expected = target[next.length - 1];
      if (char === expected) setCorrect((value) => value + 1);
      else setWrong((value) => value + 1);
    }

    setTyped(next);
  };

  if (bossIntro) {
    return createPortal(
      <div className="adventure-modal">
        <div className="adventure-runner-card pixel-card animate-pixel-pop">
          <div className="adventure-runner-header">
            <span className="adventure-boss-emoji">{stage.emoji}</span>
            <button className="pixel-btn pixel-btn-secondary adventure-close-btn" onClick={onClose} type="button">X</button>
          </div>
          <div className="font-display text-4xl leading-none mb-2">{stage.name}</div>
          <p className="font-pixel text-[0.65rem] text-muted-foreground mb-4">{questText || "A boss stage appears. Type fast and stay accurate."}</p>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <MiniStat label="WPM" value={`>=${stage.goal}`} accent="var(--color-primary)" />
            <MiniStat label="Acc" value={`>=${minAcc}%`} accent="var(--leaf)" />
            <MiniStat label="Time" value={`<=${timeLimit}s`} accent="var(--coin)" />
          </div>
          <button className="pixel-btn" onClick={() => { setBossIntro(false); inputRef.current?.focus(); }} type="button">
            Fight
          </button>
        </div>
      </div>
    , document.body);
  }

  return createPortal(
    <div className="adventure-modal">
      <div className="adventure-runner-card pixel-card animate-pixel-pop">
        <div className="adventure-runner-header">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{isBoss ? phaseEmojis[currentPhase] : stage.emoji}</span>
            <div>
              <div className="font-display text-2xl leading-none">{stage.name}</div>
              <div className="font-pixel text-[0.6rem] text-muted-foreground mt-1">
                {isBoss
                  ? `Boss phase ${currentPhase + 1}/3 - ${timeLimit}s timer`
                  : `Goal: ${stage.goal} WPM - ${minAcc}%+ accuracy - ${timeLimit}s timer`}
              </div>
              {questText && (
                <div className="font-pixel text-[0.55rem] text-muted-foreground mt-1 italic leading-tight">
                  {questText}
                </div>
              )}
            </div>
          </div>
          <button className="pixel-btn pixel-btn-secondary adventure-close-btn" onClick={onClose} type="button">X</button>
        </div>

        {isBoss && (
          <div className="mb-4">
            <div className="flex justify-between font-pixel text-[0.55rem] mb-1">
              <span className="text-muted-foreground">Boss HP</span>
              <span style={{ color: hpColor }}>{Math.round(bossHp)}%</span>
            </div>
            <div className="pixel-bar" style={{ height: 12 }}>
              <div className="h-full transition-all duration-200" style={{ width: `${bossHp}%`, background: hpColor }} />
            </div>
          </div>
        )}

        <div className="adventure-type-wrap" onClick={() => inputRef.current?.focus()}>
          <div className="adventure-type-progress" aria-hidden="true">
            <div style={{ width: `${timePercent}%` }} />
          </div>
          <div className="adventure-typing-panel">
            <div className="adventure-word-stream">
              {visibleWords.map((entry) => {
                const wordState =
                  typedLen > entry.end
                    ? "complete"
                    : typedLen >= entry.start && typedLen <= entry.end
                      ? "current"
                      : "pending";

                return (
                  <span className={`adventure-word adventure-word-${wordState}`} key={`${entry.word}-${entry.start}`}>
                    {entry.word.split("").map((char, charIndex) => {
                      const index = entry.start + charIndex;
                      const typedChar = typed[index];
                      const state = typedChar == null ? "pending" : typedChar === char ? "correct" : "wrong";
                      const isCursor = index === typedLen;
                      return (
                        <span className={`adventure-char adventure-char-${state} ${isCursor ? "adventure-char-current" : ""}`} key={`${char}-${index}`}>
                          {char}
                        </span>
                      );
                    })}
                    {typedLen === entry.end && <span className="adventure-space-cursor" aria-hidden="true" />}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        <input
          ref={inputRef}
          value={typed}
          onChange={handleChange}
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          id="stage-input"
          name="stage-input"
          aria-label="Type the stage text"
          className="absolute opacity-0 pointer-events-none"
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <MiniStat label="WPM" value={String(wpm)} accent="var(--color-primary)" />
          <MiniStat label="Acc" value={`${acc}%`} accent="var(--leaf)" />
          <MiniStat label="Time" value={`${timeRemaining}s`} accent="var(--coin)" />
          <MiniStat label="Goal" value={`${stage.goal}`} accent="var(--color-destructive)" />
        </div>

        {done && (
          <div className="adventure-result pixel-card-sm">
            <div className="text-4xl mb-2">{done === "win" ? "ðŸ†" : "ðŸ’”"}</div>
            <div className="font-display text-2xl leading-none mb-1">
              {done === "win" ? "Stage Cleared!" : "Try Again"}
            </div>
            <p className="font-pixel text-[0.65rem] text-muted-foreground mb-3">
              {done === "win"
                ? alreadyCompleted
                  ? "Replay clear only. No extra XP or coins for completed quests."
                  : `+${xpReward} XP - +${coinReward} coins`
                : `Need ${stage.goal} WPM and ${minAcc}% accuracy before time runs out.`}
            </p>
            <div className="flex justify-center gap-2">
              <button className="pixel-btn" onClick={reset} type="button">{done === "win" ? "Replay" : "Retry"}</button>
            </div>
            {done === "win" && (
              <p className="font-pixel text-[0.55rem] text-muted-foreground mt-3">
                Press Esc or click X to leave this quest.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  , document.body);
}

function MiniStat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="pixel-card-sm p-2 text-center" style={{ borderLeft: `4px solid ${accent}` }}>
      <div className="font-pixel text-[0.55rem] text-muted-foreground uppercase">{label}</div>
      <div className="font-display text-xl leading-tight" style={{ color: accent }}>{value}</div>
    </div>
  );
}
