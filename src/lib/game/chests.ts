// Configurable treasure-chest reward markers.
// Which lessons get a chest is user-controlled (previously fixed to every 5th).
// State is persisted in localStorage so it survives sessions.

const CHESTS_KEY = "pawtype-chest-lessons";
const CLAIMED_CHEST_KEY = "pawtype-claimed-chests";

function readSet(key: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function writeSet(key: string, set: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify([...set]));
    window.dispatchEvent(new Event("pawtype-chests-changed"));
  } catch {
    /* ignore */
  }
}

export function loadChestLessons(): Set<string> {
  return readSet(CHESTS_KEY);
}

export function setChestLessons(lessonIds: Iterable<string>) {
  writeSet(CHESTS_KEY, new Set(lessonIds));
}

export function toggleChestLesson(lessonId: string) {
  const set = loadChestLessons();
  if (set.has(lessonId)) set.delete(lessonId);
  else set.add(lessonId);
  writeSet(CHESTS_KEY, set);
}

export function isChestLesson(lessonId: string): boolean {
  return loadChestLessons().has(lessonId);
}

export function loadClaimedChests(): Set<string> {
  return readSet(CLAIMED_CHEST_KEY);
}

export function markChestClaimed(lessonId: string) {
  const set = loadClaimedChests();
  if (set.has(lessonId)) return;
  set.add(lessonId);
  writeSet(CLAIMED_CHEST_KEY, set);
}
