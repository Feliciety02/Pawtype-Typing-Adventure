export type InsightType = "praise" | "tip" | "warning" | "milestone" | "trend";

export type CoachInsight = {
  text: string;
  type: InsightType;
};

export type TrendDirection = "up" | "down" | "flat";

export type PlayerTrends = {
  wpm: { direction: TrendDirection; change: number; average: number };
  accuracy: { direction: TrendDirection; change: number; average: number };
  combo: { direction: TrendDirection; change: number; average: number };
  sessionCount: number;
};

export type KeystrokeData = {
  target: string;
  correct: boolean;
};

export type SessionData = {
  wpm: number;
  accuracy: number;
  duration: number;
  correctChars: number;
  mistakes: number;
  bestCombo: number;
  keystrokes: KeystrokeData[];
  isPersonalBest: boolean;
  isPerfect: boolean;
};
