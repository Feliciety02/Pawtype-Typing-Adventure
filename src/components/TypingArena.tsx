import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Maximize2, X } from "lucide-react";
import { PixelKeyboard } from "./PixelKeyboard";
import { PixelMascot } from "./PixelMascot";
import { PixelCloud } from "./PixelCloud";
import { PetRoom } from "./PetRoom";
import { ModalShell, PixelButton, RewardCard, StatCard } from "./modals/ModalShell";
import { PracticeResultsModal } from "./modals/PracticeResultsModal";
import { useGame } from "../lib/game/store";
import { saveSession, type KeystrokeEvent } from "../lib/game/stats";
import { Confetti } from "./Confetti";
import { getCoachFeedback, type CoachInsight } from "../lib/game/coach";
import { useWorld, WORLDS, type WorldId } from "./WorldTheme";
import { generateWorldText, generateMascotLine, generateWeakSpotWords, generateNextWords, sprinklePunctuation } from "../lib/game/textGenerator";
import { pushNotification } from "../lib/game/notifications";

type Props = {
  customWords?: string[];
  customTitle?: string;
  noTimer?: boolean;
  lessonMode?: boolean;
  onFinish?: (wpm: number, accuracy: number) => void;
  onClose?: () => void;
  onNextLesson?: () => void;
  hasNext?: boolean;
  lessonTargetAccuracy?: number;
  lessonDifficulty?: string;
  lessonWordCount?: number;
};

const WORD_BANK = [
  "pixel","cozy","cabin","sakura","forest","coffee","rain","cloud","moss","lantern",
  "harbor","cat","mochi","quest","river","ember","willow","quiet","golden","story",
  "garden","pebble","comet","glow","brave","spark","meadow","cinnamon","velvet","drift",
  "kindle","cottage","linen","amber","clover","biscuit","journey","whisper","feather","silver",
  "bramble","copper","ivory","midnight","gentle","compass","horizon","lullaby","marigold","sprout",
];

function makeWordsFrom(text: string | null): string[] {
  if (!text) return makeWords();
  const words = text.split(/\s+/).filter(Boolean);
  return words.length >= 15 ? sprinklePunctuation(words) : makeWords();
}

function makeWords(n = 80) {
  const out: string[] = [];
  for (let i = 0; i < n; i++) out.push(WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)]);
  return out;
}

type Mood = "idle" | "happy" | "oops" | "sleep";

const DURATIONS = [15, 30, 60] as const;

const WORLD_ART_URL: Partial<Record<WorldId, string>> = {
  cafe: "/theme/cozy-cafe.png",
  forest: "/theme/mossy-forest.png",
  ocean: "/theme/tide-pool.png",
  sakura: "/theme/sakura-park.png",
  castle: "/theme/royal-castle.png",
  space: "/theme/stardust.png",
  autumn: "/theme/cozy-campsite.png",
  mushroom: "/theme/fairy-mushroom-village.png",
  "volcanic-forge": "/theme/volcanic-forge.png",
  sunflower: "/theme/sunflower-meadow.png",
  "desert-oasis": "/theme/desert-oasis.png",
  "steam-punk-workshop": "/theme/steam-punk-workshop.png",
  "frostveil-kingdom": "/theme/frostveil-kingdom.png",
};

