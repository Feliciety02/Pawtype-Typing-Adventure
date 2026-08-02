import type {
  KeyboardBuild,
  KeyCustomization,
  CaseCustomization,
  FrameCustomization,
  PlateCustomization,
  SwitchCustomization,
  StabilizerCustomization,
  KnobCustomization,
  BadgeCustomization,
  LightingCustomization,
  SoundCustomization,
} from "./types"
import {
  LAYOUT_75,
  PAWTYPE_75_KNOB_V1,
  getKeyColorRole,
  COLOR_ROLE_PALETTES,
  flattenModelKeys,
} from "./layout-data"

function getBundledTopSource(keyId: string) {
  return `/workshop/keycaps/royal-cream/${keyId}.png`
}

// ─── Per-key default factory ──────────────────────────────────────────────────

export function makeDefaultKey(
  keyId: string,
  label: string,
  keyType: string = "standard"
): KeyCustomization {
  const role = getKeyColorRole(keyId, keyType)
  const palette = COLOR_ROLE_PALETTES[role]

  return {
    keyId,
    profile: "cherry",
    material: "painted-plastic",
    colors: {
      top:       palette.top,
      side:      palette.side,
      border:    palette.border,
      highlight: palette.highlight,
      shadow:    palette.shadow,
    },
    builtInTexture: { id: null, scale: 1, rotation: 0 },
    artwork: {
      source:   getBundledTopSource(keyId),
      useDefault: true,
      mapping:  "full-wrap",
      // Fill the physical top face so wide, non-square keys have no bare strip.
      fit:      "stretch",
      scale:    1,
      offsetX:  0,
      offsetY:  0,
      rotation: 0,
      repeatX:  1,
      repeatY:  1,
      mirrorX:  false,
      mirrorY:  false,
      blendMode: "decal",
    },
    legend: {
      text:     label,
      // The bundled crop already contains the exact legend from the artwork.
      visible:  false,
      font:     "pixel",
      color:    palette.legend,
      position: "center",
      size:     0.35,
      glow:     false,
    },
    decoration: { id: null, position: "center" },
    glow:        { enabled: false, color: "#ffcc66", intensity: 0.5 },
    pressEffect: "default",
    soundProfile: "thock",
  }
}

// ─── Case defaults — neutral cream ────────────────────────────────────────────

export const DEFAULT_CASE: CaseCustomization = {
  style:        "compact-minimal",
  material:     "painted-plastic",
  mainColor:    "#a9abad",   // warm gray
  sideColor:    "#74787b",   // charcoal-gray side
  trim:         "none",
  texture:      null,
  cornerStyle:  "rounded",
  bezelWidth:   0.6,
  rearHeight:   0.4,
  typingAngle:  6,
  engraving:    null,
  underglow:    false,
  underglowColor: "#d6d1c7",
}

export const DEFAULT_FRAME: FrameCustomization = {
  style:              "minimal",
  material:           "painted-plastic",
  mainColor:          "#4d5358",   // light graphite
  accentColor:        "#c6beb2",   // warm beige
  texture:            null,
  cornerDecorations:  false,
  sideRails:          false,
  glowChannels:       false,
  glowColor:          "#e6e8ea",
  screwType:          "flush",
}

export const DEFAULT_PLATE: PlateCustomization = {
  material:   "aluminum",
  color:      "#3f454b",
  texture:    null,
  edgeTrim:   "raw",
  glow:       false,
  glowColor:  "#dfe3e6",
  pattern:    null,
  engraving:  null,
}

export const DEFAULT_SWITCH: SwitchCustomization = {
  housingColor: "#d6d8da",
  stemColor:    "#7c8288",
  material:     "nylon",
  glow:         false,
  glowColor:    "#e8eaed",
  soundProfile: "thock",
  feel:         "tactile",
}

export const DEFAULT_STABILIZERS: StabilizerCustomization = {
  housingColor: "#c9cdd0",
  wireColor:    "#a0a8b0",
  style:        "screw-in",
  material:     "nylon",
}

export const DEFAULT_KNOB: KnobCustomization = {
  enabled:  true,
  shape:    "cylinder",
  height:   0.55,
  material: "aluminum",
  color:    "#a0a8b0",   // silver-gray outer ring
  texture:  null,
  topIcon:  null,
  glow:     false,
  glowColor: "#ffffff",
}

export const DEFAULT_BADGE: BadgeCustomization = {
  enabled: false,
  type:    "none",
  text:    "",
  source:  null,
  color:   "#9a9088",
}

