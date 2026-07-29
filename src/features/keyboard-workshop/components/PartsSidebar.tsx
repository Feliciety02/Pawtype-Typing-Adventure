"use client"
import { useState } from "react"
import { ChevronRight, LayoutGrid, Cpu } from "lucide-react"
import { useWorkshopStore } from "../store"
import type { KeyboardPart, KeyboardLayoutId } from "../types"
import { PRESETS } from "../defaults"
import { LAYOUTS, KEYBOARD_MODELS } from "../layout-data"

// Future model slots shown as "Coming Soon"
const COMING_SOON_SLOTS = 2

const PARTS: Array<{ id: KeyboardPart; label: string; icon: string }> = [
  { id: "keycaps", label: "Keycaps", icon: "⌨" },
  { id: "case", label: "Case", icon: "▭" },
  { id: "frame", label: "Frame", icon: "□" },
  { id: "plate", label: "Plate", icon: "═" },
  { id: "switches", label: "Switches", icon: "◉" },
  { id: "stabilizers", label: "Stabilizers", icon: "—" },
  { id: "knob", label: "Knob", icon: "◎" },
  { id: "badge", label: "Badge", icon: "◈" },
  { id: "lighting", label: "Lighting", icon: "✦" },
  { id: "sound", label: "Sound", icon: "♪" },
  { id: "builds", label: "Builds", icon: "⊞" },
]

const QUICK_SELECT_GROUPS: Array<{ label: string; ids: string[] }> = [
  { label: "All Keys", ids: [] },
  { label: "WASD", ids: ["W", "A", "S", "D"] },
  { label: "Arrows", ids: ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"] },
  { label: "Function Row", ids: ["Escape", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "Delete"] },
  { label: "Number Row", ids: ["Backtick", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "Minus", "Equal", "Backspace", "Home"] },
  { label: "Modifiers", ids: ["CapsLock", "Tab", "ShiftL", "ShiftR", "CtrlL", "CtrlR", "AltL", "AltR", "Win", "Fn", "Enter", "Backspace", "Backslash"] },
  { label: "Navigation", ids: ["Home", "End", "PageUp", "PageDown", "Delete"] },
  { label: "Spacebar", ids: ["Space"] },
]

const LAYOUT_OPTIONS: { id: KeyboardLayoutId; label: string }[] = [
  { id: "75%", label: "75%" },
  { id: "65%", label: "65%" },
  { id: "60%", label: "60%" },
]

export function PartsSidebar() {
  const { selectedPart, setSelectedPart, currentBuild, setLayout, selectGroup, applyPreset, keyGroups } = useWorkshopStore()
  const [expanded, setExpanded] = useState<string | null>("parts")

  const toggle = (section: string) =>
    setExpanded((v) => (v === section ? null : section))

  return (
    <aside
      className="flex flex-col h-full overflow-y-auto text-sm"
      style={{ background: "#1e1408", color: "#e8d5a0" }}
      aria-label="Parts panel"
    >
      {/* Layout selector */}
      <section className="border-b px-3 py-2" style={{ borderColor: "#3a2a14" }}>
        <button
          className="w-full flex items-center justify-between font-semibold text-xs mb-2 uppercase tracking-wider"
          style={{ color: "#c8a060" }}
          onClick={() => toggle("layout")}
          aria-expanded={expanded === "layout"}
        >
          <span className="flex items-center gap-1.5"><LayoutGrid size={12} /> Layout</span>
          <ChevronRight size={12} className={`transition-transform ${expanded === "layout" ? "rotate-90" : ""}`} />
        </button>
        {expanded === "layout" && (
          <div className="flex gap-1 flex-wrap">
            {LAYOUT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setLayout(opt.id)}
                className="px-3 py-1 rounded text-xs font-medium transition-all"
                style={{
                  background: currentBuild.layout === opt.id ? "#8a5a20" : "#2a1e10",
                  color: currentBuild.layout === opt.id ? "#ffe0a0" : "#c8a060",
                }}
                aria-pressed={currentBuild.layout === opt.id}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Parts list */}
      <section className="border-b" style={{ borderColor: "#3a2a14" }}>
        <button
          className="w-full flex items-center justify-between font-semibold text-xs uppercase tracking-wider px-3 py-2"
          style={{ color: "#c8a060" }}
          onClick={() => toggle("parts")}
          aria-expanded={expanded === "parts"}
        >
          Parts
          <ChevronRight size={12} className={`transition-transform ${expanded === "parts" ? "rotate-90" : ""}`} />
        </button>
        {expanded !== "parts" ? null : (
          <ul role="listbox" aria-label="Keyboard parts">
            {PARTS.map((p) => (
              <li key={p.id}>
                <button
                  onClick={() => setSelectedPart(p.id)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-left transition-all"
                  style={{
                    background: selectedPart === p.id ? "#4a2e10" : "transparent",
                    color: selectedPart === p.id ? "#ffe8a0" : "#d4b880",
                    borderLeft: selectedPart === p.id ? "3px solid #c8803a" : "3px solid transparent",
                  }}
                  role="option"
                  aria-selected={selectedPart === p.id}
                >
                  <span className="w-5 text-center text-base">{p.icon}</span>
                  {p.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Quick key groups */}
      <section className="border-b" style={{ borderColor: "#3a2a14" }}>
        <button
          className="w-full flex items-center justify-between font-semibold text-xs uppercase tracking-wider px-3 py-2"
          style={{ color: "#c8a060" }}
          onClick={() => toggle("groups")}
          aria-expanded={expanded === "groups"}
        >
          Key Groups
          <ChevronRight size={12} className={`transition-transform ${expanded === "groups" ? "rotate-90" : ""}`} />
        </button>
        {expanded === "groups" && (
          <div className="px-2 pb-2 flex flex-col gap-0.5">
            {QUICK_SELECT_GROUPS.map((g) => (
              <button
                key={g.label}
                onClick={() => {
                  setSelectedPart("keycaps")
                  selectGroup(g.ids.length ? g.ids : (LAYOUTS[currentBuild.layout] ?? []).map((key) => key.id))
                }}
                className="text-left px-3 py-1.5 rounded text-xs transition-all hover:opacity-80"
                style={{ background: "#2a1e10", color: "#c8a870" }}
              >
                {g.label}
              </button>
            ))}
            {/* Custom groups */}
            {keyGroups.map((g) => (
              <button
                key={g.id}
                onClick={() => { setSelectedPart("keycaps"); selectGroup(g.keyIds) }}
                className="text-left px-3 py-1.5 rounded text-xs transition-all hover:opacity-80"
                style={{ background: "#2a2010", color: "#e8c870" }}
              >
                {g.name}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Presets */}
      <section className="border-b" style={{ borderColor: "#3a2a14" }}>
        <button
          className="w-full flex items-center justify-between font-semibold text-xs uppercase tracking-wider px-3 py-2"
          style={{ color: "#c8a060" }}
          onClick={() => toggle("presets")}
          aria-expanded={expanded === "presets"}
        >
          Presets
          <ChevronRight size={12} className={`transition-transform ${expanded === "presets" ? "rotate-90" : ""}`} />
        </button>
        {expanded === "presets" && (
          <div className="px-2 pb-2 flex flex-col gap-0.5">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset.patch)}
                className="text-left px-3 py-1.5 rounded text-xs transition-all hover:opacity-80"
                style={{ background: "#2a1e10", color: "#c8a870" }}
                title={`Apply preset: ${preset.name}`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        )}
      </section>
    </aside>
  )
}
