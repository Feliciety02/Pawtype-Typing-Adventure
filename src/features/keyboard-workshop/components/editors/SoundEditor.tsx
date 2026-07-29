"use client"
import { useWorkshopStore } from "../../store"
import { Section, Select, Slider } from "./EditorPrimitives"
import type { SoundProfile } from "../../types"

const PROFILES: Array<{ value: SoundProfile; label: string }> = [
  { value: "soft", label: "Soft" },
  { value: "creamy", label: "Creamy" },
  { value: "thock", label: "Thock" },
  { value: "clack", label: "Clack" },
  { value: "silent", label: "Silent" },
  { value: "wood", label: "Wood" },
  { value: "ceramic", label: "Ceramic" },
  { value: "crystal", label: "Crystal" },
  { value: "stone", label: "Stone" },
  { value: "retro", label: "Retro" },
  { value: "magical", label: "Magical" },
]

export function SoundEditor() {
  const { currentBuild, updateSound } = useWorkshopStore()
  const s = currentBuild.sound

  return (
    <div>
      <Section title="Profile">
        <Select label="Sound Profile" value={s.profile} options={PROFILES} onChange={(v) => updateSound({ profile: v })} />
      </Section>
      <Section title="Tuning">
        <Slider label="Volume" value={s.volume} min={0} max={1} step={0.01} onChange={(v) => updateSound({ volume: v })} />
        <Slider label="Pitch" value={s.pitch} min={0.5} max={2.0} step={0.05} onChange={(v) => updateSound({ pitch: v })} />
        <Slider label="Pitch Variation" value={s.pitchVariation} min={0} max={0.3} step={0.005} onChange={(v) => updateSound({ pitchVariation: v })} />
      </Section>
      <div className="px-3 py-3 text-xs" style={{ color: "#887860" }}>
        Sound plays in Test Typing mode. Enable it from the toolbar above the 3D view.
      </div>
    </div>
  )
}
