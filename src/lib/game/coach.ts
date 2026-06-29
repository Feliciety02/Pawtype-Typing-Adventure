import type { TypingSession } from "./stats";

const OLLAMA_URL = "http://localhost:11434/api/generate";

export type CoachInsight = {
  text: string;
  type: "praise" | "tip" | "warning" | "milestone";
};

function buildPrompt(session: {
  wpm: number;
  accuracy: number;
  duration: number;
  correctChars: number;
  mistakes: number;
  bestCombo: number;
  mistakeChars: { char: string; count: number }[];
  isPersonalBest: boolean;
  isPerfect: boolean;
}): string {
  const topMistakes = session.mistakeChars
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((m) => `'${m.char}': ${m.count}x`)
    .join(", ");

  return `You are a friendly typing coach. Analyze this session and give ONE specific, encouraging sentence. No markdown. No greetings. Just the tip.

Session:
- WPM: ${session.wpm}
- Accuracy: ${session.accuracy}%
- Duration: ${session.duration}s
- Correct chars: ${session.correctChars}
- Mistakes: ${session.mistakes}
- Best combo: ${session.bestCombo}
- Top mistake chars: ${topMistakes || "none"}
${session.isPersonalBest ? "- This is a personal best!" : ""}
${session.isPerfect ? "- Perfect accuracy!" : ""}

Rules:
- If accuracy < 90%: focus on accuracy over speed
- If combo > 30: praise consistency
- If WPM < 20: encourage home row practice
- If isPerfect: celebrate but keep it humble
- Be specific, reference actual numbers from the session`;
}

export async function getCoachFeedback(session: {
  wpm: number;
  accuracy: number;
  duration: number;
  correctChars: number;
  mistakes: number;
  bestCombo: number;
  keystrokes: { correct: boolean; target: string }[];
  isPersonalBest: boolean;
  isPerfect: boolean;
}): Promise<CoachInsight | null> {
  const mistakeMap = new Map<string, number>();
  for (const k of session.keystrokes) {
    if (!k.correct) {
      mistakeMap.set(k.target, (mistakeMap.get(k.target) ?? 0) + 1);
    }
  }

  const mistakeChars = Array.from(mistakeMap.entries()).map(([char, count]) => ({ char, count }));

  const prompt = buildPrompt({ ...session, mistakeChars });

  try {
    const res = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "llama3.2:1b", prompt, stream: false }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const text = (data.response ?? "").trim();

    if (!text) return null;

    let type: CoachInsight["type"] = "tip";
    if (session.isPerfect) type = "praise";
    else if (session.accuracy >= 97) type = "milestone";
    else if (session.accuracy < 85) type = "warning";

    return { text, type };
  } catch {
    return null;
  }
}
