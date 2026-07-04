import { getSessions, type TypingSession } from "../stats";
import type { PlayerTrends, TrendDirection } from "./types";

export async function loadRecentSessions(count = 15): Promise<TypingSession[]> {
  const sessions = await getSessions(30);
  return sessions.slice(0, count);
}

function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}

function direction(values: number[]): TrendDirection {
  if (values.length < 4) return "flat";
  const recent = values.slice(0, 3);
  const older = values.slice(-3);
  const recentAvg = average(recent);
  const olderAvg = average(older);
  const diff = recentAvg - olderAvg;
  if (diff > 3) return "up";
  if (diff < -3) return "down";
  return "flat";
}

export function computeTrends(sessions: TypingSession[]): PlayerTrends | null {
  if (sessions.length < 2) return null;

  const wpms = sessions.map((s) => s.wpm);
  const accuracies = sessions.map((s) => s.accuracy);
  const combos = sessions.map((s) => s.bestCombo);

  return {
    wpm: {
      direction: direction(wpms),
      change: Math.round((wpms[0] - average(wpms.slice(1))) * 10) / 10,
      average: Math.round(average(wpms) * 10) / 10,
    },
    accuracy: {
      direction: direction(accuracies),
      change: Math.round((accuracies[0] - average(accuracies.slice(1))) * 10) / 10,
      average: Math.round(average(accuracies) * 10) / 10,
    },
    combo: {
      direction: direction(combos),
      change: Math.round(combos[0] - average(combos.slice(1))),
      average: Math.round(average(combos)),
    },
    sessionCount: sessions.length,
  };
}

export function personalBestWpm(sessions: TypingSession[]): number {
  return Math.max(...sessions.map((s) => s.wpm), 0);
}
