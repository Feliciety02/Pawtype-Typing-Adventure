import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { WORLDS, type WorldId } from "../shared/WorldTheme";
import { useGame } from "../../lib/game/store";
import { generateAdventureWords, generateQuestText } from "../../lib/game/textGenerator";
import { ModalShell, PixelButton } from "../modals/ModalShell";
import { CelebrationOverlay } from "./CelebrationOverlay";
import { QuestResultsModal } from "./QuestResultsModal";
import {
  expandWords,
  bossEmojis,
  rewardsFor,
  DIFFICULTY_TIME_LIMITS,
  type Stage,
} from "@/lib/adventure/adventureData";
import { MiniStat } from "./MiniStat";
import { PixelIcon } from "../../lib/icons/PixelIcon";
import { sceneImage } from "@/lib/adventure/adventureData";
import { THEME_BACKGROUND } from "../../lib/game/themeAssets";
import { Progress, type ProgressTone } from "@/components/ui/progress";

export function StageRunner({
  stage,
  world,
  image,
  alreadyCompleted,
  onClose,
  onWin,
}: {
  stage: Stage;
  world: WorldId;
  image?: string;
  alreadyCompleted: boolean;
  onClose: () => void;
  onWin: () => void;
}) {
  const currentWorld = WORLDS.find((entry) => entry.id === world);
  const [targetWords, setTargetWords] = useState(() => expandWords(stage.words, 72));
  const [isGeneratingWords, setIsGeneratingWords] = useState(false);
  const isGeneratingRef = useRef(false);
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
  const [resultsOpen, setResultsOpen] = useState(false);

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
    let cancelled = false;
    isGeneratingRef.current = true;
    setIsGeneratingWords(true);
    setTargetWords(expandWords(stage.words, 24));
    setTyped("");
    setStartedAt(null);
    setNow(0);
    setCorrect(0);
    setWrong(0);
    setDone(null);
    setBossIntro(isBoss);
    setWinHandled(false);
    setResultsOpen(false);
    generateAdventureWords(stage.name, world, stage.words, 96, 0)
      .then((words) => {
        if (cancelled) return;
        setTargetWords(words ?? expandWords(stage.words, 72));
      })
      .finally(() => {
        if (cancelled) return;
        isGeneratingRef.current = false;
        setIsGeneratingWords(false);
      });

    return () => {
      cancelled = true;
      isGeneratingRef.current = false;
    };
  }, [isBoss, stage.id, stage.name, stage.words, world]);

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!startedAt || done) return;
    const timer = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(timer);
  }, [startedAt, done]);

  useEffect(() => {
    if (done || bossIntro || isGeneratingRef.current) return;

    const remainingChars = target.length - typed.length;
    if (remainingChars > 180) return;

    let cancelled = false;
    isGeneratingRef.current = true;
    setIsGeneratingWords(true);
    generateAdventureWords(stage.name, world, stage.words, 56, targetWords.length)
      .then((words) => {
        if (cancelled) return;
        setTargetWords((current) => [...current, ...(words ?? expandWords(stage.words, 40))]);
      })
      .finally(() => {
        if (cancelled) return;
        isGeneratingRef.current = false;
        setIsGeneratingWords(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    bossIntro,
    done,
    stage.name,
    stage.words,
    target.length,
    targetWords.length,
    typed.length,
    world,
  ]);

  const elapsed = startedAt ? (now - startedAt) / 1000 : 0;
  const wpm = Math.round(correct / 5 / Math.max(elapsed / 60, 1 / 60));
  const acc = correct + wrong === 0 ? 100 : Math.round((correct / (correct + wrong)) * 100);
  const totalTarget = target.length;
  const typedLen = typed.length;
  const currentWordIndex = wordEntries.findIndex((entry) => typedLen <= entry.end);
  const safeCurrentWordIndex =
    currentWordIndex === -1 ? wordEntries.length - 1 : Math.max(0, currentWordIndex);
  const visibleWordStart = Math.max(0, safeCurrentWordIndex - 2);
  const visibleWords = wordEntries.slice(visibleWordStart, visibleWordStart + 12);
  const timeLimit = DIFFICULTY_TIME_LIMITS[stage.difficulty];
  const timeRemaining = startedAt ? Math.max(0, Math.ceil(timeLimit - elapsed)) : timeLimit;
  const timePercent = startedAt ? Math.min(100, (elapsed / timeLimit) * 100) : 0;
  const targetCharsForClear = Math.max(1, Math.ceil((stage.goal * timeLimit * 5) / 60));
  const clearPercent = Math.min(100, (typedLen / targetCharsForClear) * 100);
  const bossHp = isBoss ? Math.max(0, 100 - clearPercent) : 0;
  const hpColor =
    bossHp > 66 ? "var(--leaf)" : bossHp > 33 ? "var(--coin)" : "var(--color-destructive)";
  const hpTone: ProgressTone = bossHp > 66 ? "success" : bossHp > 33 ? "coin" : "danger";
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

  useEffect(() => {
    if (!done) {
      setResultsOpen(false);
      return;
    }
    const timer = window.setTimeout(() => setResultsOpen(true), 280);
    return () => window.clearTimeout(timer);
  }, [done]);

  const reset = () => {
    setTyped("");
    setStartedAt(null);
    setNow(0);
    setCorrect(0);
    setWrong(0);
    setDone(null);
    setTargetWords(expandWords(stage.words, 24));
    isGeneratingRef.current = true;
    setIsGeneratingWords(true);
    setWinHandled(false);
    setResultsOpen(false);
    generateAdventureWords(stage.name, world, stage.words, 96, 0)
      .then((words) => setTargetWords(words ?? expandWords(stage.words, 72)))
      .finally(() => {
        isGeneratingRef.current = false;
        setIsGeneratingWords(false);
      });
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (done || bossIntro || resultsOpen) return;
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
      <ModalShell
        ariaLabel={`${stage.name} boss intro`}
        onClose={onClose}
        className="pixel-modal-shell-adventure"
        size="game"
        frameClassName="pixel-modal-frame-adventure"
      >
        <div className="adventure-runner-card animate-pixel-pop">
          <div className="adventure-boss-emoji">
            <PixelIcon emoji={stage.emoji} />
          </div>
          <div className="font-display text-4xl leading-none mb-2 text-center">{stage.name}</div>
          <p className="font-pixel text-[0.65rem] text-muted-foreground mb-4 text-center">
            {questText || "A boss stage appears. Type fast and stay accurate."}
          </p>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <MiniStat label="WPM" value={`>=${stage.goal}`} accent="var(--color-primary)" />
            <MiniStat label="Acc" value={`>=${minAcc}%`} accent="var(--leaf)" />
            <MiniStat label="Time" value={`<=${timeLimit}s`} accent="var(--coin)" />
          </div>
          <PixelButton
            variant="primary"
            className="mx-auto min-w-[220px]"
            onClick={() => {
              setBossIntro(false);
              inputRef.current?.focus();
            }}
          >
            Fight
          </PixelButton>
        </div>
      </ModalShell>
    );
  }

  return createPortal(
    <div
      className="adventure-scene-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`${stage.name} quest`}
      style={(() => {
        const bg = sceneImage(world, stage.name) ?? THEME_BACKGROUND[world];
        return bg ? ({ "--adventure-bg-img": `url("${bg}")` } as React.CSSProperties) : undefined;
      })()}
    >
      <div className="adventure-runner-scene">
        <CelebrationOverlay
          active={done !== null}
          result={done}
          world={world}
          xp={xpReward}
          coins={coinReward}
        />
        <div className={`adventure-runner-card ${done ? `is-complete is-${done}` : ""}`}>
          <button
            type="button"
            className="adventure-scene-close"
            onClick={onClose}
            aria-label="Close quest"
          >
            x
          </button>

          <div className="adventure-runner-header">
            <div className="adventure-runner-heading">
              <div className="adventure-runner-heading-top">
                <span className="adventure-runner-chip">
                  {isBoss ? "Boss Quest" : `${stage.difficulty} Quest`}
                </span>
                <span className="adventure-runner-chip is-node">Node {stage.id}/5</span>
                {currentWorld ? (
                  <span className="adventure-runner-chip is-muted">{currentWorld.name}</span>
                ) : null}
              </div>
              <div className="adventure-runner-title-row">
                <div>
                  <div className="font-display text-2xl leading-none">{stage.name}</div>
                  <div className="font-pixel text-[0.6rem] text-muted-foreground mt-1">
                    {isBoss
                      ? `Goal: ${stage.goal} WPM - ${minAcc}%+ accuracy - boss phase ${currentPhase + 1}/3 - ${timeLimit}s timer`
                      : `Goal: ${stage.goal} WPM - ${minAcc}%+ accuracy - ${timeLimit}s timer`}
                  </div>
                </div>
              </div>
              <div className="adventure-runner-flavor">
                {currentWorld?.blurb ?? questText ?? "Stay focused and keep a clean rhythm."}
              </div>
            </div>

            <div className="adventure-runner-header-side">
              <div className="adventure-runner-node-card">
                {image ? (
                  <img
                    src={image}
                    alt={`${stage.name} node`}
                    className="adventure-runner-node-image"
                    draggable={false}
                  />
                ) : (
                  <span className="adventure-runner-node-fallback">
                    <PixelIcon emoji={stage.emoji} />
                  </span>
                )}
              </div>
            </div>
          </div>

          {isBoss && (
            <div className="mb-4">
              <div className="flex justify-between font-pixel text-[0.55rem] mb-1">
                <span className="text-muted-foreground">Boss HP</span>
                <span style={{ color: hpColor }}>{Math.round(bossHp)}%</span>
              </div>
              <Progress
                value={bossHp}
                size="md"
                tone={hpTone}
                aria-label={`Boss health: ${Math.round(bossHp)}%`}
              />
            </div>
          )}

          <div className="adventure-type-wrap" onClick={() => inputRef.current?.focus()}>
            <Progress
              value={timePercent}
              size="xs"
              tone="rainbow"
              aria-label={`Stage time elapsed: ${Math.round(timePercent)}%`}
            />

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
                    <span
                      className={`adventure-word adventure-word-${wordState}`}
                      key={`${entry.word}-${entry.start}`}
                    >
                      {entry.word.split("").map((char, charIndex) => {
                        const index = entry.start + charIndex;
                        const typedChar = typed[index];
                        const state =
                          typedChar == null ? "pending" : typedChar === char ? "correct" : "wrong";
                        const isCursor = index === typedLen;
                        return (
                          <span
                            className={`adventure-char adventure-char-${state} ${isCursor ? "adventure-char-current" : ""}`}
                            key={`${char}-${index}`}
                          >
                            {char}
                          </span>
                        );
                      })}
                      {typedLen === entry.end && (
                        <span className="adventure-space-cursor" aria-hidden="true" />
                      )}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="adventure-live-stats" aria-label="Live quest stats">
              <MiniStat label="WPM" value={String(wpm)} accent="var(--color-primary)" />
              <MiniStat label="Accuracy" value={`${acc}%`} accent="var(--leaf)" />
              <MiniStat label="Time" value={`${timeRemaining}s`} accent="var(--coin)" />
              <MiniStat label="Goal" value={`${stage.goal}`} accent="var(--color-destructive)" />
            </div>
          </div>

          <input
            ref={inputRef}
            value={typed}
            onChange={handleChange}
            disabled={done !== null}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            id="stage-input"
            name="stage-input"
            aria-label="Type the stage text"
            className="typing-capture-input"
          />
        </div>

        <QuestResultsModal
          open={resultsOpen}
          result={done}
          stageName={stage.name}
          goal={stage.goal}
          minAccuracy={minAcc}
          wpm={wpm}
          accuracy={acc}
          elapsedSeconds={elapsed}
          xp={xpReward}
          coins={coinReward}
          alreadyCompleted={alreadyCompleted}
          message={
            done === "win"
              ? alreadyCompleted
                ? "You cleared it again. Replay clears stay rewarding, but they do not add extra XP or coins."
                : "Clean work. The next stretch of the path is now unlocked."
              : `You need ${stage.goal} WPM and ${minAcc}% accuracy before time runs out.`
          }
          coachTip={
            done === "win"
              ? acc >= 95
                ? "Your rhythm stayed clean. Keep that same cadence into the next quest."
                : "You had the speed. Trim a few misses and this route gets much safer."
              : wpm < stage.goal
                ? "You need a little more speed here. Focus on smooth bursts before chasing the timer."
                : "Your speed was close enough. Slow down slightly and land cleaner inputs."
          }
          onReplay={reset}
          onDismiss={onClose}
        />
      </div>
    </div>,
    document.body,
  );
}
