const RECENT_WORDS: Set<string> = new Set();
const RECENT_MAX = 80;

export function trackUsed(words: string[]) {
  for (const w of words) {
    const key = w.toLowerCase().replace(/[^a-z]/g, "");
    if (key.length < 2) continue;
    RECENT_WORDS.add(key);
    if (RECENT_WORDS.size > RECENT_MAX) {
      const first = RECENT_WORDS.values().next().value;
      if (first) RECENT_WORDS.delete(first);
    }
  }
}

export function isRecent(word: string): boolean {
  return RECENT_WORDS.has(word.toLowerCase().replace(/[^a-z]/g, ""));
}

export function pickFresh(words: string[], count: number): string[] {
  const fresh = words.filter((w) => !isRecent(w));
  const pool = fresh.length >= count ? fresh : words;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
