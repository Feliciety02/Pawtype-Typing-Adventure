import type { KeycapProfile } from "./types"

export type KeycapProfileFamily = "sculpted" | "uniform" | "fantasy"

export type KeycapProfileSpec = {
  label: string
  family: KeycapProfileFamily
  heightMm?: number
  height: number
  topScaleX: number
  topScaleZ: number
  /** Positive values form a convex crown; negative values form a dish. */
  surfaceCurve: number
  /** How strongly the side wall rounds into the top surface. */
  shoulderRoundness: number
  /** Front-to-back height delta for rows 0 through 5. */
  rowTilts?: readonly [number, number, number, number, number, number]
  /** Front-to-back top offset for rows 0 through 5. */
  rowShifts?: readonly [number, number, number, number, number, number]
}

const SCULPTED_TILTS = {
  dom: [-0.11, -0.08, -0.035, 0.015, 0.07, 0.1],
  sa: [-0.1, -0.075, -0.03, 0.02, 0.075, 0.105],
  oem: [-0.075, -0.055, -0.02, 0.015, 0.055, 0.075],
  cherry: [-0.06, -0.04, -0.015, 0.012, 0.045, 0.06],
  taiHao: [-0.085, -0.06, -0.025, 0.018, 0.06, 0.085],
  kat: [-0.07, -0.05, -0.018, 0.015, 0.05, 0.07],
} as const

const SCULPTED_SHIFTS = {
  tall: [0.035, 0.025, 0.012, 0, -0.014, -0.026],
  medium: [0.025, 0.018, 0.008, 0, -0.01, -0.018],
  low: [0.018, 0.012, 0.006, 0, -0.007, -0.012],
} as const

/**
 * Relative dimensions are based on the profile comparison supplied for the
 * workshop. Heights are intentionally scaled to keyboard units rather than
 * interpreted as literal millimetres in Three.js.
 */
