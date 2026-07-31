// ─── Layout ──────────────────────────────────────────────────────────────────

export type KeyboardLayoutId = "75%" | "65%" | "60%" | "TKL" | "full"

export type KeyType =
  | "standard"
  | "function"
  | "modifier"
  | "spacebar"
  | "arrow"
  | "navigation"

export type KeyboardLayoutKey = {
  id: string
  label: string
  /** Primary legend shown on keycap (defaults to label) */
  primaryLegend?: string
  /** Secondary legend shown above primary (e.g. shift symbol on number row) */
  secondaryLegend?: string
  row: number
  width: number
  gapBefore?: number
  type: KeyType
}

// ─── Keyboard Model ───────────────────────────────────────────────────────────

export type KeyboardCaseConfig = {
  /** Padding around the key layout in units */
  bezelX: number
  bezelTop: number
  bezelBottom: number
  /** Extra space on right for navigation column integration */
  rightExtension?: number
  cornerRadius: number
  caseHeight: number
  bottomHeight: number
  typingAngle: number
}

export type KeyboardKnobConfig = {
  /** Position in board-local units: right side offset from rightmost key edge, row offset from top */
  rightOffset: number
  topOffset: number
  radius: number
}

export type KeyboardRowConfig = {
  id: string
  /** Extra gap after this row */
  gapAfter?: number
  keys: KeyboardLayoutKey[]
}

export type KeyboardModel = {
  id: string
  name: string
  layoutType: KeyboardLayoutId
  rows: KeyboardRowConfig[]
  caseConfig: KeyboardCaseConfig
  knobConfig?: KeyboardKnobConfig
  /** Whether the model includes a physical knob */
  hasKnob: boolean
}

// ─── Keycap ───────────────────────────────────────────────────────────────────

export type KeycapProfile =
  | "dom"
  | "tai-hao"
  | "kat"
  | "g20"
  | "kam"
  | "tea"
  | "apple"
  | "pixel-flat"
  | "cherry"
  | "oem"
  | "xda"
  | "dsa"
  | "sa"
  | "rounded-fantasy"
  | "artisan"
  | "crystal"
  | "stone"
  | "typewriter"

export type ArtworkMapping =
  | "top-decal"
  | "top-fill"
  | "front"
  | "top-front"
  | "multi-side"
  | "full-wrap"
  | "tile"
  | "icon"

export type ArtworkFit = "contain" | "cover" | "stretch" | "tile"

export type ArtworkBlendMode =
  | "texture"
  | "texture-color"
  | "decal"
  | "multiply"
  | "tint"

export type LegendPosition = "center" | "top-left" | "top-right" | "front"

export type KeyCustomization = {
  keyId: string
  profile: KeycapProfile
  material: string
  colors: {
    top: string
    side: string
    border: string
    highlight: string
    shadow: string
  }
  builtInTexture: {
    id: string | null
    scale: number
    rotation: number
  }
  artwork: {
    source: string | null
    /** Distinguishes the bundled per-key skin from custom uploads/removals. */
    useDefault: boolean
    mapping: ArtworkMapping
    fit: ArtworkFit
    scale: number
    offsetX: number
    offsetY: number
    rotation: 0 | 90 | 180 | 270
    repeatX: number
    repeatY: number
    mirrorX: boolean
    mirrorY: boolean
    blendMode: ArtworkBlendMode
  }
  legend: {
    text: string
    visible: boolean
    font: string
    color: string
    position: LegendPosition
    size: number
    glow: boolean
  }
  decoration: {
    id: string | null
    position: string
  }
  glow: {
    enabled: boolean
    color: string
    intensity: number
  }
  pressEffect: string
  soundProfile: string
}

// ─── Case ────────────────────────────────────────────────────────────────────

export type CaseStyle =
  | "compact-minimal"
  | "explorer"
  | "rounded-cozy"
  | "sharp-royal"
  | "crystal-frame"
  | "heavy-blacksmith"
  | "floating-stardust"
  | "cafe-counter"
  | "forest-wood"
  | "custom"

export type CaseCustomization = {
  style: CaseStyle
  material: string
  mainColor: string
  sideColor: string
  trim: string
  texture: string | null
  cornerStyle: "sharp" | "rounded" | "beveled"
  bezelWidth: number
  rearHeight: number
  typingAngle: number
  engraving: string | null
  underglow: boolean
  underglowColor: string
}

// ─── Frame ───────────────────────────────────────────────────────────────────

export type FrameStyle =
  | "minimal"
  | "explorer"
  | "forest"
  | "sakura"
  | "royal"
  | "stardust"
  | "tide-pool"
  | "cafe"
  | "blacksmith"
  | "ancient-library"
  | "crystal"
  | "custom"

