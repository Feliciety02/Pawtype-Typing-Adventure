import type { TypingSession } from "../types";
import { analyzePatterns, drillRecommendation } from "./patterns";

export type DifficultyLevel = "Easy" | "Normal" | "Hard" | "Boss";

let cachedGoals: Record<DifficultyLevel, number> | null = null;

export async function precomputeGoals(
  sessions: TypingSession[],
): Promise<Record<DifficultyLevel, number>> {
  if (cachedGoals) return cachedGoals;
  cachedGoals = {
    Easy: recommendGoal(sessions, "Easy"),
    Normal: recommendGoal(sessions, "Normal"),
    Hard: recommendGoal(sessions, "Hard"),
    Boss: recommendGoal(sessions, "Boss"),
  };
  return cachedGoals;
}

export function getCachedGoals(): Record<DifficultyLevel, number> {
  if (cachedGoals) return cachedGoals;
  return { Easy: 20, Normal: 30, Hard: 40, Boss: 50 };
}

export function invalidateGoalCache(): void {
  cachedGoals = null;
}

export function recommendGoal(sessions: TypingSession[], difficulty: DifficultyLevel): number {
  if (sessions.length === 0) {
    const defaults: Record<DifficultyLevel, number> = { Easy: 20, Normal: 30, Hard: 40, Boss: 50 };
    return defaults[difficulty];
  }

  const recent = sessions.slice(0, 10);
  const avgWpm = recent.reduce((s, r) => s + r.wpm, 0) / recent.length;
  const maxWpm = Math.max(...recent.map((r) => r.wpm));

  const multipliers: Record<DifficultyLevel, number> = {
    Easy: 0.6,
    Normal: 0.8,
    Hard: 1.0,
    Boss: 1.2,
  };
  const target = avgWpm * multipliers[difficulty];

  const minGoals: Record<DifficultyLevel, number> = { Easy: 15, Normal: 20, Hard: 30, Boss: 40 };
  const maxGoals: Record<DifficultyLevel, number> = { Easy: 60, Normal: 80, Hard: 100, Boss: 120 };

  return Math.round(
    Math.max(minGoals[difficulty], Math.min(maxGoals[difficulty], Math.max(target, maxWpm * 0.5))),
  );
}

export function recommendDuration(sessions: TypingSession[]): number {
  if (sessions.length < 3) return 30;

  const recent = sessions.slice(0, 5);
  const avgWpm = recent.reduce((s, r) => s + r.wpm, 0) / recent.length;
  const avgAccuracy = recent.reduce((s, r) => s + r.accuracy, 0) / recent.length;

  if (avgWpm < 15) return 60;
  if (avgAccuracy < 80) return 60;
  if (avgWpm < 30) return 30;
  if (avgWpm > 60 && avgAccuracy > 95) return 15;

  return 30;
}

export type DailySuggestion = {
  title: string;
  description: string;
  type: "speed" | "accuracy" | "weakness" | "explore" | "warmup";
};

export async function dailySuggestion(sessions: TypingSession[]): Promise<DailySuggestion> {
  const report = await analyzePatterns(sessions).catch(() => null);

  if (sessions.length === 0) {
    return {
      title: "First Steps",
      description: "Start with a 30-second practice run to set your baseline.",
      type: "warmup",
    };
  }

  const recent = sessions.slice(0, 5);
  const accuracy = recent.reduce((s, r) => s + r.accuracy, 0) / recent.length;
  const wpm = recent.reduce((s, r) => s + r.wpm, 0) / recent.length;
  const streak = recent.filter((r) => r.accuracy >= 95).length;

  if (accuracy < 80 && sessions.length >= 3) {
    return {
      title: "Accuracy Focus",
      description: "Run a slow, deliberate session aiming for 95%+ accuracy. Speed comes second.",
      type: "accuracy",
    };
  }

  if (wpm < 20 && sessions.length >= 3) {
    return {
      title: "Home Row Warmup",
      description: "Spend 60 seconds on home row keys (ASDF JKL;) before pushing faster.",
      type: "warmup",
    };
  }

  if (report && report.topWeakChars.length > 0) {
    const chars = report.topWeakChars
      .slice(0, 2)
      .map((c) => `"${c.char}"`)
      .join(", ");
    return {
      title: `Weak Key Drill: ${chars}`,
      description: `Practice words containing ${chars}. Slow and clean — build accuracy on those keys.`,
      type: "weakness",
    };
  }

  if (streak >= 3) {
    return {
      title: "Speed Push",
      description: `You've had ${streak} clean runs. Try a 15-second sprint at a faster pace.`,
      type: "speed",
    };
  }

  return {
    title: "Keep Steady",
    description: `Maintain your ${Math.round(wpm)} WPM pace with clean form. Consistency builds speed.`,
    type: "explore",
  };
}

export type ProgressSummary = {
  wpm: { current: number; change: number; best: number };
  accuracy: { current: number; change: number };
  totalSessions: number;
  consistency: "high" | "medium" | "low";
};

export async function progressSummary(sessions: TypingSession[]): Promise<ProgressSummary> {
  const total = sessions.length;
  const current = sessions[0] ?? null;
  const recent = sessions.slice(0, 5);
  const older = sessions.slice(5, 15);

  const currentWpm = current?.wpm ?? 0;
  const currentAcc = current?.accuracy ?? 0;
  const bestWpm = sessions.length > 0 ? Math.max(...sessions.map((s) => s.wpm)) : 0;

  const avgRecentWpm =
    recent.length > 0 ? recent.reduce((s, r) => s + r.wpm, 0) / recent.length : 0;
  const avgOlderWpm = older.length > 0 ? older.reduce((s, r) => s + r.wpm, 0) / older.length : 0;
  const wpmChange = older.length > 0 ? Math.round((avgRecentWpm - avgOlderWpm) * 10) / 10 : 0;

  const avgRecentAcc =
    recent.length > 0 ? recent.reduce((s, r) => s + r.accuracy, 0) / recent.length : 0;
  const avgOlderAcc =
    older.length > 0 ? older.reduce((s, r) => s + r.accuracy, 0) / older.length : 0;
  const accChange = Math.round((avgRecentAcc - avgOlderAcc) * 10) / 10;

  const wpmVariance =
    recent.length > 1
      ? Math.sqrt(recent.reduce((s, r) => s + (r.wpm - avgRecentWpm) ** 2, 0) / recent.length)
      : Infinity;
  const consistency: "high" | "medium" | "low" =
    wpmVariance < 5 ? "high" : wpmVariance < 12 ? "medium" : "low";

  return {
    wpm: { current: currentWpm, change: wpmChange, best: bestWpm },
    accuracy: { current: currentAcc, change: accChange },
    totalSessions: total,
    consistency,
  };
}
