import { useEffect, useMemo, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronRight, Lock, Play, Star, Crown, Gift, Swords, Sparkles } from "lucide-react";
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
import { ModalShell, PixelButton } from "./modals/ModalShell";
import { useGame } from "../lib/game/store";
import {
  getUnclaimedMilestones,
  queuePendingEgg,
  loadPendingEggs,
  milestoneForIndex,
  progressTowardNextEgg,
  LESSONS_PER_EGG,
  type EggMilestone,
} from "../lib/game/eggs";
import { EggHatchModal } from "./EggHatchModal";

const DIFFICULTY_LABEL: Record<LessonDifficulty, { label: string; color: string }> = {
  beginner:     { label: "Beginner",     color: "var(--leaf)" },
  easy:         { label: "Easy",         color: "var(--leaf)" },
  intermediate: { label: "Intermediate", color: "var(--coin)" },
  advanced:     { label: "Advanced",     color: "var(--color-primary)" },
  expert:       { label: "Expert",       color: "var(--color-primary)" },
  master:       { label: "Master",       color: "var(--color-destructive)" },
};

// Big star row (used on lesson cards + detail modal)
function BigStars({ count, size = 22 }: { count: 0 | 1 | 2 | 3; size?: number }) {
  return (
    <div className="lesson-big-stars" aria-label={`${count} of 3 stars`}>
      {[0, 1, 2].map((i) => {
        const filled = i < count;
        const golden = count === 3;
        return (
          <Star
            key={i}
            size={size}
            className={`lesson-big-star ${filled ? "is-filled" : "is-empty"} ${golden && filled ? "is-golden" : ""}`}
            strokeWidth={2.5}
            fill={filled ? "currentColor" : "none"}
          />
        );
      })}
    </div>
  );
}

