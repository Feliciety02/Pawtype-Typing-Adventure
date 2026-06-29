import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Maximize2, X } from "lucide-react";
import { PixelKeyboard } from "./PixelKeyboard";
import { PixelMascot } from "./PixelMascot";
import { useGame } from "../lib/game/store";
import { saveSession, type KeystrokeEvent } from "../lib/game/stats";
import { Confetti } from "./Confetti";
import { AICoach } from "./AICoach";
import { useWorld, WORLDS, type WorldId } from "./WorldTheme";
import { generateWorldText, generateMascotLine, generateWeakSpotWords } from "../lib/game/textGenerator";

const WORD_BANK = [
  "pixel","cozy","cabin","sakura","forest","coffee","rain","cloud","moss","lantern",
  "harbor","cat","mochi","quest","river","ember","willow","quiet","golden","story",
  "garden","pebble","comet","glow","brave","spark","meadow","cinnamon","velvet","drift",
  "kindle","cottage","linen","amber","clover","biscuit","journey","whisper","feather","silver",
  "bramble","copper","ivory","midnight","gentle","compass","horizon","lullaby","marigold","sprout",
];

function makeWordsFrom(text: string | null): string[] {
  if (!text) return makeWords();
  const words = text.replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean);
  return words.length >= 15 ? words.slice(0, 50) : makeWords();
}

function makeWords(n = 50) {
  const out: string[] = [];
  for (let i = 0; i < n; i++) out.push(WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)]);
  return out;
}

type Mood = "idle" | "happy" | "oops" | "sleep";

const DURATIONS = [15, 30, 60] as const;

const WORLD_ART_URL: Record<WorldId, string> = {
  cafe: "/theme/cozy-cafe.png",
  forest: "/theme/mossy-forest.png",
  ocean: "/theme/tide-pool.png",
  sakura: "/theme/sakura-park.png",
  castle: "/theme/royal-castle.png",
  space: "/theme/stardust.png",
};

