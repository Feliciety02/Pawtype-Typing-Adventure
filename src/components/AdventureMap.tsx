import { useMemo, useRef, useState } from "react";
import { PixelMascot } from "./PixelMascot";
import { useWorld } from "./WorldTheme";
import { useGame } from "../lib/game/store";

type Stage = {
  id: number;
  name: string;
  emoji: string;
  difficulty: "Easy" | "Normal" | "Hard" | "Boss";
  goal: number; // target WPM-like score
  words: string[];
};

const STAGES_BY_WORLD: Record<string, Stage[]> = {
  cafe: [
    { id: 1, name: "Steamy Start",    emoji: "☕", difficulty: "Easy",   goal: 20, words: ["latte","mocha","cocoa","cream","sugar","beans","mug","warm","brew","sip"] },
    { id: 2, name: "Pastry Path",     emoji: "🥐", difficulty: "Normal", goal: 30, words: ["croissant","biscuit","muffin","scone","tart","jam","butter","flaky","crumb","honey"] },
    { id: 3, name: "Barista Trial",   emoji: "🫖", difficulty: "Hard",   goal: 40, words: ["espresso","macchiato","cortado","ristretto","americano","velvet","aroma","crema","grind","steam"] },
    { id: 4, name: "Café Boss",       emoji: "👑", difficulty: "Boss",   goal: 50, words: ["cinnamon","caramel","hazelnut","gingerbread","marshmallow","pumpkin","vanilla","chocolate","blueberry","raspberry"] },
  ],
  forest: [
    { id: 1, name: "Mossy Trail",     emoji: "🌿", difficulty: "Easy",   goal: 20, words: ["fern","moss","oak","pine","leaf","root","bark","seed","vine","sap"] },
    { id: 2, name: "Owl Grove",       emoji: "🦉", difficulty: "Normal", goal: 30, words: ["willow","cedar","maple","birch","hollow","branch","forest","meadow","stream","pebble"] },
    { id: 3, name: "Fox Hollow",      emoji: "🦊", difficulty: "Hard",   goal: 40, words: ["mushroom","clearing","wildflower","thicket","brambles","sunlight","whisper","rustle","emerald","dewdrop"] },
    { id: 4, name: "Forest Guardian", emoji: "🐺", difficulty: "Boss",   goal: 50, words: ["ancientwood","silverleaf","moonpetal","ironroot","stormcloud","windsong","greenmantle","starseed","wolfsbane","nightshade"] },
  ],
  ocean: [
    { id: 1, name: "Tide Pool",       emoji: "🐚", difficulty: "Easy",   goal: 20, words: ["wave","salt","sand","reef","fish","kelp","tide","foam","crab","shell"] },
    { id: 2, name: "Coral Cove",      emoji: "🐠", difficulty: "Normal", goal: 30, words: ["coral","dolphin","seagull","lagoon","pebbles","driftwood","seaweed","oyster","anchor","harbor"] },
    { id: 3, name: "Deep Trench",     emoji: "🐙", difficulty: "Hard",   goal: 40, words: ["jellyfish","anglerfish","starfish","plankton","barnacle","luminous","abyssal","current","compass","beacon"] },
    { id: 4, name: "Leviathan",       emoji: "🐳", difficulty: "Boss",   goal: 50, words: ["tempestwave","stormwater","krakenink","mooncurrent","saltspray","horizonline","tidalpull","oceanheart","seafoam","whirlpool"] },
  ],
  sakura: [
    { id: 1, name: "Petal Path",      emoji: "🌸", difficulty: "Easy",   goal: 20, words: ["bloom","petal","pink","park","wind","bench","kite","pond","koi","bow"] },
    { id: 2, name: "Lantern Lane",    emoji: "🏮", difficulty: "Normal", goal: 30, words: ["lantern","blossom","temple","garden","whisper","kimono","origami","ribbon","silken","mochi"] },
    { id: 3, name: "Tea Garden",      emoji: "🍵", difficulty: "Hard",   goal: 40, words: ["matcha","ceremony","porcelain","sakuramochi","wisteria","camellia","azalea","bamboo","peaceful","tranquil"] },
    { id: 4, name: "Spring Empress",  emoji: "👘", difficulty: "Boss",   goal: 50, words: ["springbreeze","pinkcascade","mountainmist","silentpetal","goldenkoi","crimsonleaf","ancientstone","windchime","silkroad","jadepool"] },
  ],
  castle: [
    { id: 1, name: "Drawbridge",      emoji: "🛡", difficulty: "Easy",   goal: 20, words: ["king","queen","sword","crown","gold","gem","tome","mage","quest","kite"] },
    { id: 2, name: "Hall of Knights", emoji: "⚔",  difficulty: "Normal", goal: 30, words: ["knight","castle","dragon","wizard","scroll","shield","armor","valiant","royal","silver"] },
    { id: 3, name: "Wizard Spire",    emoji: "🧙", difficulty: "Hard",   goal: 40, words: ["enchanted","sorcerer","alchemy","grimoire","talisman","incantation","mystical","arcane","prophecy","conjure"] },
    { id: 4, name: "Dragon Lord",     emoji: "🐉", difficulty: "Boss",   goal: 50, words: ["dragonfire","ironcrown","stormblade","goldhoard","obsidian","thundermail","eldritch","kingsguard","midnightoath","silvermoon"] },
  ],
  space: [
    { id: 1, name: "Launchpad",       emoji: "🚀", difficulty: "Easy",   goal: 20, words: ["star","moon","mars","jet","void","beam","ion","arc","disk","glow"] },
    { id: 2, name: "Asteroid Belt",   emoji: "☄",  difficulty: "Normal", goal: 30, words: ["comet","planet","orbit","nebula","quasar","cosmos","gravity","stellar","photon","plasma"] },
    { id: 3, name: "Nebula Drift",    emoji: "🪐", difficulty: "Hard",   goal: 40, words: ["andromeda","supernova","blackhole","hyperdrive","wormhole","starlight","interstellar","exoplanet","luminosity","singularity"] },
    { id: 4, name: "Galaxy Sentinel", emoji: "👾", difficulty: "Boss",   goal: 50, words: ["voidwalker","starforge","cosmichunter","nebulasong","quantumleap","eventhorizon","ironstation","photonblade","stardrive","celestial"] },
  ],
};

