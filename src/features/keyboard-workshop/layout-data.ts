import type {
  KeyboardLayoutKey,
  KeyboardModel,
  KeyboardRowConfig,
} from "./types"

const U = 1   // 1 keyboard unit
// Real keycaps have only a narrow seam between them. Keeping this small also
// makes the overall keyboard footprint more compact.
const GAP = 0.008

export { U, GAP }

// ─── Pawtype 75 Knob V1 ───────────────────────────────────────────────────────
//
// Compact 75% mechanical keyboard with a rotary knob.
// Layout:
//   Row 0 — Esc | F1–F4 | F5–F8 | F9–F12 | Knob    (+ right nav column: Del)
//   Row 1 — ` 1–0 - = Backspace Delete
//   Row 2 — Tab Q–P [ ] \                             (+ PgUp)
//   Row 3 — CapsLock A–; ' Enter                      (+ PgDn)
//   Row 4 — LShift Z–/ RShift | Up | End
//   Row 5 — Ctrl Win Alt Spacebar Fn Ctrl | Left Down Right

const ROW_FN: KeyboardRowConfig = {
  id: "fn-row",
  gapAfter: 0.2,
  keys: [
    // Escape — separated from F1
    { id: "Escape",  label: "Esc",  primaryLegend: "Esc",   row: 0, width: 1,    type: "function" },
    // F1–F4 group
    { id: "F1",  label: "F1",  primaryLegend: "F1",   row: 0, width: 1, gapBefore: 0.48, type: "function" },
    { id: "F2",  label: "F2",  primaryLegend: "F2",   row: 0, width: 1, gapBefore: 0.12, type: "function" },
    { id: "F3",  label: "F3",  primaryLegend: "F3",   row: 0, width: 1, gapBefore: 0.12, type: "function" },
    { id: "F4",  label: "F4",  primaryLegend: "F4",   row: 0, width: 1, gapBefore: 0.12, type: "function" },
    // F5–F8 group
    { id: "F5",  label: "F5",  primaryLegend: "F5",   row: 0, width: 1, gapBefore: 0.42, type: "function" },
    { id: "F6",  label: "F6",  primaryLegend: "F6",   row: 0, width: 1, gapBefore: 0.12, type: "function" },
    { id: "F7",  label: "F7",  primaryLegend: "F7",   row: 0, width: 1, gapBefore: 0.12, type: "function" },
    { id: "F8",  label: "F8",  primaryLegend: "F8",   row: 0, width: 1, gapBefore: 0.12, type: "function" },
    // F9–F12 group
    { id: "F9",  label: "F9",  primaryLegend: "F9",   row: 0, width: 1, gapBefore: 0.42, type: "function" },
    { id: "F10", label: "F10", primaryLegend: "F10",  row: 0, width: 1, gapBefore: 0.12, type: "function" },
    { id: "F11", label: "F11", primaryLegend: "F11",  row: 0, width: 1, gapBefore: 0.12, type: "function" },
    { id: "F12", label: "F12", primaryLegend: "F12",  row: 0, width: 1, gapBefore: 0.12, type: "function" },
    // Knob placeholder — not a real key, rendered separately; skip here
  ],
}

const ROW_NUMBER: KeyboardRowConfig = {
  id: "number-row",
  keys: [
    { id: "Backtick",  label: "`", primaryLegend: "`",  secondaryLegend: "~",  row: 1, width: 1,   type: "standard" },
    { id: "1",         label: "1", primaryLegend: "1",  secondaryLegend: "!",  row: 1, width: 1,   type: "standard" },
    { id: "2",         label: "2", primaryLegend: "2",  secondaryLegend: "@",  row: 1, width: 1,   type: "standard" },
    { id: "3",         label: "3", primaryLegend: "3",  secondaryLegend: "#",  row: 1, width: 1,   type: "standard" },
    { id: "4",         label: "4", primaryLegend: "4",  secondaryLegend: "$",  row: 1, width: 1,   type: "standard" },
    { id: "5",         label: "5", primaryLegend: "5",  secondaryLegend: "%",  row: 1, width: 1,   type: "standard" },
    { id: "6",         label: "6", primaryLegend: "6",  secondaryLegend: "^",  row: 1, width: 1,   type: "standard" },
    { id: "7",         label: "7", primaryLegend: "7",  secondaryLegend: "&",  row: 1, width: 1,   type: "standard" },
    { id: "8",         label: "8", primaryLegend: "8",  secondaryLegend: "*",  row: 1, width: 1,   type: "standard" },
    { id: "9",         label: "9", primaryLegend: "9",  secondaryLegend: "(",  row: 1, width: 1,   type: "standard" },
    { id: "0",         label: "0", primaryLegend: "0",  secondaryLegend: ")",  row: 1, width: 1,   type: "standard" },
    { id: "Minus",     label: "-", primaryLegend: "-",  secondaryLegend: "_",  row: 1, width: 1,   type: "standard" },
    { id: "Equal",     label: "=", primaryLegend: "=",  secondaryLegend: "+",  row: 1, width: 1,   type: "standard" },
    { id: "Backspace", label: "⌫", primaryLegend: "⌫",                         row: 1, width: 2,   type: "modifier" },
    { id: "Delete",    label: "Del", primaryLegend: "Del",                    row: 1, width: 1, gapBefore: 0.1, type: "navigation" },
  ],
}

