"use client"
import { RotateCcw, RotateCw, Keyboard, Camera } from "lucide-react"
import { useWorkshopStore } from "../store"
import type { CameraPreset } from "../types"

const CAMERA_PRESETS: { id: CameraPreset; label: string }[] = [
  { id: "isometric", label: "Iso" },
  { id: "top", label: "Top" },
  { id: "front", label: "Front" },
  { id: "left", label: "Left" },
  { id: "right", label: "Right" },
  { id: "typing", label: "Typing" },
  { id: "keycap-closeup", label: "Key ↗" },
  { id: "case-closeup", label: "Case ↗" },
]

export function WorkshopToolbar() {
  const {
    undo,
    redo,
    history,
    historyIndex,
    testTypingMode,
    setTestTypingMode,
    cameraPreset,
    setCameraPreset,
  } = useWorkshopStore()

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  return (
    <footer
      className="flex items-center gap-2 px-3 py-2 border-t flex-wrap"
      style={{ background: "#2a1e12", borderColor: "#5a3a20" }}
      role="toolbar"
      aria-label="Workshop actions"
    >
      {/* Camera */}
      <div className="flex items-center gap-1 mr-2">
        <Camera size={13} className="opacity-60" style={{ color: "#c8a870" }} />
        <select
          value={cameraPreset}
          onChange={(event) => setCameraPreset(event.target.value as CameraPreset)}
          className="rounded px-2 py-1 text-xs outline-none"
          style={{ background: "#3a2a14", color: "#e8d5a0", border: "1px solid #5a3a20" }}
          aria-label="Camera view"
        >
          {CAMERA_PRESETS.map((preset) => <option key={preset.id} value={preset.id}>{preset.label} view</option>)}
        </select>
        <button
          onClick={() => setCameraPreset("isometric")}
          className="px-2 py-1 rounded text-xs"
          style={{ background: "#3a2a14", color: "#c8a870" }}
          title="Reset camera"
        >
          Reset view
        </button>
      </div>

      <div className="h-5 w-px" style={{ background: "#5a3a20" }} />

      {/* Test typing */}
      <button
        onClick={() => setTestTypingMode(!testTypingMode)}
        className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all"
        style={{
          background: testTypingMode ? "#204a30" : "#3a2a14",
          color: testTypingMode ? "#80e0a0" : "#c8a870",
        }}
        aria-pressed={testTypingMode}
      >
        <Keyboard size={13} />
        Test Typing
      </button>

      <div className="flex-1" />

      {/* Undo / redo */}
      <div className="flex items-center gap-1">
        <button
          onClick={undo}
          disabled={!canUndo}
          className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-all disabled:opacity-40"
          style={{ background: "#3a2a14", color: "#c8a870" }}
          aria-label="Undo"
          title="Undo"
        >
          <RotateCcw size={13} />
          <span className="hidden sm:inline">Undo</span>
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-all disabled:opacity-40"
          style={{ background: "#3a2a14", color: "#c8a870" }}
          aria-label="Redo"
          title="Redo"
        >
          <RotateCw size={13} />
          <span className="hidden sm:inline">Redo</span>
        </button>
      </div>
    </footer>
  )
}
