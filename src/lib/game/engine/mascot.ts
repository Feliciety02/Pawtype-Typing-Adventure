export type MascotContext = {
  combo: number;
  bestCombo: number;
  mistakes: number;
  correctChars: number;
  weakChars: string[];
  wpm?: number;
};

const IDLE_LINES = [
  "Ready when your paws are.",
  "Tap in and wake the room.",
  "A cozy run is waiting.",
  "Your keyboard is warm and ready.",
  "Stillness before the first keystroke.",
];

const HAPPY_LINES = [
  "Nice rhythm, keep gliding.",
  "Clean strokes, steady paws.",
  "That flow looks sharp.",
  "Every key lands just right.",
  "Your fingers know the way.",
];

const OOPS_LINES = [
  "Slow it down, stay smooth.",
  "Breathe, then land each key.",
  "Reset the rhythm, not the run.",
  "Even the best typists pause.",
  "One key at a time.",
];

const SLEEP_LINES = [
  "The room is sleepy. Type.",
  "Wake the keys with one word.",
  "Your keyboard is waiting.",
  "A single keystroke breaks the silence.",
  "Start anywhere — just type.",
];

function pick<T>(items: T[], seed: string): T {
  const index = seed.split("").reduce((s, c) => s + c.charCodeAt(0), 0) % items.length;
  return items[index];
}

function comboLine(combo: number, bestCombo: number): string | null {
  if (combo >= 40) {
    return `${combo} keys in a row! Your fingers are dancing.`;
  }
  if (combo >= 25) {
    return `That's a ${combo}-key streak. Keep that flow going.`;
  }
  if (combo >= 15) {
    if (bestCombo > combo) {
      return `${combo} keys clean. Your best is ${bestCombo} — push for it.`;
    }
    return `${combo} keys smooth. This is your best run yet.`;
  }
  return null;
}

function weakCharLine(weakChars: string[], mistakes: number): string | null {
  if (weakChars.length === 0) return null;
  if (mistakes < 2) return null;
  const char = weakChars[0];
  const quote = (c: string) => `"${c}"`;
  if (mistakes >= 5) {
    return `The ${quote(char)} key keeps tripping you. Slow down and land it clean.`;
  }
  if (mistakes >= 3) {
    return `Watch the ${quote(char)} key — it's your most missed. Take an extra beat.`;
  }
  return `The ${quote(char)} key gave you trouble. Try a quick drill on it later.`;
}

function encouragementLine(mistakes: number, correctChars: number): string | null {
  if (mistakes === 0 && correctChars > 20) {
    return "Not a single mistake so far — flawless control.";
  }
  if (correctChars > 50 && mistakes < 3) {
    return `${correctChars} characters and only ${mistakes} off. That's precision.`;
  }
  if (correctChars > 100) {
    return `${correctChars} chars in. You're building real stamina.`;
  }
  return null;
}

function contextLine(ctx: MascotContext): string | null {
  const combo = comboLine(ctx.combo, ctx.bestCombo);
  if (combo) return combo;

  const weak = weakCharLine(ctx.weakChars, ctx.mistakes);
  if (weak) return weak;

  const encourage = encouragementLine(ctx.mistakes, ctx.correctChars);
  if (encourage) return encourage;

  return null;
}

export function generateMascotLine(mood: string, ctx?: MascotContext): string | null {
  const pool =
    mood === "idle"
      ? IDLE_LINES
      : mood === "happy"
        ? HAPPY_LINES
        : mood === "oops"
          ? OOPS_LINES
          : mood === "sleep"
            ? SLEEP_LINES
            : null;

  if (!pool) return null;

  if (ctx && (mood === "happy" || mood === "oops")) {
    const contextual = contextLine(ctx);
    if (contextual) return contextual;
  }

  return pick(pool, mood + (ctx?.combo ?? 0));
}