// Give Backspace a matching long modifier footprint.
ROW_NUMBER.keys.find((key) => key.id === "Backspace")!.width = 2.563

const ROW_QWERTY: KeyboardRowConfig = {
  id: "qwerty-row",
  keys: [
    { id: "Tab",       label: "Tab",  primaryLegend: "Tab",  row: 2, width: 1.5,  type: "modifier" },
    { id: "Q",         label: "Q",    row: 2, width: 1,   type: "standard" },
    { id: "W",         label: "W",    row: 2, width: 1,   type: "standard" },
    { id: "E",         label: "E",    row: 2, width: 1,   type: "standard" },
    { id: "R",         label: "R",    row: 2, width: 1,   type: "standard" },
    { id: "T",         label: "T",    row: 2, width: 1,   type: "standard" },
    { id: "Y",         label: "Y",    row: 2, width: 1,   type: "standard" },
    { id: "U",         label: "U",    row: 2, width: 1,   type: "standard" },
    { id: "I",         label: "I",    row: 2, width: 1,   type: "standard" },
    { id: "O",         label: "O",    row: 2, width: 1,   type: "standard" },
    { id: "P",         label: "P",    row: 2, width: 1,   type: "standard" },
    { id: "BracketL",  label: "[",    primaryLegend: "[", secondaryLegend: "{", row: 2, width: 1, type: "standard" },
    { id: "BracketR",  label: "]",    primaryLegend: "]", secondaryLegend: "}", row: 2, width: 1, type: "standard" },
    { id: "Backslash", label: "\\",   primaryLegend: "\\",secondaryLegend: "|", row: 2, width: 2.063, type: "modifier" },
    // Right nav column — Page Up
    { id: "PageUp",    label: "PgUp", primaryLegend: "PgUp", row: 2, width: 1, gapBefore: 0.1, type: "navigation" },
  ],
}

const ROW_HOME: KeyboardRowConfig = {
  id: "home-row",
  keys: [
    { id: "CapsLock",  label: "Caps",  primaryLegend: "Caps",  row: 3, width: 1.75, type: "modifier" },
    { id: "A",         label: "A",     row: 3, width: 1,   type: "standard" },
    { id: "S",         label: "S",     row: 3, width: 1,   type: "standard" },
    { id: "D",         label: "D",     row: 3, width: 1,   type: "standard" },
    { id: "F",         label: "F",     row: 3, width: 1,   type: "standard" },
    { id: "G",         label: "G",     row: 3, width: 1,   type: "standard" },
    { id: "H",         label: "H",     row: 3, width: 1,   type: "standard" },
    { id: "J",         label: "J",     row: 3, width: 1,   type: "standard" },
    { id: "K",         label: "K",     row: 3, width: 1,   type: "standard" },
    { id: "L",         label: "L",     row: 3, width: 1,   type: "standard" },
    { id: "Semicolon", label: ";",     primaryLegend: ";", secondaryLegend: ":", row: 3, width: 1, type: "standard" },
    { id: "Quote",     label: "'",     primaryLegend: "'", secondaryLegend: '"', row: 3, width: 1, type: "standard" },
    { id: "Enter",     label: "Enter", primaryLegend: "Enter", row: 3, width: 2.821, type: "modifier" },
    // Right nav column — Page Down
    { id: "PageDown",  label: "PgDn",  primaryLegend: "PgDn",  row: 3, width: 1, gapBefore: 0.1, type: "navigation" },
  ],
}

