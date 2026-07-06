import type { WorldId } from "@/components/shared/WorldTheme";

export const WORD_BANK = [
  "pixel",
  "cozy",
  "cabin",
  "sakura",
  "forest",
  "coffee",
  "rain",
  "cloud",
  "moss",
  "lantern",
  "harbor",
  "cat",
  "mochi",
  "quest",
  "river",
  "ember",
  "willow",
  "quiet",
  "golden",
  "story",
  "garden",
  "pebble",
  "comet",
  "glow",
  "brave",
  "spark",
  "meadow",
  "cinnamon",
  "velvet",
  "drift",
  "kindle",
  "cottage",
  "linen",
  "amber",
  "clover",
  "biscuit",
  "journey",
  "whisper",
  "feather",
  "silver",
  "bramble",
  "copper",
  "ivory",
  "midnight",
  "gentle",
  "compass",
  "horizon",
  "lullaby",
  "marigold",
  "sprout",
];

export function makeWordsFrom(text: string | null): string[] {
  if (!text) return makeWords();
  const words = text.split(/\s+/).filter(Boolean);
  return words.length >= 15 ? sprinklePunctuation(words) : makeWords();
}

export function makeWords(n = 80) {
  const out: string[] = [];
  for (let i = 0; i < n; i++) out.push(WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)]);
  return out;
}

export type Mood = "idle" | "happy" | "oops" | "sleep";

export const DURATIONS = [15, 30, 60] as const;

import { sprinklePunctuation } from "../../lib/game/textGenerator";
