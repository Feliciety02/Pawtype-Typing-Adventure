import type { TypingSession } from "./types";

export type GhostRace = Pick<TypingSession, "timestamp" | "duration" | "wpm" | "accuracy" | "bestCombo">;

export function personalBestGhost(sessions: TypingSession[]): GhostRace | null {
  if (sessions.length === 0) return null;
  return sessions.reduce((best, session) =>
    session.wpm > best.wpm || (session.wpm === best.wpm && session.accuracy > best.accuracy)
      ? session
      : best,
  );
}

export function queueGhostRace(ghost: GhostRace) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem("pawtype-ghost-race", JSON.stringify(ghost));
}