const ROW_SHIFT: KeyboardRowConfig = {
  id: "shift-row",
  keys: [
    { id: "ShiftL",    label: "Shift", primaryLegend: "Shift", row: 4, width: 2.25, type: "modifier" },
    { id: "Z",         label: "Z",     row: 4, width: 1,   type: "standard" },
    { id: "X",         label: "X",     row: 4, width: 1,   type: "standard" },
    { id: "C",         label: "C",     row: 4, width: 1,   type: "standard" },
    { id: "V",         label: "V",     row: 4, width: 1,   type: "standard" },
    { id: "B",         label: "B",     row: 4, width: 1,   type: "standard" },
    { id: "N",         label: "N",     row: 4, width: 1,   type: "standard" },
    { id: "M",         label: "M",     row: 4, width: 1,   type: "standard" },
    { id: "Comma",     label: ",",     primaryLegend: ",", secondaryLegend: "<", row: 4, width: 1, type: "standard" },
    { id: "Period",    label: ".",     primaryLegend: ".", secondaryLegend: ">", row: 4, width: 1, type: "standard" },
    { id: "Slash",     label: "/",     primaryLegend: "/", secondaryLegend: "?", row: 4, width: 1, type: "standard" },
    // Sized to centre ArrowUp exactly over ArrowDown in the inverted-T cluster.
    { id: "ShiftR",    label: "Shift", primaryLegend: "Shift", row: 4, width: 2.22, type: "modifier" },
    // Inverted-T arrow cluster upper key sits inline here
    { id: "ArrowUp",   label: "↑",     primaryLegend: "↑",     row: 4, width: 1, gapBefore: 0.1, type: "arrow" },
    // Right nav column — End
    { id: "End",       label: "End",   primaryLegend: "End",   row: 4, width: 1, gapBefore: 0.1, type: "navigation" },
  ],
}

const ROW_BOTTOM: KeyboardRowConfig = {
  id: "bottom-row",
  keys: [
    { id: "CtrlL",      label: "Ctrl",  primaryLegend: "Ctrl",  row: 5, width: 1.25, type: "modifier" },
    { id: "Win",        label: "Win",   primaryLegend: "Win",   row: 5, width: 1.25, type: "modifier" },
    { id: "AltL",       label: "Alt",   primaryLegend: "Alt",   row: 5, width: 1.25, type: "modifier" },
    { id: "Space",      label: "Space", primaryLegend: "SPACE",  row: 5, width: 6.25, type: "spacebar" },
    { id: "AltR",       label: "Alt",   primaryLegend: "Alt",   row: 5, width: 1.25, type: "modifier" },
    { id: "Fn",         label: "Fn",    primaryLegend: "Fn",    row: 5, width: 1, type: "modifier" },
    { id: "CtrlR",      label: "Ctrl",  primaryLegend: "Ctrl",  row: 5, width: 1.25, type: "modifier" },
    // Inverted-T arrow cluster — Left / Down / Right
    { id: "ArrowLeft",  label: "←",     primaryLegend: "←",     row: 5, width: 1, gapBefore: 0.1, type: "arrow" },
    { id: "ArrowDown",  label: "↓",     primaryLegend: "↓",     row: 5, width: 1, type: "arrow" },
    { id: "ArrowRight", label: "→",     primaryLegend: "→",     row: 5, width: 1, type: "arrow" },
  ],
}

export const PAWTYPE_75_KNOB_V1: KeyboardModel = {
  id: "pawtype-75-knob-v1",
  name: "Pawtype 75 Knob V1",
  layoutType: "75%",
  rows: [ROW_FN, ROW_NUMBER, ROW_QWERTY, ROW_HOME, ROW_SHIFT, ROW_BOTTOM],
  caseConfig: {
    bezelX:         0.40,
    bezelTop:       0.55,
    bezelBottom:    0.70,   // slightly thicker front lip
    rightExtension: 0,
    cornerRadius:   0.15,
    caseHeight:     0.46,
    bottomHeight:   0.30,
    typingAngle:    6,
  },
  knobConfig: {
    // Centres the knob over the shared right navigation column.
    rightOffset: 0.385,
    topOffset:   0.10,   // distance from top of function row
    radius:      0.46,
  },
  hasKnob: true,
}

/** Registry of all available keyboard models */
export const KEYBOARD_MODELS: KeyboardModel[] = [
  PAWTYPE_75_KNOB_V1,
]

