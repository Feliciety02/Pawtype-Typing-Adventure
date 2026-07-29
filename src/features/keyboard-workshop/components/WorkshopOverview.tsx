import { Search, Paintbrush, RotateCcw, Box, CircleDot, Sparkles, Save } from "lucide-react"
import { useWorkshopStore } from "../store"
import { LAYOUTS } from "../layout-data"

export function WorkshopOverview() {
  const {
    currentBuild,
    selectedKeyIds,
    selectGroup,
    setSelectedPart,
    updateAllKeys,
    setCameraPreset,
  } = useWorkshopStore()
  const keys = Object.values(currentBuild.keys)
  const firstKey = keys[0]

  const findKeys = (query: string) => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return
    const matches = (LAYOUTS[currentBuild.layout] ?? [])
      .filter((key) => `${key.id} ${key.label} ${key.primaryLegend ?? ""} ${key.type}`.toLowerCase().includes(normalized))
      .map((key) => key.id)
    if (matches.length) {
      setSelectedPart("keycaps")
      selectGroup(matches)
      setCameraPreset(matches.length === 1 ? "keycap-closeup" : "top")
    }
  }

  return (
    <section className="workshop-overview" aria-label="Keyboard overview and quick controls">
      <div className="workshop-overview__stats">
        <strong>{currentBuild.name}</strong>
        <span>{currentBuild.layout} · {keys.length} keys · {firstKey?.profile ?? "Cherry"} · {firstKey?.material ?? "PBT"}</span>
        <span>{selectedKeyIds.length ? `${selectedKeyIds.length} selected` : "Select a key or group"}</span>
      </div>

      <div className="workshop-overview__parts" aria-label="Choose what to customize">
        <button type="button" onClick={() => setSelectedPart("keycaps")}><Paintbrush size={13} /> Keycaps</button>
        <button type="button" onClick={() => setSelectedPart("case")}><Box size={13} /> Case</button>
        <button type="button" onClick={() => setSelectedPart("knob")}><CircleDot size={13} /> Knob</button>
        <button type="button" onClick={() => setSelectedPart("lighting")}><Sparkles size={13} /> Lighting</button>
        <button type="button" onClick={() => setSelectedPart("builds")}><Save size={13} /> Builds</button>
      </div>

      <label className="workshop-overview__search">
        <Search size={14} />
        <input
          placeholder="Find a key: Enter, Space, Arrow…"
          onKeyDown={(event) => {
            if (event.key === "Enter") findKeys(event.currentTarget.value)
          }}
        />
      </label>

      <div className="workshop-overview__controls">
        <label title="Apply this color to every keycap">
          <Paintbrush size={14} /> All keycaps
          <input
            type="color"
            value={firstKey?.colors.top ?? "#e8dfc8"}
            onChange={(event) => {
              if (!firstKey) return
              const top = event.target.value
              updateAllKeys({ colors: { ...firstKey.colors, top } })
            }}
          />
        </label>
        <label title="Apply this color to every keyboard legend">
          Legend
          <input
            type="color"
            value={firstKey?.legend.color ?? "#303438"}
            onChange={(event) => {
              if (!firstKey) return
              updateAllKeys({ legend: { ...firstKey.legend, color: event.target.value } })
            }}
          />
        </label>
        <button type="button" onClick={() => { selectGroup(Object.keys(currentBuild.keys)); setSelectedPart("keycaps") }}>
          <RotateCcw size={14} /> Select all
        </button>
      </div>
    </section>
  )
}
