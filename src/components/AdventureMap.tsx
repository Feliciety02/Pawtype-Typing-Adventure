import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useWorld, type WorldId } from "./WorldTheme";
import { useGame } from "../lib/game/store";
import { generateQuestText } from "../lib/game/textGenerator";

type Difficulty = "Easy" | "Normal" | "Hard" | "Elite" | "Boss";

type Stage = {
  id: number;
  name: string;
  emoji: string;
  difficulty: Difficulty;
  goal: number;
  words: string[];
};

type Status = "locked" | "available" | "complete";

const NODE_IMAGES: Record<string, string[]> = {
  cafe: [16, 17, 18, 19, 20].map((n) => `/node-level/cozy-cafe-nl/cozy-cafe-node-${n}.png`),
  forest: [1, 2, 3, 4, 5].map((n) => `/node-level/mossy-forest-nl/mossy-forest-node-${n}.png`),
  ocean: [1, 2, 3, 4, 5].map((n) => `/node-level/tide-pool-nl/tide-pool-node-${n}.png`),
  sakura: [1, 2, 3, 4, 5].map((n) => `/node-level/sakura-park-nl/sakura-park-node-${n}.png`),
  castle: [1, 2, 3, 4, 5].map((n) => `/node-level/royal-castle-nl/royal-castle-node-${n}.png`),
  space: [1, 2, 3, 4, 5].map((n) => `/node-level/stardust-nl/stardust-node-${n}.png`),
};