export function getKeyboardModel(id: string): KeyboardModel {
  return KEYBOARD_MODELS.find((m) => m.id === id) ?? PAWTYPE_75_KNOB_V1
}

// ─── Flatten model rows to a key array ───────────────────────────────────────

export function flattenModelKeys(model: KeyboardModel): KeyboardLayoutKey[] {
  const keys: KeyboardLayoutKey[] = []
  for (const row of model.rows) {
    for (const k of row.keys) {
      keys.push(k)
    }
  }
  return keys
}

// ─── Legacy flat arrays (derived from models) ─────────────────────────────────

export const LAYOUT_75: KeyboardLayoutKey[] = flattenModelKeys(PAWTYPE_75_KNOB_V1)

export function validateKeyboardLayout(rows: KeyboardRowConfig[]) {
  const keys = rows.flatMap((row) => row.keys)
  const ids = keys.map((key) => key.id)
  return {
    keyCount: keys.length,
    duplicateIds: ids.filter((id, index) => ids.indexOf(id) !== index),
    missingLegends: keys.filter((key) => !(key.primaryLegend ?? key.label)),
    invalidWidths: keys.filter((key) => !Number.isFinite(key.width) || key.width <= 0),
    emptyRows: rows.filter((row) => row.keys.length === 0).map((row) => row.id),
  }
}

if (import.meta.env.DEV) {
  const result = validateKeyboardLayout(PAWTYPE_75_KNOB_V1.rows)
  if (result.keyCount !== 81 || result.duplicateIds.length || result.missingLegends.length || result.invalidWidths.length || result.emptyRows.length) {
    console.error("Invalid Pawtype 75 keyboard layout", result)
  }
}

