"use client"
import { useWorkshopStore } from "../../store"
import { Section, ColorPicker, Select, Slider, Toggle } from "./EditorPrimitives"
import type { KnobShape } from "../../types"

const KNOB_SHAPES: Array<{ value: KnobShape; label: string }> = [
  { value: "cylinder", label: "Cylinder" },
  { value: "crystal", label: "Crystal" },
  { value: "wooden-dial", label: "Wooden Dial" },
  { value: "gear", label: "Gear" },
  { value: "potion", label: "Potion" },
  { value: "mushroom", label: "Mushroom" },
  { value: "star-dial", label: "Star Dial" },
]

const KNOB_MATERIALS = [
  "walnut", "maple", "aluminum", "brass", "resin", "crystal", "obsidian", "ceramic",
].map((v) => ({
  value: v,
  label: v.charAt(0).toUpperCase() + v.slice(1),
}))

export function KnobEditor() {
  const { currentBuild, updateKnob } = useWorkshopStore()
  const k = currentBuild.knob

  return (
    <div>
      <Section title="Visibility">
        <Toggle label="Enable Knob" checked={k.enabled} onChange={(v) => updateKnob({ enabled: v })} />
      </Section>
      {k.enabled && (
        <>
          <Section title="Shape">
            <Select label="Shape" value={k.shape} options={KNOB_SHAPES} onChange={(v) => updateKnob({ shape: v })} />
            <Select label="Material" value={k.material} options={KNOB_MATERIALS} onChange={(v) => updateKnob({ material: v })} />
            <Slider label="Height" value={k.height} min={0.2} max={1.5} step={0.05} onChange={(v) => updateKnob({ height: v })} />
          </Section>
          <Section title="Color">
            <ColorPicker label="Knob Color" value={k.color} onChange={(v) => updateKnob({ color: v })} />
          </Section>
          <Section title="Glow">
            <Toggle label="Glow" checked={k.glow} onChange={(v) => updateKnob({ glow: v })} />
            {k.glow && <ColorPicker label="Glow Color" value={k.glowColor} onChange={(v) => updateKnob({ glowColor: v })} />}
          </Section>
        </>
      )}
    </div>
  )
}
