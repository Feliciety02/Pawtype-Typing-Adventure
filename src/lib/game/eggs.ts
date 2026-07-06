// Pet egg milestones — awarded every 10 completed lessons.
// State lives in localStorage so it survives sessions (independent of the
// GameState reducer). Hatching a pet dispatches ADOPT_PET into the game store,
// which is the source of truth for owned pets.

import type { PetType } from "./types";
import { PET_NAMES } from "./types";

const CLAIMED_KEY = "pawtype-claimed-eggs";
const PENDING_KEY = "pawtype-pending-eggs";
export const LESSONS_PER_EGG = 10;

// Pool of hatchable pets, in reveal order. Starter (cat) is excluded so the
// first egg is always a new companion.
export const EGG_POOL: PetType[] = ["dog", "fox", "rabbit", "panda", "penguin", "dragon"];

export type EggMilestone = {
  /** 1-indexed egg number (1, 2, 3...). Milestone reached at n*10 lessons. */
  index: number;
  /** Lessons required to claim this egg. */
  threshold: number;
  /** The pet that will hatch (deterministic by index). */
  petType: PetType;
};

export function milestoneForIndex(index: number): EggMilestone {
  const petType = EGG_POOL[(index - 1) % EGG_POOL.length];
  return { index, threshold: index * LESSONS_PER_EGG, petType };
}

export function petLabel(pet: PetType): string {
  return PET_NAMES[pet] ?? pet;
}

// ---------- persistence ----------
function readSet(key: string): Set<number> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as number[];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}
function writeSet(key: string, set: Set<number>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify([...set]));
  } catch {
    /* ignore */
  }
}

export function loadClaimedEggs(): Set<number> {
  return readSet(CLAIMED_KEY);
}
export function loadPendingEggs(): Set<number> {
  return readSet(PENDING_KEY);
}

/**
 * Return milestone indices the player has earned (based on lesson count) but
 * not yet claimed via the hatching modal.
 */
export function getUnclaimedMilestones(completedLessons: number): EggMilestone[] {
  const earned = Math.floor(completedLessons / LESSONS_PER_EGG);
  const claimed = loadClaimedEggs();
  const out: EggMilestone[] = [];
  for (let i = 1; i <= earned; i++) {
    if (!claimed.has(i)) out.push(milestoneForIndex(i));
  }
  return out;
}

/** Mark an egg as claimed. Idempotent. */
export function markEggClaimed(index: number) {
  const claimed = loadClaimedEggs();
  if (claimed.has(index)) return;
  claimed.add(index);
  writeSet(CLAIMED_KEY, claimed);
  // remove from pending queue if present
  const pending = loadPendingEggs();
  if (pending.delete(index)) writeSet(PENDING_KEY, pending);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("pawtype-egg-claimed", { detail: { index } }));
  }
}

/** Queue an egg as pending (earned but modal not yet acknowledged). */
export function queuePendingEgg(index: number) {
  const claimed = loadClaimedEggs();
  if (claimed.has(index)) return;
  const pending = loadPendingEggs();
  if (pending.has(index)) return;
  pending.add(index);
  writeSet(PENDING_KEY, pending);
}

export function progressTowardNextEgg(completedLessons: number) {
  const nextIndex = Math.floor(completedLessons / LESSONS_PER_EGG) + 1;
  const target = nextIndex * LESSONS_PER_EGG;
  const progress = completedLessons % LESSONS_PER_EGG;
  return { nextIndex, target, progress, total: LESSONS_PER_EGG };
}