// Legacy 65% and 60% layouts (standalone, no model config yet)
export const LAYOUT_65: KeyboardLayoutKey[] = [
  { id: "Escape", label: "Esc",  row: 1, width: 1, type: "function" },
  { id: "1",  label: "1", primaryLegend: "1", secondaryLegend: "!", row: 1, width: 1, type: "standard" },
  { id: "2",  label: "2", primaryLegend: "2", secondaryLegend: "@", row: 1, width: 1, type: "standard" },
  { id: "3",  label: "3", primaryLegend: "3", secondaryLegend: "#", row: 1, width: 1, type: "standard" },
  { id: "4",  label: "4", primaryLegend: "4", secondaryLegend: "$", row: 1, width: 1, type: "standard" },
  { id: "5",  label: "5", primaryLegend: "5", secondaryLegend: "%", row: 1, width: 1, type: "standard" },
  { id: "6",  label: "6", primaryLegend: "6", secondaryLegend: "^", row: 1, width: 1, type: "standard" },
  { id: "7",  label: "7", primaryLegend: "7", secondaryLegend: "&", row: 1, width: 1, type: "standard" },
  { id: "8",  label: "8", primaryLegend: "8", secondaryLegend: "*", row: 1, width: 1, type: "standard" },
  { id: "9",  label: "9", primaryLegend: "9", secondaryLegend: "(", row: 1, width: 1, type: "standard" },
  { id: "0",  label: "0", primaryLegend: "0", secondaryLegend: ")", row: 1, width: 1, type: "standard" },
  { id: "Minus",     label: "-", primaryLegend: "-", secondaryLegend: "_", row: 1, width: 1, type: "standard" },
  { id: "Equal",     label: "=", primaryLegend: "=", secondaryLegend: "+", row: 1, width: 1, type: "standard" },
  { id: "Backspace", label: "⌫", row: 1, width: 2, type: "modifier" },
  { id: "Delete",    label: "Del", row: 1, width: 1, type: "navigation" },
  { id: "Tab",       label: "Tab", row: 2, width: 1.5, type: "modifier" },
  { id: "Q", label: "Q", row: 2, width: 1, type: "standard" },
  { id: "W", label: "W", row: 2, width: 1, type: "standard" },
  { id: "E", label: "E", row: 2, width: 1, type: "standard" },
  { id: "R", label: "R", row: 2, width: 1, type: "standard" },
  { id: "T", label: "T", row: 2, width: 1, type: "standard" },
  { id: "Y", label: "Y", row: 2, width: 1, type: "standard" },
  { id: "U", label: "U", row: 2, width: 1, type: "standard" },
  { id: "I", label: "I", row: 2, width: 1, type: "standard" },
  { id: "O", label: "O", row: 2, width: 1, type: "standard" },
  { id: "P", label: "P", row: 2, width: 1, type: "standard" },
  { id: "BracketL",  label: "[", row: 2, width: 1, type: "standard" },
  { id: "BracketR",  label: "]", row: 2, width: 1, type: "standard" },
  { id: "Backslash", label: "\\", row: 2, width: 1.5, type: "modifier" },
  { id: "PageUp",    label: "PgUp", row: 2, width: 1, type: "navigation" },
  { id: "CapsLock",  label: "Caps", row: 3, width: 1.75, type: "modifier" },
  { id: "A", label: "A", row: 3, width: 1, type: "standard" },
  { id: "S", label: "S", row: 3, width: 1, type: "standard" },
  { id: "D", label: "D", row: 3, width: 1, type: "standard" },
  { id: "F", label: "F", row: 3, width: 1, type: "standard" },
  { id: "G", label: "G", row: 3, width: 1, type: "standard" },
  { id: "H", label: "H", row: 3, width: 1, type: "standard" },
  { id: "J", label: "J", row: 3, width: 1, type: "standard" },
  { id: "K", label: "K", row: 3, width: 1, type: "standard" },
  { id: "L", label: "L", row: 3, width: 1, type: "standard" },
  { id: "Semicolon", label: ";", row: 3, width: 1, type: "standard" },
  { id: "Quote",     label: "'", row: 3, width: 1, type: "standard" },
  { id: "Enter",     label: "Enter", row: 3, width: 2.25, type: "modifier" },
  { id: "PageDown",  label: "PgDn", row: 3, width: 1, type: "navigation" },
  { id: "ShiftL",    label: "Shift", row: 4, width: 2.25, type: "modifier" },
  { id: "Z", label: "Z", row: 4, width: 1, type: "standard" },
  { id: "X", label: "X", row: 4, width: 1, type: "standard" },
  { id: "C", label: "C", row: 4, width: 1, type: "standard" },
  { id: "V", label: "V", row: 4, width: 1, type: "standard" },
  { id: "B", label: "B", row: 4, width: 1, type: "standard" },
  { id: "N", label: "N", row: 4, width: 1, type: "standard" },
  { id: "M", label: "M", row: 4, width: 1, type: "standard" },
  { id: "Comma",  label: ",", row: 4, width: 1, type: "standard" },
  { id: "Period", label: ".", row: 4, width: 1, type: "standard" },
  { id: "Slash",  label: "/", row: 4, width: 1, type: "standard" },
  { id: "ShiftR",     label: "Shift", row: 4, width: 1.75, type: "modifier" },
  { id: "ArrowUp",    label: "↑",     row: 4, width: 1, type: "arrow" },
  { id: "End",        label: "End",   row: 4, width: 1, type: "navigation" },
  { id: "CtrlL",      label: "Ctrl",  row: 5, width: 1.25, type: "modifier" },
  { id: "Win",        label: "Win",   row: 5, width: 1.25, type: "modifier" },
  { id: "AltL",       label: "Alt",   row: 5, width: 1.25, type: "modifier" },
  { id: "Space",      label: "",      row: 5, width: 6.25, type: "spacebar" },
  { id: "AltR",       label: "Alt",   row: 5, width: 1.25, type: "modifier" },
  { id: "Fn",         label: "Fn",    row: 5, width: 1.25, type: "modifier" },
  { id: "ArrowLeft",  label: "←",     row: 5, width: 1, type: "arrow" },
  { id: "ArrowDown",  label: "↓",     row: 5, width: 1, type: "arrow" },
  { id: "ArrowRight", label: "→",     row: 5, width: 1, type: "arrow" },
]

