"use client"
import { useWorkshopStore } from "../../store"
import { Section, ColorPicker, Select, Toggle } from "./EditorPrimitives"

const BADGE_TYPES = [
  { value: "paw", label: "Paw Print" },
  { value: "initial", label: "Initial" },
  { value: "rune", label: "Rune" },
  { value: "guild", label: "Guild" },
  { value: "custom", label: "Custom" },
  { value: "none", label: "None" },
]

export function BadgeEditor() {
  const { currentBuild, updateBadge } = useWorkshopStore()
  const b = currentBuild.badge

  return (
    <div>
      <Section title="Visibility">
        <Toggle label="Show Badge" checked={b.enabled} onChange={(v) => updateBadge({ enabled: v })} />
      </Section>
      {b.enabled && (
        <>
          <Section title="Type">
            <Select
              label="Badge Type"
              value={b.type}
              options={BADGE_TYPES}
              onChange={(v) => updateBadge({ type: v as typeof b.type })}
            />
            {(b.type === "initial" || b.type === "rune" || b.type === "guild") && (
              <div className="flex flex-col gap-1 mt-1">
                <label className="text-xs" style={{ color: "#a09070" }}>Text / Initials</label>
                <input
                  className="rounded px-2 py-1 text-sm bg-transparent border outline-none"
                  style={{ color: "#ffe8b0", borderColor: "#5a3a20" }}
                  value={b.text}
                  maxLength={3}
                  onChange={(e) => updateBadge({ text: e.target.value.toUpperCase() })}
                  placeholder="e.g. KW"
                />
              </div>
            )}
          </Section>
          <Section title="Color">
            <ColorPicker label="Badge Color" value={b.color} onChange={(v) => updateBadge({ color: v })} />
          </Section>
        </>
      )}
    </div>
  )
}
