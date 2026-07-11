// ──────────── Domain Types ────────────
// Central, framework-agnostic models for the PawType domain.

export type DomainId = string;

// ──────────── Difficulty ────────────

export type Difficulty = "beginner" | "easy" | "intermediate" | "advanced" | "expert" | "master";

// ──────────── Reward ────────────

export interface Reward {
  coins: number;
  xp: number;
  petExp: number;
  items?: string[];
}

export const ZERO_REWARD: Reward = { coins: 0, xp: 0, petExp: 0 };
export const addRewards = (a: Reward, b: Reward): Reward => ({
  coins: a.coins + b.coins,
  xp: a.xp + b.xp,
  petExp: a.petExp + b.petExp,
  items: [...(a.items ?? []), ...(b.items ?? [])],
});

// ──────────── Lesson & Unit ────────────

export interface LessonDef {
  id: DomainId;
  unitId: DomainId;
  title: string;
  emoji: string;
  difficulty: Difficulty;
  targetWpm: number;
  targetAccuracy: number;
  words: string[];
  note?: string;
  order: number;
}

export interface UnitDef {
  id: DomainId;
  number: number;
  title: string;
  emoji: string;
  purpose: string;
  lessons: LessonDef[];
}

// ──────────── Attempt ────────────

export type AttemptType = "lesson" | "practice" | "adventure" | "weak-spot";

export interface Attempt {
  id: DomainId;
  type: AttemptType;
  refId?: DomainId;
  timestamp: number;
  duration: number;
  wpm: number;
  accuracy: number;
  correctChars: number;
  mistakes: number;
  bestCombo: number;
  keystrokeCount: number;
  reward: Reward;
}

// ──────────── Lesson Progress ────────────

export interface LessonProgress {
  completed: boolean;
  bestWpm: number;
  bestAccuracy: number;
  bestStars: number;
  attemptCount: number;
  lastAttemptedAt?: number;
}

export const freshLessonProgress = (): LessonProgress => ({
  completed: false,
  bestWpm: 0,
  bestAccuracy: 0,
  bestStars: 0,
  attemptCount: 0,
});

// ──────────── Stars ────────────

export function starsForAccuracy(accuracy: number, targetAccuracy: number): number {
  if (accuracy >= Math.min(targetAccuracy + 5, 100)) return 3;
  if (accuracy >= targetAccuracy) return 2;
  return 1;
}

// ──────────── Difficulty-based rewards ────────────

const DIFFICULTY_XP: Record<string, number> = {
  beginner: 25,
  easy: 50,
  intermediate: 75,
  advanced: 100,
  expert: 150,
  master: 200,
};

export function lessonReward(difficulty: Difficulty, wordCount: number): Reward {
  const base = DIFFICULTY_XP[difficulty] ?? 50;
  const xp = base + Math.floor(wordCount / 5);
  const coins = Math.round(xp / 2);
  const petExp = Math.max(1, Math.floor(wordCount / 10));
  return { xp, coins, petExp };
}

export function adventureStageReward(goal: number): Reward {
  const xp = goal * 3;
  const coins = goal;
  const petExp = Math.max(1, Math.floor(goal / 2));
  return { xp, coins, petExp };
}

export function bossStageReward(goal: number): Reward {
  const xp = goal * 6;
  const coins = goal * 2;
  const petExp = Math.max(2, goal);
  return { xp, coins, petExp };
}

// ──────────── Progression ────────────

export interface Milestone {
  level: number;
  title: string;
  rewards: Reward;
}

export interface LevelInfo {
  level: number;
  xp: number;
  xpForNext: number;
  progressPct: number;
}

export function xpForLevel(level: number): number {
  return level * 100;
}

export function totalXpForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) total += xpForLevel(i);
  return total;
}

export function computeLevelInfo(xp: number, level: number): LevelInfo {
  const needed = xpForLevel(level);
  return {
    level,
    xp,
    xpForNext: needed,
    progressPct: needed > 0 ? Math.round((xp / needed) * 100) : 0,
  };
}

export const MILESTONES: Milestone[] = [
  { level: 1, title: "Home Row", rewards: { coins: 50, xp: 0, petExp: 0 } },
  { level: 5, title: "Steady Typer", rewards: { coins: 100, xp: 0, petExp: 0, items: ["theme-forest"] } },
  { level: 10, title: "Top Row", rewards: { coins: 200, xp: 0, petExp: 0, items: ["theme-sakura"] } },
  { level: 15, title: "Rhythm Keeper", rewards: { coins: 300, xp: 0, petExp: 0 } },
  { level: 20, title: "Bottom Row", rewards: { coins: 400, xp: 0, petExp: 0, items: ["theme-ocean"] } },
  { level: 30, title: "Keyboard Explorer", rewards: { coins: 500, xp: 0, petExp: 0 } },
  { level: 40, title: "Speed Builder", rewards: { coins: 600, xp: 0, petExp: 0 } },
  { level: 50, title: "Accuracy Master", rewards: { coins: 800, xp: 0, petExp: 0, items: ["theme-castle"] } },
  { level: 75, title: "Keyboard Wizard", rewards: { coins: 1000, xp: 0, petExp: 0 } },
  { level: 100, title: "Pixel Legend", rewards: { coins: 2000, xp: 0, petExp: 0, items: ["theme-space"] } },
];

