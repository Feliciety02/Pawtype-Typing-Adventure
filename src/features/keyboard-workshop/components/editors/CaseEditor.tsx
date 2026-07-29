"use client"
import { useWorkshopStore } from "../../store"
import { Section, ColorPicker, Select, Slider, Toggle, ChipSelector } from "./EditorPrimitives"
import type { CaseStyle } from "../../types"

const CASE_STYLES: Array<{ value: CaseStyle; label: string }> = [
  { value: "compact-minimal", label: "Compact Minimal" },
  { value: "explorer", label: "Explorer" },
  { value: "rounded-cozy", label: "Rounded Cozy" },
  { value: "sharp-royal", label: "Sharp Royal" },
  { value: "crystal-frame", label: "Crystal Frame" },
  { value: "heavy-blacksmith", label: "Heavy Blacksmith" },
  { value: "floating-stardust", label: "Floating Stardust" },
  { value: "cafe-counter", label: "Café Counter" },
  { value: "forest-wood", label: "Forest Wood" },
  { value: "custom", label: "Custom" },
]

const CASE_MATERIALS = [
  "wood", "aluminum", "polycarbonate", "brass", "resin",
  "stone", "ceramic", "steel", "custom",
].map((v) => ({ value: v, label: v.charAt(0).toUpperCase() + v.slice(1) }))

export function CaseEditor() {
  const { currentBuild, updateCase } = useWorkshopStore()
  const c = currentBuild.case

  return (
    <div>
      <Section title="Style">
        <Select label="Case Style" value={c.style} options={CASE_STYLES} onChange={(v) => updateCase({ style: v })} />
        <Select label="Material" value={c.material} options={CASE_MATERIALS} onChange={(v) => updateCase({ material: v })} />
        <ChipSelector
          label="Corners"
          value={c.cornerStyle}
          options={[
            { value: "sharp", label: "Sharp" },
            { value: "rounded", label: "Rounded" },
            { value: "beveled", label: "Beveled" },
          ]}
          onChange={(v) => updateCase({ cornerStyle: v })}
        />
      </Section>
      <Section title="Colors">
        <ColorPicker label="Main Color" value={c.mainColor} onChange={(v) => updateCase({ mainColor: v })} />
        <ColorPicker label="Side Color" value={c.sideColor} onChange={(v) => updateCase({ sideColor: v })} />
      </Section>
      <Section title="Geometry">
        <Slider label="Rear Height" value={c.rearHeight} min={0.1} max={1.2} step={0.02} onChange={(v) => updateCase({ rearHeight: v })} />
        <Slider label="Typing Angle" value={c.typingAngle} min={0} max={15} step={0.5} onChange={(v) => updateCase({ typingAngle: v })} />
        <Slider label="Bezel Width" value={c.bezelWidth} min={0.2} max={1.5} step={0.05} onChange={(v) => updateCase({ bezelWidth: v })} />
      </Section>
      <Section title="Underglow">
        <Toggle label="Underglow" checked={c.underglow} onChange={(v) => updateCase({ underglow: v })} />
        {c.underglow && <ColorPicker label="Glow Color" value={c.underglowColor} onChange={(v) => updateCase({ underglowColor: v })} />}
      </Section>
    </div>
  )
}
