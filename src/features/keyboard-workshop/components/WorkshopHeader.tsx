"use client"
import { useState, type RefObject } from "react"
import { Save, ChevronDown, Copy, Trash2, Check } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { CampBackButton } from "@/components/camp/CampBackButton"
import { useWorkshopStore } from "../store"

export function WorkshopHeader({
  embedded = false,
  onBack,
  backButtonRef,
}: {
  embedded?: boolean
  onBack?: () => void
  backButtonRef?: RefObject<HTMLButtonElement | null>
}) {
  const navigate = useNavigate()
  const {
    currentBuild,
    buildNameDraft,
    unsavedChanges,
    setBuildName,
    saveBuild,
    saveAsNewBuild,
    equipBuild,
    exportBuild,
    resetBuild,
  } = useWorkshopStore()

  const [editingName, setEditingName] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    saveBuild()
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  const handleEquip = () => {
    saveBuild()
    equipBuild(currentBuild.id)
  }

  const handleExport = () => {
    const json = exportBuild()
    const blob = new Blob([json], { type: "application/json" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = `${currentBuild.name.replace(/\s+/g, "-")}.json`
    a.click()
  }

  return (
    <header
      className={`workshop-header flex items-center gap-3 px-4 py-2 border-b ${
        embedded ? "workshop-header--embedded" : ""
      }`}
      style={{ background: "#3a2a1a", borderColor: "#5a3a20" }}
    >
      {embedded ? (
        <span className="workshop-header__sidebar-title">My Keyboard</span>
      ) : (
        <>
          <CampBackButton ref={backButtonRef} onClick={onBack ?? (() => navigate({ to: "/" }))} />
          <div className="h-5 w-px" style={{ background: "#5a3a20" }} />
          <span className="text-sm font-bold tracking-wide hidden sm:inline" style={{ color: "#e8d5a0" }}>
            Keyboard Workshop
          </span>
          <div className="h-5 w-px hidden sm:block" style={{ background: "#5a3a20" }} />
        </>
      )}

      {/* Build name */}
      <div className="workshop-header__build-name flex items-center gap-2 flex-1">
        {!embedded && (editingName ? (
          <input
            autoFocus
            className="rounded px-2 py-1 text-sm font-semibold bg-transparent border outline-none w-48"
            style={{ color: "#ffe8b0", borderColor: "#8a6030" }}
            value={buildNameDraft}
            onChange={(e) => setBuildName(e.target.value)}
            onBlur={() => setEditingName(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "Escape") setEditingName(false)
            }}
          />
        ) : (
          <button
            onClick={() => setEditingName(true)}
            className="text-sm font-semibold px-2 py-1 rounded hover:opacity-80 transition-opacity"
            style={{ color: "#ffe8b0" }}
            title="Click to rename build"
          >
            {buildNameDraft}
            {unsavedChanges && <span className="ml-1 text-xs" style={{ color: "#c89040" }}>*</span>}
          </button>
        ))}
      </div>

      {/* Action buttons */}
      <div className="workshop-header__actions flex items-center gap-2">
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-all"
          style={{ background: saved ? "#4a7a30" : "#6a4a20", color: saved ? "#c8f0a0" : "#f0d090" }}
          title="Save build"
        >
          {saved ? <Check size={14} /> : <Save size={14} />}
          <span className="hidden sm:inline">{saved ? "Saved" : "Save"}</span>
        </button>

        <button
          onClick={handleEquip}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-semibold transition-all"
          style={{ background: "#8a5a20", color: "#ffe0a0" }}
          title="Save and equip this keyboard"
        >
          <span>Equip</span>
        </button>

        {/* More menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu((v) => !v)}
            className="flex items-center gap-1 px-2 py-1.5 rounded transition-all"
            style={{ background: "#4a3020", color: "#c8a870" }}
            title="More options"
            aria-expanded={showMenu}
          >
            <ChevronDown size={16} />
          </button>

          {showMenu && (
            <div
              className="absolute right-0 top-8 z-50 rounded shadow-lg border min-w-40 py-1 text-sm"
              style={{ background: "#2a1a10", borderColor: "#5a3a20", color: "#e8d0a0" }}
              onBlur={() => setShowMenu(false)}
            >
              <button
                className="w-full text-left px-4 py-2 hover:opacity-80 flex items-center gap-2"
                onClick={() => { const name = prompt("New build name:", buildNameDraft + " (copy)"); if (name) saveAsNewBuild(name); setShowMenu(false) }}
              >
                <Copy size={13} /> Save As Copy
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:opacity-80 flex items-center gap-2"
                onClick={() => { handleExport(); setShowMenu(false) }}
              >
                Export JSON
              </button>
              <hr style={{ borderColor: "#5a3a20" }} />
              <button
                className="w-full text-left px-4 py-2 hover:opacity-80 flex items-center gap-2"
                style={{ color: "#e07070" }}
                onClick={() => { if (confirm("Reset this build?")) { resetBuild(); setShowMenu(false) } }}
              >
                <Trash2 size={13} /> Reset Build
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
