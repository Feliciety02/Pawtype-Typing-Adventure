import type { TypingSession } from "../types";
import type { CoachInsight, SessionData } from "./types";
import { loadRecentSessions, computeTrends, personalBestWpm } from "./history";
import { analyzePatterns, drillRecommendation } from "./patterns";

function topMistakeChar(
  keystrokes: SessionData["keystrokes"],
): { char: string; count: number } | null {
  const counts = new Map<string, number>();
  for (const k of keystrokes) {
    if (!k.correct) {
      counts.set(k.target, (counts.get(k.target) ?? 0) + 1);
    }
  }
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  return sorted.length > 0 ? { char: sorted[0][0], count: sorted[0][1] } : null;
}

function buildTrendInsight(
  session: SessionData,
  trends: NonNullable<ReturnType<typeof computeTrends>>,
): CoachInsight | null {
  const { wpm, accuracy } = trends;

  if (wpm.direction === "up" && wpm.change >= 3) {
    return {
      type: "trend",
      text: `You're up ${wpm.change} WPM from your recent average (${wpm.average}). That's real progress — keep the same approach.`,
    };
  }

  if (wpm.direction === "down" && wpm.change <= -3 && session.mistakes > 0) {
    return {
      type: "warning",
      text: `Your speed dipped ${Math.abs(wpm.change)} WPM below average. Slow down and focus on accuracy to rebuild rhythm.`,
    };
  }

  if (accuracy.direction === "up" && accuracy.change >= 2) {
    return {
      type: "trend",
      text: `Accuracy improved ${accuracy.change}% over your recent average (${accuracy.average}%). Clean keystrokes are building.`,
    };
  }

  if (accuracy.direction === "down" && accuracy.change <= -2) {
    const mistake = topMistakeChar(session.keystrokes);
    if (mistake) {
      return {
        type: "tip",
        text: `Accuracy slipped ${Math.abs(accuracy.change)}%. The "${mistake.char}" key caused ${mistake.count} errors — drill that character.`,
      };
    }
    return {
      type: "tip",
      text: `Accuracy slipped ${Math.abs(accuracy.change)}%. Focus on deliberate keystrokes over speed right now.`,
    };
  }

  if (trends.sessionCount >= 5 && wpm.direction === "flat" && accuracy.direction === "flat") {
    return {
      type: "tip",
      text: `You've been steady around ${wpm.average} WPM for ${trends.sessionCount} sessions. Try a slightly faster pace to break the plateau.`,
    };
  }

  return null;
}

function buildMomentumInsight(session: SessionData, allTimeBest: number): CoachInsight | null {
  if (session.isPerfect) {
    return {
      type: "praise",
      text: `Perfect ${session.accuracy}% accuracy at ${session.wpm} WPM. Every keystroke landed — that's the mark of control.`,
    };
  }

  if (session.isPersonalBest && session.wpm > 0) {
    return {
      type: "milestone",
      text: `Personal best: ${session.wpm} WPM. You're closing in on ${allTimeBest > session.wpm ? `your all-time best of ${allTimeBest}` : "new records"}.`,
    };
  }

  if (session.accuracy < 80) {
    const mistake = topMistakeChar(session.keystrokes);
    if (mistake) {
      return {
        type: "warning",
        text: `Accuracy is ${session.accuracy}%. The "${mistake.char}" key accounts for ${mistake.count} errors. Ease the pace and land that key cleanly.`,
      };
    }
    return {
      type: "warning",
      text: `Accuracy dropped to ${session.accuracy}%. Cut your pace by half and focus on clean keystrokes before adding speed.`,
    };
  }

  if (session.bestCombo >= 40) {
    return {
      type: "praise",
      text: `${session.bestCombo} keys in a row without a miss. Your hand memory is locking in — speed will follow naturally.`,
    };
  }

  if (session.bestCombo >= 20) {
    return {
      type: "praise",
      text: `A ${session.bestCombo}-key streak shows solid consistency. Keep that rhythm and the WPM will climb.`,
    };
  }

  if (session.wpm < 20) {
    return {
      type: "tip",
      text: `You averaged ${session.wpm} WPM. Practice home row positioning — keep fingers on ASDF and JKL; and move only when needed.`,
    };
  }

  const mistake = topMistakeChar(session.keystrokes);
  if (mistake && mistake.count >= 3) {
    return {
      type: "tip",
      text: `The "${mistake.char}" key tripped you up ${mistake.count} times. Try a short drill focusing on words with that letter.`,
    };
  }

  return null;
}

function buildFallbackInsight(session: SessionData): CoachInsight {
  if (session.accuracy >= 97) {
    return {
      type: "milestone",
      text: `${session.wpm} WPM at ${session.accuracy}% accuracy. Strong control — push the pace slightly on your next run.`,
    };
  }
  return {
    type: "tip",
    text: `You held ${session.wpm} WPM for ${Math.round(session.duration)}s. Try keeping the same speed but cutting mistakes in half next time.`,
  };
}

async function buildPatternInsight(
  session: SessionData,
  sessions: TypingSession[],
): Promise<CoachInsight | null> {
  const report = await analyzePatterns(sessions);
  if (!report || report.topWeakChars.length === 0) return null;

  const sessionMistake = topMistakeChar(session.keystrokes);
  const topWeak = report.topWeakChars[0];

  if (sessionMistake && sessionMistake.char === topWeak.char && session.accuracy > 90) {
    return {
      type: "trend",
      text: `The "${topWeak.char}" key used to be your weakest (${topWeak.accuracy}% historically) — but you handled it well this run. Improvement is real.`,
    };
  }

  if (report.weakestZone && report.weakestZone.accuracy < 85 && report.weakestZone.mistakes > 5) {
    return {
      type: "tip",
      text: `Your ${report.weakestZone.label.toLowerCase()} zone is at ${report.weakestZone.accuracy}% accuracy overall. Try slow drills targeting those keys.`,
    };
  }

  if (report.topWeakBigrams.length > 0) {
    const top = report.topWeakBigrams[0];
    return {
      type: "tip",
      text: `The "${top.pair}" sequence trips you up often (${top.accuracy}% accuracy). Practice transitioning between those two letters slowly.`,
    };
  }

  return null;
}

export async function getCoachFeedback(
  session: SessionData,
  sessions: TypingSession[],
): Promise<CoachInsight | null> {
  try {
    const recent = loadRecentSessions(sessions, 15);
    const trends = computeTrends(recent);
    const allTimeBest = recent.length > 0 ? personalBestWpm(recent) : 0;

    const trendInsight = trends ? buildTrendInsight(session, trends) : null;
    if (trendInsight) return trendInsight;

    const patternInsight = await buildPatternInsight(session, sessions);
    if (patternInsight) return patternInsight;

    const momentumInsight = buildMomentumInsight(session, allTimeBest);
    if (momentumInsight) return momentumInsight;

    return buildFallbackInsight(session);
  } catch {
    return null;
  }
}
