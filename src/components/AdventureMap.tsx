import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useWorld, WORLDS, type WorldId } from "./WorldTheme";
import { useGame } from "../lib/game/store";
import { generateAdventureWords, generateQuestText } from "../lib/game/textGenerator";

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

const NODE_IMAGES: Partial<Record<WorldId, string[]>> = {
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

const WORLD_WORDS: Record<WorldId, string[]> = {
  cafe: ["latte", "mocha", "cocoa", "cream", "sugar", "beans", "mug", "warm", "brew", "sip", "roast", "coffee", "manor", "garden", "corner", "velvet", "caramel", "vanilla", "aroma", "steam"],
  forest: ["fern", "moss", "oak", "pine", "leaf", "root", "bark", "seed", "vine", "sap", "grove", "fox", "woods", "elder", "tree", "willow", "cedar", "brook", "branch", "hollow"],
  ocean: ["wave", "salt", "sand", "reef", "fish", "kelp", "tide", "foam", "crab", "shell", "coral", "pearl", "grotto", "abyss", "palace", "current", "lagoon", "oyster", "anchor", "harbor"],
  sakura: ["bloom", "petal", "pink", "park", "wind", "pond", "koi", "lotus", "tea", "garden", "shrine", "hill", "sakura", "sanctuary", "lantern", "mochi", "ribbon", "spring", "temple", "blossom"],
  castle: ["gate", "royal", "court", "knight", "hall", "king", "keep", "crown", "citadel", "sword", "shield", "armor", "banner", "castle", "dragon", "wizard", "scroll", "gold", "gem", "throne"],
  space: ["star", "glade", "nebula", "grove", "galaxy", "pool", "cosmic", "ruins", "astral", "observatory", "comet", "planet", "orbit", "quasar", "cosmos", "gravity", "stellar", "photon", "void", "moon"],
  autumn: ["camp", "pine", "fire", "circle", "bear", "ridge", "ranger", "lookout", "leaf", "cabin", "trail", "ember", "acorn", "harvest", "cider", "maple", "hearth", "golden", "twig", "lantern"],
  mushroom: ["mushroom", "fairy", "hollow", "glow", "grove", "crystal", "thicket", "queen", "tree", "spore", "cap", "root", "fern", "twinkle", "sprite", "moss", "dew", "petal", "magic", "village"],
  moonlit: ["moon", "gate", "silver", "pond", "jasmine", "walk", "lunar", "shrine", "night", "pavilion", "star", "garden", "glow", "quiet", "mist", "dream", "stone", "lantern", "petal", "shadow"],
  rainy: ["reading", "nook", "archive", "hall", "grand", "library", "wizard", "study", "ancient", "archives", "book", "page", "ink", "quill", "scroll", "shelf", "paper", "rain", "window", "tome"],
  snowy: ["frost", "path", "pine", "ridge", "frozen", "creek", "blizzard", "pass", "winter", "lodge", "snow", "cabin", "ice", "fire", "mittens", "fir", "crystal", "drift", "flake", "summit"],
  sunflower: ["daisy", "path", "sunflower", "field", "windmill", "hill", "golden", "harvest", "haven", "meadow", "bee", "seed", "petal", "wheat", "farm", "breeze", "barn", "honey", "bright", "summer"],
};

const STAGE_DEFS: Record<WorldId, Array<{ name: string; emoji: string; difficulty: Difficulty }>> = {
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
  snowy: [
    { name: "Frost Path", emoji: "❄️", difficulty: "Easy" },
    { name: "Pine Ridge", emoji: "🌲", difficulty: "Easy" },
    { name: "Frozen Creek", emoji: "🧊", difficulty: "Normal" },
    { name: "Blizzard Pass", emoji: "🌨️", difficulty: "Hard" },
    { name: "Winter Lodge", emoji: "🏔️", difficulty: "Boss" },
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
  rainy: [
    { name: "Reading Nook", emoji: "📚", difficulty: "Easy" },
    { name: "Archive Hall", emoji: "🗄️", difficulty: "Easy" },
    { name: "Grand Library", emoji: "📖", difficulty: "Normal" },
    { name: "Wizard's Study", emoji: "🧙", difficulty: "Hard" },
    { name: "Ancient Archives", emoji: "🔮", difficulty: "Boss" },
  ],
  autumn: [
    { name: "Camp Entrance", emoji: "🏕️", difficulty: "Easy" },
    { name: "Pine Camp", emoji: "🌲", difficulty: "Easy" },
    { name: "Campfire Circle", emoji: "🔥", difficulty: "Normal" },
    { name: "Bear Ridge", emoji: "🐻", difficulty: "Hard" },
    { name: "Ranger's Lookout", emoji: "🧭", difficulty: "Boss" },
  ],
  moonlit: [
    { name: "Moon Gate", emoji: "🌙", difficulty: "Easy" },
    { name: "Silver Pond", emoji: "💧", difficulty: "Easy" },
    { name: "Jasmine Walk", emoji: "🌼", difficulty: "Normal" },
    { name: "Lunar Shrine", emoji: "⛩️", difficulty: "Hard" },
    { name: "Moonlit Pavilion", emoji: "🏯", difficulty: "Boss" },
  ],
};

const STAGES_BY_WORLD: Record<WorldId, Stage[]> = Object.fromEntries(
  Object.entries(STAGE_DEFS).map(([world, stages]) => [
    world,
    stages.map((stage, index) => ({
      id: index + 1,
      ...stage,
      goal: DIFFICULTY_GOALS[stage.difficulty] + (index === 1 ? 5 : 0),
      words: wordsFor(world as WorldId, index + 1),
    })),
  ]),
) as Record<WorldId, Stage[]>;

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
  const words = WORLD_WORDS[world];
  return Array.from({ length: 10 }, (_, index) => words[(stageId * 3 + index) % words.length]);
}

function bossEmojis(emoji: string): [string, string, string] {
  return BOSS_PHASE_EMOJIS[emoji] ?? [emoji, "💢", "💫"];
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
  const frameRef = useRef<HTMLDivElement>(null);
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
    const frame = frameRef.current;
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
    <div ref={frameRef} className="adventure-node-image-frame">
      <img
        src={src}
        alt={alt}
        className={`${className} ${measuredStyle ? "adventure-node-img-measured" : ""}`}
        style={measuredStyle}
        draggable={false}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

export function AdventureMap() {
  const { world } = useWorld();
  const { state, dispatch } = useGame();
  const orderedWorlds = [
    ...WORLDS.filter((item) => item.id === world),
    ...WORLDS.filter((item) => item.id !== world),
  ];
  const allStages = orderedWorlds.flatMap((item) => STAGES_BY_WORLD[item.id]);
  const totalCleared = orderedWorlds.reduce((sum, item) => sum + (state.adventures[item.id]?.length ?? 0), 0);
  const [active, setActive] = useState<{ stage: Stage; world: WorldId } | null>(null);

  const statusOf = (worldId: WorldId, stage: Stage, index: number): Status => {
    const stages = STAGES_BY_WORLD[worldId];
    const completed = state.adventures[worldId] ?? [];
    if (completed.includes(stage.id)) return "complete";
    if (index === 0) return "available";
    return completed.includes(stages[index - 1].id) ? "available" : "locked";
  };

  const clearedPercent = Math.round((totalCleared / allStages.length) * 100);
  const nextWorld = orderedWorlds.find((item) =>
    STAGES_BY_WORLD[item.id].some((stage, index) => statusOf(item.id, stage, index) === "available"),
  );
  const nextStage = nextWorld
    ? STAGES_BY_WORLD[nextWorld.id].find((stage, index) => statusOf(nextWorld.id, stage, index) === "available")
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
          const stages = STAGES_BY_WORLD[theme.id];
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
          onClose={() => setActive(null)}
          onWin={() => {
            const { xp, coins } = rewardsFor(active.stage);
            dispatch({ type: "COMPLETE_STAGE", world: active.world, stageId: active.stage.id });
            dispatch({ type: "ADD_XP", amount: xp });
            dispatch({ type: "EARN_COINS", amount: coins });
            dispatch({ type: "ADD_PET_XP", amount: coins });
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
      <div className="adventure-node-icon" data-has-image={Boolean(image)}>
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
        {status === "complete" && <span className="adventure-node-overlay adventure-node-overlay-check">✓</span>}
      </div>
      <div className="adventure-node-name-plaque">{stage.name}</div>
      <div className="adventure-node-meta">
        <span className="adventure-difficulty-pill">{stage.difficulty}</span>
        <span className="adventure-wpm-pill">{stage.goal} WPM</span>
      </div>
      <div className="adventure-node-reward">
        <span>+{xp} XP</span>
        <span>+{coins} Coins</span>
      </div>
      <div className="adventure-node-action">{actionLabel}</div>
    </button>
  );
}

function StageRunner({
  stage,
  world,
  onClose,
  onWin,
}: {
  stage: Stage;
  world: WorldId;
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
    if (passed) onWin();
  }, [acc, done, elapsed, minAcc, onWin, stage.goal, startedAt, timeLimit, wpm]);

  const reset = () => {
    setTyped("");
    setStartedAt(null);
    setNow(0);
    setCorrect(0);
    setWrong(0);
    setDone(null);
    setTargetWords(expandWords(stage.words, 72));
    setIsGeneratingWords(false);
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
    return (
      <div className="adventure-modal" onClick={onClose}>
        <div className="adventure-runner-card pixel-card animate-pixel-pop" onClick={(event) => event.stopPropagation()}>
          <span className="adventure-boss-emoji">{stage.emoji}</span>
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
    );
  }

  return (
    <div className="adventure-modal" onClick={onClose}>
      <div className="adventure-runner-card pixel-card animate-pixel-pop" onClick={(event) => event.stopPropagation()}>
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
            <div className="text-4xl mb-2">{done === "win" ? "🏆" : "💔"}</div>
            <div className="font-display text-2xl leading-none mb-1">
              {done === "win" ? "Stage Cleared!" : "Try Again"}
            </div>
            <p className="font-pixel text-[0.65rem] text-muted-foreground mb-3">
              {done === "win" ? `+${xpReward} XP - +${coinReward} coins` : `Need ${stage.goal} WPM and ${minAcc}% accuracy before time runs out.`}
            </p>
            <div className="flex justify-center gap-2">
              <button className="pixel-btn pixel-btn-secondary" onClick={onClose} type="button">Map</button>
              <button className="pixel-btn" onClick={reset} type="button">{done === "win" ? "Replay" : "Retry"}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MiniStat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="pixel-card-sm p-2 text-center" style={{ borderLeft: `4px solid ${accent}` }}>
      <div className="font-pixel text-[0.55rem] text-muted-foreground uppercase">{label}</div>
      <div className="font-display text-xl leading-tight" style={{ color: accent }}>{value}</div>
    </div>
  );
}
