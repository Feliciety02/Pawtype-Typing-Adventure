import { useWorkshopStore } from "../store"
import { LAYOUTS } from "../layout-data"

const groups = [
  ["All keys", () => true],
  ["Letters", (id: string) => /^[A-Z]$/.test(id)],
  ["Numbers", (id: string) => /^\d$/.test(id)],
  ["Function", (id: string) => id === "Escape" || /^F\d+$/.test(id)],
  ["Modifiers", (id: string) => ["Tab", "CapsLock", "ShiftL", "ShiftR", "CtrlL", "CtrlR", "AltL", "AltR", "Enter", "Space", "Backspace"].includes(id)],
  ["Arrows", (id: string) => id.startsWith("Arrow")],
  ["Navigation", (id: string) => ["Delete", "Home", "PageUp", "PageDown", "End"].includes(id)],
  ["WASD", (id: string) => ["W", "A", "S", "D"].includes(id)],
] as const

export function QuickSelectionBar() {
  const { currentBuild, selectGroup, setSelectedPart } = useWorkshopStore()
  const choose = (test: (id: string) => boolean) => {
    setSelectedPart("keycaps")
    selectGroup((LAYOUTS[currentBuild.layout] ?? []).filter((key) => test(key.id)).map((key) => key.id))
  }
  return (
    <nav className="quick-selection" aria-label="Edit controls">
      <span>Edit</span>
      {groups.map(([label, test]) => <button key={label} onClick={() => choose(test)}>{label}</button>)}
    </nav>
  )
}
