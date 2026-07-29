"use client"
import { RotateCcw } from "lucide-react"
import { useWorkshopStore } from "../../store"
import { LAYOUTS } from "../../layout-data"
import { Section, ChipSelector, Select, Toggle, ColorPicker, Slider } from "./EditorPrimitives"
import type { KeycapProfile } from "../../types"

const PROFILES: Array<{ value: KeycapProfile; label: string }> = [
  { value: "cherry", label: "Classic" },
  { value: "pixel-flat", label: "Flat" },
  { value: "rounded-fantasy", label: "Rounded" },
  { value: "artisan", label: "Artisan" },
]

const MATERIALS = [
  { value: "painted-plastic", label: "Plastic" },
  { value: "walnut", label: "Wood" },
  { value: "silver", label: "Metal" },
]

export function KeycapEditor() {
  const { selectedKeyIds, currentBuild, updateSelectedKeys, updateKey, resetSelectedKeys, selectKey, deselectAll, setSelectedPart } = useWorkshopStore()
  const layoutKeys = LAYOUTS[currentBuild.layout] ?? []
  const firstKey = selectedKeyIds.length ? currentBuild.keys[selectedKeyIds[0]] : null

  if (!firstKey) {
    return (
      <div className="p-4">
        <p className="text-sm font-semibold" style={{ color: "#e8d5a0" }}>Choose a key to begin</p>
        <p className="mt-1 text-xs" style={{ color: "#a08050" }}>Click a key on the keyboard or choose a group below.</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {layoutKeys.map((key) => (
            <button key={key.id} onClick={() => { setSelectedPart("keycaps"); selectKey(key.id) }} className="rounded px-2 py-1 text-xs" style={{ background: "#2a1e10", color: "#c8a870" }}>
              {key.label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  const selectionLabel = selectedKeyIds.length === 1 ? `${firstKey.legend.text || selectedKeyIds[0]} key` : `${selectedKeyIds.length} keys`
  const update = (patch: Parameters<typeof updateSelectedKeys>[0]) => {
    // A single selected key always receives its own independent style record.
    if (selectedKeyIds.length === 1) {
      updateKey(selectedKeyIds[0], patch)
      return
    }
    updateSelectedKeys(patch)
  }

  return (
    <div>
      <div className="flex items-center justify-between px-3 py-2 text-xs" style={{ background: "#211610", color: "#c8a060" }}>
        <span>Customizing {selectionLabel}</span>
        <button onClick={deselectAll} className="underline">Deselect</button>
      </div>

      <Section title="Style">
        <ChipSelector label="Keycap shape" value={firstKey.profile} options={PROFILES} onChange={(profile) => update({ profile })} />
      </Section>

      <Section title="Color">
        <ColorPicker label="Key color" value={firstKey.colors.top} onChange={(color) => update({ colors: { ...firstKey.colors, top: color, side: color } })} />
      </Section>

      <Section title="Material">
        <Select label="Material" value={firstKey.material} options={MATERIALS} onChange={(material) => update({ material })} />
      </Section>

      <Section title="Legend">
        <p className="text-xs" style={{ color: "#a08050" }}>Key labels are fixed to the keyboard layout.</p>
        <Toggle label="Show legend" checked={firstKey.legend.visible} onChange={(visible) => update({ legend: { ...firstKey.legend, visible } })} />
        <ColorPicker label="Legend color" value={firstKey.legend.color} onChange={(color) => update({ legend: { ...firstKey.legend, color } })} />
        <Slider label="Legend size" value={firstKey.legend.size} min={0.15} max={0.7} step={0.01} onChange={(size) => update({ legend: { ...firstKey.legend, size } })} />
      </Section>

      <div className="px-3 py-3 flex gap-2">
        <button onClick={resetSelectedKeys} className="flex items-center gap-1 rounded px-2 py-1.5 text-xs" style={{ background: "#3a2a14", color: "#e8d0a0" }}>
          <RotateCcw size={13} /> Reset selected
        </button>
      </div>
    </div>
  )
}
