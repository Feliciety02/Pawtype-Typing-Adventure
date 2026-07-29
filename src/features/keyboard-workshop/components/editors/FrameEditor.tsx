"use client"
import { useWorkshopStore } from "../../store"
import { Section, ColorPicker, Select, Toggle } from "./EditorPrimitives"
import type { FrameStyle } from "../../types"

const FRAME_STYLES: Array<{ value: FrameStyle; label: string }> = [
  { value: "minimal", label: "Minimal" },
  { value: "explorer", label: "Explorer" },
  { value: "forest", label: "Forest" },
  { value: "sakura", label: "Sakura" },
  { value: "royal", label: "Royal" },
  { value: "stardust", label: "Stardust" },
  { value: "tide-pool", label: "Tide Pool" },
  { value: "cafe", label: "Café" },
  { value: "blacksmith", label: "Blacksmith" },
  { value: "ancient-library", label: "Ancient Library" },
  { value: "crystal", label: "Crystal" },
  { value: "custom", label: "Custom" },
]

const FRAME_MATERIALS = [
  "oak", "walnut", "maple", "aluminum", "brass", "steel", "resin", "carbon-fiber", "crystal",
].map((v) => ({ value: v, label: v.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") }))

const SCREW_TYPES = ["brass", "steel", "black", "gold", "rune", "none"].map((v) => ({
  value: v,
  label: v.charAt(0).toUpperCase() + v.slice(1),
}))

export function FrameEditor() {
  const { currentBuild, updateFrame } = useWorkshopStore()
  const f = currentBuild.frame

  return (
    <div>
      <Section title="Style">
        <Select label="Frame Style" value={f.style} options={FRAME_STYLES} onChange={(v) => updateFrame({ style: v })} />
        <Select label="Material" value={f.material} options={FRAME_MATERIALS} onChange={(v) => updateFrame({ material: v })} />
        <Select label="Screw Type" value={f.screwType} options={SCREW_TYPES} onChange={(v) => updateFrame({ screwType: v })} />
      </Section>
      <Section title="Colors">
        <ColorPicker label="Main Color" value={f.mainColor} onChange={(v) => updateFrame({ mainColor: v })} />
        <ColorPicker label="Accent Color" value={f.accentColor} onChange={(v) => updateFrame({ accentColor: v })} />
      </Section>
      <Section title="Decoration">
        <Toggle label="Corner Decorations" checked={f.cornerDecorations} onChange={(v) => updateFrame({ cornerDecorations: v })} />
        <Toggle label="Side Rails" checked={f.sideRails} onChange={(v) => updateFrame({ sideRails: v })} />
        <Toggle label="Glow Channels" checked={f.glowChannels} onChange={(v) => updateFrame({ glowChannels: v })} />
        {f.glowChannels && (
          <ColorPicker label="Glow Color" value={f.glowColor} onChange={(v) => updateFrame({ glowColor: v })} />
        )}
      </Section>
    </div>
  )
}