export const KEYCAP_PROFILE_SPECS: Record<KeycapProfile, KeycapProfileSpec> = {
  dom: {
    label: "DOM",
    family: "sculpted",
    heightMm: 16.5,
    height: 0.75,
    topScaleX: 0.74,
    topScaleZ: 0.72,
    surfaceCurve: 0.13,
    shoulderRoundness: 0.92,
    rowTilts: SCULPTED_TILTS.dom,
    rowShifts: SCULPTED_SHIFTS.tall,
  },
  sa: {
    label: "SA",
    family: "sculpted",
    heightMm: 16.5,
    height: 0.75,
    topScaleX: 0.76,
    topScaleZ: 0.73,
    surfaceCurve: -0.035,
    shoulderRoundness: 0.25,
    rowTilts: SCULPTED_TILTS.sa,
    rowShifts: SCULPTED_SHIFTS.tall,
  },
  oem: {
    label: "OEM",
    family: "sculpted",
    heightMm: 11.9,
    height: 0.54,
    topScaleX: 0.82,
    topScaleZ: 0.8,
    surfaceCurve: -0.025,
    shoulderRoundness: 0.18,
    rowTilts: SCULPTED_TILTS.oem,
    rowShifts: SCULPTED_SHIFTS.medium,
  },
  cherry: {
    label: "Cherry",
    family: "sculpted",
    heightMm: 9.4,
    height: 0.43,
    topScaleX: 0.86,
    topScaleZ: 0.84,
    surfaceCurve: -0.022,
    shoulderRoundness: 0.14,
    rowTilts: SCULPTED_TILTS.cherry,
    rowShifts: SCULPTED_SHIFTS.low,
  },
  "tai-hao": {
    label: "Tai Hao",
    family: "sculpted",
    heightMm: 14.8,
    height: 0.67,
    topScaleX: 0.8,
    topScaleZ: 0.79,
    surfaceCurve: -0.02,
    shoulderRoundness: 0.12,
    rowTilts: SCULPTED_TILTS.taiHao,
    rowShifts: SCULPTED_SHIFTS.medium,
  },
  kat: {
    label: "KAT",
    family: "sculpted",
    heightMm: 13.5,
    height: 0.61,
    topScaleX: 0.85,
    topScaleZ: 0.82,
    surfaceCurve: 0.035,
    shoulderRoundness: 0.82,
    rowTilts: SCULPTED_TILTS.kat,
    rowShifts: SCULPTED_SHIFTS.medium,
  },
  dsa: {
    label: "DSA",
    family: "uniform",
    heightMm: 7.6,
    height: 0.35,
    topScaleX: 0.9,
    topScaleZ: 0.88,
    surfaceCurve: -0.018,
    shoulderRoundness: 0.24,
  },
  g20: {
    label: "G20",
    family: "uniform",
    heightMm: 7.1,
    height: 0.32,
    topScaleX: 0.86,
    topScaleZ: 0.84,
    surfaceCurve: 0,
    shoulderRoundness: 0.02,
  },
  xda: {
    label: "XDA",
    family: "uniform",
    heightMm: 9.1,
    height: 0.41,
    topScaleX: 0.88,
    topScaleZ: 0.86,
    surfaceCurve: 0.02,
    shoulderRoundness: 0.72,
  },
  kam: {
    label: "KAM",
    family: "uniform",
    heightMm: 9.1,
    height: 0.41,
    topScaleX: 0.89,
    topScaleZ: 0.87,
    surfaceCurve: 0.035,
    shoulderRoundness: 0.9,
  },
  tea: {
    label: "TEA",
    family: "uniform",
    heightMm: 3.8,
    height: 0.18,
    topScaleX: 0.9,
    topScaleZ: 0.88,
    surfaceCurve: 0,
    shoulderRoundness: 0.04,
  },
  apple: {
    label: "Apple",
    family: "uniform",
    heightMm: 2.3,
    height: 0.11,
    topScaleX: 0.96,
    topScaleZ: 0.94,
    surfaceCurve: 0,
    shoulderRoundness: 0.08,
  },
  "pixel-flat": {
    label: "Pixel Flat",
    family: "fantasy",
    height: 0.28,
    topScaleX: 0.92,
    topScaleZ: 0.9,
    surfaceCurve: 0,
    shoulderRoundness: 0,
  },
  "rounded-fantasy": {
    label: "Rounded Fantasy",
    family: "fantasy",
    height: 0.44,
    topScaleX: 0.86,
    topScaleZ: 0.82,
    surfaceCurve: 0.055,
    shoulderRoundness: 0.9,
  },
  artisan: {
    label: "Artisan",
    family: "fantasy",
    height: 0.58,
    topScaleX: 0.84,
    topScaleZ: 0.8,
    surfaceCurve: 0.1,
    shoulderRoundness: 0.72,
  },
  crystal: {
    label: "Crystal",
    family: "fantasy",
    height: 0.42,
    topScaleX: 0.78,
    topScaleZ: 0.76,
    surfaceCurve: 0.1,
    shoulderRoundness: 0,
  },
  stone: {
    label: "Stone",
    family: "fantasy",
    height: 0.46,
    topScaleX: 0.87,
    topScaleZ: 0.83,
    surfaceCurve: 0.025,
    shoulderRoundness: 0.55,
  },
  typewriter: {
    label: "Typewriter",
    family: "fantasy",
    height: 0.55,
    topScaleX: 0.78,
    topScaleZ: 0.74,
    surfaceCurve: 0.08,
    shoulderRoundness: 0.95,
  },
}

export const KEYCAP_PROFILE_OPTIONS: Array<{
  value: KeycapProfile
  label: string
}> = (Object.entries(KEYCAP_PROFILE_SPECS) as Array<
  [KeycapProfile, KeycapProfileSpec]
>).map(([value, spec]) => ({
  value,
  label: `${spec.label} · ${spec.family === "sculpted" ? "Sculpted" : spec.family === "uniform" ? "Uniform" : "Fantasy"}`,
}))

export type ResolvedKeycapProfile = KeycapProfileSpec & {
  topTilt: number
  topShiftZ: number
  topSurfaceHeight: number
}

export function resolveKeycapProfile(
  profile: KeycapProfile,
  row: number,
): ResolvedKeycapProfile {
  const spec = KEYCAP_PROFILE_SPECS[profile] ?? KEYCAP_PROFILE_SPECS.cherry
  const rowIndex = Math.max(0, Math.min(5, row))
  const topTilt = spec.rowTilts?.[rowIndex] ?? 0
  const topShiftZ = spec.rowShifts?.[rowIndex] ?? 0

  return {
    ...spec,
    topTilt,
    topShiftZ,
    // Artwork and legends are centered on the resolved top plane. Row tilt is
    // applied by rotation, so including it here would count the slope twice.
    topSurfaceHeight: spec.height + Math.max(0, spec.surfaceCurve),
  }
}
