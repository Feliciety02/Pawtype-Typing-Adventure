"use client"
import { RotateCcw, Upload, ImageOff } from "lucide-react"
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
  const uploadArtwork = async (file: File) => update({ artwork: { ...firstKey.artwork, source: await resizeArtwork(file) } })

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

      <Section title="Keycap artwork">
        <p className="text-xs" style={{ color: "#a08050" }}>Upload a design for the selected keycap{selectedKeyIds.length > 1 ? "s" : ""}.</p>
        <label className="mt-2 flex cursor-pointer items-center justify-center gap-1 rounded px-2 py-2 text-xs" style={{ background: "#3a2a14", color: "#e8d0a0" }}>
          <Upload size={13} /> {firstKey.artwork.source ? "Replace image" : "Upload image"}
          <input className="hidden" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadArtwork(file); event.currentTarget.value = "" }} />
        </label>
        {firstKey.artwork.source && <>
          <Select label="Apply image" value={firstKey.artwork.mapping} options={[{ value: "top-decal", label: "Top only" }, { value: "full-wrap", label: "Top and sides" }]} onChange={(mapping) => update({ artwork: { ...firstKey.artwork, mapping } })} />
          <Slider label="Image scale" value={firstKey.artwork.scale} min={0.5} max={2} step={0.05} onChange={(scale) => update({ artwork: { ...firstKey.artwork, scale } })} />
          <button onClick={() => update({ artwork: { ...firstKey.artwork, source: null } })} className="mt-2 flex items-center gap-1 text-xs underline" style={{ color: "#d98b8b" }}><ImageOff size={13} /> Remove image</button>
        </>}
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

async function resizeArtwork(file: File): Promise<string> {
  const image = await createImageBitmap(file)
  const scale = Math.min(1, 256 / Math.max(image.width, image.height))
  const canvas = document.createElement("canvas")
  canvas.width = Math.max(1, Math.round(image.width * scale)); canvas.height = Math.max(1, Math.round(image.height * scale))
  canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height); image.close()
  return canvas.toDataURL("image/webp", 0.86)
}
