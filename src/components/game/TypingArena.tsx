import { RotateCcw, X } from "lucide-react";
import { PixelKeyboard } from "./PixelKeyboard";
import { PixelCloud } from "./PixelCloud";
import { PetRoom } from "../shop/PetRoom";
import { PracticeResultsModal } from "../modals/PracticeResultsModal";
import { Confetti } from "../shared/Confetti";
import { DURATIONS } from "@/lib/game/typing-arena-data";
import { LessonResultsModal } from "./LessonResultsModal";
import { useTypingEngine, type TypingEngineProps } from "@/hooks/useTypingEngine";

export function TypingArena(props: TypingEngineProps = {}) {
  const {
    lessonMode,
    customWords,
    customTitle,
    noTimer,
    onNextLesson,
    hasNext,
    lessonTargetAccuracy,
    lessonDifficulty,
    lessonWordCount,
    onClose,
  } = props;

  const {
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
    setShowConfetti,
    setResultsOpen,
    setPetRoomOpen,
    handleChange,
    handleWeakSpotDrill,
    reset,
  } = useTypingEngine(props);

  return (
    <div className="typing-page-shell flex flex-col gap-4">
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
                <div className="font-pixel text-sm" style={{ color: "var(--leaf)" }}>
                  {accuracy}%
                </div>
              </div>
              <div className="text-center">
                <div className="font-pixel text-[0.45rem] text-muted-foreground">Combo</div>
                <div className="font-pixel text-sm" style={{ color: "var(--coin)" }}>
                  {bestCombo}
                </div>
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
          <div
            className="mx-4 mb-2 shrink-0"
            style={{
              height: 4,
              background: "var(--color-muted)",
              borderRadius: 999,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: `oklch(from var(--leaf) l c h / 0.8)`,
                borderRadius: 999,
                transition: "width 0.15s",
              }}
            />
          </div>

          {/* Word count */}
          <div className="px-4 mb-1 shrink-0">
            <span className="font-pixel text-[0.5rem] text-muted-foreground">
              {currentWordIndex + 1} / {words.length} words
            </span>
          </div>

          {/* Typing text */}
          <div
            className="flex-1 flex items-center justify-center px-4 min-h-0"
            onClick={() => inputRef.current?.focus()}
          >
            <div
              className="typing-focus-shell w-full max-w-3xl"
              style={{ border: "none", background: "transparent", boxShadow: "none", padding: 0 }}
            >
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
                          typedCh == null ? "pending" : typedCh === ch ? "correct" : "wrong";
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
                <div className="typing-start-hint font-pixel" style={{ marginTop: "1rem" }}>
                  Start typing to begin the lesson
                </div>
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
            className="typing-capture-input"
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
                        type="button"
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
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    reset();
                  }}
                  className="typing-toolbar-btn typing-new-btn"
                  aria-label="New test"
                  title="New test"
                >
                  <RotateCcw size={13} strokeWidth={2.4} />
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
                            typedCh == null ? "pending" : typedCh === ch ? "correct" : "wrong";
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
                        {isCurrent && typed.length === end && (
                          <span className="typing-caret-space" />
                        )}
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
                  <span>
                    {currentWordIndex + 1} / {words.length} words
                  </span>
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
                className="typing-capture-input"
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
                  {mascotLine ??
                    (mood === "happy"
                      ? "Nice rhythm!"
                      : mood === "oops"
                        ? "Slow down!"
                        : mood === "sleep"
                          ? "Start typing!"
                          : currentWorld.name)}
                </span>
                <button
                  className="typing-toolbar-btn text-[0.5rem]"
                  type="button"
                  title="Open pet room"
                  onClick={() => setPetRoomOpen(true)}
                >
                  ?? Pet Room
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

      {finished &&
        resultsOpen &&
        (lessonMode ? (
          <LessonResultsModal
            accuracy={accuracy}
            wpm={wpm}
            bestCombo={bestCombo}
            lessonTargetAccuracy={lessonTargetAccuracy}
            lessonDifficulty={lessonDifficulty}
            lessonWordCount={lessonWordCount}
            coachLoading={coachLoading}
            coachError={coachError}
            coachInsight={coachInsight}
            onReset={reset}
            onNextLesson={onNextLesson}
            onClose={() => setResultsOpen(false)}
            hasNext={hasNext}
          />
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
                  : (coachInsight?.text ?? "Great work out there!")
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
        ))}

      <Confetti active={showConfetti} world={world} onFinish={() => setShowConfetti(false)} />
      {petRoomOpen && <PetRoom onClose={() => setPetRoomOpen(false)} />}
    </div>
  );
}
