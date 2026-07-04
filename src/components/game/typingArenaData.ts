import type { WorldId } from "../shared/WorldTheme";

export const WORD_BANK = [
  "pixel","cozy","cabin","sakura","forest","coffee","rain","cloud","moss","lantern",
  "harbor","cat","mochi","quest","river","ember","willow","quiet","golden","story",
  "garden","pebble","comet","glow","brave","spark","meadow","cinnamon","velvet","drift",
  "kindle","cottage","linen","amber","clover","biscuit","journey","whisper","feather","silver",
  "bramble","copper","ivory","midnight","gentle","compass","horizon","lullaby","marigold","sprout",
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

export const WORLD_ART_URL: Partial<Record<WorldId, string>> = {
  cafe: "/theme/cozy-cafe.png",
  forest: "/theme/mossy-forest.png",
  ocean: "/theme/tide-pool.png",
  sakura: "/theme/sakura-park.png",
  castle: "/theme/royal-castle.png",
  space: "/theme/stardust.png",
  autumn: "/theme/cozy-campsite.png",
  mushroom: "/theme/fairy-mushroom-village.png",
  "volcanic-forge": "/theme/volcanic-forge.png",
  sunflower: "/theme/sunflower-meadow.png",
  "desert-oasis": "/theme/desert-oasis.png",
  "steam-punk-workshop": "/theme/steam-punk-workshop.png",
  "frostveil-kingdom": "/theme/frostveil-kingdom.png",
};

import { sprinklePunctuation } from "../../lib/game/textGenerator";
