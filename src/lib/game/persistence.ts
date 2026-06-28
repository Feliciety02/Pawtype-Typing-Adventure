import type { GameState } from "./types";

const STORAGE_KEY = "pawtype-game-state";

export interface GamePersistence {
  save(state: GameState): void;
  load(): GameState | null;
}

export class LocalStoragePersistence implements GamePersistence {
  save(state: GameState): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Failed to save game state:", e);
    }
  }

  load(): GameState | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as GameState;
    } catch {
      return null;
    }
  }

  clear(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }
}

export const persistence = new LocalStoragePersistence();
