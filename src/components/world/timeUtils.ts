export type DayNightSegment =
  | "midnight"
  | "predawn"
  | "sunrise"
  | "morning"
  | "noon"
  | "afternoon"
  | "sunset"
  | "twilight";

export type RgbColor = {
  r: number;
  g: number;
  b: number;
};

export const DAY_MINUTES = 24 * 60;

export const DAY_NIGHT_SCHEDULE: { segment: DayNightSegment; minute: number }[] = [
  { segment: "midnight", minute: 0 },
  { segment: "predawn", minute: 4 * 60 + 30 },
  { segment: "sunrise", minute: 6 * 60 },
  { segment: "morning", minute: 9 * 60 },
  { segment: "noon", minute: 12 * 60 },
  { segment: "afternoon", minute: 15 * 60 },
  { segment: "sunset", minute: 18 * 60 },
  { segment: "twilight", minute: 19 * 60 + 30 },
];

export function getLocalMinutes(date: Date = new Date()) {
  return date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60;
}

export function easeInOutSine(t: number) {
  return -(Math.cos(Math.PI * clamp01(t)) - 1) / 2;
}

export function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * clamp01(t);
}

export function hexToRgb(hex: string): RgbColor {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(normalized, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

export function mixRgb(a: RgbColor, b: RgbColor, t: number): RgbColor {
  return {
    r: Math.round(lerp(a.r, b.r, t)),
    g: Math.round(lerp(a.g, b.g, t)),
    b: Math.round(lerp(a.b, b.b, t)),
  };
}

export function rgbToCss(color: RgbColor, alpha = 1) {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${clamp01(alpha)})`;
}

export function getSegmentWindow(minutes = getLocalMinutes()) {
  const schedule = DAY_NIGHT_SCHEDULE;
  let current = schedule[0];
  let next = schedule[1];

  for (let i = 0; i < schedule.length; i++) {
    const item = schedule[i];
    const following = schedule[(i + 1) % schedule.length];
    const start = item.minute;
    const end = following.minute <= start ? following.minute + DAY_MINUTES : following.minute;
    const normalizedMinutes = minutes < start ? minutes + DAY_MINUTES : minutes;

    if (normalizedMinutes >= start && normalizedMinutes < end) {
      current = item;
      next = following;
      const rawProgress = (normalizedMinutes - start) / (end - start);
      return {
        current: current.segment,
        next: next.segment,
        progress: clamp01(rawProgress),
        easedProgress: easeInOutSine(rawProgress),
      };
    }
  }

  return {
    current: "midnight" as DayNightSegment,
    next: "predawn" as DayNightSegment,
    progress: 0,
    easedProgress: 0,
  };
}

export function rangeProgress(minutes: number, start: number, end: number) {
  const normalizedEnd = end <= start ? end + DAY_MINUTES : end;
  const normalizedMinutes = minutes < start ? minutes + DAY_MINUTES : minutes;
  return clamp01((normalizedMinutes - start) / (normalizedEnd - start));
}

