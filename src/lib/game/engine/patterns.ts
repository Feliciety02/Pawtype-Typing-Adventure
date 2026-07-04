import { getSessions, type TypingSession, type KeystrokeEvent } from "../stats";

export type CharStats = {
  char: string;
  attempts: number;
  mistakes: number;
  accuracy: number;
};

export type BigramStats = {
  pair: string;
  attempts: number;
  mistakes: number;
  accuracy: number;
};

export type KeyboardZone = "left-top" | "left-home" | "left-bottom" | "right-top" | "right-home" | "right-bottom";

const KEYBOARD_MAP: Record<string, KeyboardZone> = {
  q: "left-top", w: "left-top", e: "left-top", r: "left-top", t: "left-top",
  a: "left-home", s: "left-home", d: "left-home", f: "left-home", g: "left-home",
  z: "left-bottom", x: "left-bottom", c: "left-bottom", v: "left-bottom", b: "left-bottom",
  y: "right-top", u: "right-top", i: "right-top", o: "right-top", p: "right-top",
  h: "right-home", j: "right-home", k: "right-home", l: "right-home",
  n: "right-bottom", m: "right-bottom",
};

export type ZoneStats = {
  zone: KeyboardZone;
  total: number;
  mistakes: number;
  accuracy: number;
  label: string;
};

export type PatternReport = {
  chars: CharStats[];
  bigrams: BigramStats[];
  zones: ZoneStats[];
  topWeakChars: CharStats[];
  topWeakBigrams: BigramStats[];
  weakestZone: ZoneStats | null;
};

const ZONE_LABELS: Record<KeyboardZone, string> = {
  "left-top": "Left Top Row (Q,W,E,R,T)",
  "left-home": "Left Home Row (A,S,D,F,G)",
  "left-bottom": "Left Bottom Row (Z,X,C,V,B)",
  "right-top": "Right Top Row (Y,U,I,O,P)",
  "right-home": "Right Home Row (H,J,K,L)",
  "right-bottom": "Right Bottom Row (N,M)",
};

function extractEvents(sessions: TypingSession[]): KeystrokeEvent[] {
  return sessions.flatMap((s) => s.keystrokes ?? []);
}

function computeCharStats(events: KeystrokeEvent[]): CharStats[] {
  const counts = new Map<string, { attempts: number; mistakes: number }>();
  for (const ev of events) {
    const key = ev.target.toLowerCase();
    if (!/^[a-z]$/.test(key)) continue;
    const entry = counts.get(key) ?? { attempts: 0, mistakes: 0 };
    entry.attempts++;
    if (!ev.correct) entry.mistakes++;
    counts.set(key, entry);
  }
  return [...counts.entries()]
    .map(([char, data]) => ({
      char,
      attempts: data.attempts,
      mistakes: data.mistakes,
      accuracy: data.attempts > 0 ? Math.round(((data.attempts - data.mistakes) / data.attempts) * 10000) / 100 : 100,
    }))
    .sort((a, b) => a.accuracy - b.accuracy);
}

function computeBigramStats(events: KeystrokeEvent[]): BigramStats[] {
  const pairs = new Map<string, { attempts: number; mistakes: number }>();
  for (let i = 0; i < events.length - 1; i++) {
    const a = events[i].target.toLowerCase();
    const b = events[i + 1].target.toLowerCase();
    if (!/^[a-z]$/.test(a) || !/^[a-z]$/.test(b)) continue;
    const pair = `${a}${b}`;
    const entry = pairs.get(pair) ?? { attempts: 0, mistakes: 0 };
    entry.attempts++;
    if (!events[i].correct || !events[i + 1].correct) entry.mistakes++;
    pairs.set(pair, entry);
  }
  return [...pairs.entries()]
    .map(([pair, data]) => ({
      pair,
      attempts: data.attempts,
      mistakes: data.mistakes,
      accuracy: data.attempts > 0 ? Math.round(((data.attempts - data.mistakes) / data.attempts) * 10000) / 100 : 100,
    }))
    .filter((b) => b.attempts >= 3)
    .sort((a, b) => a.accuracy - b.accuracy);
}

function computeZoneStats(events: KeystrokeEvent[]): ZoneStats[] {
  const zoneData = new Map<KeyboardZone, { total: number; mistakes: number }>();
  for (const [char, zone] of Object.entries(KEYBOARD_MAP)) {
    zoneData.set(zone, { total: 0, mistakes: 0 });
  }
  for (const ev of events) {
    const key = ev.target.toLowerCase();
    const zone = KEYBOARD_MAP[key];
    if (!zone) continue;
    const entry = zoneData.get(zone)!;
    entry.total++;
    if (!ev.correct) entry.mistakes++;
  }
  return [...zoneData.entries()]
    .map(([zone, data]) => ({
      zone,
      total: data.total,
      mistakes: data.mistakes,
      accuracy: data.total > 0 ? Math.round(((data.total - data.mistakes) / data.total) * 10000) / 100 : 100,
      label: ZONE_LABELS[zone],
    }))
    .filter((z) => z.total > 0)
    .sort((a, b) => a.accuracy - b.accuracy);
}

export async function analyzePatterns(sessionCount = 30): Promise<PatternReport | null> {
  try {
    const sessions = await getSessions(sessionCount);
    if (sessions.length === 0) return null;

    const events = extractEvents(sessions);
    if (events.length === 0) return null;

    const chars = computeCharStats(events);
    const bigrams = computeBigramStats(events);
    const zones = computeZoneStats(events);

    return {
      chars,
      bigrams,
      zones,
      topWeakChars: chars.filter((c) => c.accuracy < 90 && c.attempts >= 3).slice(0, 5),
      topWeakBigrams: bigrams.filter((b) => b.accuracy < 85).slice(0, 5),
      weakestZone: zones[0] ?? null,
    };
  } catch {
    return null;
  }
}

export function drillRecommendation(report: PatternReport): string | null {
  if (report.topWeakChars.length === 0) return null;
  const chars = report.topWeakChars.slice(0, 3).map((c) => `"${c.char}"`).join(", ");
  if (report.weakestZone && report.weakestZone.accuracy < 85) {
    return `Focus on ${chars}. Your ${report.weakestZone.label.toLowerCase()} zone needs work (${report.weakestZone.accuracy}% accuracy). Try slow, deliberate drills on those keys.`;
  }
  return `Drill these characters: ${chars}. Type each slowly in groups of 5 before attempting full words.`;
}