type Status = "locked" | "available" | "complete";

export function AdventureMap() {
  const { world } = useWorld();
  const { state, dispatch } = useGame();
  const stages = STAGES_BY_WORLD[world] ?? STAGES_BY_WORLD.cafe;
  const completed = state.adventures[world] ?? [];
  const [active, setActive] = useState<Stage | null>(null);

  const statusOf = (s: Stage, idx: number): Status => {
    if (completed.includes(s.id)) return "complete";
    if (idx === 0) return "available";
    return completed.includes(stages[idx - 1].id) ? "available" : "locked";
  };

  return (
    <div className="pixel-card p-5 sm:p-6 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="text-3xl leading-none">Adventure</h2>
          <p className="font-pixel text-[0.65rem] text-muted-foreground mt-1">
            Travel the map. Each stage unlocks the next.
          </p>
        </div>
        <div className="pixel-chip">
          🗺 {completed.length} / {stages.length} cleared
        </div>
      </div>

      <div className="relative">
        {/* dashed path */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <path
            d="M 8 75 Q 30 20, 50 50 T 92 30"
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="0.6"
            strokeDasharray="2 2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative py-4">
          {stages.map((s, i) => {
            const st = statusOf(s, i);
            return (
              <StageNode
                key={s.id}
                stage={s}
                index={i}
                status={st}
                onPlay={() => st !== "locked" && setActive(s)}
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
            dispatch({ type: "COMPLETE_STAGE", world, stageId: active.id });
            dispatch({ type: "ADD_XP", amount: active.goal * 3 });
            dispatch({ type: "EARN_COINS", amount: active.goal });
          }}
        />
      )}
    </div>
  );
}

function StageNode({
  stage, index, status, onPlay,
}: { stage: Stage; index: number; status: Status; onPlay: () => void }) {
  const offset = index % 2 === 0 ? "sm:mt-8" : "sm:mb-8";
  const accent =
    stage.difficulty === "Boss" ? "var(--color-primary)" :
    stage.difficulty === "Hard" ? "var(--coin)" :
    stage.difficulty === "Normal" ? "var(--leaf)" : "var(--sky)";

  return (
    <button
      onClick={onPlay}
      disabled={status === "locked"}
      className={`pixel-card-sm p-3 text-center flex flex-col items-center gap-1.5 transition-transform ${offset}`}
      style={{
        opacity: status === "locked" ? 0.5 : 1,
        cursor: status === "locked" ? "not-allowed" : "pointer",
        borderTop: `4px solid ${accent}`,
      }}
    >
      <div
        className="grid place-items-center text-2xl"
        style={{
          width: 56, height: 56,
          background: status === "complete"
            ? "color-mix(in oklab, var(--leaf) 35%, var(--color-card))"
            : "var(--color-muted)",
          border: "2px solid var(--color-border)",
          borderRadius: 6,
        }}
      >
        {status === "locked" ? "🔒" : status === "complete" ? "✓" : stage.emoji}
      </div>
      <div className="font-pixel text-[0.65rem] leading-tight">{stage.name}</div>
      <div className="font-pixel text-[0.55rem] text-muted-foreground uppercase">
        {stage.difficulty} · {stage.goal} wpm
      </div>
    </button>
  );
}

/* ---------- Stage runner: a focused typing mini-test ---------- */

function StageRunner({
  stage, world, onClose, onWin,
}: { stage: Stage; world: string; onClose: () => void; onWin: () => void }) {
  const target = useMemo(() => stage.words.join(" "), [stage]);
  const [typed, setTyped] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [done, setDone] = useState<null | "win" | "lose">(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => {
    if (!startedAt || done) return;
    const t = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(t);
  }, [startedAt, done]);

  const elapsed = startedAt ? (now - startedAt) / 1000 : 0;
  const wpm = Math.round((correct / 5) / Math.max(elapsed / 60, 1 / 60));
  const acc = correct + wrong === 0 ? 100 : Math.round((correct / (correct + wrong)) * 100);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (done) return;
    const next = e.target.value;
    if (!startedAt && next.length > 0) { setStartedAt(Date.now()); setNow(Date.now()); }
    if (next.length > typed.length) {
      const ch = next[next.length - 1];
      const expected = target[next.length - 1];
      if (ch === expected) setCorrect((c) => c + 1);
      else setWrong((w) => w + 1);
    }
    setTyped(next.slice(0, target.length));
    if (next.length >= target.length) {
      const finalWpm = Math.round((correct / 5) / Math.max(elapsed / 60, 1 / 60));
      const passed = finalWpm >= stage.goal && acc >= 80;
      setDone(passed ? "win" : "lose");
      if (passed) onWin();
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 grid place-items-center p-4 animate-pixel-pop"
      style={{ background: "color-mix(in oklab, var(--color-background) 80%, transparent)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="pixel-card p-5 sm:p-6 max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{stage.emoji}</span>
            <div>
              <div className="font-display text-2xl leading-none">{stage.name}</div>
              <div className="font-pixel text-[0.6rem] text-muted-foreground mt-1">
                Goal: {stage.goal} WPM · 80%+ accuracy
              </div>
            </div>
          </div>
          <button className="pixel-btn pixel-btn-secondary" onClick={onClose}>✕</button>
        </div>

        <div
          className="font-mono text-xl sm:text-2xl leading-[1.7] tracking-wide scanlines rounded-md p-4 cursor-text"
          style={{ background: "color-mix(in oklab, var(--color-muted) 60%, transparent)" }}
          onClick={() => inputRef.current?.focus()}
        >
          {target.split("").map((ch, i) => {
            const t = typed[i];
            const state = t == null ? "pending" : t === ch ? "correct" : "wrong";
            const isCursor = i === typed.length;
            return (
              <span
                key={i}
                style={{
                  color:
                    state === "correct" ? "var(--color-foreground)" :
                    state === "wrong"   ? "var(--color-destructive)" : "var(--muted-foreground)",
                  background: isCursor
                    ? "color-mix(in oklab, var(--color-primary) 35%, transparent)"
                    : state === "wrong"
                      ? "color-mix(in oklab, var(--color-destructive) 18%, transparent)"
                      : "transparent",
                  borderRadius: 2, padding: "0 1px",
                }}
              >
                {ch === " " ? "\u00A0" : ch}
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
          <MiniStat label="Goal" value={`${stage.goal}`} accent="var(--coin)" />
        </div>

        {done && (
          <div className="mt-5 pixel-card-sm p-4 text-center">
            <div className="flex justify-center mb-2">
              <PixelMascot mood={done === "win" ? "happy" : "oops"} size={64} />
            </div>
            <div className="font-display text-2xl mb-1">
              {done === "win" ? "Stage Cleared!" : "So close — try again!"}
            </div>
            <p className="font-pixel text-[0.65rem] text-muted-foreground mb-3">
              {done === "win"
                ? `+ ${stage.goal * 3} XP · +${stage.goal} 🪙`
                : `Need ${stage.goal} WPM at 80%+ accuracy.`}
            </p>
            <div className="flex gap-2 justify-center">
              <button className="pixel-btn pixel-btn-secondary" onClick={onClose}>Map</button>
              <button
                className="pixel-btn"
                onClick={() => {
                  setTyped(""); setStartedAt(null); setNow(0);
                  setCorrect(0); setWrong(0); setDone(null);
                  setTimeout(() => inputRef.current?.focus(), 0);
                }}
              >
                {done === "win" ? "Replay" : "Retry"}
              </button>
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