export function milestoneForLevel(level: number): Milestone | undefined {
  return MILESTONES.find((m) => m.level === level);
}

// ──────────── Quest ────────────

export type QuestStatus = "active" | "completed" | "claimed";

export type QuestConditionType =
  | "complete_lessons"
  | "reach_level"
  | "earn_coins"
  | "maintain_streak"
  | "complete_attempts"
  | "reach_wpm"
  | "reach_accuracy";

export interface QuestCondition {
  type: QuestConditionType;
  target: number;
  current: number;
  label: string;
}

export interface QuestDef {
  id: DomainId;
  title: string;
  description: string;
  emoji: string;
  conditions: QuestCondition[];
  reward: Reward;
}

export interface QuestState {
  questId: DomainId;
  status: QuestStatus;
  conditions: QuestCondition[];
  startedAt: number;
  completedAt?: number;
  claimedAt?: number;
}

export const QUEST_DEFS: QuestDef[] = [
  {
    id: "q-first-lesson",
    title: "First Steps",
    description: "Complete your first lesson.",
    emoji: "🌱",
    conditions: [{ type: "complete_lessons", target: 1, current: 0, label: "Lessons completed" }],
    reward: { coins: 50, xp: 100, petExp: 10 },
  },
  {
    id: "q-five-lessons",
    title: "Getting Started",
    description: "Complete 5 lessons.",
    emoji: "📚",
    conditions: [{ type: "complete_lessons", target: 5, current: 0, label: "Lessons completed" }],
    reward: { coins: 100, xp: 150, petExp: 20 },
  },
  {
    id: "q-twenty-lessons",
    title: "Dedicated Learner",
    description: "Complete 20 lessons.",
    emoji: "🎓",
    conditions: [{ type: "complete_lessons", target: 20, current: 0, label: "Lessons completed" }],
    reward: { coins: 300, xp: 500, petExp: 50 },
  },
  {
    id: "q-fifty-lessons",
    title: "Halfway There",
    description: "Complete 50 lessons.",
    emoji: "🏆",
    conditions: [{ type: "complete_lessons", target: 50, current: 0, label: "Lessons completed" }],
    reward: { coins: 500, xp: 1000, petExp: 100 },
  },
  {
    id: "q-all-lessons",
    title: "Curriculum Complete",
    description: "Complete all lessons.",
    emoji: "👑",
    conditions: [{ type: "complete_lessons", target: 90, current: 0, label: "Lessons completed" }],
    reward: { coins: 2000, xp: 5000, petExp: 500, items: ["theme-legendary-crown"] },
  },
  {
    id: "q-reach-level-5",
    title: "Level 5",
    description: "Reach level 5.",
    emoji: "⭐",
    conditions: [{ type: "reach_level", target: 5, current: 0, label: "Player level" }],
    reward: { coins: 150, xp: 0, petExp: 30 },
  },
  {
    id: "q-reach-level-10",
    title: "Level 10",
    description: "Reach level 10.",
    emoji: "🌟",
    conditions: [{ type: "reach_level", target: 10, current: 0, label: "Player level" }],
    reward: { coins: 300, xp: 0, petExp: 60 },
  },
  {
    id: "q-earn-1000-coins",
    title: "Coin Collector",
    description: "Earn 1,000 coins total.",
    emoji: "🪙",
    conditions: [{ type: "earn_coins", target: 1000, current: 0, label: "Coins earned" }],
    reward: { coins: 200, xp: 300, petExp: 40 },
  },
  {
    id: "q-streak-7",
    title: "Week Warrior",
    description: "Maintain a 7-day streak.",
    emoji: "🔥",
    conditions: [{ type: "maintain_streak", target: 7, current: 0, label: "Day streak" }],
    reward: { coins: 500, xp: 500, petExp: 100 },
  },
  {
    id: "q-streak-30",
    title: "Monthly Master",
    description: "Maintain a 30-day streak.",
    emoji: "💎",
    conditions: [{ type: "maintain_streak", target: 30, current: 0, label: "Day streak" }],
    reward: { coins: 2000, xp: 2000, petExp: 500, items: ["legendary-streak-crown"] },
  },
  {
    id: "q-wpm-40",
    title: "Speedster",
    description: "Reach 40 WPM on any lesson.",
    emoji: "⚡",
    conditions: [{ type: "reach_wpm", target: 40, current: 0, label: "Best WPM" }],
    reward: { coins: 250, xp: 400, petExp: 50 },
  },
  {
    id: "q-wpm-60",
    title: "Speed Demon",
    description: "Reach 60 WPM on any lesson.",
    emoji: "🚀",
    conditions: [{ type: "reach_wpm", target: 60, current: 0, label: "Best WPM" }],
    reward: { coins: 500, xp: 800, petExp: 100 },
  },
  {
    id: "q-wpm-80",
    title: "Speed Legend",
    description: "Reach 80 WPM on any lesson.",
    emoji: "💨",
    conditions: [{ type: "reach_wpm", target: 80, current: 0, label: "Best WPM" }],
    reward: { coins: 1000, xp: 1500, petExp: 200 },
  },
  {
    id: "q-accuracy-95",
    title: "Precise Typer",
    description: "Reach 95% accuracy on any lesson.",
    emoji: "🎯",
    conditions: [{ type: "reach_accuracy", target: 95, current: 0, label: "Best accuracy" }],
    reward: { coins: 200, xp: 300, petExp: 50 },
  },
  {
    id: "q-accuracy-100",
    title: "Flawless",
    description: "Get 100% accuracy on any lesson.",
    emoji: "💯",
    conditions: [{ type: "reach_accuracy", target: 100, current: 0, label: "Best accuracy" }],
    reward: { coins: 500, xp: 1000, petExp: 100 },
  },
];