const STAGES_BY_WORLD: Record<string, Stage[]> = {
  cafe: [
    { id: 1, name: "Steamy Start", emoji: "☕", difficulty: "Easy", goal: 20, words: ["latte", "mocha", "cocoa", "cream", "sugar", "beans", "mug", "warm", "brew", "sip"] },
    { id: 2, name: "Pastry Path", emoji: "🥐", difficulty: "Normal", goal: 30, words: ["croissant", "biscuit", "muffin", "scone", "tart", "jam", "butter", "flaky", "crumb", "honey"] },
    { id: 3, name: "Barista Trial", emoji: "🫘", difficulty: "Hard", goal: 40, words: ["espresso", "macchiato", "cortado", "ristretto", "americano", "velvet", "aroma", "crema", "grind", "steam"] },
    { id: 4, name: "Roastmaster", emoji: "🔥", difficulty: "Elite", goal: 45, words: ["arabica", "robusta", "singleorigin", "frenchpress", "pourover", "chemex", "aeropress", "tamping", "extraction", "roastery"] },
    { id: 5, name: "Cafe Boss", emoji: "👑", difficulty: "Boss", goal: 50, words: ["cinnamon", "caramel", "hazelnut", "gingerbread", "marshmallow", "pumpkin", "vanilla", "chocolate", "blueberry", "raspberry"] },
  ],
  forest: [
    { id: 1, name: "Mossy Trail", emoji: "🌿", difficulty: "Easy", goal: 20, words: ["fern", "moss", "oak", "pine", "leaf", "root", "bark", "seed", "vine", "sap"] },
    { id: 2, name: "Owl Grove", emoji: "🦉", difficulty: "Normal", goal: 30, words: ["willow", "cedar", "maple", "birch", "hollow", "branch", "forest", "meadow", "stream", "pebble"] },
    { id: 3, name: "Fox Hollow", emoji: "🦊", difficulty: "Hard", goal: 40, words: ["mushroom", "clearing", "wildflower", "thicket", "brambles", "sunlight", "whisper", "rustle", "emerald", "dewdrop"] },
    { id: 4, name: "Elder Glade", emoji: "🌳", difficulty: "Elite", goal: 45, words: ["evergreen", "canopy", "underbrush", "rootweave", "mossheart", "fireflies", "twilight", "wandering", "owlsong", "foxglove"] },
    { id: 5, name: "Forest Guardian", emoji: "🐺", difficulty: "Boss", goal: 50, words: ["ancientwood", "silverleaf", "moonpetal", "ironroot", "stormcloud", "windsong", "greenmantle", "starseed", "wolfsbane", "nightshade"] },
  ],
  ocean: [
    { id: 1, name: "Tide Pool", emoji: "🐚", difficulty: "Easy", goal: 20, words: ["wave", "salt", "sand", "reef", "fish", "kelp", "tide", "foam", "crab", "shell"] },
    { id: 2, name: "Coral Cove", emoji: "🐠", difficulty: "Normal", goal: 30, words: ["coral", "dolphin", "seagull", "lagoon", "pebbles", "driftwood", "seaweed", "oyster", "anchor", "harbor"] },
    { id: 3, name: "Deep Trench", emoji: "🐙", difficulty: "Hard", goal: 40, words: ["jellyfish", "anglerfish", "starfish", "plankton", "barnacle", "luminous", "abyssal", "current", "compass", "beacon"] },
    { id: 4, name: "Sunken Ruins", emoji: "🏛", difficulty: "Elite", goal: 45, words: ["shipwreck", "treasure", "trident", "mariner", "fathomless", "seabreeze", "pearl", "narwhal", "kelpforest", "manta"] },
    { id: 5, name: "Leviathan", emoji: "🐳", difficulty: "Boss", goal: 50, words: ["tempestwave", "stormwater", "krakenink", "mooncurrent", "saltspray", "horizonline", "tidalpull", "oceanheart", "seafoam", "whirlpool"] },
  ],
  sakura: [
    { id: 1, name: "Petal Path", emoji: "🌸", difficulty: "Easy", goal: 20, words: ["bloom", "petal", "pink", "park", "wind", "bench", "kite", "pond", "koi", "bow"] },
    { id: 2, name: "Lantern Lane", emoji: "🏮", difficulty: "Normal", goal: 30, words: ["lantern", "blossom", "temple", "garden", "whisper", "kimono", "origami", "ribbon", "silken", "mochi"] },
    { id: 3, name: "Tea Garden", emoji: "🍵", difficulty: "Hard", goal: 40, words: ["matcha", "ceremony", "porcelain", "sakuramochi", "wisteria", "camellia", "azalea", "bamboo", "peaceful", "tranquil"] },
    { id: 4, name: "Moon Bridge", emoji: "🌉", difficulty: "Elite", goal: 45, words: ["arched", "reflection", "wisterias", "stonelantern", "tearoom", "haiku", "calligraphy", "raindrop", "stillness", "blossomfall"] },
    { id: 5, name: "Spring Empress", emoji: "👘", difficulty: "Boss", goal: 50, words: ["springbreeze", "pinkcascade", "mountainmist", "silentpetal", "goldenkoi", "crimsonleaf", "ancientstone", "windchime", "silkroad", "jadepool"] },
  ],
  castle: [
    { id: 1, name: "Drawbridge", emoji: "🛡", difficulty: "Easy", goal: 20, words: ["king", "queen", "sword", "crown", "gold", "gem", "tome", "mage", "quest", "kite"] },
    { id: 2, name: "Hall of Knights", emoji: "⚔", difficulty: "Normal", goal: 30, words: ["knight", "castle", "dragon", "wizard", "scroll", "shield", "armor", "valiant", "royal", "silver"] },
    { id: 3, name: "Wizard Spire", emoji: "🧙", difficulty: "Hard", goal: 40, words: ["enchanted", "sorcerer", "alchemy", "grimoire", "talisman", "incantation", "mystical", "arcane", "prophecy", "conjure"] },
    { id: 4, name: "Throne Vault", emoji: "💎", difficulty: "Elite", goal: 45, words: ["chalice", "regalia", "heraldry", "banneret", "courtier", "vassalage", "fortress", "battlement", "portcullis", "seneschal"] },
    { id: 5, name: "Dragon Lord", emoji: "🐉", difficulty: "Boss", goal: 50, words: ["dragonfire", "ironcrown", "stormblade", "goldhoard", "obsidian", "thundermail", "eldritch", "kingsguard", "midnightoath", "silvermoon"] },
  ],
  space: [
    { id: 1, name: "Launchpad", emoji: "🚀", difficulty: "Easy", goal: 20, words: ["star", "moon", "mars", "jet", "void", "beam", "ion", "arc", "disk", "glow"] },
    { id: 2, name: "Asteroid Belt", emoji: "☄", difficulty: "Normal", goal: 30, words: ["comet", "planet", "orbit", "nebula", "quasar", "cosmos", "gravity", "stellar", "photon", "plasma"] },
    { id: 3, name: "Nebula Drift", emoji: "🪐", difficulty: "Hard", goal: 40, words: ["andromeda", "supernova", "blackhole", "hyperdrive", "wormhole", "starlight", "interstellar", "exoplanet", "luminosity", "singularity"] },
    { id: 4, name: "Pulsar Station", emoji: "🛰", difficulty: "Elite", goal: 45, words: ["satellite", "moonbase", "lightspeed", "antimatter", "darkmatter", "neutronstar", "magnetar", "cosmicray", "asteroidfield", "spacetime"] },
    { id: 5, name: "Galaxy Sentinel", emoji: "👾", difficulty: "Boss", goal: 50, words: ["voidwalker", "starforge", "cosmichunter", "nebulasong", "quantumleap", "eventhorizon", "ironstation", "photonblade", "stardrive", "celestial"] },
  ],
};