export function TypingArena({
  customWords, customTitle, noTimer, lessonMode,
  onFinish, onClose, onNextLesson, hasNext,
  lessonTargetAccuracy, lessonDifficulty, lessonWordCount,
}: Props = {}) {
  const { state, dispatch } = useGame();
  const { world } = useWorld();
  const currentWorld = WORLDS.find((w) => w.id === world)!;
  const worldArtUrl = WORLD_ART_URL[world];
  const [duration] = useState<(typeof DURATIONS)[number]>(30);
  const [words, setWords] = useState<string[]>(() => (customWords && customWords.length ? customWords : []));
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
  const [petRoomOpen, setPetRoomOpen] = useState(false);
  const [coachInsight, setCoachInsight] = useState<CoachInsight | null>(null);
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachError, setCoachError] = useState(false);
  const prevLevelRef = useRef(state.player.level);
  const startOffset = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevWorldRef = useRef(world);
  const prevMoodRef = useRef<Mood>(mood);
  const generatingRef = useRef(false);
  const worldIdRef = useRef(world);

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

  // Timer tick (skipped for untimed lessons)
  useEffect(() => {
    if (noTimer || !startedAt || finished) return;
    const t = setInterval(() => {
      const e = (Date.now() - startedAt) / 1000;
      setElapsed(e);
      if (e >= duration) {
        setFinished(true);
        setMood("happy");
      }
    }, 100);
    return () => clearInterval(t);
  }, [startedAt, duration, finished, noTimer]);

  // Finish when all words are typed in untimed mode
  const typedAllRef = useRef(false);
  useEffect(() => {
    if (!noTimer || finished) return;
    if (target.length > 0 && typed.length >= target.length && !typedAllRef.current) {
      typedAllRef.current = true;
      setElapsed((Date.now() - (startedAt ?? Date.now())) / 1000);
      setFinished(true);
      setMood("happy");
    }
  }, [noTimer, finished, typed, target, startedAt]);

  // Grant rewards & save session when test finishes
  useEffect(() => {
    if (!finished) return;
    setResultsOpen(true);

    if (lessonMode) {
      onFinish?.(wpm, accuracy);
      return;
    }

    const xp = Math.round(wpm * 1.5);
    const coins = Math.round(wpm / 2);
    dispatch({ type: "EARN_COINS", amount: coins });
    dispatch({ type: "ADD_XP", amount: xp });
    dispatch({ type: "ADD_PET_XP", amount: Math.max(1, Math.round(correctChars / 10)) });
    dispatch({ type: "LOG_TYPING_TEST", correctChars, mistakes });

    if (accuracy === 100) setShowConfetti(true);

    pushNotification({
      emoji: accuracy === 100 ? "✨" : "🎯",
      title: customTitle ? `Lesson · ${customTitle}` : "Test complete",
      body: `${wpm} WPM · ${accuracy}% acc · +${xp} XP · +${coins}🪙`,
    });

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

  // Notify on level up
  useEffect(() => {
    if (state.player.level > prevLevelRef.current) {
      pushNotification({
        emoji: "⬆",
        title: `Level ${state.player.level}!`,
        body: "You leveled up. Keep that rhythm going.",
      });
      prevLevelRef.current = state.player.level;
    }
  }, [state.player.level]);

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

  // Keep world ref in sync for continuous generation
  useEffect(() => {
    worldIdRef.current = world;
  }, [world]);

  // Reset typed-all ref on reset
  useEffect(() => {
    typedAllRef.current = false;
  }, [words]);

  // Generate initial words on mount / world change (skipped for lessons)
  useEffect(() => {
    if (customWords && customWords.length) return;
    setGeneratedText(null);
    generateWorldText(world).then((text) => {
      setGeneratedText(text);
      if (text) {
        const initial = text.replace(/[^\w\s'-]/g, "").split(/\s+/).filter(Boolean);
        if (initial.length >= 10) setWords(initial);
      }
    });
  }, [world, customWords]);

  // Generate mascot line on mood change with session context
  const mascotCtxRef = useRef({ combo: 0, bestCombo: 0, mistakes: 0, correctChars: 0, weakChars: new Set<string>() });
  const updateMascotCtx = useCallback(() => {
    mascotCtxRef.current = { combo, bestCombo, mistakes, correctChars, weakChars: new Set(keystrokes.filter((k) => !k.correct).map((k) => k.target)) };
  }, [combo, bestCombo, mistakes, correctChars, keystrokes]);
  useEffect(() => {
    updateMascotCtx();
  }, [updateMascotCtx]);
  useEffect(() => {
    if (prevMoodRef.current === mood) return;
    prevMoodRef.current = mood;
    const ctx = mascotCtxRef.current;
    generateMascotLine(mood, {
      combo: ctx.combo,
      bestCombo: ctx.bestCombo,
      mistakes: ctx.mistakes,
      correctChars: ctx.correctChars,
      weakChars: [...ctx.weakChars],
    }).then(setMascotLine);
    }, [mood]);

  // Fetch coach feedback when race finishes
  useEffect(() => {
    if (!finished) {
      setCoachInsight(null);
      setCoachLoading(false);
      setCoachError(false);
      return;
    }
    setCoachLoading(true);
    const isPersonalBest = wpm > 0 && wpm > parseInt(localStorage.getItem("pawtype-best-wpm") ?? "0");
    const isPerfect = accuracy === 100;
    if (isPersonalBest && wpm > 0) {
      try { localStorage.setItem("pawtype-best-wpm", String(wpm)); } catch {}
    }
    getCoachFeedback({ wpm, accuracy, duration: elapsed, correctChars, mistakes, bestCombo, keystrokes: keystrokes.map((k) => ({ correct: k.correct, target: k.target })), isPersonalBest, isPerfect })
      .then(setCoachInsight)
      .catch(() => setCoachError(true))
      .finally(() => setCoachLoading(false));
  }, [finished]);

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

  const reset = useCallback((_newDuration?: (typeof DURATIONS)[number], drillWords?: string[]) => {
    const base = drillWords
      ?? (customWords && customWords.length ? customWords : (generatedText ? makeWordsFrom(generatedText) : makeWords()));
    setWords(base);
    setTyped("");
    setStartedAt(null);
    setElapsed(0);
    setMistakes(0);
    setCorrectChars(0);
    setFinished(false);
    setResultsOpen(false);
    setCoachInsight(null);
    setCoachLoading(false);
    setCoachError(false);
    setCombo(0);
    setBestCombo(0);
    setMood("idle");
    setKeystrokes([]);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [generatedText, customWords]);

  const loadMoreWords = useCallback(async () => {
    if (generatingRef.current) return;
    generatingRef.current = true;
    const id = worldIdRef.current;
    const batch = await generateNextWords(id, 30).catch(() => null);
    if (batch && batch.length > 0) {
      setWords((prev) => [...prev, ...batch]);
    }
    generatingRef.current = false;
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
    setTyped(next);
    // Load more words when nearing the end (never in untimed lessons)
    if (!noTimer && currentWordIndex >= words.length - 10 && !generatingRef.current) {
      loadMoreWords();
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

  const xp = useMemo(() => Math.round(wpm * 1.5), [wpm]);
  const coins = useMemo(() => Math.round(wpm / 2), [wpm]);

  const perfMessage = useMemo(() => {
    if (accuracy === 100) return "⭐ Flawless victory!";
    if (accuracy >= 95) return "✨ Incredible precision!";
    if (accuracy >= 90) return "🌟 Great focus today!";
    if (accuracy >= 80) return "👍 Solid effort!";
    if (accuracy >= 70) return "💪 Keep it up!";
    return "🌱 Room to grow!";
  }, [accuracy]);

  type Particle = { id: number; x: number; delay: number; size: number; shape: "star" | "dot"; color: string };
  const particles = useMemo<Particle[]>(() => {
    if (!finished) return [];
    const COLORS = ["var(--coin)", "var(--sakura)", "var(--leaf)", "var(--sky)", "var(--color-primary)"];
    return Array.from({ length: 14 }, (_, i) => ({
      id: i,
      x: 5 + Math.random() * 90,
      delay: Math.random() * 1.8,
      size: 4 + Math.random() * 7,
      shape: Math.random() < 0.4 ? "star" as const : "dot" as const,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
  }, [finished]);

  const progress = noTimer
    ? (target.length > 0 ? (typed.length / target.length) * 100 : 0)
    : (elapsed / duration) * 100;

  const requestFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(console.warn);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {!isFullscreen && !lessonMode && (
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
      {lessonMode ? (
        /* --- Lesson full-screen typing --- */
        <div className="flex flex-col" style={{ height: "100dvh" }}>
          {/* Top bar: stats + close */}
          <div className="flex items-center justify-between px-4 py-2 shrink-0">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="font-pixel text-[0.45rem] text-muted-foreground">WPM</div>
                <div className="font-pixel text-sm">{wpm}</div>
              </div>
              <div className="text-center">
                <div className="font-pixel text-[0.45rem] text-muted-foreground">Acc</div>
                <div className="font-pixel text-sm" style={{ color: "var(--leaf)" }}>{accuracy}%</div>
              </div>
              <div className="text-center">
                <div className="font-pixel text-[0.45rem] text-muted-foreground">Combo</div>
                <div className="font-pixel text-sm" style={{ color: "var(--coin)" }}>{bestCombo}</div>
              </div>
            </div>
            <button
              className="pixel-btn pixel-btn-secondary p-1.5"
              onClick={() => onClose?.()}
              aria-label="Close lesson"
              title="Exit lesson"
            >
              <X size={14} />
            </button>
          </div>

          {/* Progress bar */}
          <div className="mx-4 mb-2 shrink-0" style={{ height: 4, background: "var(--color-muted)", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ width: `${progress}%`, height: "100%", background: `oklch(from var(--leaf) l c h / 0.8)`, borderRadius: 999, transition: "width 0.15s" }} />
          </div>

          {/* Word count */}
          <div className="px-4 mb-1 shrink-0">
            <span className="font-pixel text-[0.5rem] text-muted-foreground">
              {currentWordIndex + 1} / {words.length} words
            </span>
          </div>

          {/* Typing text */}
          <div className="flex-1 flex items-center justify-center px-4 min-h-0" onClick={() => inputRef.current?.focus()}>
            <div className="typing-focus-shell w-full max-w-3xl" style={{ border: "none", background: "transparent", boxShadow: "none", padding: 0 }}>
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
                <div className="typing-start-hint font-pixel" style={{ marginTop: "1rem" }}>Start typing to begin the lesson</div>
              )}
            </div>
          </div>

          {/* Keyboard */}
          <div className="shrink-0 px-2 pb-2">
            <PixelKeyboard active={activeKey} />
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
      ) : (
        <>
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
            {!noTimer && (
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
            )}
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
            {noTimer ? (
              <span>{currentWordIndex + 1} / {words.length} words</span>
            ) : (
              <span>{Math.max(0, Math.ceil(duration - elapsed))}s</span>
            )}
            {!noTimer && <span>{currentWordIndex + 1} words</span>}
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
            position: "relative",
            overflow: "hidden",
          }}
        >
          <PixelCloud count={3} />
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
              title="Open pet room"
              onClick={() => setPetRoomOpen(true)}
            >
              🏡 Pet Room
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard */}
      <div className="keyboard-dock">
        <PixelKeyboard active={activeKey} />
      </div>
      </>
      )}

      {finished && resultsOpen && (
        lessonMode ? (
          <ModalShell
            ariaLabel="Lesson results"
            onClose={() => setResultsOpen(false)}
            className="pixel-modal-shell-lesson"
            frameClassName="pixel-modal-frame-lesson"
          >
            <div className="lesson-results-layout">
              {(() => {
                const stars = (() => {
                  if (lessonTargetAccuracy == null) return 1;
                  if (accuracy >= Math.min(lessonTargetAccuracy + 5, 100)) return 3;
                  if (accuracy >= lessonTargetAccuracy) return 2;
                  return 1;
                })();
                return (
                  <div className="lesson-results-stars">
                    {[1, 2, 3].map((star) => (
                      <span
                        key={star}
                        className={star <= stars ? "is-filled" : ""}
                      >
                        <img src="/Icons/star.png" alt="" className="pixel-icon" />
                      </span>
                    ))}
                  </div>
                );
              })()}

              <div className="lesson-results-title">Lesson Complete!</div>

              <div className="lesson-results-stats">
                <StatCard icon={<img src="/Icons/nav/practice.png" alt="" className="pixel-stat-art" />} label="WPM" value={String(wpm)} />
                <StatCard icon={<img src="/Icons/dart.png" alt="" className="pixel-stat-art" />} label="Accuracy" value={`${accuracy}%`} valueClassName="is-sky" />
                <StatCard icon={<img src="/Icons/flame.png" alt="" className="pixel-stat-art" />} label="Combo" value={String(bestCombo)} valueClassName="is-gold" />
              </div>

              {(() => {
                const rewards = lessonDifficulty && lessonWordCount
                  ? (() => {
                      const base: Record<string, number> = {
                        beginner: 25,
                        easy: 50,
                        intermediate: 75,
                        advanced: 100,
                        expert: 150,
                        master: 200,
                      };
                      const rewardXp = (base[lessonDifficulty] ?? 50) + Math.floor(lessonWordCount / 5);
                      const rewardCoins = Math.round(rewardXp / 2);
                      const rewardPetExp = Math.max(1, Math.floor(lessonWordCount / 10));
                      return { rewardXp, rewardCoins, rewardPetExp };
                    })()
                  : null;

                if (!rewards) return null;

                return (
                  <div className="lesson-results-bonus">
                    <RewardCard xp={rewards.rewardXp} coins={rewards.rewardCoins} />
                    <div className="lesson-results-pet-exp">
                      <span>Pet EXP</span>
                      <strong>+{rewards.rewardPetExp}</strong>
                    </div>
                  </div>
                );
              })()}

              <div className="lesson-results-tip">
                {coachLoading
                  ? "Analyzing your run..."
                  : coachError
                    ? "Keep typing and I’ll have feedback ready!"
                    : coachInsight?.text ?? "Great work out there!"}
              </div>

              <div className="lesson-results-actions">
                <PixelButton variant="secondary" onClick={() => reset()} icon={<span>↻</span>}>
                  Retry
                </PixelButton>
                {hasNext ? (
                  <PixelButton variant="primary" onClick={() => onNextLesson?.()} icon={<span>▶</span>}>
                    Next Lesson
                  </PixelButton>
                ) : (
                  <PixelButton variant="primary" onClick={() => onClose?.()} icon={<span>↩</span>}>
                    Back to Lessons
                  </PixelButton>
                )}
              </div>
            </div>
          </ModalShell>
        ) : (
          <PracticeResultsModal
            accuracy={accuracy}
            bestCombo={bestCombo}
            elapsedSeconds={elapsed}
            xp={xp}
            coins={coins}
            feedbackMessage={mascotLine ?? perfMessage}
            coachTip={
              coachLoading
                ? "Analyzing your run..."
                : coachError
                  ? "Keep typing and I'll have feedback ready!"
                  : coachInsight?.text ?? "Great work out there!"
            }
            practicedKeys={mistakeChars}
            onContinue={() => {
              if (mistakeChars.length > 0) {
                handleWeakSpotDrill();
                return;
              }
              reset();
            }}
            onRetry={() => reset()}
            onClose={() => setResultsOpen(false)}
          />
        )
      )}

      <Confetti active={showConfetti} onFinish={() => setShowConfetti(false)} />
      {petRoomOpen && <PetRoom onClose={() => setPetRoomOpen(false)} />}
    </div>
  );
}
