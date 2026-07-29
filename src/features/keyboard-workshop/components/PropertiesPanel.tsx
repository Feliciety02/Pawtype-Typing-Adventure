"use client"
import { X } from "lucide-react"
import { useWorkshopStore } from "../store"
import { KeycapEditor } from "./editors/KeycapEditor"
import { CaseEditor } from "./editors/CaseEditor"
import { FrameEditor } from "./editors/FrameEditor"
import { PlateEditor } from "./editors/PlateEditor"
import { SwitchEditor } from "./editors/SwitchEditor"
import { StabilizerEditor } from "./editors/StabilizerEditor"
import { KnobEditor } from "./editors/KnobEditor"
import { BadgeEditor } from "./editors/BadgeEditor"
import { LightingEditor } from "./editors/LightingEditor"
import { SoundEditor } from "./editors/SoundEditor"
import { BuildManager } from "./BuildManager"

export function PropertiesPanel() {
  const { selectedPart, selectedKeyIds, deselectAll, setSelectedPart } = useWorkshopStore()

  return (
    <aside
      className="flex flex-col h-full overflow-y-auto"
      style={{ background: "#1a1208", color: "#e8d5a0" }}
      aria-label="Properties panel"
    >
      {/* Panel header */}
      <div
        className="px-3 py-2 border-b text-xs font-bold uppercase tracking-wider flex items-center justify-between"
        style={{ borderColor: "#3a2a14", color: "#c8a060", background: "#211610" }}
      >
        <span>{selectedPart === "keycaps"
          ? selectedKeyIds.length === 0
            ? "Inspector · Keycaps"
            : selectedKeyIds.length === 1
            ? `Inspector · ${selectedKeyIds[0]}`
            : `Inspector · ${selectedKeyIds.length} Keys`
          : selectedPart === "case" ? "Inspector · Case"
          : selectedPart === "frame" ? "Inspector · Frame"
          : selectedPart === "plate" ? "Inspector · Plate"
          : selectedPart === "switches" ? "Inspector · Switches"
          : selectedPart === "stabilizers" ? "Inspector · Stabilizers"
          : selectedPart === "knob" ? "Inspector · Knob"
          : selectedPart === "badge" ? "Inspector · Badge"
          : selectedPart === "lighting" ? "Inspector · Lighting"
          : selectedPart === "sound" ? "Inspector · Sound"
          : selectedPart === "builds" ? "Inspector · Saved Builds"
          : "Inspector"}</span>
        <button
          onClick={() => { deselectAll(); setSelectedPart("keycaps") }}
          className="rounded p-1 opacity-70 hover:opacity-100"
          aria-label="Close inspector"
          title="Close inspector"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {selectedPart === "keycaps" && <KeycapEditor />}
        {selectedPart === "case" && <CaseEditor />}
        {selectedPart === "frame" && <FrameEditor />}
        {selectedPart === "plate" && <PlateEditor />}
        {selectedPart === "switches" && <SwitchEditor />}
        {selectedPart === "stabilizers" && <StabilizerEditor />}
        {selectedPart === "knob" && <KnobEditor />}
        {selectedPart === "badge" && <BadgeEditor />}
        {selectedPart === "lighting" && <LightingEditor />}
        {selectedPart === "sound" && <SoundEditor />}
        {selectedPart === "builds" && <BuildManager />}
      </div>
    </aside>
  )
}