const BOSS_PHASE_EMOJIS: Record<string, [string, string, string]> = {
  "👑": ["👑", "⚔", "✨"],
  "🐺": ["🐺", "🐾", "🌕"],
  "🐳": ["🐳", "🌊", "💫"],
  "👘": ["👘", "🎀", "🌸"],
  "🐉": ["🐉", "🔥", "⚡"],
  "👾": ["👾", "💥", "☄"],
};

function bossEmojis(emoji: string): [string, string, string] {
  return BOSS_PHASE_EMOJIS[emoji] ?? [emoji, "💢", "💫"];
}

function rewardsFor(stage: Stage): { xp: number; coins: number } {
  if (stage.difficulty === "Boss") return { xp: stage.goal * 6, coins: stage.goal * 2 };
  if (stage.difficulty === "Elite") return { xp: Math.round(stage.goal * 4), coins: Math.round(stage.goal * 1.5) };
  return { xp: stage.goal * 3, coins: stage.goal };
}

export function AdventureMap() {
  const { world } = useWorld();
  const { state, dispatch } = useGame();
  const stages = STAGES_BY_WORLD[world] ?? STAGES_BY_WORLD.cafe;
  const completed = state.adventures[world] ?? [];
  const [active, setActive] = useState<Stage | null>(null);

  const statusOf = (stage: Stage, index: number): Status => {
    if (completed.includes(stage.id)) return "complete";
    if (index === 0) return "available";
    return completed.includes(stages[index - 1].id) ? "available" : "locked";
  };

  const clearedCount = stages.filter((stage) => completed.includes(stage.id)).length;
  const clearedPercent = Math.round((clearedCount / stages.length) * 100);
  const nextStage = stages.find((stage, index) => statusOf(stage, index) === "available");

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
            <span className="font-pixel text-[0.55rem] uppercase text-muted-foreground">Progress</span>
            <strong className="font-display text-2xl leading-none">{clearedCount}/{stages.length}</strong>
          </div>
          <div className="pixel-bar adventure-progress-bar">
            <div style={{ width: `${clearedPercent}%` }} />
          </div>
          <div className="adventure-next-line">
            <span>{nextStage ? "Next stage" : "All clear"}</span>
            <strong>{nextStage?.name ?? "World complete"}</strong>
          </div>
        </div>
      </div>

      <div className="adventure-map-board">
        <div className="adventure-map-glow" aria-hidden="true" />
        <svg className="adventure-route" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden="true">
          <path d="M 8 75 Q 30 20, 50 50 T 92 30" fill="none" className="adventure-route-shadow" vectorEffect="non-scaling-stroke" />
          <path d="M 8 75 Q 30 20, 50 50 T 92 30" fill="none" className="adventure-route-line" vectorEffect="non-scaling-stroke" />
        </svg>

        <div className="adventure-node-grid">
          {stages.map((stage, index) => {
            const status = statusOf(stage, index);
            return (
              <StageNode
                key={stage.id}
                stage={stage}
                index={index}
                status={status}
                onPlay={() => status !== "locked" && setActive(stage)}
              />
            );
          })}
        </div>
      </div>

      {active && (
        <StageRunner
          stage={active}
          world={world}
          onClose={() => setActive(null)}
          onWin={() => {
            const { xp, coins } = rewardsFor(active);
            dispatch({ type: "COMPLETE_STAGE", world, stageId: active.id });
            dispatch({ type: "ADD_XP", amount: xp });
            dispatch({ type: "EARN_COINS", amount: coins });
            dispatch({ type: "ADD_PET_XP", amount: Math.round(coins) });
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
      : stage.difficulty === "Elite"
        ? "var(--color-accent, var(--color-primary))"
        : stage.difficulty === "Hard"
          ? "var(--coin)"
          : stage.difficulty === "Normal"
            ? "var(--leaf)"
            : "var(--sky)";
  const statusLabel = status === "complete" ? "Cleared" : status === "locked" ? "Locked" : "Start";
  const statusIcon = status === "complete" ? "✓" : status === "locked" ? "🔒" : "▶";
  const { xp, coins } = rewardsFor(stage);

  return (
    <button
      onClick={onPlay}
      disabled={status === "locked"}
      className={`adventure-node pixel-card-sm adventure-node-${status} ${index % 2 === 0 ? "adventure-node-low" : "adventure-node-high"}`}
      style={{ borderTop: `4px solid ${accent}` }}
      type="button"
    >
      <div className="adventure-node-topline">
        <span className="adventure-node-index">Stage {index + 1}</span>
        <span className="adventure-node-status">{statusIcon} {statusLabel}</span>
      </div>
      <div className="adventure-node-icon">
        {image ? (
          <img
            src={image}
            alt={`${stage.name} node`}
            className="adventure-node-img"
            style={{ imageRendering: "pixelated" }}
            draggable={false}
          />
        ) : (
          <span>{stage.emoji}</span>
        )}
        {status === "locked" && <span className="adventure-node-overlay">🔒</span>}
        {status === "complete" && <span className="adventure-node-overlay adventure-node-overlay-check">✓</span>}
      </div>
      <div className="adventure-node-name">{stage.name}</div>
      <div className="adventure-node-meta">
        <span>{stage.difficulty}</span>
        <span>{stage.goal} WPM</span>
      </div>
      <div className="adventure-node-reward">
        <span>+{xp} XP</span>
        <span>+{coins} coins</span>
      </div>
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
  world: string;
  onClose: () => void;
  onWin: () => void;
}) {
  const target = useMemo(() => stage.words.join(" "), [stage.words]);
  const isBoss = stage.difficulty === "Boss";
  const minAcc = isBoss ? 85 : 80;
  const phaseEmojis = useMemo(() => bossEmojis(stage.emoji), [stage.emoji]);
  const inputRef = useRef<HTMLInputElement>(null);

  const [typed, setTyped] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [done, setDone] = useState<null | "win" | "lose">(null);
  const [bossIntro, setBossIntro] = useState(isBoss);

  useEffect(() => {
    inputRef.current?.focus();
    if (!isBoss) return;
    const timer = setTimeout(() => setBossIntro(false), 1600);
    return () => clearTimeout(timer);
  }, [isBoss]);

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

  const elapsed = startedAt ? (now - startedAt) / 1000 : 0;
  const wpm = Math.round(correct / 5 / Math.max(elapsed / 60, 1 / 60));
  const acc = correct + wrong === 0 ? 100 : Math.round((correct / (correct + wrong)) * 100);
  const totalTarget = target.length;
  const typedLen = typed.length;
  const bossHp = isBoss && totalTarget > 0 ? Math.max(0, ((totalTarget - typedLen) / totalTarget) * 100) : 0;
  const hpColor = bossHp > 66 ? "var(--leaf)" : bossHp > 33 ? "var(--coin)" : "var(--color-destructive)";
  const currentPhase = isBoss && totalTarget > 0 ? Math.min(Math.floor(typedLen / (totalTarget / 3)), 2) : 0;
  const timeLimit = isBoss ? Math.max(30, Math.ceil((stage.words.length / stage.goal) * 60 * 1.5)) : Infinity;
  const xpReward = isBoss ? stage.goal * 6 : stage.goal * 3;
  const coinReward = isBoss ? stage.goal * 2 : stage.goal;
  const [questText, setQuestText] = useState<string | null>(null);

  useEffect(() => {
    generateQuestText(stage.name, world as WorldId).then(setQuestText);
  }, [stage.name, world]);

  useEffect(() => {
    if (isBoss && startedAt && !done && elapsed >= timeLimit) setDone("lose");
  }, [done, elapsed, isBoss, startedAt, timeLimit]);

  const reset = () => {
    setTyped("");
    setStartedAt(null);
    setNow(0);
    setCorrect(0);
    setWrong(0);
    setDone(null);
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

    if (next.length >= totalTarget) {
      const finalElapsed = startedAt ? (Date.now() - startedAt) / 1000 : 1;
      const finalWpm = Math.round(correct / 5 / Math.max(finalElapsed / 60, 1 / 60));
      const finalAcc = correct + wrong === 0 ? 100 : Math.round((correct / (correct + wrong)) * 100);
      const passed = finalWpm >= stage.goal && finalAcc >= minAcc;
      setDone(passed ? "win" : "lose");
      if (passed) onWin();
    }
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
                {isBoss ? `Boss phase ${currentPhase + 1}/3` : `Goal: ${stage.goal} WPM · ${minAcc}%+ accuracy`}
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

        <div className="adventure-typing-panel" onClick={() => inputRef.current?.focus()}>
          {target.split("").map((char, index) => {
            const typedChar = typed[index];
            const state = typedChar == null ? "pending" : typedChar === char ? "correct" : "wrong";
            const isCursor = index === typedLen;
            return (
              <span className={`adventure-char adventure-char-${state} ${isCursor ? "adventure-char-current" : ""}`} key={`${char}-${index}`}>
                {char === " " ? "\u00A0" : char}
              </span>
            );
          })}
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
          aria-label="Type the stage text"
          className="absolute opacity-0 pointer-events-none"
        />

        <div className="grid grid-cols-3 gap-3 mt-4">
          <MiniStat label="WPM" value={String(wpm)} accent="var(--color-primary)" />
          <MiniStat label="Acc" value={`${acc}%`} accent="var(--leaf)" />
          <MiniStat label={isBoss ? "Time" : "Goal"} value={isBoss ? `${Math.ceil(elapsed)}s` : String(stage.goal)} accent="var(--coin)" />
        </div>

        {done && (
          <div className="adventure-result pixel-card-sm">
            <div className="text-4xl mb-2">{done === "win" ? "🏆" : "💔"}</div>
            <div className="font-display text-2xl leading-none mb-1">
              {done === "win" ? "Stage Cleared!" : "Try Again"}
            </div>
            <p className="font-pixel text-[0.65rem] text-muted-foreground mb-3">
              {done === "win" ? `+${xpReward} XP · +${coinReward} coins` : `Need ${stage.goal} WPM and ${minAcc}% accuracy.`}
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
