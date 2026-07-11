import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useGame } from "@/lib/game/store";
import type { KeystrokeEvent } from "@/lib/game/types";
import { getCoachFeedback, type CoachInsight } from "@/lib/game/coach";
import { useWorld, WORLDS } from "@/components/shared/WorldTheme";
import {
  generateWorldText,
  generateMascotLine,
  generateWeakSpotWords,
  generateNextWords,
} from "@/lib/game/textGenerator";
import { pushNotification } from "@/lib/game/notifications";
import { DURATIONS, makeWords, makeWordsFrom, type Mood } from "@/lib/game/typing-arena-data";
import { THEME_BACKGROUND } from "@/lib/game/themeAssets";

export type TypingEngineProps = {
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

export function useTypingEngine({
  customWords,
  customTitle,
  noTimer,
  lessonMode,
  onFinish,
  onClose: _onClose,
  onNextLesson,
  hasNext: _hasNext,
  lessonTargetAccuracy: _lessonTargetAccuracy,
  lessonDifficulty: _lessonDifficulty,
  lessonWordCount: _lessonWordCount,
}: TypingEngineProps = {}) {
  const { state, dispatch } = useGame();
  const { world } = useWorld();
  const currentWorld = WORLDS.find((w) => w.id === world)!;
  const worldArtUrl = THEME_BACKGROUND[world];

  const [duration, setDuration] = useState<(typeof DURATIONS)[number]>(30);
  const [words, setWords] = useState<string[]>(() =>
    customWords && customWords.length ? customWords : [],
  );
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
  const mascotCtxRef = useRef({
    combo: 0,
    bestCombo: 0,
    mistakes: 0,
    correctChars: 0,
    weakChars: new Set<string>(),
  });
  const typedAllRef = useRef(false);

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

  const mistakeChars = useMemo(() => {
    return [...new Set(keystrokes.filter((k) => !k.correct).map((k) => k.target))];
  }, [keystrokes]);

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

    const xpReward = Math.round(wpm * 1.5);
    const coinReward = Math.round(wpm / 2);
    dispatch({ type: "EARN_COINS", amount: coinReward });
    dispatch({ type: "ADD_XP", amount: xpReward });
    dispatch({ type: "ADD_PET_XP", amount: Math.max(1, Math.round(correctChars / 10)) });
    dispatch({ type: "LOG_TYPING_TEST", correctChars, mistakes });

    if (accuracy === 100) setShowConfetti(true);

    pushNotification({
      emoji: accuracy === 100 ? "🏆" : "📝",
      title: customTitle ? `Lesson x ${customTitle}` : "Test complete",
      body: `${wpm} WPM x ${accuracy}% acc x +${xpReward} XP x +${coinReward} 🪙`,
    });

    dispatch({
      type: "LOG_TYPING_SESSION",
      session: {
        timestamp: Date.now(),
        duration: elapsed,
        wpm,
        accuracy,
        correctChars,
        mistakes,
        bestCombo,
        keystrokes,
      },
    });
  }, [finished]);

  // Notify on level up
  useEffect(() => {
    if (state.player.level > prevLevelRef.current) {
      pushNotification({
        emoji: "?",
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
        const initial = text
          .replace(/[^\w\s'-]/g, "")
          .split(/\s+/)
          .filter(Boolean);
        if (initial.length >= 10) setWords(initial);
      }
    });
  }, [world, customWords]);

  // Generate mascot line on mood change with session context
  const updateMascotCtx = useCallback(() => {
    mascotCtxRef.current = {
      combo,
      bestCombo,
      mistakes,
      correctChars,
      weakChars: new Set(keystrokes.filter((k) => !k.correct).map((k) => k.target)),
    };
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
    const isPersonalBest =
      wpm > 0 && wpm > parseInt(localStorage.getItem("pawtype-best-wpm") ?? "0");
    const isPerfect = accuracy === 100;
    if (isPersonalBest && wpm > 0) {
      try {
        localStorage.setItem("pawtype-best-wpm", String(wpm));
      } catch {
        /* ignore */
      }
    }
    getCoachFeedback(
      {
        wpm,
        accuracy,
        duration: elapsed,
        correctChars,
        mistakes,
        bestCombo,
        keystrokes: keystrokes.map((k) => ({ correct: k.correct, target: k.target })),
        isPersonalBest,
        isPerfect,
      },
      state.sessions,
    )
      .then(setCoachInsight)
      .catch(() => setCoachError(true))
      .finally(() => setCoachLoading(false));
  }, [finished, state.sessions]);

  const handleWeakSpotDrill = useCallback(() => {
    generateWeakSpotWords([...mistakeChars]).then((result) => {
      if (result) {
        reset(undefined, result);
      }
    });
  }, [mistakeChars]);

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

  const reset = useCallback(
    (newDuration?: (typeof DURATIONS)[number], drillWords?: string[]) => {
      if (newDuration) setDuration(newDuration);
      const base =
        drillWords ??
        (customWords && customWords.length
          ? customWords
          : generatedText
            ? makeWordsFrom(generatedText)
            : makeWords());
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
    },
    [generatedText, customWords],
  );

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

  const progress = noTimer
    ? target.length > 0
      ? (typed.length / target.length) * 100
      : 0
    : (elapsed / duration) * 100;

  const perfMessage = useMemo(() => {
    if (accuracy === 100) return "🏆 Flawless victory!";
    if (accuracy >= 95) return "⭐ Incredible precision!";
    if (accuracy >= 90) return "👍 Great focus today!";
    if (accuracy >= 80) return "💪 Solid effort!";
    if (accuracy >= 70) return "🌱 Keep it up!";
    return "📈 Room to grow!";
  }, [accuracy]);

  type Particle = {
    id: number;
    x: number;
    delay: number;
    size: number;
    shape: "star" | "dot";
    color: string;
  };
  const particles = useMemo<Particle[]>(() => {
    if (!finished) return [];
    const COLORS = [
      "var(--coin)",
      "var(--sakura)",
      "var(--leaf)",
      "var(--sky)",
      "var(--color-primary)",
    ];
    return Array.from({ length: 14 }, (_, i) => ({
      id: i,
      x: 5 + Math.random() * 90,
      delay: Math.random() * 1.8,
      size: 4 + Math.random() * 7,
      shape: Math.random() < 0.4 ? ("star" as const) : ("dot" as const),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
  }, [finished]);

  return {
    state,
    dispatch,
    world,
    currentWorld,
    worldArtUrl,
    words,
    typed,
    startedAt,
    elapsed,
    mistakes,
    correctChars,
    mood,
    activeKey,
    finished,
    combo,
    bestCombo,
    keystrokes,
    showConfetti,
    resultsOpen,
    mascotLine,
    petRoomOpen,
    coachInsight,
    coachLoading,
    coachError,
    duration,
    target,
    wordRanges,
    currentWordIndex,
    visibleWords,
    wpm,
    accuracy,
    xp,
    coins,
    mistakeChars,
    progress,
    perfMessage,
    particles,
    inputRef,
    setDuration,
    setMood,
    setShowConfetti,
    setResultsOpen,
    setPetRoomOpen,
    setCoachInsight,
    setCoachLoading,
    setCoachError,
    handleChange,
    handleWeakSpotDrill,
    reset,
    loadMoreWords,
  };
}
