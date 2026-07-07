import {
  DAY_MINUTES,
  type DayNightSegment,
  easeInOutSine,
  getLocalMinutes,
  getSegmentWindow,
  hexToRgb,
  lerp,
  mixRgb,
  rangeProgress,
  rgbToCss,
} from "./timeUtils";

export type ParticleMood = "pollen" | "butterflies" | "dust" | "fireflies" | "shooting-star";

export type DayNightState = {
  minute: number;
  current: DayNightSegment;
  next: DayNightSegment;
  progress: number;
  skyOpacity: number;
  skyA: DayNightSegment;
  skyB: DayNightSegment;
  sun: {
    x: number;
    y: number;
    opacity: number;
    glow: number;
  };
  moon: {
    x: number;
    y: number;
    opacity: number;
    glow: number;
  };
  starsOpacity: number;
  constellationsOpacity: number;
  cloudTint: string;
  lightingOverlay: string;
  waterHighlightOpacity: number;
  particleMoods: ParticleMood[];
};

const OVERLAY_COLORS: Record<DayNightSegment, string> = {
  midnight: "#081423",
  predawn: "#3F4A7A",
  sunrise: "#FFD9A1",
  morning: "#FFFFFF",
  noon: "#FFFFFF",
  afternoon: "#FFF4D0",
  sunset: "#FFB56A",
  twilight: "#5E63A8",
};

const OVERLAY_ALPHA: Record<DayNightSegment, number> = {
  midnight: 0.58,
  predawn: 0.42,
  sunrise: 0.28,
  morning: 0,
  noon: 0,
  afternoon: 0.14,
  sunset: 0.34,
  twilight: 0.48,
};

const CLOUD_TINT: Record<DayNightSegment, string> = {
  midnight: "#17284A",
  predawn: "#6F79B8",
  sunrise: "#FFD0B2",
  morning: "#FFFFFF",
  noon: "#FFFFFF",
  afternoon: "#FFF4D0",
  sunset: "#FF8F73",
  twilight: "#6970B9",
};

function getArcPosition(progress: number, startX: number, endX: number, horizonY: number, apexY: number) {
  const eased = easeInOutSine(progress);
  return {
    x: lerp(startX, endX, eased),
    y: lerp(horizonY, apexY, Math.sin(Math.PI * progress)),
  };
}

function getSunState(minute: number) {
  const sunrise = 6 * 60;
  const sunset = 18 * 60;
  const daylight = rangeProgress(minute, sunrise, sunset);
  const fadeIn = rangeProgress(minute, 5 * 60 + 30, 7 * 60);
  const fadeOut = 1 - rangeProgress(minute, 17 * 60, 18 * 60 + 30);
  const opacity = Math.min(fadeIn, fadeOut);
  const pos = getArcPosition(daylight, 8, 92, 73, 15);

  return {
    ...pos,
    opacity,
    glow: opacity * (0.65 + Math.sin(Math.PI * daylight) * 0.35),
  };
}

function getMoonState(minute: number) {
  const moonProgress = rangeProgress(minute, 18 * 60, 6 * 60);
  const fadeAfterSunset = rangeProgress(minute, 18 * 60, 20 * 60);
  const fadeBeforeSunrise = 1 - rangeProgress(minute, 4 * 60 + 30, 6 * 60 + 30);
  const visibleNight = minute >= 18 * 60 || minute < 6 * 60 + 30 ? 1 : 0;
  const opacity = Math.min(fadeAfterSunset || visibleNight, fadeBeforeSunrise) * visibleNight;
  const pos = getArcPosition(moonProgress, 92, 8, 70, 18);

  return {
    ...pos,
    opacity,
    glow: opacity * 0.45,
  };
}

function getStarsOpacity(minute: number) {
  if (minute >= 21 * 60 || minute < 4 * 60) return 1;
  if (minute >= 18 * 60 && minute < 21 * 60) return lerp(0.4, 1, rangeProgress(minute, 18 * 60, 21 * 60));
  if (minute >= 4 * 60 && minute < 6 * 60) return 1 - rangeProgress(minute, 4 * 60, 6 * 60);
  if (minute >= 17 * 60 && minute < 18 * 60) return lerp(0, 0.4, rangeProgress(minute, 17 * 60, 18 * 60));
  return 0;
}

function getConstellationsOpacity(minute: number) {
  if (minute >= 21 * 60 || minute < 4 * 60) return 0.32;
  if (minute >= 20 * 60 && minute < 21 * 60) return lerp(0, 0.32, rangeProgress(minute, 20 * 60, 21 * 60));
  if (minute >= 4 * 60 && minute < 5 * 60) return lerp(0.32, 0, rangeProgress(minute, 4 * 60, 5 * 60));
  return 0;
}

function getParticleMoods(minute: number): ParticleMood[] {
  if (minute >= 21 * 60 || minute < 4 * 60) return ["fireflies", "shooting-star"];
  if (minute >= 19 * 60 + 30 && minute < 21 * 60) return ["fireflies"];
  if (minute >= 18 * 60 && minute < 19 * 60 + 30) return ["dust"];
  if (minute >= 12 * 60 && minute < 18 * 60) return ["butterflies", "pollen"];
  return ["pollen"];
}

export function getDayNightState(date: Date = new Date()): DayNightState {
  const minute = getLocalMinutes(date) % DAY_MINUTES;
  const segment = getSegmentWindow(minute);
  const easedProgress = segment.easedProgress;
  const overlayColor = mixRgb(
    hexToRgb(OVERLAY_COLORS[segment.current]),
    hexToRgb(OVERLAY_COLORS[segment.next]),
    easedProgress,
  );
  const overlayAlpha = lerp(OVERLAY_ALPHA[segment.current], OVERLAY_ALPHA[segment.next], easedProgress);
  const cloudTint = mixRgb(
    hexToRgb(CLOUD_TINT[segment.current]),
    hexToRgb(CLOUD_TINT[segment.next]),
    easedProgress,
  );
  const sun = getSunState(minute);
  const moon = getMoonState(minute);

  return {
    minute,
    current: segment.current,
    next: segment.next,
    progress: segment.progress,
    skyOpacity: easedProgress,
    skyA: segment.current,
    skyB: segment.next,
    sun,
    moon,
    starsOpacity: getStarsOpacity(minute),
    constellationsOpacity: getConstellationsOpacity(minute),
    cloudTint: rgbToCss(cloudTint, 0.72),
    lightingOverlay: rgbToCss(overlayColor, overlayAlpha),
    waterHighlightOpacity: Math.min(0.42, sun.opacity * 0.26 + moon.opacity * 0.2),
    particleMoods: getParticleMoods(minute),
  };
}

