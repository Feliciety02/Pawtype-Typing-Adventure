"use client"
import { useWorkshopStore } from "../../store"
import { Section, ColorPicker, Select, Slider } from "./EditorPrimitives"
import type { LightingEffect } from "../../types"

const EFFECTS: Array<{ value: LightingEffect; label: string }> = [
  { value: "static", label: "Static" },
  { value: "breathing", label: "Breathing" },
  { value: "key-press", label: "Key Press" },
  { value: "ripple", label: "Ripple" },
  { value: "wave", label: "Wave" },
  { value: "combo-wave", label: "Combo Wave" },
  { value: "fireflies", label: "Fireflies" },
  { value: "sakura", label: "Sakura" },
  { value: "bubbles", label: "Bubbles" },
  { value: "stars", label: "Stars" },
  { value: "golden-sparks", label: "Golden Sparks" },
  { value: "steam-glow", label: "Steam Glow" },
]

const DIRECTIONS = ["left-right", "right-left", "top-bottom", "bottom-top", "center-out", "radial"].map(
  (v) => ({ value: v, label: v.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" to ") })
)

const TRIGGERS = [
  { value: "always", label: "Always On" },
  { value: "on-keypress", label: "On Keypress" },
  { value: "idle", label: "Idle" },
  { value: "combo", label: "Combo" },
]

const ENV_PRESETS = [
  { value: "neutral-studio", label: "Neutral Studio" },
  { value: "warm-workshop", label: "Warm Workshop" },
  { value: "morning", label: "Morning" },
  { value: "sunset", label: "Sunset" },
  { value: "moonlight", label: "Moonlight" },
  { value: "forest-glow", label: "Forest Glow" },
  { value: "sakura-light", label: "Sakura Light" },
  { value: "royal-candlelight", label: "Royal Candlelight" },
  { value: "stardust", label: "Stardust" },
  { value: "cafe", label: "Café" },
]

export function LightingEditor() {
  const { currentBuild, updateLighting, lightingEnv, setLightingEnv } = useWorkshopStore()
  const l = currentBuild.lighting

  return (
    <div>
      <Section title="Effect">
        <Select label="Effect" value={l.effect} options={EFFECTS} onChange={(v) => updateLighting({ effect: v })} />
        <Select label="Trigger" value={l.trigger} options={TRIGGERS} onChange={(v) => updateLighting({ trigger: v })} />
        <Select label="Direction" value={l.direction} options={DIRECTIONS} onChange={(v) => updateLighting({ direction: v })} />
        <Slider label="Speed" value={l.speed} min={0} max={1} step={0.01} onChange={(v) => updateLighting({ speed: v })} />
      </Section>
      <Section title="Colors">
        <ColorPicker label="Primary Color" value={l.primaryColor} onChange={(v) => updateLighting({ primaryColor: v })} />
        <ColorPicker label="Secondary Color" value={l.secondaryColor} onChange={(v) => updateLighting({ secondaryColor: v })} />
      </Section>
      <Section title="Intensity">
        <Slider label="Brightness" value={l.brightness} min={0} max={1} step={0.01} onChange={(v) => updateLighting({ brightness: v })} />
        <Slider label="Intensity" value={l.intensity} min={0} max={1} step={0.01} onChange={(v) => updateLighting({ intensity: v })} />
        <Slider label="Ambient Light" value={l.ambientLight} min={0} max={1} step={0.01} onChange={(v) => updateLighting({ ambientLight: v })} />
        <Slider label="Shadow Strength" value={l.shadowStrength} min={0} max={1} step={0.01} onChange={(v) => updateLighting({ shadowStrength: v })} />
      </Section>
      <Section title="Preview Environment">
        <Select label="Environment" value={lightingEnv} options={ENV_PRESETS} onChange={setLightingEnv} />
      </Section>
    </div>
  )
}
