"use client"
import { useWorkshopStore } from "../../store"
import { Section, ColorPicker, Select, Toggle, ChipSelector } from "./EditorPrimitives"

const MATERIALS = ["nylon", "polycarbonate", "pom", "uhmwpe", "metal"].map((v) => ({
  value: v, label: v.toUpperCase(),
}))

const FEELS: Array<{ value: string; label: string }> = [
  { value: "linear", label: "Linear" },
  { value: "tactile", label: "Tactile" },
  { value: "clicky", label: "Clicky" },
  { value: "silent-linear", label: "Silent Linear" },
  { value: "silent-tactile", label: "Silent Tactile" },
  { value: "optical", label: "Optical" },
  { value: "magnetic", label: "Magnetic" },
]

const SOUND_PROFILES = ["thock", "clack", "creamy", "soft", "silent", "wood", "crystal", "retro", "magical"].map(
  (v) => ({ value: v, label: v.charAt(0).toUpperCase() + v.slice(1) })
)

export function SwitchEditor() {
  const { currentBuild, updateSwitch, selectedKeyIds } = useWorkshopStore()
  // Use first selected key's switch, or global default
  const firstId = selectedKeyIds[0]
  const sw = firstId
    ? currentBuild.switches[firstId] ?? {
        housingColor: "#e8e0d8", stemColor: "#c8503a", material: "nylon",
        glow: false, glowColor: "#ff6644", soundProfile: "thock", feel: "tactile",
      }
    : Object.values(currentBuild.switches)[0] ?? {
        housingColor: "#e8e0d8", stemColor: "#c8503a", material: "nylon",
        glow: false, glowColor: "#ff6644", soundProfile: "thock", feel: "tactile",
      }

  const apply = (patch: Parameters<typeof updateSwitch>[0]) =>
    updateSwitch(patch, selectedKeyIds.length > 0 ? selectedKeyIds : undefined)

  return (
    <div>
      <Section title="Type">
        <Select label="Feel" value={sw.feel} options={FEELS} onChange={(v) => apply({ feel: v })} />
        <Select label="Housing Material" value={sw.material} options={MATERIALS} onChange={(v) => apply({ material: v })} />
        <Select label="Sound Profile" value={sw.soundProfile} options={SOUND_PROFILES} onChange={(v) => apply({ soundProfile: v })} />
      </Section>
      <Section title="Colors">
        <ColorPicker label="Housing Color" value={sw.housingColor} onChange={(v) => apply({ housingColor: v })} />
        <ColorPicker label="Stem Color" value={sw.stemColor} onChange={(v) => apply({ stemColor: v })} />
      </Section>
      <Section title="Effects">
        <Toggle label="LED Glow" checked={sw.glow} onChange={(v) => apply({ glow: v })} />
        {sw.glow && <ColorPicker label="Glow Color" value={sw.glowColor} onChange={(v) => apply({ glowColor: v })} />}
      </Section>
      {selectedKeyIds.length > 0 && (
        <div className="px-3 py-2 text-xs" style={{ color: "#a08060" }}>
          Editing {selectedKeyIds.length} selected {selectedKeyIds.length === 1 ? "key" : "keys"}
        </div>
      )}
    </div>
  )
}