// ──────────── Quest helpers ────────────

export function initialQuestStates(): QuestState[] {
  return QUEST_DEFS.map((q) => ({
    questId: q.id,
    status: "active" as QuestStatus,
    conditions: q.conditions.map((c) => ({ ...c })),
    startedAt: Date.now(),
  }));
}

export function isQuestComplete(qs: QuestState): boolean {
  return qs.conditions.every((c) => c.current >= c.target);
}

export function computeQuestProgress(
  quests: QuestState[],
  lessonProgress: Record<string, LessonProgress>,
  playerLevel: number,
  totalCoinsEarned: number,
  streak: number,
): QuestState[] {
  const completedLessonCount = Object.values(lessonProgress).filter((lp) => lp.completed).length;
  const bestWpm = Object.values(lessonProgress).reduce((max, lp) => Math.max(max, lp.bestWpm), 0);
  const bestAccuracy = Object.values(lessonProgress).reduce(
    (max, lp) => Math.max(max, lp.bestAccuracy),
    0,
  );

  return quests.map((qs) => {
    const def = QUEST_DEFS.find((d) => d.id === qs.questId);
    if (!def || qs.status === "claimed") return qs;

    const updatedConditions = def.conditions.map((c) => {
      let current = c.current;
      switch (c.type) {
        case "complete_lessons":
          current = completedLessonCount;
          break;
        case "reach_level":
          current = playerLevel;
          break;
        case "earn_coins":
          current = totalCoinsEarned;
          break;
        case "maintain_streak":
          current = streak;
          break;
        case "reach_wpm":
          current = bestWpm;
          break;
        case "reach_accuracy":
          current = bestAccuracy;
          break;
      }
      return { ...c, current };
    });

    const allMet = updatedConditions.every((c) => c.current >= c.target);
    const newStatus: QuestStatus = allMet
      ? "completed"
      : qs.status;

    const completedAt = allMet && qs.status === "active" ? Date.now() : qs.completedAt;

    return {
      ...qs,
      conditions: updatedConditions,
      status: newStatus,
      completedAt,
    };
  });
}

// ──────────── Unlock logic ────────────

export function isUnitUnlocked(unitNumber: number, completedLessonIds: Set<string>): boolean {
  if (unitNumber === 1) return true;
  // We don't import UNITS here to avoid circular deps. Units are passed in.
  return true; // caller must check
}

// ──────────── Typing stats (derived) ────────────

export interface TypingStats {
  totalAttempts: number;
  totalDuration: number;
  averageWpm: number;
  averageAccuracy: number;
  bestWpm: number;
  bestAccuracy: number;
  totalCorrectChars: number;
  totalMistakes: number;
}

export function computeTypingStats(attempts: Attempt[]): TypingStats {
  if (attempts.length === 0) {
    return {
      totalAttempts: 0,
      totalDuration: 0,
      averageWpm: 0,
      averageAccuracy: 0,
      bestWpm: 0,
      bestAccuracy: 0,
      totalCorrectChars: 0,
      totalMistakes: 0,
    };
  }
  return {
    totalAttempts: attempts.length,
    totalDuration: attempts.reduce((s, a) => s + a.duration, 0),
    averageWpm: Math.round(attempts.reduce((s, a) => s + a.wpm, 0) / attempts.length),
    averageAccuracy: Math.round(attempts.reduce((s, a) => s + a.accuracy, 0) / attempts.length),
    bestWpm: Math.max(...attempts.map((a) => a.wpm)),
    bestAccuracy: Math.max(...attempts.map((a) => a.accuracy)),
    totalCorrectChars: attempts.reduce((s, a) => s + a.correctChars, 0),
    totalMistakes: attempts.reduce((s, a) => s + a.mistakes, 0),
  };
}
