"use client"
import { useWorkshopStore } from "../../store"
import { Section, ColorPicker, Select, Toggle } from "./EditorPrimitives"
import type { PlateMaterial } from "../../types"

const PLATE_MATERIALS: Array<{ value: PlateMaterial; label: string }> = [
  { value: "aluminum", label: "Aluminum" },
  { value: "brass", label: "Brass" },
  { value: "steel", label: "Steel" },
  { value: "wood", label: "Wood" },
  { value: "polycarbonate", label: "Polycarbonate" },
  { value: "crystal", label: "Crystal" },
  { value: "stone", label: "Stone" },
  { value: "galaxy-glass", label: "Galaxy Glass" },
  { value: "moss-metal", label: "Moss Metal" },
  { value: "custom", label: "Custom" },
]

const EDGE_TRIMS = ["polished", "brushed", "raw", "rounded", "gilded", "none"].map((v) => ({
  value: v,
  label: v.charAt(0).toUpperCase() + v.slice(1),
}))

export function PlateEditor() {
  const { currentBuild, updatePlate } = useWorkshopStore()
  const p = currentBuild.plate

  return (
    <div>
      <Section title="Material">
        <Select label="Plate Material" value={p.material} options={PLATE_MATERIALS} onChange={(v) => updatePlate({ material: v })} />
        <Select label="Edge Trim" value={p.edgeTrim} options={EDGE_TRIMS} onChange={(v) => updatePlate({ edgeTrim: v })} />
      </Section>
      <Section title="Color">
        <ColorPicker label="Plate Color" value={p.color} onChange={(v) => updatePlate({ color: v })} />
      </Section>
      <Section title="Effects">
        <Toggle label="Glow" checked={p.glow} onChange={(v) => updatePlate({ glow: v })} />
        {p.glow && (
          <ColorPicker label="Glow Color" value={p.glowColor} onChange={(v) => updatePlate({ glowColor: v })} />
        )}
      </Section>
    </div>
  )
}
