import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PixelKeyboard } from "./PixelKeyboard";
import { PixelMascot } from "./PixelMascot";
import { useGame } from "../lib/game/store";

const WORD_BANK = [
  "pixel","cozy","cabin","sakura","forest","coffee","rain","cloud","moss","lantern",
  "harbor","cat","mochi","quest","river","ember","willow","quiet","golden","story",
  "garden","pebble","comet","glow","brave","spark","meadow","cinnamon","velvet","drift",
  "kindle","cottage","linen","amber","clover","biscuit","journey","whisper","feather","silver",
  "bramble","copper","ivory","midnight","gentle","compass","horizon","lullaby","marigold","sprout",
];

function makeWords(n = 40) {
  const out: string[] = [];
  for (let i = 0; i < n; i++) out.push(WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)]);
  return out;
}

type Mood = "idle" | "happy" | "oops" | "sleep";

const DURATIONS = [15, 30, 60] as const;

export function TypingArena() {
  const { dispatch } = useGame();
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
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const sparkId = useRef(0);

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

  // Grant rewards when test finishes
  useEffect(() => {
    if (!finished) return;
    const xp = Math.round(wpm * 1.5);
    const coins = Math.round(wpm / 2);
    dispatch({ type: "EARN_COINS", amount: coins });
    dispatch({ type: "ADD_XP", amount: xp });
    dispatch({ type: "LOG_TYPING_TEST", correctChars, mistakes });
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
    if (newDuration) setDuration(newDuration);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (finished) return;
    const next = e.target.value;
    if (!startedAt && next.length > 0) setStartedAt(Date.now());

    const lastIdx = next.length - 1;
    if (next.length > typed.length) {
      const ch = next[lastIdx];
      setActiveKey(ch);
      const expected = target[lastIdx];
      if (ch === expected) {
        setCorrectChars((c) => c + 1);
        setCombo((c) => {
          const nc = c + 1;
          setBestCombo((b) => Math.max(b, nc));
          if (nc > 0 && nc % 10 === 0) burstSparkles();
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

  const burstSparkles = () => {
    const batch = Array.from({ length: 6 }).map(() => ({
      id: sparkId.current++,
      x: 30 + Math.random() * 40,
      y: 10 + Math.random() * 60,
    }));
    setSparkles((s) => [...s, ...batch]);
    setTimeout(() => setSparkles((s) => s.slice(batch.length)), 800);
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
    <div className="grid lg:grid-cols-[1fr_280px] gap-6">
      <div className="pixel-card p-6 sm:p-8 relative overflow-hidden">
        {/* Top controls */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="pixel-chip">⏱ Time</div>
          <div className="flex gap-1.5">
            {DURATIONS.map((d) => (
              <button
                key={d}
                onClick={() => reset(d)}
                className="pixel-btn pixel-btn-secondary"
                style={
                  d === duration
                    ? { background: "var(--color-primary)", color: "var(--color-primary-foreground)" }
                    : undefined
                }
              >
                {d}s
              </button>
            ))}
          </div>
          <div className="ml-auto pixel-chip" title="Combo">
            🔥 x{combo}
          </div>
          <button onClick={() => reset()} className="pixel-btn pixel-btn-secondary" aria-label="New test">
            ↻ New
          </button>
        </div>

        {/* Timer bar */}
        <div className="pixel-bar mb-6">
          <div
            className="h-full"
            style={{
              width: `${progress}%`,
              background:
                "linear-gradient(90deg, var(--coin), var(--color-primary))",
              transition: "width 100ms linear",
            }}
          />
          <span
            className="absolute inset-0 grid place-items-center font-pixel text-[0.65rem]"
            style={{ color: "var(--color-foreground)" }}
          >
            {Math.ceil(remaining)}s left
          </span>
        </div>

        {/* Words display */}
        <div
          className="relative font-mono text-2xl sm:text-[1.7rem] leading-[1.7] tracking-wide cursor-text scanlines rounded-md p-4"
          style={{ background: "color-mix(in oklab, var(--color-muted) 60%, transparent)" }}
          onClick={() => inputRef.current?.focus()}
        >
          {target.split("").map((ch, i) => {
            const typedCh = typed[i];
            const state =
              typedCh == null ? "pending" : typedCh === ch ? "correct" : "wrong";
            const isCursor = i === typed.length;
            return (
              <span
                key={i}
                style={{
                  color:
                    state === "correct"
                      ? "var(--color-foreground)"
                      : state === "wrong"
                        ? "var(--color-destructive)"
                        : "var(--muted-foreground)",
                  background: isCursor
                    ? "color-mix(in oklab, var(--color-primary) 35%, transparent)"
                    : state === "wrong"
                      ? "color-mix(in oklab, var(--color-destructive) 18%, transparent)"
                      : "transparent",
                  borderRadius: 2,
                  padding: "0 1px",
                }}
              >
                {ch === " " ? "\u00A0" : ch}
              </span>
            );
          })}

          {/* Sparkle particles */}
          {sparkles.map((s) => (
            <span
              key={s.id}
              className="absolute font-pixel text-xs animate-sparkle pointer-events-none"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                color: "var(--coin)",
                textShadow: "1px 1px 0 var(--color-border)",
              }}
            >
              ✦
            </span>
          ))}
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

        {/* Live stats */}
        <div className="grid grid-cols-4 gap-3 mt-6">
          <Stat label="WPM" value={String(wpm)} accent="var(--color-primary)" />
          <Stat label="Acc" value={`${accuracy}%`} accent="var(--leaf)" />
          <Stat label="Combo" value={`${bestCombo}`} accent="var(--coin)" />
          <Stat label="Time" value={`${elapsed.toFixed(0)}s`} accent="var(--sky)" />
        </div>

        {finished && (
          <div
            className="absolute inset-0 grid place-items-center backdrop-blur-sm animate-pixel-pop"
            style={{ background: "color-mix(in oklab, var(--color-background) 80%, transparent)" }}
          >
            <div className="pixel-card p-6 text-center max-w-sm w-full">
              <div className="flex justify-center mb-2">
                <PixelMascot mood="happy" size={72} />
              </div>
              <h2 className="text-3xl mb-2">Quest Complete!</h2>
              <div className="grid grid-cols-3 gap-3 my-4">
                <Stat label="WPM" value={String(wpm)} accent="var(--color-primary)" />
                <Stat label="Acc" value={`${accuracy}%`} accent="var(--leaf)" />
                <Stat label="Combo" value={`${bestCombo}`} accent="var(--coin)" />
              </div>
              <p className="text-sm text-muted-foreground mb-4 font-pixel">
                + {Math.round(wpm * 1.5)} XP &nbsp; + {Math.round(wpm / 2)} 🪙
              </p>
              <button className="pixel-btn w-full" onClick={() => reset()}>
                ↻ Try Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Side: keyboard + mascot */}
      <div className="flex flex-col gap-4">
        <div className="pixel-card p-4 flex flex-col items-center gap-2">
          <span className="font-pixel text-[0.65rem] text-muted-foreground">Whiskers, your buddy</span>
          <PixelMascot mood={mood} size={120} />
          <p className="font-pixel text-[0.65rem] text-center max-w-[200px]" style={{ color: "var(--muted-foreground)" }}>
            {mood === "happy" && "Nice rhythm! Keep going."}
            {mood === "oops" && "Oops — slow down a bit."}
            {mood === "sleep" && "Zzz... start typing to wake me!"}
            {mood === "idle" && "Press any key to begin."}
          </p>
        </div>
        <PixelKeyboard active={activeKey} />
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div
      className="pixel-card-sm p-2.5 text-center"
      style={{ borderLeft: `4px solid ${accent}` }}
    >
      <div className="font-pixel text-[0.6rem] text-muted-foreground uppercase">{label}</div>
      <div className="font-display text-2xl leading-tight" style={{ color: accent }}>
        {value}
      </div>
    </div>
  );
}