export const LAYOUT_60: KeyboardLayoutKey[] = [
  { id: "Escape", label: "Esc", row: 1, width: 1, type: "function" },
  { id: "1",  label: "1", primaryLegend: "1", secondaryLegend: "!", row: 1, width: 1, type: "standard" },
  { id: "2",  label: "2", primaryLegend: "2", secondaryLegend: "@", row: 1, width: 1, type: "standard" },
  { id: "3",  label: "3", primaryLegend: "3", secondaryLegend: "#", row: 1, width: 1, type: "standard" },
  { id: "4",  label: "4", primaryLegend: "4", secondaryLegend: "$", row: 1, width: 1, type: "standard" },
  { id: "5",  label: "5", primaryLegend: "5", secondaryLegend: "%", row: 1, width: 1, type: "standard" },
  { id: "6",  label: "6", primaryLegend: "6", secondaryLegend: "^", row: 1, width: 1, type: "standard" },
  { id: "7",  label: "7", primaryLegend: "7", secondaryLegend: "&", row: 1, width: 1, type: "standard" },
  { id: "8",  label: "8", primaryLegend: "8", secondaryLegend: "*", row: 1, width: 1, type: "standard" },
  { id: "9",  label: "9", primaryLegend: "9", secondaryLegend: "(", row: 1, width: 1, type: "standard" },
  { id: "0",  label: "0", primaryLegend: "0", secondaryLegend: ")", row: 1, width: 1, type: "standard" },
  { id: "Minus",     label: "-", primaryLegend: "-", secondaryLegend: "_", row: 1, width: 1, type: "standard" },
  { id: "Equal",     label: "=", primaryLegend: "=", secondaryLegend: "+", row: 1, width: 1, type: "standard" },
  { id: "Backspace", label: "⌫", row: 1, width: 2, type: "modifier" },
  { id: "Tab",       label: "Tab", row: 2, width: 1.5, type: "modifier" },
  { id: "Q", label: "Q", row: 2, width: 1, type: "standard" },
  { id: "W", label: "W", row: 2, width: 1, type: "standard" },
  { id: "E", label: "E", row: 2, width: 1, type: "standard" },
  { id: "R", label: "R", row: 2, width: 1, type: "standard" },
  { id: "T", label: "T", row: 2, width: 1, type: "standard" },
  { id: "Y", label: "Y", row: 2, width: 1, type: "standard" },
  { id: "U", label: "U", row: 2, width: 1, type: "standard" },
  { id: "I", label: "I", row: 2, width: 1, type: "standard" },
  { id: "O", label: "O", row: 2, width: 1, type: "standard" },
  { id: "P", label: "P", row: 2, width: 1, type: "standard" },
  { id: "BracketL",  label: "[", row: 2, width: 1, type: "standard" },
  { id: "BracketR",  label: "]", row: 2, width: 1, type: "standard" },
  { id: "Backslash", label: "\\", row: 2, width: 1.5, type: "modifier" },
  { id: "CapsLock",  label: "Caps", row: 3, width: 1.75, type: "modifier" },
  { id: "A", label: "A", row: 3, width: 1, type: "standard" },
  { id: "S", label: "S", row: 3, width: 1, type: "standard" },
  { id: "D", label: "D", row: 3, width: 1, type: "standard" },
  { id: "F", label: "F", row: 3, width: 1, type: "standard" },
  { id: "G", label: "G", row: 3, width: 1, type: "standard" },
  { id: "H", label: "H", row: 3, width: 1, type: "standard" },
  { id: "J", label: "J", row: 3, width: 1, type: "standard" },
  { id: "K", label: "K", row: 3, width: 1, type: "standard" },
  { id: "L", label: "L", row: 3, width: 1, type: "standard" },
  { id: "Semicolon", label: ";", row: 3, width: 1, type: "standard" },
  { id: "Quote",     label: "'", row: 3, width: 1, type: "standard" },
  { id: "Enter",     label: "Enter", row: 3, width: 2.25, type: "modifier" },
  { id: "ShiftL",    label: "Shift", row: 4, width: 2.25, type: "modifier" },
  { id: "Z", label: "Z", row: 4, width: 1, type: "standard" },
  { id: "X", label: "X", row: 4, width: 1, type: "standard" },
  { id: "C", label: "C", row: 4, width: 1, type: "standard" },
  { id: "V", label: "V", row: 4, width: 1, type: "standard" },
  { id: "B", label: "B", row: 4, width: 1, type: "standard" },
  { id: "N", label: "N", row: 4, width: 1, type: "standard" },
  { id: "M", label: "M", row: 4, width: 1, type: "standard" },
  { id: "Comma",  label: ",", row: 4, width: 1, type: "standard" },
  { id: "Period", label: ".", row: 4, width: 1, type: "standard" },
  { id: "Slash",  label: "/", row: 4, width: 1, type: "standard" },
  { id: "ShiftR", label: "Shift", row: 4, width: 2.75, type: "modifier" },
  { id: "CtrlL",  label: "Ctrl",  row: 5, width: 1.25, type: "modifier" },
  { id: "Win",    label: "Win",   row: 5, width: 1.25, type: "modifier" },
  { id: "AltL",   label: "Alt",   row: 5, width: 1.25, type: "modifier" },
  { id: "Space",  label: "",      row: 5, width: 6.25, type: "spacebar" },
  { id: "AltR",   label: "Alt",   row: 5, width: 1.25, type: "modifier" },
  { id: "Fn",     label: "Fn",    row: 5, width: 1.25, type: "modifier" },
  { id: "CtrlR",  label: "Ctrl",  row: 5, width: 1.5,  type: "modifier" },
]

