import { Search, Paintbrush, Box, CircleDot, Sparkles, Save, Volume2, Sticker } from "lucide-react"
import { useWorkshopStore } from "../store"
import { LAYOUTS } from "../layout-data"

export function WorkshopOverview() {
  const { currentBuild, selectedKeyIds, selectGroup, setSelectedPart, setCameraPreset, setLayout } = useWorkshopStore()
  const keys = Object.values(currentBuild.keys)

  const findKeys = (query: string) => {
    const queryText = query.trim().toLowerCase()
    if (!queryText) return
    const matches = (LAYOUTS[currentBuild.layout] ?? [])
      .filter((key) => `${key.id} ${key.label} ${key.primaryLegend ?? ""}`.toLowerCase().includes(queryText))
      .map((key) => key.id)
    if (matches.length) {
      setSelectedPart("keycaps")
      selectGroup(matches)
      setCameraPreset(matches.length === 1 ? "keycap-closeup" : "top")
    }
  }

  return (
    <section className="workshop-overview" aria-label="Keyboard controls">
      <div className="workshop-overview__stats">
        <strong>{currentBuild.name}</strong>
        <span>{currentBuild.layout} keyboard</span>
        <span>{selectedKeyIds.length ? `${selectedKeyIds.length} keys selected` : "Pick a key to start"}</span>
      </div>
      <div className="workshop-overview__parts" aria-label="Choose what to change">
        <button type="button" onClick={() => setSelectedPart("keycaps")}><Paintbrush size={13} /> Keys</button>
        <button type="button" onClick={() => setSelectedPart("case")}><Box size={13} /> Keyboard</button>
        <button type="button" onClick={() => setSelectedPart("knob")}><CircleDot size={13} /> Knob</button>
        <button type="button" onClick={() => setSelectedPart("lighting")}><Sparkles size={13} /> Lights</button>
        <button type="button" onClick={() => setSelectedPart("badge")}><Sticker size={13} /> Logo</button>
        <button type="button" onClick={() => setSelectedPart("sound")}><Volume2 size={13} /> Sounds</button>
        <button type="button" onClick={() => setSelectedPart("builds")}><Save size={13} /> My builds</button>
        <label className="workshop-overview__layout">Size <select value={currentBuild.layout} onChange={(event) => setLayout(event.target.value)}><option value="75%">75%</option><option value="65%">65%</option><option value="60%">60%</option></select></label>
      </div>
      <label className="workshop-overview__search">
        <Search size={14} />
        <input placeholder="Find a key" aria-label="Find a key" onKeyDown={(event) => { if (event.key === "Enter") findKeys(event.currentTarget.value) }} />
      </label>
    </section>
  )
}