export type FrameCustomization = {
  style: FrameStyle
  material: string
  mainColor: string
  accentColor: string
  texture: string | null
  cornerDecorations: boolean
  sideRails: boolean
  glowChannels: boolean
  glowColor: string
  screwType: string
}

// ─── Plate ───────────────────────────────────────────────────────────────────

export type PlateMaterial =
  | "aluminum"
  | "brass"
  | "steel"
  | "wood"
  | "polycarbonate"
  | "crystal"
  | "stone"
  | "galaxy-glass"
  | "moss-metal"
  | "custom"

export type PlateCustomization = {
  material: PlateMaterial
  color: string
  texture: string | null
  edgeTrim: string
  glow: boolean
  glowColor: string
  pattern: string | null
  engraving: string | null
}

// ─── Switch ──────────────────────────────────────────────────────────────────

export type SwitchCustomization = {
  housingColor: string
  stemColor: string
  material: string
  glow: boolean
  glowColor: string
  soundProfile: string
  feel: string
}

// ─── Stabilizer ──────────────────────────────────────────────────────────────

export type StabilizerCustomization = {
  housingColor: string
  wireColor: string
  style: string
  material: string
}

// ─── Knob ────────────────────────────────────────────────────────────────────

export type KnobShape =
  | "cylinder"
  | "crystal"
  | "wooden-dial"
  | "gear"
  | "potion"
  | "mushroom"
  | "star-dial"

export type KnobCustomization = {
  enabled: boolean
  shape: KnobShape
  height: number
  material: string
  color: string
  texture: string | null
  topIcon: string | null
  glow: boolean
  glowColor: string
}

// ─── Badge ───────────────────────────────────────────────────────────────────

export type BadgeCustomization = {
  enabled: boolean
  type: "paw" | "initial" | "rune" | "guild" | "custom" | "none"
  text: string
  source: string | null
  color: string
}

// ─── Lighting ────────────────────────────────────────────────────────────────

export type LightingEffect =
  | "static"
  | "breathing"
  | "key-press"
  | "ripple"
  | "wave"
  | "combo-wave"
  | "fireflies"
  | "sakura"
  | "bubbles"
  | "stars"
  | "golden-sparks"
  | "steam-glow"

export type LightingCustomization = {
  effect: LightingEffect
  primaryColor: string
  secondaryColor: string
  speed: number
  intensity: number
  direction: string
  trigger: string
  previewEnv: string
  brightness: number
  ambientLight: number
  shadowStrength: number
}

// ─── Sound ───────────────────────────────────────────────────────────────────

export type SoundProfile =
  | "soft"
  | "creamy"
  | "thock"
  | "clack"
  | "silent"
  | "wood"
  | "ceramic"
  | "crystal"
  | "stone"
  | "retro"
  | "magical"

export type SoundCustomization = {
  profile: SoundProfile
  volume: number
  pitch: number
  pitchVariation: number
}

// ─── Build ───────────────────────────────────────────────────────────────────

export type KeyboardBuild = {
  id: string
  name: string
  /** Which KeyboardModel this build is based on */
  modelId: string
  layout: KeyboardLayoutId
  keys: Record<string, KeyCustomization>
  case: CaseCustomization
  frame: FrameCustomization
  plate: PlateCustomization
  switches: Record<string, SwitchCustomization>
  stabilizers: StabilizerCustomization
  knob: KnobCustomization
  badge: BadgeCustomization
  lighting: LightingCustomization
  sound: SoundCustomization
  createdAt: string
  updatedAt: string
}

// ─── Camera ──────────────────────────────────────────────────────────────────

export type CameraPreset =
  | "isometric"
  | "top"
  | "front"
  | "left"
  | "right"
  | "typing"
  | "keycap-closeup"
  | "case-closeup"

// ─── Keyboard Part ───────────────────────────────────────────────────────────

export type KeyboardPart =
  | "keycaps"
  | "case"
  | "frame"
  | "plate"
  | "switches"
  | "stabilizers"
  | "knob"
  | "badge"
  | "lighting"
  | "sound"
  | "builds"

// ─── Custom Group ─────────────────────────────────────────────────────────────

export type KeyGroup = {
  id: string
  name: string
  keyIds: string[]
}

// ─── Editor Tab ──────────────────────────────────────────────────────────────

export type EditorTab =
  | "shape"
  | "material"
  | "color"
  | "texture"
  | "artwork"
  | "legend"
  | "decoration"
  | "effects"
  | "sound"
