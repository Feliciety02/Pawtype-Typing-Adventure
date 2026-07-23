// Pet mood & hunger tracker — persisted per pet type in localStorage.
// Feeding refreshes mood; mood decays over ~24h to "content" then "hungry".
// Purely presentational; does not gate gameplay.

import type { PetType } from "./types";

const KEY = "pawtype-pet-mood";
const HAPPY_WINDOW_MS = 4 * 60 * 60 * 1000; // 4h → Happy
const CONTENT_WINDOW_MS = 20 * 60 * 60 * 1000; // 4–20h → Content
// after 20h → Hungry

export type PetMood = "happy" | "content" | "hungry";

type MoodStore = Record<string, { lastFed: number }>;

function read(): MoodStore {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

function write(store: MoodStore) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(store));
    window.dispatchEvent(new Event("pawtype-pet-mood-changed"));
  } catch {
    /* ignore */
  }
}

export function moodFor(petType: PetType | null): PetMood {
  if (!petType) return "content";
  const store = read();
  const entry = store[petType];
  if (!entry) return "content";
  const elapsed = Date.now() - entry.lastFed;
  if (elapsed < HAPPY_WINDOW_MS) return "happy";
  if (elapsed < CONTENT_WINDOW_MS) return "content";
  return "hungry";
}

export function markFed(petType: PetType) {
  const store = read();
  store[petType] = { lastFed: Date.now() };
  write(store);
}

export const MOOD_META: Record<PetMood, { emoji: string; label: string; tint: string }> = {
  happy: { emoji: "😻", label: "Happy", tint: "var(--leaf, #7cc36c)" },
  content: { emoji: "😺", label: "Content", tint: "var(--coin, #f4c86a)" },
  hungry: { emoji: "🍽️", label: "Hungry", tint: "var(--color-destructive, #e07a5f)" },
};
