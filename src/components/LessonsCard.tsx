import { useEffect, useMemo, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronRight, X, Lock, Play, Star } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import {
  UNITS,
  loadCompletedLessons,
  markLessonCompleted,
  unitProgress,
  loadLessonStats,
  saveLessonStats,
  isUnitUnlocked,
  isLessonUnlocked,
  lessonStars,
  lessonRewards,
  type Lesson,
  type Unit,
  type LessonDifficulty,
} from "../lib/game/curriculum";
import { TypingArena } from "./TypingArena";
import { useGame } from "../lib/game/store";

const DIFFICULTY_LABEL: Record<LessonDifficulty, { label: string; color: string }> = {
  beginner:     { label: "Beginner",     color: "var(--leaf)" },
  easy:         { label: "Easy",         color: "var(--leaf)" },
  intermediate: { label: "Intermediate", color: "var(--coin)" },
  advanced:     { label: "Advanced",     color: "var(--color-primary)" },
  expert:       { label: "Expert",       color: "var(--color-primary)" },
  master:       { label: "Master",       color: "var(--color-destructive)" },
};

export function LessonsCard() {
  const { dispatch } = useGame();
  const [completed, setCompleted] = useState<Set<string>>(() => loadCompletedLessons());
  const [openUnits, setOpenUnits] = useState<Set<string>>(() => new Set([UNITS[0].id]));
  const [detail, setDetail] = useState<{ unit: Unit; lesson: Lesson } | null>(null);
  const [typing, setTyping] = useState<{ unit: Unit; lesson: Lesson } | null>(null);

  useEffect(() => {
    const refresh = () => setCompleted(loadCompletedLessons());
    window.addEventListener("pawtype-lesson-completed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("pawtype-lesson-completed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const totals = useMemo(() => {
    const total = UNITS.reduce((n, u) => n + u.lessons.length, 0);
    const done = UNITS.reduce((n, u) => n + u.lessons.filter((l) => completed.has(l.id)).length, 0);
    return { done, total };
  }, [completed]);

  const toggleUnit = (id: string) => {
    setOpenUnits((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleFinish = useCallback((wpm: number, accuracy: number) => {
    if (!typing) return;
    markLessonCompleted(typing.lesson.id);
    saveLessonStats(typing.lesson.id, wpm, accuracy);
    const rewards = lessonRewards(typing.lesson.difficulty, typing.lesson.words.length);
    dispatch({ type: "ADD_XP", amount: rewards.xp });
    dispatch({ type: "EARN_COINS", amount: rewards.coins });
    dispatch({ type: "ADD_PET_XP", amount: rewards.petExp });
    setCompleted(loadCompletedLessons());
  }, [typing, dispatch]);

  const closeTyping = () => setTyping(null);

  const nextLesson = () => {
    if (!typing) return;
    const unitLessons = typing.unit.lessons;
    const idx = unitLessons.findIndex((l) => l.id === typing.lesson.id);
    if (idx < unitLessons.length - 1) {
      setTyping({ unit: typing.unit, lesson: unitLessons[idx + 1] });
    } else {
      const uIdx = UNITS.findIndex((u) => u.id === typing.unit.id);
      if (uIdx < UNITS.length - 1) {
        setTyping({ unit: UNITS[uIdx + 1], lesson: UNITS[uIdx + 1].lessons[0] });
      } else {
        setTyping(null);
      }
    }
  };

  const lessonDetail = detail?.lesson;
  const lessonUnit = detail?.unit;

  return (
    <div className="pixel-card p-5">
      <SectionHeader
        title="Curriculum"
        subtitle={`A guided path from home row to graduation · ${totals.done}/${totals.total} lessons complete`}
      />

      <div className="flex flex-col gap-4 mt-2">
        {UNITS.map((unit, uIdx) => {
          const open = openUnits.has(unit.id);
          const prog = unitProgress(unit, completed);
          const unlocked = isUnitUnlocked(unit.number, completed);
          const isDone = prog.done === prog.total;

          return (
            <div key={unit.id} className="pixel-card-sm overflow-hidden">
              <button
                type="button"
                onClick={() => unlocked && toggleUnit(unit.id)}
                className="w-full flex items-center gap-3 p-3 text-left"
                style={{ opacity: unlocked ? 1 : 0.5, cursor: unlocked ? "pointer" : "not-allowed" }}
                aria-expanded={open}
              >
                <div
                  className="grid place-items-center text-xl shrink-0"
                  style={{
                    width: 44, height: 44,
                    background: unlocked ? "color-mix(in oklab, var(--color-muted) 60%, transparent)" : "var(--color-muted)",
                    border: "2px solid var(--color-border)",
                    borderRadius: 8,
                  }}
                >
                  {unlocked ? unit.emoji : <Lock size={16} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-pixel text-sm truncate">
                    Unit {unit.number} · {unit.title}
                    {isDone && <span className="ml-2" style={{ color: "var(--leaf)" }}>✓</span>}
                  </div>
                  <div className="font-pixel text-[0.55rem] text-muted-foreground mt-1">{unit.purpose}</div>
                  {/* progress bar */}
                  <div
                    className="mt-1.5"
                    style={{
                      height: 6,
                      background: "var(--color-muted)",
                      borderRadius: 999,
                      maxWidth: 160,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${prog.total > 0 ? (prog.done / prog.total) * 100 : 0}%`,
                        height: "100%",
                        background: isDone ? "var(--leaf)" : "var(--coin)",
                        borderRadius: 999,
                        transition: "width 0.3s",
                      }}
                    />
                  </div>
                </div>
                <div className="font-pixel text-[0.6rem] shrink-0" style={{ color: "var(--muted-foreground)" }}>
                  {prog.done}/{prog.total}
                </div>
                {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>

              {open && unlocked && (
                <div className="px-3 pb-3">
                  {/* vertical lesson path */}
                  <div className="relative flex flex-col items-center">
                    {/* vertical connector line */}
                    <div
                      className="absolute"
                      style={{
                        top: 0, bottom: 0, width: 3,
                        background: "color-mix(in oklab, var(--color-border) 30%, transparent)",
                        borderRadius: 999,
                      }}
                    />
                    {unit.lessons.map((lesson, lIdx) => {
                      const done = completed.has(lesson.id);
                      const unlocked = isLessonUnlocked(unit, lIdx, completed);
                      const stats = loadLessonStats()[lesson.id];

                      return (
                        <button
                          key={lesson.id}
                          type="button"
                          onClick={() => unlocked && setDetail({ unit, lesson })}
                          disabled={!unlocked}
                          className="relative flex items-center gap-3 w-full text-left py-2 px-3"
                          style={{
                            cursor: unlocked ? "pointer" : "not-allowed",
                            opacity: unlocked ? 1 : 0.45,
                          }}
                        >
                          {/* node circle */}
                          <div
                            className="shrink-0 grid place-items-center"
                            style={{
                              width: 38, height: 38, borderRadius: "50%",
                              border: `3px solid ${
                                done ? "var(--leaf)" : unlocked ? "var(--coin)" : "var(--color-border)"
                              }`,
                              background: done
                                ? "var(--leaf)"
                                : unlocked
                                  ? "color-mix(in oklab, var(--coin) 12%, transparent)"
                                  : "var(--color-muted)",
                              color: done ? "white" : "var(--muted-foreground)",
                              zIndex: 1,
                              transition: "background 0.2s, border-color 0.2s",
                            }}
                          >
                            {done ? (
                              <span className="font-pixel text-[0.55rem] font-bold">✓</span>
                            ) : unlocked ? (
                              <span className="text-base">{lesson.emoji}</span>
                            ) : (
                              <Lock size={12} />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-pixel text-[0.7rem] truncate">{lesson.title}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span
                                className="font-pixel text-[0.5rem]"
                                style={{ color: DIFFICULTY_LABEL[lesson.difficulty].color }}
                              >
                                {DIFFICULTY_LABEL[lesson.difficulty].label}
                              </span>
                              {stats && (
                                <span className="font-pixel text-[0.5rem] text-muted-foreground">
                                  Best: {stats.bestWpm} WPM · {stats.bestAccuracy}%
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="shrink-0">
                            {done ? (
                              <span className="font-pixel text-[0.6rem]" style={{ color: "var(--leaf)" }}>
                                {Array.from({ length: 3 }, (_, i) => {
                                  const stars = lessonStars(
                                    loadLessonStats()[lesson.id]?.bestAccuracy ?? 0,
                                    lesson.targetAccuracy
                                  );
                                  return i < stars ? "★" : "☆";
                                }).join("")}
                              </span>
                            ) : unlocked ? (
                              <Play size={14} className="shrink-0" style={{ color: "var(--coin)" }} />
                            ) : (
                              <Lock size={12} className="shrink-0" style={{ color: "var(--muted-foreground)" }} />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lesson detail modal */}
      {detail && lessonDetail && createPortal(
        <div
          className="fixed inset-0 z-50 grid place-items-center p-4"
          style={{ background: "color-mix(in oklab, black 50%, transparent)" }}
          onClick={() => setDetail(null)}
        >
          <div
            className="pixel-card p-6 w-full max-w-sm"
            style={{ height: "min(520px, 80dvh)", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="float-right pixel-btn pixel-btn-secondary p-1 border-0"
              onClick={() => setDetail(null)}
              aria-label="Close"
            >
              <X size={14} />
            </button>

            <div className="text-center mb-4">
              <div className="text-3xl mb-2">{lessonDetail.emoji}</div>
              <div className="font-display text-xl leading-none">{lessonDetail.title}</div>
              <div className="font-pixel text-[0.55rem] mt-1" style={{ color: DIFFICULTY_LABEL[lessonDetail.difficulty].color }}>
                {DIFFICULTY_LABEL[lessonDetail.difficulty].label}
              </div>
              {lessonDetail.note && (
                <p className="font-pixel text-[0.55rem] text-muted-foreground mt-2">{lessonDetail.note}</p>
              )}
            </div>

            <div className="flex justify-center gap-4 mb-4">
              <div className="text-center">
                <div className="font-pixel text-[0.5rem] text-muted-foreground">Target WPM</div>
                <div className="font-display text-lg">{lessonDetail.targetWpm}</div>
              </div>
              <div className="text-center">
                <div className="font-pixel text-[0.5rem] text-muted-foreground">Target Acc</div>
                <div className="font-display text-lg">{lessonDetail.targetAccuracy}%</div>
              </div>
            </div>

            {/* Best stats */}
            {(() => {
              const stats = loadLessonStats()[lessonDetail.id];
              if (!stats) return null;
              const stars = lessonStars(stats.bestAccuracy, lessonDetail.targetAccuracy);
              return (
                <div className="mb-4 p-3" style={{ background: "var(--color-muted)", borderRadius: 8 }}>
                  <div className="font-pixel text-[0.5rem] text-muted-foreground mb-1">Best Performance</div>
                  <div className="flex justify-between items-center">
                    <span className="font-pixel text-[0.6rem]">{stats.bestWpm} WPM · {stats.bestAccuracy}%</span>
                    <span className="font-pixel text-[0.7rem]" style={{ color: "var(--coin)" }}>
                      {Array.from({ length: 3 }, (_, i) => i < stars ? "★" : "☆").join("")}
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Rewards preview */}
            {(() => {
              const rewards = lessonRewards(lessonDetail.difficulty, lessonDetail.words.length);
              return (
                <div className="flex justify-center gap-4 mb-4">
                  <div className="text-center">
                    <div className="font-pixel text-[0.5rem] text-muted-foreground">XP</div>
                    <div className="font-pixel text-sm" style={{ color: "var(--color-primary)" }}>+{rewards.xp}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-pixel text-[0.5rem] text-muted-foreground">Coins</div>
                    <div className="font-pixel text-sm" style={{ color: "var(--coin)" }}>+{rewards.coins}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-pixel text-[0.5rem] text-muted-foreground">Pet EXP</div>
                    <div className="font-pixel text-sm" style={{ color: "var(--leaf)" }}>+{rewards.petExp}</div>
                  </div>
                </div>
              );
            })()}

            <button
              className="pixel-btn w-full flex items-center justify-center gap-2 py-2.5"
              onClick={() => {
                setTyping({ unit: lessonUnit!, lesson: lessonDetail });
                setDetail(null);
              }}
            >
              <Play size={16} /> Start Lesson
            </button>
          </div>
        </div>
      , document.body)}

      {/* Full-screen typing overlay */}
      {typing && createPortal(
        <div className="fixed inset-0 z-50" style={{ background: "var(--color-background)" }}>
          <TypingArena
            key={typing.lesson.id}
            customWords={typing.lesson.words}
            customTitle={`${typing.unit.title} · ${typing.lesson.title}`}
            noTimer
            lessonMode
            onFinish={handleFinish}
            onClose={closeTyping}
            onNextLesson={nextLesson}
            hasNext={
              typing.unit.lessons.length > typing.unit.lessons.findIndex((l) => l.id === typing.lesson.id) + 1 ||
              UNITS.length > UNITS.findIndex((u) => u.id === typing.unit.id) + 1
            }
            lessonTargetAccuracy={typing.lesson.targetAccuracy}
            lessonDifficulty={typing.lesson.difficulty}
            lessonWordCount={typing.lesson.words.length}
          />
        </div>
      , document.body)}
    </div>
  );
}
