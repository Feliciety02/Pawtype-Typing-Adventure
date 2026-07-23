import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronRight, Lock, Play, Crown, Swords, Gift } from "lucide-react";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { PixelIcon } from "@/lib/icons/PixelIcon";
import { BigStars } from "./BigStars";
import { RewardBadge } from "@/components/game/RewardBadge";
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
} from "@/lib/game/curriculum";
import { TypingArena } from "@/components/game/TypingArena";
import { ModalShell, PixelButton } from "@/components/modals/ModalShell";
import { useGame } from "@/lib/game/store";
import {
  getUnclaimedMilestones,
  queuePendingEgg,
  loadPendingEggs,
  milestoneForIndex,
  progressTowardNextEgg,
  LESSONS_PER_EGG,
  type EggMilestone,
} from "@/lib/game/eggs";
import {
  loadChestLessons,
  toggleChestLesson,
  loadClaimedChests,
  markChestClaimed,
} from "@/lib/game/chests";
import { EggHatchModal } from "@/components/shop/EggHatchModal";
import { generateLessonText } from "@/lib/game/textGenerator";
import type { Zone } from "@/lib/game/engine/generator";
import { Progress } from "@/components/ui/progress";
import { getDailyGoal, tickDailyGoal, subscribeDailyGoal } from "@/lib/game/dailyGoal";

const DIFFICULTY_LABEL: Record<LessonDifficulty, { label: string; color: string }> = {
  beginner: { label: "Beginner", color: "var(--leaf)" },
  easy: { label: "Easy", color: "var(--leaf)" },
  intermediate: { label: "Intermediate", color: "var(--coin)" },
  advanced: { label: "Advanced", color: "var(--color-primary)" },
  expert: { label: "Expert", color: "var(--color-primary)" },
  master: { label: "Master", color: "var(--color-destructive)" },
};

function lessonEmojiImg(emoji: string, className = "pixel-icon") {
  return <PixelIcon emoji={emoji} className={className} />;
}

function DailyGoalWidget({ goal, count, streak }: { goal: number; count: number; streak: number }) {
  const pct = Math.max(0, Math.min(1, count / goal));
  const R = 14;
  const C = 2 * Math.PI * R;
  const complete = count >= goal;
  return (
    <div className={`daily-goal ${complete ? "is-complete" : ""}`} title="Today's lesson goal">
      <div className="daily-goal-ring" aria-hidden="true">
        <svg viewBox="0 0 34 34">
          <circle className="track" cx="17" cy="17" r={R} fill="none" strokeWidth="4" />
          <circle
            className="fill"
            cx="17"
            cy="17"
            r={R}
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - pct)}
          />
        </svg>
        <span className="center">{complete ? "✓" : `${count}/${goal}`}</span>
      </div>
      <div className="daily-goal-meta">
        <strong>Daily Goal</strong>
        <span className={`daily-goal-streak ${streak >= 3 ? "is-hot" : ""}`}>
          🔥 {streak}-day streak
        </span>
      </div>
    </div>
  );
}

function XpBurst({ xp, coins, petXp }: { xp: number; coins: number; petXp: number }) {
  return createPortal(
    <div className="xp-burst" role="status" aria-live="polite">
      <div className="xp-burst-title">Quest Cleared!</div>
      <div className="xp-burst-row">
        <span>+{xp} XP</span>
        <span>+{coins} 🪙</span>
        <span>+{petXp} 🐾</span>
      </div>
    </div>,
    document.body,
  );
}