export const LAYOUTS: Record<string, KeyboardLayoutKey[]> = {
  "75%": LAYOUT_75,
  "65%": LAYOUT_65,
  "60%": LAYOUT_60,
}

// ─── Row profile heights ──────────────────────────────────────────────────────

export const ROW_PROFILE = {
  function: { height: 0.36, tilt: -2 },
  number:   { height: 0.42, tilt: -3 },
  qwerty:   { height: 0.44, tilt: -1 },
  home:     { height: 0.44, tilt:  1 },
  shift:    { height: 0.42, tilt:  2 },
  bottom:   { height: 0.40, tilt:  3 },
} as const

export type RowProfileKey = keyof typeof ROW_PROFILE

export function getRowProfileKey(row: number): RowProfileKey {
  switch (row) {
    case 0: return "function"
    case 1: return "number"
    case 2: return "qwerty"
    case 3: return "home"
    case 4: return "shift"
    case 5: return "bottom"
    default: return "qwerty"
  }
}

// ─── Compute key positions ────────────────────────────────────────────────────

export type KeyPosition = {
  keyId: string
  /** Primary display legend */
  primaryLegend: string
  /** Secondary display legend (shift symbol etc.) */
  secondaryLegend?: string
  x: number
  y: number
  z: number
  width: number
  height: number
  depth: number
  rowProfileKey: RowProfileKey
  row: number
  type: string
}

export function computeKeyPositions(
  keys: KeyboardLayoutKey[],
  unitSize: number = 1,
  gap: number = GAP
): KeyPosition[] {
  const rows: Record<number, KeyboardLayoutKey[]> = {}
  for (const key of keys) {
    if (!rows[key.row]) rows[key.row] = []
    rows[key.row].push(key)
  }

  const positions: KeyPosition[] = []

  // Every row uses the same outside width. This keeps the first and last
  // key edges perfectly vertical while preserving each row's intentional gaps.
  const rowWidths = Object.values(rows).map((rowKeys) => {
    let width = 0
    for (const key of rowKeys) {
      width += (key.gapBefore ?? 0) * (unitSize + gap)
      width += key.width * unitSize + (key.width - 1) * gap + gap
    }
    return width - gap
  })
  const targetRowWidth = Math.max(...rowWidths)

  for (const [rowStr, rowKeys] of Object.entries(rows)) {
    const row = parseInt(rowStr)
    const rp = ROW_PROFILE[getRowProfileKey(row)]
    const naturalWidth = (() => {
      let width = 0
      for (const key of rowKeys) {
        width += (key.gapBefore ?? 0) * (unitSize + gap)
        width += key.width * unitSize + (key.width - 1) * gap + gap
      }
      return width - gap
    })()
    // Preserve the intended key-to-key geometry, especially the inverted-T
    // arrow cluster. Any width needed to reach the common right edge becomes
    // one clean separation before the row's final navigation key.
    // The first row ends with the physical knob, not an invisible spacer.
    // Leave F12 in its natural group position so the knob can occupy the
    // remaining first-row space inside the case.
    const rowEndSpacer = row === 0 ? 0 : targetRowWidth - naturalWidth
    let x = 0
    for (const [keyIndex, key] of rowKeys.entries()) {
      if (key.gapBefore !== undefined) x += key.gapBefore * (unitSize + gap)
      if (keyIndex === rowKeys.length - 1) x += rowEndSpacer
      const w = key.width * unitSize + (key.width - 1) * gap
      const cx = x + w / 2
      positions.push({
        keyId: key.id,
        primaryLegend: key.primaryLegend ?? key.label,
        secondaryLegend: key.secondaryLegend,
        x: cx,
        y: -(row * (unitSize + gap)),
        z: 0,
        width: w,
        height: rp.height,
        depth: unitSize,
        rowProfileKey: getRowProfileKey(row),
        row,
        type: key.type,
      })
      x += w + gap
    }
  }

  // Center all keys around origin
  const allX = positions.map((p) => p.x)
  const allY = positions.map((p) => p.y)
  const minX = Math.min(...allX.map((x, i) => x - positions[i].width / 2))
  const maxX = Math.max(...allX.map((x, i) => x + positions[i].width / 2))
  const minY = Math.min(...allY.map((y, i) => y - positions[i].depth / 2))
  const maxY = Math.max(...allY.map((y, i) => y + positions[i].depth / 2))
  const offsetX = (minX + maxX) / 2
  const offsetY = (minY + maxY) / 2

  for (const pos of positions) {
    pos.x -= offsetX
    pos.y -= offsetY
  }

  return positions
}

