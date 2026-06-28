export type KeystrokeEvent = {
  charIndex: number;
  char: string;
  target: string;
  correct: boolean;
  timestamp: number;
};

export type TypingSession = {
  id?: number;
  timestamp: number;
  duration: number;
  wpm: number;
  accuracy: number;
  correctChars: number;
  mistakes: number;
  bestCombo: number;
  keystrokes: KeystrokeEvent[];
};

const DB_NAME = "pawtype-stats";
const DB_VERSION = 1;
const STORE = "sessions";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id", autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveSession(session: Omit<TypingSession, "id">): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    const req = store.add(session);
    req.onsuccess = () => resolve(req.result as number);
    req.onerror = () => reject(req.error);
  });
}

export async function getSessions(limit = 50): Promise<TypingSession[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const store = tx.objectStore(STORE);
    const req = store.getAll(null, limit);
    req.onsuccess = () => {
      const sessions = (req.result as TypingSession[]).reverse();
      resolve(sessions);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function clearSessions(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    const req = store.clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}