export function TypingArena() {
  const { dispatch } = useGame();
  const { world } = useWorld();
  const currentWorld = WORLDS.find((w) => w.id === world)!;
  const worldArtUrl = WORLD_ART_URL[world];
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
  const [resultsOpen, setResultsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [mascotLine, setMascotLine] = useState<string | null>(null);
  const startOffset = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevWorldRef = useRef(world);
  const prevMoodRef = useRef<Mood>(mood);

  const target = useMemo(() => words.join(" "), [words]);
  const wordRanges = useMemo(() => {
    let cursor = 0;
    return words.map((word, index) => {
      const start = cursor;
      const end = start + word.length;
      cursor = end + 1;
      return { word, index, start, end };
    });
  }, [words]);
  const currentWordIndex = useMemo(() => {
    const index = wordRanges.findIndex(({ end }) => typed.length <= end);
    return index === -1 ? wordRanges.length - 1 : index;
  }, [typed.length, wordRanges]);
  const visibleWords = useMemo(() => {
    const start = Math.max(0, currentWordIndex - 3);
    const end = Math.min(words.length, currentWordIndex + 18);
    return wordRanges.slice(start, end);
  }, [currentWordIndex, wordRanges, words.length]);

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
    setResultsOpen(true);
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

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && resultsOpen) {
        setResultsOpen(false);
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [resultsOpen]);

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreenChange);
    onFullscreenChange();
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  // Idle → sleep after a while
  useEffect(() => {
    if (startedAt || finished) return;
    const t = setTimeout(() => setMood("sleep"), 6000);
    return () => clearTimeout(t);
  }, [startedAt, finished, typed]);

  // Generate world-themed text on mount / world change
  useEffect(() => {
    setGeneratedText(null);
    generateWorldText(world).then(setGeneratedText);
  }, [world]);

  // Use generated text once it loads
  useEffect(() => {
    if (generatedText) {
      setWords(makeWordsFrom(generatedText));
    }
  }, [generatedText]);

  // Generate mascot line on mood change
  useEffect(() => {
    if (prevMoodRef.current === mood) return;
    prevMoodRef.current = mood;
    generateMascotLine(mood).then(setMascotLine);
  }, [mood]);

  const mistakeChars = useMemo(() => {
    return [...new Set(keystrokes.filter((k) => !k.correct).map((k) => k.target))];
  }, [keystrokes]);

  const handleWeakSpotDrill = useCallback(() => {
    generateWeakSpotWords([...mistakeChars]).then((result) => {
      if (result) {
        reset(undefined, result);
      }
    });
  }, [mistakeChars]);

  const reset = useCallback((newDuration?: (typeof DURATIONS)[number], customWords?: string[]) => {
    setWords(customWords ?? (generatedText ? makeWordsFrom(generatedText) : makeWords()));
    setTyped("");
    setStartedAt(null);
    setElapsed(0);
    setMistakes(0);
    setCorrectChars(0);
    setFinished(false);
    setResultsOpen(false);
    setCombo(0);
    setBestCombo(0);
    setMood("idle");
    setKeystrokes([]);
    if (newDuration) setDuration(newDuration);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [generatedText]);

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

  const progress = (elapsed / duration) * 100;

  const requestFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(console.warn);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {!isFullscreen && (
        <button
          className="typing-toolbar-btn self-end"
          type="button"
          onClick={requestFullscreen}
          title="Fullscreen"
          aria-label="Enter fullscreen"
        >
          <Maximize2 size={12} />
          Fullscreen
        </button>
      )}

      {/* Main content: typing area + artwork */}
      <div className="practice-stage-grid">
        {/* Typing area */}
        <div
          className="typing-area"
          style={{
            backgroundImage: `linear-gradient(color-mix(in oklab, var(--color-card) 86%, transparent), color-mix(in oklab, var(--color-card) 86%, transparent)), url("${worldArtUrl}")`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
          onClick={() => inputRef.current?.focus()}
        >
          {/* Subtle ambient glow */}
          <div className="ambient-glow absolute inset-0" />

          <div className="typing-toolbar relative z-1">
            <div className="typing-time-pills" aria-label="Typing test duration">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={(e) => {
                    e.stopPropagation();
                    reset(d);
                  }}
                  className={`typing-toolbar-btn ${d === duration ? "active" : ""}`}
                >
                  {d}s
                </button>
              ))}
            </div>
            <div className="typing-toolbar-spacer" />
            <button
              onClick={(e) => { e.stopPropagation(); reset(); }}
              className="typing-toolbar-btn typing-new-btn"
              aria-label="New test"
              title="New test"
            >
              ↻
            </button>
          </div>

          <div className="typing-progress-line relative z-1" aria-hidden="true">
            <div style={{ width: `${progress}%` }} />
          </div>

          <div className="typing-focus-shell relative z-1">
            <div className="typing-text">
              {visibleWords.map(({ word, index, start, end }) => {
                const isCurrent = index === currentWordIndex;
                const isComplete = typed.length > end;
                const isUpcoming = index > currentWordIndex;
                const isPast = index < currentWordIndex;
                const typedWord = typed.slice(start, Math.min(typed.length, end));
                const hasMistake = typedWord
                  .split("")
                  .some((char, charIndex) => char !== word[charIndex]);
                const wordClass = [
                  "typing-word",
                  isCurrent && "word-current",
                  isComplete && !hasMistake && "word-complete",
                  isComplete && hasMistake && "word-complete-wrong",
                  isPast && !isComplete && "word-past",
                  isUpcoming && "word-upcoming",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <span className={wordClass} key={`${index}-${word}`}>
                    {word.split("").map((ch, charIndex) => {
                      const targetIndex = start + charIndex;
                      const typedCh = typed[targetIndex];
                      const charState =
                        typedCh == null
                          ? "pending"
                          : typedCh === ch
                            ? "correct"
                            : "wrong";
                      const isCursor = targetIndex === typed.length;

                      return (
                        <span
                          className={`typing-char char-${charState} ${isCursor ? "char-current" : ""}`}
                          key={`${targetIndex}-${ch}`}
                        >
                          {ch}
                        </span>
                      );
                    })}
                    {isCurrent && typed.length === end && <span className="typing-caret-space" />}
                  </span>
                );
              })}
            </div>
            {!startedAt && !typed && (
              <div className="typing-start-hint font-pixel">Start typing to wake the room</div>
            )}
          </div>

          <div className="typing-session-meta relative z-1">
            <span>{Math.max(0, Math.ceil(duration - elapsed))}s</span>
            <span>{currentWordIndex + 1} / {words.length}</span>
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

        </div>

        {/* Artwork panel */}
        <div
          className="world-art"
          style={{
            backgroundImage: `linear-gradient(color-mix(in oklab, var(--color-card) 16%, transparent), color-mix(in oklab, var(--color-card) 16%, transparent)), url("${worldArtUrl}")`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="world-art-inner">
            <div className="pet-placeholder-square" aria-hidden="true" />
            <span className="font-pixel text-[0.5rem] text-center world-art-label">
              {mascotLine ?? (
                mood === "happy" ? "Nice rhythm!" :
                mood === "oops" ? "Slow down!" :
                mood === "sleep" ? "Start typing!" :
                currentWorld.name
              )}
            </span>
            <button
              className="typing-toolbar-btn text-[0.5rem]"
              type="button"
              title="Pet room coming soon"
              disabled
            >
              Coming soon
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard */}
      <div className="keyboard-dock">
        <PixelKeyboard active={activeKey} />
      </div>

      {finished && resultsOpen && (
        <div className="results-overlay" role="dialog" aria-modal="true" aria-label="Typing results">
          <div className="results-card">
            <button
              className="results-close-btn"
              type="button"
              onClick={() => {
                setResultsOpen(false);
                setTimeout(() => inputRef.current?.focus(), 0);
              }}
              aria-label="Close results"
              title="Close"
            >
              <X size={14} />
            </button>
            <div className="flex justify-center mb-2">
              <PixelMascot mood="happy" size={64} />
            </div>
            {mascotLine && (
              <p className="font-pixel text-[0.55rem] text-muted-foreground text-center mb-3">{mascotLine}</p>
            )}
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
            {mistakeChars.length > 0 && (
              <button className="pixel-btn w-full mt-2" onClick={handleWeakSpotDrill}>
                🎯 Practice: {mistakeChars.join(", ")}
              </button>
            )}
            <button className="pixel-btn w-full" onClick={() => reset()}>
              ↻ Try Again
            </button>
          </div>
        </div>
      )}

      <Confetti active={showConfetti} onFinish={() => setShowConfetti(false)} />
    </div>
  );
}