export const STABILIZER_KEYS = new Set([
  "Backspace",
  "Enter",
  "ShiftL",
  "ShiftR",
  "Space",
])

// ─── Per-key default colorway for PAWTYPE_75_KNOB_V1 ─────────────────────────
//
// accent:      dark charcoal  #2c2825
// function:    pale gray-blue #b8bec8
// navigation:  soft gray-blue #8a9aaa
// alphanumeric:cream          #e8dfc8
// modifier:    warm off-white #d8cdb8

export type KeyColorRole =
  | "alpha"       // cream alphanumeric keys
  | "modifier"    // warm off-white modifiers
  | "function"    // pale gray-blue fn row
  | "navigation"  // soft gray-blue nav keys
  | "accent"      // dark charcoal: Esc, Enter, arrows, spacebar
  | "special"     // knob

export const KEY_COLOR_ROLES: Record<string, KeyColorRole> = {
  // Accent (dark charcoal)
  Escape:     "accent",
  Enter:      "accent",
  ArrowUp:    "accent",
  ArrowDown:  "accent",
  ArrowLeft:  "accent",
  ArrowRight: "accent",
  Space:      "accent",
  // Function group (pale gray-blue)
  F1: "function", F2: "function", F3: "function", F4: "function",
  F5: "function", F6: "function", F7: "function", F8: "function",
  F9: "function", F10: "function", F11: "function", F12: "function",
  // Navigation (soft gray-blue)
  Delete:   "navigation",
  Home:     "navigation",
  PageUp:   "navigation",
  PageDown: "navigation",
  End:      "navigation",
  // Everything else defaults to alpha or modifier
}

export const COLOR_ROLE_PALETTES: Record<KeyColorRole, {
  top: string; side: string; border: string; highlight: string; shadow: string; legend: string
}> = {
  alpha: {
    top:       "#e8dfc8",
    side:      "#c4b898",
    border:    "#a89870",
    highlight: "#f5ede0",
    shadow:    "#9a8860",
    legend:    "#2c2420",
  },
  modifier: {
    top:       "#d8cdb8",
    side:      "#b8a890",
    border:    "#9a8870",
    highlight: "#e8ddd0",
    shadow:    "#8a7860",
    legend:    "#2c2420",
  },
  function: {
    top:       "#b8bec8",
    side:      "#8890a0",
    border:    "#6878a0",
    highlight: "#c8d0dc",
    shadow:    "#506080",
    legend:    "#1a2030",
  },
  navigation: {
    top:       "#8a9aaa",
    side:      "#607080",
    border:    "#405060",
    highlight: "#a0b0c0",
    shadow:    "#304050",
    legend:    "#f0f4f8",
  },
  accent: {
    top:       "#2c2825",
    side:      "#1a1714",
    border:    "#0e0c0a",
    highlight: "#3e3835",
    shadow:    "#0e0c0a",
    legend:    "#e8dfc8",
  },
  special: {
    top:       "#a0a8b0",
    side:      "#707880",
    border:    "#505860",
    highlight: "#b8c0c8",
    shadow:    "#404850",
    legend:    "#f0f4f8",
  },
}

export function getKeyColorRole(keyId: string, keyType: string): KeyColorRole {
  if (KEY_COLOR_ROLES[keyId]) return KEY_COLOR_ROLES[keyId]
  if (keyType === "modifier") return "modifier"
  if (keyType === "function") return "function"
  if (keyType === "navigation") return "navigation"
  if (keyType === "arrow") return "accent"
  if (keyType === "spacebar") return "accent"
  return "alpha"
}
