"use client"
import { useState } from "react"
import { Trash2, Copy, Check, Upload, Download, Star } from "lucide-react"
import { useWorkshopStore } from "../store"
import { PRESETS } from "../defaults"

export function BuildManager() {
  const {
    currentBuild,
    savedBuilds,
    equippedBuildId,
    loadBuild,
    deleteBuild,
    duplicateBuild,
    equipBuild,
    saveAsNewBuild,
    importBuild,
    exportBuild,
    saveBuild,
    applyPreset,
  } = useWorkshopStore()

  const [tab, setTab] = useState<"saved" | "presets">("saved")
  const [equipped, setEquipped] = useState<string | null>(null)

  const handleEquip = (id: string) => {
    equipBuild(id)
    setEquipped(id)
    setTimeout(() => setEquipped(null), 1800)
  }

  const handleImport = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        importBuild(ev.target?.result as string)
      }
      reader.readAsText(file)
    }
    input.click()
  }

  const handleExport = () => {
    const json = exportBuild()
    const blob = new Blob([json], { type: "application/json" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = `${currentBuild.name.replace(/\s+/g, "-")}.json`
    a.click()
  }

  const baseRowStyle = {
    background: "#221610",
    borderColor: "#3a2a14",
    color: "#d4b880",
  }

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex border-b" style={{ borderColor: "#3a2a14" }}>
        {(["saved", "presets"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-2 text-xs font-semibold uppercase tracking-wider transition-all"
            style={{
              background: tab === t ? "#3a2810" : "transparent",
              color: tab === t ? "#ffe0a0" : "#a08050",
              borderBottom: tab === t ? "2px solid #c8803a" : "2px solid transparent",
            }}
            aria-selected={tab === t}
          >
            {t === "saved" ? "Saved Builds" : "Presets"}
          </button>
        ))}
      </div>

      {tab === "saved" && (
        <div className="flex-1 overflow-y-auto">
          {/* Current build row */}
          <div className="px-3 pt-3 pb-1">
            <p className="text-xs font-semibold mb-2" style={{ color: "#c8a060" }}>
              Current Build
            </p>
            <div
              className="rounded px-3 py-2 flex items-center gap-2 border"
              style={{ ...baseRowStyle, background: "#2e1e0e" }}
            >
              <span className="flex-1 text-sm font-medium truncate" style={{ color: "#ffe8a0" }}>
                {currentBuild.name}
              </span>
              <button
                onClick={() => saveBuild()}
                className="px-2 py-1 rounded text-xs"
                style={{ background: "#5a3a18", color: "#f0d080" }}
                title="Save current build"
              >
                Save
              </button>
              <button
                onClick={() => handleEquip(currentBuild.id)}
                className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-all"
                style={{
                  background: equipped === currentBuild.id ? "#3a6020" : "#8a5a20",
                  color: equipped === currentBuild.id ? "#b0f070" : "#ffe0a0",
                }}
                title="Equip this build"
              >
                {equipped === currentBuild.id ? <Check size={11} /> : <Star size={11} />}
                Equip
              </button>
            </div>
          </div>

          {/* Saved builds */}
          <div className="px-3 py-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold" style={{ color: "#c8a060" }}>
                Saved Builds ({savedBuilds.length})
              </p>
              <div className="flex gap-1">
                <button
                  onClick={handleImport}
                  className="flex items-center gap-1 px-2 py-0.5 rounded text-xs"
                  style={{ background: "#2a1e10", color: "#c8a870" }}
                  title="Import JSON"
                >
                  <Upload size={11} /> Import
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-1 px-2 py-0.5 rounded text-xs"
                  style={{ background: "#2a1e10", color: "#c8a870" }}
                  title="Export current build as JSON"
                >
                  <Download size={11} /> Export
                </button>
              </div>
            </div>

            {savedBuilds.length === 0 ? (
              <p className="text-xs py-4 text-center" style={{ color: "#6a5030" }}>
                No saved builds yet. Save your current build to get started.
              </p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {savedBuilds.map((b) => (
                  <div
                    key={b.id}
                    className="rounded px-3 py-2 flex items-center gap-2 border"
                    style={{
                      ...baseRowStyle,
                      background: b.id === currentBuild.id ? "#2e1e0e" : "#221610",
                      borderColor: equippedBuildId === b.id ? "#8a7030" : "#3a2a14",
                    }}
                  >
                    {equippedBuildId === b.id && (
                      <Star size={11} style={{ color: "#e0c050", flexShrink: 0 }} aria-label="Equipped" />
                    )}
                    <span className="flex-1 text-xs font-medium truncate" style={{ color: "#e0c890" }}>
                      {b.name}
                    </span>
                    <span className="text-xs shrink-0" style={{ color: "#6a5030" }}>
                      {b.layout}
                    </span>
                    <button
                      onClick={() => loadBuild(b.id)}
                      className="px-2 py-0.5 rounded text-xs shrink-0"
                      style={{ background: "#3a2a10", color: "#c8a870" }}
                      title="Load this build"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => handleEquip(b.id)}
                      className="flex items-center gap-0.5 px-2 py-0.5 rounded text-xs shrink-0 transition-all"
                      style={{
                        background: equipped === b.id ? "#3a6020" : "#5a3a18",
                        color: equipped === b.id ? "#b0f070" : "#ffe0a0",
                      }}
                      title="Equip this build"
                    >
                      {equipped === b.id ? <Check size={10} /> : <Star size={10} />}
                    </button>
                    <button
                      onClick={() => duplicateBuild(b.id)}
                      className="p-1 rounded transition-all"
                      style={{ color: "#a08050" }}
                      title="Duplicate"
                    >
                      <Copy size={11} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${b.name}"?`)) deleteBuild(b.id)
                      }}
                      className="p-1 rounded transition-all"
                      style={{ color: "#c05050" }}
                      title="Delete"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Save as new */}
            <div className="mt-3">
              <button
                onClick={() => {
                  const name = prompt("Build name:", currentBuild.name + " (copy)")
                  if (name) saveAsNewBuild(name)
                }}
                className="w-full py-1.5 rounded text-xs font-medium transition-all"
                style={{ background: "#3a2a14", color: "#c8a870" }}
              >
                + Save as New Build
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === "presets" && (
        <div className="flex-1 overflow-y-auto px-3 py-3">
          <p className="text-xs mb-3" style={{ color: "#a08050" }}>
            Presets apply a themed style to your case and frame. Your keycap
            customizations are preserved.
          </p>
          <div className="flex flex-col gap-1.5">
            {PRESETS.map((preset) => (
              <div
                key={preset.id}
                className="flex items-center gap-2 px-3 py-2 rounded border"
                style={{ background: "#221610", borderColor: "#3a2a14" }}
              >
                <span className="flex-1 text-sm font-medium" style={{ color: "#e0c890" }}>
                  {preset.name}
                </span>
                <button
                  onClick={() => applyPreset(preset.patch)}
                  className="px-3 py-1 rounded text-xs font-medium transition-all"
                  style={{ background: "#5a3a18", color: "#ffe0a0" }}
                >
                  Apply
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
