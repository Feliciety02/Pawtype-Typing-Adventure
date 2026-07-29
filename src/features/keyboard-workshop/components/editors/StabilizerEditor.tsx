"use client"
import { useWorkshopStore } from "../../store"
import { Section, ColorPicker, Select } from "./EditorPrimitives"

const STAB_STYLES = [
  { value: "screw-in", label: "Screw-in" },
  { value: "pcb-snap", label: "PCB Snap-in" },
  { value: "plate-mounted", label: "Plate Mounted" },
  { value: "costar", label: "Costar" },
]

const STAB_MATERIALS = ["brass", "steel", "nylon", "pom", "polycarbonate"].map((v) => ({
  value: v,
  label: v.charAt(0).toUpperCase() + v.slice(1),
}))

export function StabilizerEditor() {
  const { currentBuild, updateStabilizers } = useWorkshopStore()
  const s = currentBuild.stabilizers

  return (
    <div>
      <Section title="Type">
        <Select label="Style" value={s.style} options={STAB_STYLES} onChange={(v) => updateStabilizers({ style: v })} />
        <Select label="Material" value={s.material} options={STAB_MATERIALS} onChange={(v) => updateStabilizers({ material: v })} />
      </Section>
      <Section title="Colors">
        <ColorPicker label="Housing Color" value={s.housingColor} onChange={(v) => updateStabilizers({ housingColor: v })} />
        <ColorPicker label="Wire Color" value={s.wireColor} onChange={(v) => updateStabilizers({ wireColor: v })} />
      </Section>
    </div>
  )
}