export const DEFAULT_LIGHTING: LightingCustomization = {
  effect:        "static",
  primaryColor:  "#ffffff",
  secondaryColor: "#aaaacc",
  speed:         0.4,
  intensity:     0.5,
  direction:     "left-right",
  trigger:       "always",
  previewEnv:    "neutral-studio",
  brightness:    0.9,
  ambientLight:  0.7,
  shadowStrength: 0.35,
}

export const DEFAULT_SOUND: SoundCustomization = {
  profile:        "thock",
  volume:         0.7,
  pitch:          1.0,
  pitchVariation: 0.05,
}

// ─── Build factory ────────────────────────────────────────────────────────────

export function makeDefaultBuild(id: string, name: string): KeyboardBuild {
  const modelKeys = flattenModelKeys(PAWTYPE_75_KNOB_V1)
  const keys: Record<string, KeyCustomization> = {}
  for (const k of modelKeys) {
    keys[k.id] = makeDefaultKey(k.id, k.primaryLegend ?? k.label, k.type)
  }

  return {
    id,
    name,
    modelId: PAWTYPE_75_KNOB_V1.id,
    layout:  "75%",
    keys,
    case:         { ...DEFAULT_CASE },
    frame:        { ...DEFAULT_FRAME },
    plate:        { ...DEFAULT_PLATE },
    switches:     {},
    stabilizers:  { ...DEFAULT_STABILIZERS },
    knob:         { ...DEFAULT_KNOB },
    badge:        { ...DEFAULT_BADGE },
    lighting:     { ...DEFAULT_LIGHTING },
    sound:        { ...DEFAULT_SOUND },
    createdAt:    new Date().toISOString(),
    updatedAt:    new Date().toISOString(),
  }
}

// ─── Presets ──────────────────────────────────────────────────────────────────

export const PRESETS: Array<{ id: string; name: string; patch: Partial<KeyboardBuild> }> = [
  {
    id: "neutral-cream",
    name: "Neutral Cream",
    patch: {
      case:  { ...DEFAULT_CASE, mainColor: "#e8dfc8", sideColor: "#c4b898" },
      frame: { ...DEFAULT_FRAME, mainColor: "#d8cdb8", accentColor: "#9a9088" },
    },
  },
  {
    id: "forest-explorer",
    name: "Forest Explorer",
    patch: {
      case:  { ...DEFAULT_CASE, mainColor: "#3d6b35", sideColor: "#2a4a23", style: "forest-wood" },
      frame: { ...DEFAULT_FRAME, style: "forest", mainColor: "#4a7a40", accentColor: "#8fcc5a" },
    },
  },
  {
    id: "cozy-cafe",
    name: "Cozy Cafe",
    patch: {
      case:  { ...DEFAULT_CASE, mainColor: "#6b3a1f", sideColor: "#4a2510", style: "cafe-counter" },
      frame: { ...DEFAULT_FRAME, style: "cafe", mainColor: "#7a4a2a", accentColor: "#d4854a" },
    },
  },
  {
    id: "sakura-bloom",
    name: "Sakura Bloom",
    patch: {
      case:  { ...DEFAULT_CASE, mainColor: "#e8b0c0", sideColor: "#c88090", style: "rounded-cozy" },
      frame: { ...DEFAULT_FRAME, style: "sakura", mainColor: "#d890a8", accentColor: "#f0c8d8" },
    },
  },
  {
    id: "royal-scholar",
    name: "Royal Scholar",
    patch: {
      case:  { ...DEFAULT_CASE, mainColor: "#1a1a3a", sideColor: "#0a0a2a", style: "sharp-royal" },
      frame: { ...DEFAULT_FRAME, style: "royal", mainColor: "#2a2a5a", accentColor: "#c8a830" },
    },
  },
  {
    id: "tide-pool",
    name: "Tide Pool",
    patch: {
      case:  { ...DEFAULT_CASE, mainColor: "#1a3a4a", sideColor: "#0a2030", style: "rounded-cozy" },
      frame: { ...DEFAULT_FRAME, style: "tide-pool", mainColor: "#204858", accentColor: "#40a0b0" },
    },
  },
  {
    id: "stardust",
    name: "Stardust",
    patch: {
      case:  { ...DEFAULT_CASE, mainColor: "#1c1030", sideColor: "#0c0820", underglow: true },
      frame: { ...DEFAULT_FRAME, style: "stardust", mainColor: "#2a1a50", accentColor: "#9060e0" },
    },
  },
  {
    id: "blacksmith-forge",
    name: "Blacksmith Forge",
    patch: {
      case:  { ...DEFAULT_CASE, mainColor: "#2a2420", sideColor: "#1a1610", style: "heavy-blacksmith" },
      frame: { ...DEFAULT_FRAME, style: "blacksmith", mainColor: "#353028", accentColor: "#806030" },
    },
  },
]