export function LessonsCard() {
  const { dispatch } = useGame();
  const [completed, setCompleted] = useState<Set<string>>(() => loadCompletedLessons());
  const [openUnits, setOpenUnits] = useState<Set<string>>(() => new Set([UNITS[0].id]));
  const [detail, setDetail] = useState<{ unit: Unit; lesson: Lesson } | null>(null);
  const [typing, setTyping] = useState<{ unit: Unit; lesson: Lesson } | null>(null);
  const [generatedWords, setGeneratedWords] = useState<string[] | null>(null);
  const [activeEgg, setActiveEgg] = useState<EggMilestone | null>(null);
  const [chestLessons, setChestLessons] = useState<Set<string>>(() => loadChestLessons());
  const [claimedChests, setClaimedChests] = useState<Set<string>>(() => loadClaimedChests());
  const [showChestConfig, setShowChestConfig] = useState(false);
  const [daily, setDaily] = useState(() => getDailyGoal());
  const [xpBurst, setXpBurst] = useState<{ xp: number; coins: number; petXp: number } | null>(null);
  const deferredAfterEgg = useRef<null | (() => void)>(null);
  const prevTypingRef = useRef(typing);

  useEffect(() => {
    const refresh = () => setCompleted(loadCompletedLessons());
    const refreshChests = () => {
      setChestLessons(loadChestLessons());
      setClaimedChests(loadClaimedChests());
    };
    window.addEventListener("pawtype-lesson-completed", refresh);
    window.addEventListener("pawtype-egg-claimed", refresh);
    window.addEventListener("pawtype-chests-changed", refreshChests);
    window.addEventListener("storage", refresh);
    const unsubDaily = subscribeDailyGoal(() => setDaily(getDailyGoal()));
    return () => {
      window.removeEventListener("pawtype-lesson-completed", refresh);
      window.removeEventListener("pawtype-egg-claimed", refresh);
      window.removeEventListener("pawtype-chests-changed", refreshChests);
      window.removeEventListener("storage", refresh);
      unsubDaily();
    };
  }, []);

  useEffect(() => {
    if (activeEgg) return;
    const unclaimed = getUnclaimedMilestones(completed.size);
    if (unclaimed.length === 0) return;
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

  const handleFinish = useCallback(
    (wpm: number, accuracy: number) => {
      if (!typing) return;
      const wasCompleted = completed.has(typing.lesson.id);
      markLessonCompleted(typing.lesson.id);
      saveLessonStats(typing.lesson.id, wpm, accuracy);
      const rewards = lessonRewards(typing.lesson.difficulty, typing.lesson.words.length);
      dispatch({ type: "ADD_XP", amount: rewards.xp });
      dispatch({ type: "EARN_COINS", amount: rewards.coins });
      dispatch({ type: "ADD_PET_XP", amount: rewards.petExp });

      // Claim chest bonus if this lesson is a configured chest
      if (chestLessons.has(typing.lesson.id) && !claimedChests.has(typing.lesson.id)) {
        dispatch({ type: "EARN_COINS", amount: 100 });
        markChestClaimed(typing.lesson.id);
        setClaimedChests(loadClaimedChests());
      }

      if (!wasCompleted) {
        const newCount = completed.size + 1;
        if (newCount > 0 && newCount % LESSONS_PER_EGG === 0) {
          queuePendingEgg(newCount / LESSONS_PER_EGG);
        }
        tickDailyGoal();
      }
      setCompleted(loadCompletedLessons());

      // Floating XP burst
      const bonus = chestLessons.has(typing.lesson.id) ? 100 : 0;
      setXpBurst({ xp: rewards.xp, coins: rewards.coins + bonus, petXp: rewards.petExp });
      window.setTimeout(() => setXpBurst(null), 1500);
    },
    [typing, dispatch, completed, chestLessons, claimedChests],
  );

  // Try to open a pending egg modal, deferring `next` until the modal closes.
  // Returns true when an egg is being displayed.
  const openPendingEgg = useCallback((next: () => void) => {
    const pending = [...loadPendingEggs()].sort((a, b) => a - b);
    if (pending.length === 0) return false;
    deferredAfterEgg.current = next;
    setActiveEgg(milestoneForIndex(pending[0]));
    return true;
  }, []);

  function unitZones(unitNumber: number): Zone[] {
    switch (unitNumber) {
      case 1:
        return ["home"];
      case 2:
        return ["top"];
      case 3:
        return ["bottom"];
      case 6:
        return ["numbers"];
      case 7:
        return ["symbols"];
      default:
        return [];
    }
  }

  useEffect(() => {
    if (!typing) return;
    if (prevTypingRef.current?.lesson.id === typing.lesson.id) return;
    prevTypingRef.current = typing;
    setGeneratedWords(null);
    generateLessonText(typing.lesson.difficulty, unitZones(typing.unit.number), 60)
      .then((text) => {
        const words = text.split(/\s+/).filter(Boolean);
        if (words.length >= 10) setGeneratedWords(words);
      })
      .catch(() => {});
  }, [typing]);

  const closeTyping = () => {
    if (openPendingEgg(() => setTyping(null))) return;
    setTyping(null);
  };

  const nextLesson = () => {
    if (!typing) return;
    const goToNext = () => {
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
    if (openPendingEgg(goToNext)) return;
    goToNext();
  };

  const lessonDetail = detail?.lesson;
  const lessonUnit = detail?.unit;

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
    <div className="pixel-card p-5 quest-log-root">
      <SectionHeader
        title="Quest Log"
        subtitle={`A guided path from home row to graduation — ${totals.done}/${totals.total} quests complete`}
      />

      <div
        className="quest-chest-toolbar"
        style={{ justifyContent: "space-between", alignItems: "center", gap: 12 }}
      >
        <DailyGoalWidget goal={daily.goal} count={daily.count} streak={daily.streak} />
        <button type="button" onClick={() => setShowChestConfig(true)}>
          <Gift size={12} style={{ display: "inline", verticalAlign: -2, marginRight: 4 }} />
          Configure Chests ({chestLessons.size})
        </button>
      </div>

      {/* Egg milestone progress banner */}
      <div className="quest-milestone-banner">
        <div className="quest-milestone-icon" aria-hidden="true">
          🥚
        </div>
        <div className="quest-milestone-body">
          <div className="quest-milestone-title">
            Egg #{eggProgress.nextIndex} · {eggProgress.progress}/{eggProgress.total} lessons
          </div>
          <Progress
            className="quest-milestone-bar"
            value={eggProgress.progress}
            max={eggProgress.total}
            size="sm"
            tone="coin"
            aria-label={`Next egg: ${eggProgress.progress} of ${eggProgress.total} lessons`}
          />
        </div>
        <div className="quest-milestone-hint">Every 10 lessons = 1 pet egg</div>
      </div>

      <div className="quest-chapter-list">
        {UNITS.map((unit) => {
          const open = openUnits.has(unit.id);
          const prog = unitProgress(unit, completed);
          const unlocked = isUnitUnlocked(unit.number, completed);
          const isDone = prog.done === prog.total;
          const pct = prog.total ? Math.round((prog.done / prog.total) * 100) : 0;

          return (
            <div
              key={unit.id}
              className={`quest-chapter ${isDone ? "is-done" : ""} ${!unlocked ? "is-locked" : ""}`}
            >
              {/* Chapter Header */}
              <button
                type="button"
                onClick={() => unlocked && toggleUnit(unit.id)}
                className="quest-chapter-head"
                aria-expanded={open}
                disabled={!unlocked}
              >
                <div className="quest-chapter-emblem">
                  {unlocked ? (
                    <PixelIcon emoji="🌟" className="quest-chapter-icon" />
                  ) : (
                    <Lock size={20} />
                  )}
                  <div className="quest-chapter-emblem-emoji">{unit.emoji}</div>
                </div>
                <div className="quest-chapter-body">
                  <div className="quest-chapter-eyebrow">
                    Chapter {unit.number}
                    {isDone && (
                      <span className="quest-chapter-done-chip">
                        <Crown size={10} /> Cleared
                      </span>
                    )}
                  </div>
                  <div className="quest-chapter-title">{unit.title}</div>
                  <div className="quest-chapter-purpose">{unit.purpose}</div>
                  <div className="quest-chapter-progress">
                    <Progress
                      className="quest-chapter-bar"
                      value={prog.done}
                      max={prog.total}
                      size="xs"
                      tone="success"
                      aria-label={`${unit.title}: ${prog.done} of ${prog.total} lessons complete`}
                    />
                    <span className="quest-chapter-count">{pct}%</span>
                  </div>
                </div>
                <div className="quest-chapter-caret" aria-hidden="true">
                  {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </div>
              </button>

              {open && unlocked && (
                <>
                  {/* Mini Adventure Path */}
                  <div className="quest-adventure-path" aria-hidden="true">
                    {unit.lessons.map((lesson, lIdx) => {
                      const done = completed.has(lesson.id);
                      const unlockedL = isLessonUnlocked(unit, lIdx, completed);
                      const isCurrent = lesson.id === currentLessonId;
                      return (
                        <div key={lesson.id} className="quest-path-node-wrap">
                          {lIdx > 0 && <div className="quest-path-connector" />}
                          <div
                            className={`quest-path-node ${done ? "is-done" : ""} ${isCurrent ? "is-current" : ""} ${!unlockedL ? "is-locked" : ""}`}
                            title={lesson.title}
                          >
                            {lessonEmojiImg(lesson.emoji, "quest-path-icon")}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Lesson Quest Cards */}
                  <div className="quest-card-list">
                    {unit.lessons.map((lesson, lIdx) => {
                      const done = completed.has(lesson.id);
                      const unlockedL = isLessonUnlocked(unit, lIdx, completed);
                      const stats = loadLessonStats()[lesson.id];
                      const stars = (
                        stats ? lessonStars(stats.bestAccuracy, lesson.targetAccuracy) : 0
                      ) as 0 | 1 | 2 | 3;
                      const isCurrent = lesson.id === currentLessonId;
                      const rewards = lessonRewards(lesson.difficulty, lesson.words.length);
                      const isBoss = lIdx === unit.lessons.length - 1;
                      const allRewardsClaimed = done && stars === 3;
                      const showRewards = unlockedL && !allRewardsClaimed;

                      return (
                        <div key={lesson.id} className="quest-card-row">
                          <button
                            type="button"
                            onClick={() => unlockedL && setDetail({ unit, lesson })}
                            disabled={!unlockedL}
                            className={[
                              "quest-card",
                              done ? "is-done" : "",
                              !unlockedL ? "is-locked" : "",
                              isCurrent ? "is-current" : "",
                              isBoss ? "is-boss" : "",
                              stars === 3 ? "is-perfect" : "",
                            ]
                              .join(" ")
                              .trim()}
                          >
                            {/* Decorative scenery */}
                            <div className="quest-card-scene" aria-hidden="true" />
                            {chestLessons.has(lesson.id) && (
                              <span
                                className={`quest-card-chest-badge ${claimedChests.has(lesson.id) ? "is-claimed" : ""}`}
                                aria-label={
                                  claimedChests.has(lesson.id)
                                    ? "Chest opened"
                                    : "Treasure chest reward"
                                }
                                title={
                                  claimedChests.has(lesson.id)
                                    ? "Chest opened"
                                    : "Treasure chest: +100 coins on completion"
                                }
                              >
                                {claimedChests.has(lesson.id) ? "📭" : "🎁"} +100
                              </span>
                            )}

                            {/* Left - Status */}
                            <div className="quest-card-art">
                              <div className="quest-card-art-inner">
                                {done ? (
                                  <div className="quest-card-shield">
                                    <span className="quest-card-shield-check">✓</span>
                                  </div>
                                ) : !unlockedL ? (
                                  <div className="quest-card-locked-icon">
                                    <Lock size={22} />
                                    <div className="quest-card-vine" />
                                    <div className="quest-card-vine quest-card-vine-2" />
                                  </div>
                                ) : isBoss ? (
                                  <Swords size={28} />
                                ) : (
                                  lessonEmojiImg(lesson.emoji, "quest-card-emoji")
                                )}
                              </div>
                              {isCurrent && !done && <div className="quest-card-sparkle" />}
                              {isCurrent && !done && (
                                <div className="quest-card-sparkle quest-card-sparkle-2" />
                              )}
                              {isCurrent && !done && (
                                <div className="quest-card-sparkle quest-card-sparkle-3" />
                              )}
                              <div className="quest-card-status-chip">
                                {!unlockedL
                                  ? "Locked"
                                  : done
                                    ? "Cleared"
                                    : isCurrent
                                      ? "Current"
                                      : "Open"}
                              </div>
                            </div>

                            {/* Center - Info */}
                            <div className="quest-card-body">
                              <div className="quest-card-title-row">
                                <div className="quest-card-title">
                                  {isBoss && <span className="quest-card-boss-tag">BOSS</span>}
                                  {lesson.title}
                                </div>
                              </div>
                              <div className="quest-card-desc">
                                {lesson.note ||
                                  `${lesson.words.length} words, ${lesson.words.slice(0, 3).join(", ")}${lesson.words.length > 3 ? "..." : ""}`}
                              </div>
                              <div className="quest-card-meta">
                                <span
                                  className="quest-card-diff"
                                  style={{ color: DIFFICULTY_LABEL[lesson.difficulty].color }}
                                >
                                  {DIFFICULTY_LABEL[lesson.difficulty].label}
                                </span>
                                <span className="quest-card-meta-sep">·</span>
                                <span>{lesson.targetWpm} WPM</span>
                                <span className="quest-card-meta-sep">·</span>
                                <span>{lesson.targetAccuracy}% ACC</span>
                                {stats && (
                                  <>
                                    <span className="quest-card-meta-sep">·</span>
                                    <span className="quest-card-best">
                                      Best {stats.bestWpm} / {stats.bestAccuracy}%
                                    </span>
                                  </>
                                )}
                              </div>
                              {allRewardsClaimed ? (
                                <div className="quest-card-claimed">All Rewards Claimed</div>
                              ) : showRewards ? (
                                <div className="quest-card-rewards">
                                  <RewardBadge
                                    icon="✨"
                                    label="XP"
                                    value={rewards.xp}
                                    collected={done}
                                  />
                                  <RewardBadge
                                    icon="🪙"
                                    label="Coins"
                                    value={rewards.coins}
                                    collected={done}
                                  />
                                  <RewardBadge
                                    icon="🤍"
                                    label="Pet EXP"
                                    value={rewards.petExp}
                                    collected={done}
                                  />
                                </div>
                              ) : null}
                            </div>

                            {/* Right - Progress */}
                            <div className="quest-card-side">
                              {unlockedL && <BigStars count={stars} />}
                              {done && (
                                <div className="quest-card-completion-badge">
                                  <Crown size={14} /> Complete
                                </div>
                              )}
                              <div
                                className={`quest-card-action ${done ? "is-done" : ""} ${!unlockedL ? "is-locked" : ""}`}
                              >
                                {done ? (
                                  <>
                                    <Crown size={16} />
                                    Replay
                                  </>
                                ) : unlockedL ? (
                                  <div className="quest-card-play-btn">
                                    <Play size={18} />
                                    {isCurrent ? "Continue" : "Play"}
                                  </div>
                                ) : (
                                  <>
                                    <Lock size={14} />
                                    Locked
                                  </>
                                )}
                              </div>
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Lesson detail modal */}
      {detail && lessonDetail && lessonUnit && (
        <ModalShell
          ariaLabel="Quest details"
          onClose={() => setDetail(null)}
          className="pixel-modal-shell-lesson-detail"
          size="lg"
        >
          <div className="quest-detail-modal">
            <div className="quest-detail-header">
              <div className="quest-detail-emoji">
                {lessonEmojiImg(lessonDetail.emoji, "quest-detail-emoji-img")}
              </div>
              <div className="quest-detail-title">{lessonDetail.title}</div>
              <div
                className="quest-detail-difficulty"
                style={{ color: DIFFICULTY_LABEL[lessonDetail.difficulty].color }}
              >
                {DIFFICULTY_LABEL[lessonDetail.difficulty].label}
              </div>
              {(() => {
                const s = loadLessonStats()[lessonDetail.id];
                const starCount = (
                  s ? lessonStars(s.bestAccuracy, lessonDetail.targetAccuracy) : 0
                ) as 0 | 1 | 2 | 3;
                return (
                  <div className="quest-detail-stars">
                    <BigStars count={starCount} size={26} />
                  </div>
                );
              })()}
              {lessonDetail.note ? <p className="quest-detail-note">{lessonDetail.note}</p> : null}
            </div>

            <div className="quest-detail-targets">
              <div className="quest-detail-target-card">
                <div className="quest-detail-target-label">Target WPM</div>
                <div className="quest-detail-target-value">{lessonDetail.targetWpm}</div>
              </div>
              <div className="quest-detail-target-card">
                <div className="quest-detail-target-label">Target Acc</div>
                <div className="quest-detail-target-value">{lessonDetail.targetAccuracy}%</div>
              </div>
            </div>

            {(() => {
              const s = loadLessonStats()[lessonDetail.id];
              if (!s) return null;
              return (
                <div className="quest-detail-best">
                  <div className="quest-detail-best-label">Best Performance</div>
                  <div className="quest-detail-best-row">
                    <span>
                      {s.bestWpm} WPM — {s.bestAccuracy}%
                    </span>
                  </div>
                </div>
              );
            })()}

            {(() => {
              const r = lessonRewards(lessonDetail.difficulty, lessonDetail.words.length);
              return (
                <div className="quest-detail-rewards">
                  <div>
                    <div className="quest-detail-reward-label">XP</div>
                    <div className="quest-detail-reward-value is-primary">+{r.xp}</div>
                  </div>
                  <div>
                    <div className="quest-detail-reward-label">Coins</div>
                    <div className="quest-detail-reward-value is-coin">+{r.coins}</div>
                  </div>
                  <div>
                    <div className="quest-detail-reward-label">Pet EXP</div>
                    <div className="quest-detail-reward-value is-leaf">+{r.petExp}</div>
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
              Start Quest
            </PixelButton>
          </div>
        </ModalShell>
      )}

      {activeEgg && (
        <EggHatchModal
          milestone={activeEgg}
          onClose={() => {
            const pending = [...loadPendingEggs()].sort((a, b) => a - b);
            const next = pending.find((i) => i !== activeEgg.index);
            if (next) {
              setActiveEgg(milestoneForIndex(next));
            } else {
              setActiveEgg(null);
              const cb = deferredAfterEgg.current;
              deferredAfterEgg.current = null;
              if (cb) cb();
            }
          }}
        />
      )}

      {showChestConfig && (
        <ModalShell
          ariaLabel="Configure treasure chests"
          onClose={() => setShowChestConfig(false)}
          size="xl"
        >
          <div className="p-4">
            <h3 className="text-xl mb-2">🎁 Configure Treasure Chests</h3>
            <p className="font-pixel text-[0.6rem] text-muted-foreground mb-3">
              Pick the exact lessons that reward a chest (+100 coins on completion).
            </p>
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                className="chest-config-item"
                onClick={() => {
                  // Reset every-5th default preset
                  const ids: string[] = [];
                  UNITS.forEach((u) => {
                    u.lessons.forEach((l, i) => {
                      if ((i + 1) % 5 === 0) ids.push(l.id);
                    });
                  });
                  toggleChestLesson("__reset__"); // no-op trigger event
                  // apply set
                  import("@/lib/game/chests").then((m) => m.setChestLessons(ids));
                }}
              >
                Preset: Every 5th
              </button>
              <button
                type="button"
                className="chest-config-item"
                onClick={() => import("@/lib/game/chests").then((m) => m.setChestLessons([]))}
              >
                Clear All
              </button>
            </div>
            {UNITS.map((u) => (
              <div key={u.id}>
                <div className="chest-config-unit">
                  {u.emoji} Chapter {u.number}: {u.title}
                </div>
                <div className="chest-config-list">
                  {u.lessons.map((l) => {
                    const on = chestLessons.has(l.id);
                    return (
                      <button
                        key={l.id}
                        type="button"
                        className={`chest-config-item ${on ? "is-on" : ""}`}
                        onClick={() => toggleChestLesson(l.id)}
                      >
                        <span>{on ? "🎁" : "▫"}</span>
                        <span>{l.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="mt-4 flex justify-end">
              <PixelButton variant="primary" onClick={() => setShowChestConfig(false)}>
                Done
              </PixelButton>
            </div>
          </div>
        </ModalShell>
      )}

      {typing &&
        createPortal(
          <div className="fixed inset-0 z-50" style={{ background: "var(--color-background)" }}>
            <TypingArena
              key={typing.lesson.id}
              customWords={generatedWords ?? typing.lesson.words}
              customTitle={`${typing.unit.title} — ${typing.lesson.title}`}
              noTimer
              lessonMode
              onFinish={handleFinish}
              onClose={closeTyping}
              onNextLesson={nextLesson}
              hasNext={
                typing.unit.lessons.length >
                  typing.unit.lessons.findIndex((l) => l.id === typing.lesson.id) + 1 ||
                UNITS.length > UNITS.findIndex((u) => u.id === typing.unit.id) + 1
              }
              lessonTargetAccuracy={typing.lesson.targetAccuracy}
              lessonDifficulty={typing.lesson.difficulty}
              lessonWordCount={(generatedWords ?? typing.lesson.words).length}
            />
          </div>,
          document.body,
        )}

      {xpBurst && <XpBurst xp={xpBurst.xp} coins={xpBurst.coins} petXp={xpBurst.petXp} />}
    </div>
  );
}
