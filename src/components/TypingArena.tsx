import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PixelKeyboard } from "./PixelKeyboard";
import { PixelMascot } from "./PixelMascot";
import { PixelPet } from "./PixelPet";
import { useGame } from "../lib/game/store";
import { saveSession, type KeystrokeEvent } from "../lib/game/stats";
import { Confetti } from "./Confetti";
import { AICoach } from "./AICoach";
import { useWorld, WORLDS } from "./WorldTheme";

const WORD_BANK = [
  "pixel","cozy","cabin","sakura","forest","coffee","rain","cloud","moss","lantern",
  "harbor","cat","mochi","quest","river","ember","willow","quiet","golden","story",
  "garden","pebble","comet","glow","brave","spark","meadow","cinnamon","velvet","drift",
  "kindle","cottage","linen","amber","clover","biscuit","journey","whisper","feather","silver",
  "bramble","copper","ivory","midnight","gentle","compass","horizon","lullaby","marigold","sprout",
];

function makeWords(n = 50) {
  const out: string[] = [];
  for (let i = 0; i < n; i++) out.push(WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)]);
  return out;
}

type Mood = "idle" | "happy" | "oops" | "sleep";

const DURATIONS = [15, 30, 60] as const;

export function TypingArena() {
  const { state, dispatch } = useGame();
  const { world } = useWorld();
  const currentWorld = WORLDS.find((w) => w.id === world)!;
  const activePet = state.inventory.activePet
    ? state.inventory.pets.find((p) => p.type === state.inventory.activePet)
    : null;
  const [duration, setDuration] = useState<(typeof DURATIONS)[number]>(30);
  const [words, setWords] = useState<string[]>(() => makeWords());
  const [typed, setTyped] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [mood, setMood] = useState<Mood>("idle");
  const [activeKey, setActiveKey] = useState<string>();
  const [finished, setFinished] = useState(false);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [keystrokes, setKeystrokes] = useState<KeystrokeEvent[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const startOffset = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const target = useMemo(() => words.join(" "), [words]);

  // Timer tick
  useEffect(() => {
    if (!startedAt || finished) return;
    const t = setInterval(() => {
      const e = (Date.now() - startedAt) / 1000;
      setElapsed(e);
      if (e >= duration) {
        setFinished(true);
        setMood("happy");
      }
    }, 100);
    return () => clearInterval(t);
  }, [startedAt, duration, finished]);

  // Grant rewards & save session when test finishes
  useEffect(() => {
    if (!finished) return;
    const xp = Math.round(wpm * 1.5);
    const coins = Math.round(wpm / 2);
    dispatch({ type: "EARN_COINS", amount: coins });
    dispatch({ type: "ADD_XP", amount: xp });
    dispatch({ type: "ADD_PET_XP", amount: Math.max(1, Math.round(correctChars / 10)) });
    dispatch({ type: "LOG_TYPING_TEST", correctChars, mistakes });

    if (accuracy === 100) setShowConfetti(true);

    saveSession({
      timestamp: Date.now(),
      duration: elapsed,
      wpm,
      accuracy,
      correctChars,
      mistakes,
      bestCombo,
      keystrokes,
    }).catch(console.warn);
  }, [finished]);

  // Idle → sleep after a while
  useEffect(() => {
    if (startedAt || finished) return;
    const t = setTimeout(() => setMood("sleep"), 6000);
    return () => clearTimeout(t);
  }, [startedAt, finished, typed]);

  const reset = useCallback((newDuration?: (typeof DURATIONS)[number]) => {
    setWords(makeWords());
    setTyped("");
    setStartedAt(null);
    setElapsed(0);
    setMistakes(0);
    setCorrectChars(0);
    setFinished(false);
    setCombo(0);
    setBestCombo(0);
    setMood("idle");
    setKeystrokes([]);
    if (newDuration) setDuration(newDuration);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (finished) return;
    const next = e.target.value;
    if (!startedAt && next.length > 0) {
      setStartedAt(Date.now());
      startOffset.current = Date.now();
    }

    const lastIdx = next.length - 1;
    if (next.length > typed.length) {
      const ch = next[lastIdx];
      setActiveKey(ch);
      const expected = target[lastIdx];
      const isCorrect = ch === expected;
      setKeystrokes((prev) => [
        ...prev,
        {
          charIndex: lastIdx,
          char: ch,
          target: expected,
          correct: isCorrect,
          timestamp: Date.now() - startOffset.current,
        },
      ]);
      if (isCorrect) {
        setCorrectChars((c) => c + 1);
        setCombo((c) => {
          const nc = c + 1;
          setBestCombo((b) => Math.max(b, nc));
          return nc;
        });
        setMood("happy");
      } else {
        setMistakes((m) => m + 1);
        setCombo(0);
        setMood("oops");
      }
    }
    setTyped(next.slice(0, target.length));
    if (next.length >= target.length) {
      setFinished(true);
      setMood("happy");
    }
  };

  const wpm = useMemo(() => {
    const minutes = Math.max(elapsed, 1) / 60;
    return Math.round(correctChars / 5 / Math.max(minutes, 1 / 60));
  }, [correctChars, elapsed]);

  const accuracy = useMemo(() => {
    const total = correctChars + mistakes;
    if (!total) return 100;
    return Math.round((correctChars / total) * 100);
  }, [correctChars, mistakes]);

  const remaining = Math.max(0, duration - elapsed);
  const progress = (elapsed / duration) * 100;

  return (
    <div className="flex flex-col gap-4">
      {/* World title bar */}
      <div className="flex items-center gap-2 px-1">
        <span className="text-xl">{currentWorld.emoji}</span>
        <span className="font-display text-xl">{currentWorld.name}</span>
        <span className="font-pixel text-[0.55rem] text-muted-foreground ml-1">{currentWorld.blurb}</span>
      </div>

      {/* Main content: typing area + artwork */}
      <div className="grid lg:grid-cols-[1fr_220px] gap-4">
        {/* Typing area */}
        <div className="typing-area" onClick={() => inputRef.current?.focus()}>
          {/* Subtle ambient glow */}
          <div className="ambient-glow absolute inset-0" />

          {/* Minimal top controls */}
          <div className="typing-toolbar relative z-1">
            {DURATIONS.map((d) => (
              <button
                key={d}
                onClick={(e) => { e.stopPropagation(); reset(d); }}
                className={`typing-toolbar-btn ${d === duration ? "active" : ""}`}
              >
                {d}s
              </button>
            ))}
            <div className="typing-toolbar-spacer" />
            <button
              onClick={(e) => { e.stopPropagation(); reset(); }}
              className="typing-toolbar-btn"
              aria-label="New test"
            >
              ↻ New
            </button>
          </div>

          {/* Thin progress bar */}
          <div className="relative z-1" style={{ height: 3, background: "var(--color-muted)", borderRadius: 2, marginBottom: "1.5rem", overflow: "hidden" }}>
            <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, var(--color-primary), var(--accent))", transition: "width 0.1s linear", borderRadius: 2 }} />
          </div>

          {/* Typing text — large, spacious */}
          <div className="typing-text relative z-1">
            {target.split("").map((ch, i) => {
              const typedCh = typed[i];
              const state = typedCh == null ? "pending" : typedCh === ch ? "correct" : "wrong";
              const isCurrent = i === typed.length;
              let cls = "char-" + state;
              if (isCurrent) cls += " char-current";
              return (
                <span key={i} className={cls}>
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
            aria-label="Type the text above"
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            className="absolute opacity-0 pointer-events-none"
          />

          {/* Results screen */}
          {finished && (
            <div className="results-overlay">
              <div className="results-card">
                <div className="flex justify-center mb-3">
                  <PixelMascot mood="happy" size={64} />
                </div>
                <div className="results-title">Quest Complete!</div>
                <div className="results-stats">
                  <div className="results-stat">
                    <div className="results-stat-label">WPM</div>
                    <div className="results-stat-value" style={{ color: "var(--color-primary)" }}>{wpm}</div>
                  </div>
                  <div className="results-stat">
                    <div className="results-stat-label">Accuracy</div>
                    <div className="results-stat-value" style={{ color: "var(--leaf)" }}>{accuracy}%</div>
                  </div>
                  <div className="results-stat">
                    <div className="results-stat-label">Best Combo</div>
                    <div className="results-stat-value" style={{ color: "var(--coin)" }}>{bestCombo}</div>
                  </div>
                  <div className="results-stat">
                    <div className="results-stat-label">Time</div>
                    <div className="results-stat-value" style={{ color: "var(--sky)" }}>{elapsed.toFixed(0)}s</div>
                  </div>
                  <div className="results-stat">
                    <div className="results-stat-label">Correct</div>
                    <div className="results-stat-value" style={{ color: "var(--leaf)" }}>{correctChars}</div>
                  </div>
                  <div className="results-stat">
                    <div className="results-stat-label">Mistakes</div>
                    <div className="results-stat-value" style={{ color: "var(--color-destructive)" }}>{mistakes}</div>
                  </div>
                </div>
                <div className="results-rewards">
                  +{Math.round(wpm * 1.5)} XP &nbsp; +{Math.round(wpm / 2)} 🪙
                </div>
                <div className="mb-4 text-left">
                  <AICoach
                    wpm={wpm}
                    accuracy={accuracy}
                    duration={elapsed}
                    correctChars={correctChars}
                    mistakes={mistakes}
                    bestCombo={bestCombo}
                    keystrokes={keystrokes.map((k) => ({ correct: k.correct, target: k.target }))}
                  />
                </div>
                <button className="pixel-btn w-full" onClick={() => reset()}>
                  ↻ Try Again
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Artwork panel */}
        <div className="world-art">
          <div className="world-art-inner">
            {activePet ? (
              <>
                <PixelPet pet={activePet} size={100} showDetails={false} />
                <span className="font-pixel text-[0.55rem] text-muted-foreground text-center">
                  {mood === "happy" && "✦ Great typing!"}
                  {mood === "oops" && "✧ Stay calm!"}
                  {mood === "sleep" && "Zzz..."}
                  {mood === "idle" && `${currentWorld.emoji} ${currentWorld.name}`}
                </span>
              </>
            ) : (
              <>
                <PixelMascot mood={mood} size={100} />
                <span className="font-pixel text-[0.5rem] text-muted-foreground text-center">
                  {mood === "happy" && "Nice rhythm!"}
                  {mood === "oops" && "Slow down!"}
                  {mood === "sleep" && "Start typing!"}
                  {mood === "idle" && `${currentWorld.emoji} ${currentWorld.name}`}
                </span>
                <button className="typing-toolbar-btn text-[0.5rem]">Adopt a pet!</button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Keyboard */}
      <div className="pixel-card p-3">
        <PixelKeyboard active={activeKey} />
      </div>

      <Confetti active={showConfetti} onFinish={() => setShowConfetti(false)} />
    </div>
  );
}