export function LessonsCard() {
  const { dispatch } = useGame();
  const [completed, setCompleted] = useState<Set<string>>(() => loadCompletedLessons());
  const [openUnits, setOpenUnits] = useState<Set<string>>(() => new Set([UNITS[0].id]));
  const [detail, setDetail] = useState<{ unit: Unit; lesson: Lesson } | null>(null);
  const [typing, setTyping] = useState<{ unit: Unit; lesson: Lesson } | null>(null);
  const [activeEgg, setActiveEgg] = useState<EggMilestone | null>(null);

  useEffect(() => {
    const refresh = () => setCompleted(loadCompletedLessons());
    window.addEventListener("pawtype-lesson-completed", refresh);
    window.addEventListener("pawtype-egg-claimed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("pawtype-lesson-completed", refresh);
      window.removeEventListener("pawtype-egg-claimed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  // Check for any pending/unclaimed eggs on mount and after completion
  useEffect(() => {
    if (activeEgg) return;
    const unclaimed = getUnclaimedMilestones(completed.size);
    if (unclaimed.length === 0) return;
    // queue extras, present the first
    unclaimed.forEach((m) => queuePendingEgg(m.index));
    const pending = [...loadPendingEggs()].sort((a, b) => a - b);
    if (pending.length > 0) {
      setActiveEgg(milestoneForIndex(pending[0]));
    }
  }, [completed, activeEgg]);

  const totals = useMemo(() => {
    const total = UNITS.reduce((n, u) => n + u.lessons.length, 0);
    const done = UNITS.reduce((n, u) => n + u.lessons.filter((l) => completed.has(l.id)).length, 0);
    return { done, total };
  }, [completed]);

  const eggProgress = useMemo(() => progressTowardNextEgg(totals.done), [totals.done]);

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
    const wasCompleted = completed.has(typing.lesson.id);
    markLessonCompleted(typing.lesson.id);
    saveLessonStats(typing.lesson.id, wpm, accuracy);
    const rewards = lessonRewards(typing.lesson.difficulty, typing.lesson.words.length);
    dispatch({ type: "ADD_XP", amount: rewards.xp });
    dispatch({ type: "EARN_COINS", amount: rewards.coins });
    dispatch({ type: "ADD_PET_XP", amount: rewards.petExp });

    // Check milestone (only on first-time completion)
    if (!wasCompleted) {
      const newCount = completed.size + 1;
      if (newCount > 0 && newCount % LESSONS_PER_EGG === 0) {
        queuePendingEgg(newCount / LESSONS_PER_EGG);
      }
    }
    setCompleted(loadCompletedLessons());
  }, [typing, dispatch, completed]);

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

  // Find "current" lesson (first unlocked, incomplete lesson) for pulse
  const currentLessonId = useMemo(() => {
    for (const u of UNITS) {
      if (!isUnitUnlocked(u.number, completed)) continue;
      for (let i = 0; i < u.lessons.length; i++) {
        const l = u.lessons[i];
        if (!completed.has(l.id) && isLessonUnlocked(u, i, completed)) return l.id;
      }
    }
    return null;
  }, [completed]);

  return (
    <div className="pixel-card p-5 lessons-card-root">
      <SectionHeader
        title="Curriculum"
        subtitle={`A guided path from home row to graduation - ${totals.done}/${totals.total} lessons complete`}
      />

      {/* Egg milestone progress banner */}
      <div className="lesson-milestone-banner">
        <div className="lesson-milestone-icon" aria-hidden="true">🥚</div>
        <div className="lesson-milestone-body">
          <div className="lesson-milestone-title">
            Egg #{eggProgress.nextIndex} · {eggProgress.progress}/{eggProgress.total} lessons
          </div>
          <div className="lesson-milestone-bar">
            <div
              className="lesson-milestone-fill"
              style={{ width: `${(eggProgress.progress / eggProgress.total) * 100}%` }}
            />
          </div>
        </div>
        <div className="lesson-milestone-hint">Every 10 lessons = 1 pet egg</div>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {UNITS.map((unit) => {
          const open = openUnits.has(unit.id);
          const prog = unitProgress(unit, completed);
          const unlocked = isUnitUnlocked(unit.number, completed);
          const isDone = prog.done === prog.total;

          return (
            <div key={unit.id} className={`unit-chapter-card ${isDone ? "is-done" : ""} ${!unlocked ? "is-locked" : ""}`}>
              <button
                type="button"
                onClick={() => unlocked && toggleUnit(unit.id)}
                className="unit-chapter-head"
                aria-expanded={open}
                disabled={!unlocked}
              >
                <div className="unit-chapter-emblem">
                  {unlocked ? <span>{unit.emoji}</span> : <Lock size={18} />}
                </div>
                <div className="unit-chapter-body">
                  <div className="unit-chapter-eyebrow">
                    Chapter {unit.number}
                    {isDone && (
                      <span className="unit-chapter-done-chip">
                        <Crown size={10} /> Cleared
                      </span>
                    )}
                  </div>
                  <div className="unit-chapter-title">{unit.title}</div>
                  <div className="unit-chapter-purpose">{unit.purpose}</div>
                  <div className="unit-chapter-progress">
                    <div className="unit-chapter-bar">
                      <div
                        className="unit-chapter-fill"
                        style={{ width: `${prog.total ? (prog.done / prog.total) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="unit-chapter-count">{prog.done}/{prog.total}</span>
                  </div>
                </div>
                <div className="unit-chapter-caret" aria-hidden="true">
                  {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </div>
              </button>

              {open && unlocked && (
                <div className="unit-lesson-list">
                  {unit.lessons.map((lesson, lIdx) => {
                    const done = completed.has(lesson.id);
                    const unlockedL = isLessonUnlocked(unit, lIdx, completed);
                    const stats = loadLessonStats()[lesson.id];
                    const stars = (stats
                      ? lessonStars(stats.bestAccuracy, lesson.targetAccuracy)
                      : 0) as 0 | 1 | 2 | 3;
                    const isCurrent = lesson.id === currentLessonId;
                    const rewards = lessonRewards(lesson.difficulty, lesson.words.length);
                    const isBoss = lIdx === unit.lessons.length - 1;
                    const showChestAfter = (lIdx + 1) % 5 === 0 && lIdx !== unit.lessons.length - 1;

                    return (
                      <div key={lesson.id} className="lesson-node-row">
                        <button
                          type="button"
                          onClick={() => unlockedL && setDetail({ unit, lesson })}
                          disabled={!unlockedL}
                          className={[
                            "lesson-node-card",
                            done ? "is-done" : "",
                            !unlockedL ? "is-locked" : "",
                            isCurrent ? "is-current" : "",
                            isBoss ? "is-boss" : "",
                            stars === 3 ? "is-perfect" : "",
                          ].join(" ").trim()}
                        >
                          <div className="lesson-node-emblem">
                            {done ? (
                              <span className="lesson-node-check">✓</span>
                            ) : !unlockedL ? (
                              <Lock size={18} />
                            ) : isBoss ? (
                              <Swords size={20} />
                            ) : (
                              <span>{lesson.emoji === "🔥" ? <img src="/Icons/fire.png" alt="" className="pixel-icon" /> : lesson.emoji === "🌊" ? <img src="/Icons/water-wave.png" alt="" className="pixel-icon" /> : lesson.emoji === "⏰" ? <img src="/Icons/alarm-clock.png" alt="" className="pixel-icon" /> : lesson.emoji === "💎" ? <img src="/Icons/glowing-star.png" alt="" className="pixel-icon" /> : lesson.emoji === "👑" ? <img src="/Icons/star.png" alt="" className="pixel-icon" /> : lesson.emoji}</span>
                            )}
                            {isCurrent && !done && <span className="lesson-node-pulse" aria-hidden="true" />}
                            {done && <span className="lesson-node-sparkle" aria-hidden="true" />}
                          </div>

                          <div className="lesson-node-body">
                            <div className="lesson-node-titlerow">
                              <div className="lesson-node-title">
                                {isBoss && <span className="lesson-node-boss-tag">BOSS</span>}
                                {lesson.title}
                              </div>
                              {unlockedL && <BigStars count={stars} />}
                            </div>
                            <div className="lesson-node-meta">
                              <span
                                className="lesson-node-diff"
                                style={{ color: DIFFICULTY_LABEL[lesson.difficulty].color }}
                              >
                                {DIFFICULTY_LABEL[lesson.difficulty].label}
                              </span>
                              <span className="lesson-node-meta-sep">·</span>
                              <span>{lesson.targetWpm} WPM</span>
                              <span className="lesson-node-meta-sep">·</span>
                              <span>{lesson.targetAccuracy}% ACC</span>
                              {stats && (
                                <>
                                  <span className="lesson-node-meta-sep">·</span>
                                  <span className="lesson-node-best">Best {stats.bestWpm} / {stats.bestAccuracy}%</span>
                                </>
                              )}
                            </div>
                            <div className="lesson-node-rewards">
                              <span className="lesson-reward-chip is-xp">+{rewards.xp} XP</span>
                              <span className="lesson-reward-chip is-coin">+{rewards.coins} <img src="/Icons/coin.png" alt="" className="pixel-icon" /></span>
                              <span className="lesson-reward-chip is-pet">+{rewards.petExp} PET</span>
                            </div>
                          </div>

                          <div className="lesson-node-action" aria-hidden="true">
                            {done ? (
                              <Sparkles size={18} style={{ color: "var(--leaf)" }} />
                            ) : unlockedL ? (
                              <Play size={20} style={{ color: "var(--coin)" }} />
                            ) : (
                              <Lock size={16} style={{ color: "var(--muted-foreground)" }} />
                            )}
                          </div>
                        </button>

                        {showChestAfter && (
                          <div className={`lesson-chest-node ${done ? "is-glow" : ""}`} aria-hidden="true">
                            <Gift size={16} />
                            <span>Mini-reward · streak bonus</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lesson detail modal */}
      {detail && lessonDetail && lessonUnit && (
        <ModalShell
          ariaLabel="Lesson details"
          onClose={() => setDetail(null)}
          className="pixel-modal-shell-lesson-detail"
        >
          <div className="lesson-detail-modal">
            <div className="lesson-detail-header">
              <div className="lesson-detail-emoji">{lessonDetail.emoji}</div>
              <div className="lesson-detail-title">{lessonDetail.title}</div>
              <div
                className="lesson-detail-difficulty"
                style={{ color: DIFFICULTY_LABEL[lessonDetail.difficulty].color }}
              >
                {DIFFICULTY_LABEL[lessonDetail.difficulty].label}
              </div>
              {(() => {
                const stats = loadLessonStats()[lessonDetail.id];
                const stars = (stats ? lessonStars(stats.bestAccuracy, lessonDetail.targetAccuracy) : 0) as 0 | 1 | 2 | 3;
                return <div className="mt-2"><BigStars count={stars} size={26} /></div>;
              })()}
              {lessonDetail.note ? <p className="lesson-detail-note">{lessonDetail.note}</p> : null}
            </div>

            <div className="lesson-detail-targets">
              <div className="lesson-detail-target-card">
                <div className="lesson-detail-target-label">Target WPM</div>
                <div className="lesson-detail-target-value">{lessonDetail.targetWpm}</div>
              </div>
              <div className="lesson-detail-target-card">
                <div className="lesson-detail-target-label">Target Acc</div>
                <div className="lesson-detail-target-value">{lessonDetail.targetAccuracy}%</div>
              </div>
            </div>

            {(() => {
              const stats = loadLessonStats()[lessonDetail.id];
              if (!stats) return null;
              return (
                <div className="lesson-detail-best">
                  <div className="lesson-detail-best-label">Best Performance</div>
                  <div className="lesson-detail-best-row">
                    <span>{stats.bestWpm} WPM - {stats.bestAccuracy}%</span>
                  </div>
                </div>
              );
            })()}

            {(() => {
              const rewards = lessonRewards(lessonDetail.difficulty, lessonDetail.words.length);
              return (
                <div className="lesson-detail-rewards">
                  <div>
                    <div className="lesson-detail-reward-label">XP</div>
                    <div className="lesson-detail-reward-value is-primary">+{rewards.xp}</div>
                  </div>
                  <div>
                    <div className="lesson-detail-reward-label">Coins</div>
                    <div className="lesson-detail-reward-value is-coin">+{rewards.coins}</div>
                  </div>
                  <div>
                    <div className="lesson-detail-reward-label">Pet EXP</div>
                    <div className="lesson-detail-reward-value is-leaf">+{rewards.petExp}</div>
                  </div>
                </div>
              );
            })()}

            <PixelButton
              variant="primary"
              className="w-full"
              icon={<Play size={16} />}
              onClick={() => {
                setTyping({ unit: lessonUnit, lesson: lessonDetail });
                setDetail(null);
              }}
            >
              Start Lesson
            </PixelButton>
          </div>
        </ModalShell>
      )}

      {/* Egg hatching modal */}
      {activeEgg && (
        <EggHatchModal
          milestone={activeEgg}
          onClose={() => {
            const pending = [...loadPendingEggs()].sort((a, b) => a - b);
            const next = pending.find((i) => i !== activeEgg.index);
            setActiveEgg(next ? milestoneForIndex(next) : null);
          }}
        />
      )}

      {/* Full-screen typing overlay */}
      {typing && createPortal(
        <div className="fixed inset-0 z-50" style={{ background: "var(--color-background)" }}>
          <TypingArena
            key={typing.lesson.id}
            customWords={typing.lesson.words}
            customTitle={`${typing.unit.title} - ${typing.lesson.title}`}
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
