"use client"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import type {
  KeyboardBuild,
  KeyboardPart,
  EditorTab,
  CameraPreset,
  KeyGroup,
  KeyCustomization,
  CaseCustomization,
  FrameCustomization,
  PlateCustomization,
  SwitchCustomization,
  StabilizerCustomization,
  KnobCustomization,
  BadgeCustomization,
  LightingCustomization,
  SoundCustomization,
  KeyboardLayoutId,
} from "./types"
import { makeDefaultBuild, makeDefaultKey } from "./defaults"
import { LAYOUT_75, LAYOUTS, getKeyboardModel, flattenModelKeys } from "./layout-data"

function nanoid() {
  return Math.random().toString(36).slice(2, 10)
}

/**
 * Adds keys introduced by a layout update without discarding a user's saved
 * colours, legends, or other per-key customizations.
 */
function normalizeBuildKeys(build: KeyboardBuild): KeyboardBuild {
  const layoutKeys = LAYOUTS[build.layout] ?? flattenModelKeys(
    getKeyboardModel(build.modelId ?? "pawtype-75-knob-v1")
  )
  const keys: Record<string, KeyCustomization> = {}

  for (const layoutKey of layoutKeys) {
    const defaults = makeDefaultKey(
      layoutKey.id,
      layoutKey.primaryLegend ?? layoutKey.label,
      layoutKey.type
    )
    const saved = build.keys?.[layoutKey.id]
    const normalized = saved
      ? deepMerge(defaults, { ...saved, keyId: layoutKey.id }) as KeyCustomization
      : defaults

    const savedHasArtworkMode = Boolean(
      saved?.artwork && "useDefault" in saved.artwork
    )
    if (!savedHasArtworkMode && !saved?.artwork?.source) {
      // Upgrade pre-atlas builds once. A later explicit removal carries
      // useDefault=false and therefore remains removed across reloads.
      normalized.artwork = { ...defaults.artwork }
    } else if (!savedHasArtworkMode) {
      normalized.artwork.useDefault = false
    } else if (saved?.artwork.useDefault) {
      normalized.artwork.source = defaults.artwork.source
      normalized.artwork.fit = defaults.artwork.fit
    }

    normalized.legend = {
      ...normalized.legend,
      // An intentionally blank legend is a customization and must survive reloads.
      text: saved?.legend && "text" in saved.legend ? saved.legend.text : defaults.legend.text,
      visible: !savedHasArtworkMode && !saved?.artwork?.source
        ? defaults.legend.visible
        : saved?.legend?.visible ?? defaults.legend.visible,
    }
    keys[layoutKey.id] = normalized
  }

  return { ...build, keys }
}

type HistoryEntry = {
  build: KeyboardBuild
}

type WorkshopTypingState = {
  pressedKeys: Set<string>
  setPressedKey: (keyId: string, pressed: boolean) => void
  clearPressedKeys: () => void
}

/**
 * Keystrokes are high-frequency, transient preview state. Keeping them outside
 * the persisted editor store prevents unrelated Workshop panels from rendering
 * on every keydown and keyup.
 */
export const useWorkshopTypingStore = create<WorkshopTypingState>()((set) => ({
  pressedKeys: new Set(),
  setPressedKey: (keyId, pressed) => {
    set((state) => {
      if (state.pressedKeys.has(keyId) === pressed) return state
      const pressedKeys = new Set(state.pressedKeys)
      if (pressed) pressedKeys.add(keyId)
      else pressedKeys.delete(keyId)
      return { pressedKeys }
    })
  },
  clearPressedKeys: () => {
    set((state) =>
      state.pressedKeys.size === 0 ? state : { pressedKeys: new Set() },
    )
  },
}))

type WorkshopState = {
  // Current working build
  currentBuild: KeyboardBuild
  // Saved builds
  savedBuilds: KeyboardBuild[]
  // Active equipped build id
  equippedBuildId: string | null
  // Selection
  selectedKeyIds: string[]
  selectedPart: KeyboardPart
  // Editor
  activeEditorTab: EditorTab
  // Camera
  cameraPreset: CameraPreset
  // Exploded view
  explodedView: boolean
  explodeAmount: number
  // Test typing
  testTypingMode: boolean
  // History
  history: HistoryEntry[]
  historyIndex: number
  // UI state
  unsavedChanges: boolean
  buildNameDraft: string
  // Key groups
  keyGroups: KeyGroup[]
  // Lighting env
  lightingEnv: string
}

type WorkshopActions = {
  // Build
  setBuildName: (name: string) => void
  setLayout: (layoutId: KeyboardLayoutId) => void
  setModelId: (modelId: string) => void
  saveBuild: () => void
  saveAsNewBuild: (name: string) => void
  loadBuild: (id: string) => void
  deleteBuild: (id: string) => void
  duplicateBuild: (id: string) => void
  equipBuild: (id: string) => void
  resetBuild: () => void
  importBuild: (json: string) => void
  exportBuild: () => string
  applyPreset: (patch: Partial<KeyboardBuild>) => void
  // Keys
  selectKey: (id: string, multi?: boolean) => void
  deselectAll: () => void
  selectGroup: (keyIds: string[]) => void
  updateSelectedKeys: (patch: Partial<KeyCustomization>) => void
  resetSelectedKeys: () => void
  updateAllKeys: (patch: Partial<KeyCustomization>) => void
  updateKey: (keyId: string, patch: Partial<KeyCustomization>) => void
  // Parts
  setSelectedPart: (part: KeyboardPart) => void
  updateCase: (patch: Partial<CaseCustomization>) => void
  updateFrame: (patch: Partial<FrameCustomization>) => void
  updatePlate: (patch: Partial<PlateCustomization>) => void
  updateSwitch: (patch: Partial<SwitchCustomization>, keyIds?: string[]) => void
  updateStabilizers: (patch: Partial<StabilizerCustomization>) => void
  updateKnob: (patch: Partial<KnobCustomization>) => void
  updateBadge: (patch: Partial<BadgeCustomization>) => void
  updateLighting: (patch: Partial<LightingCustomization>) => void
  updateSound: (patch: Partial<SoundCustomization>) => void
  // Editor
  setActiveEditorTab: (tab: EditorTab) => void
  // Camera
  setCameraPreset: (preset: CameraPreset) => void
  // Exploded
  setExplodedView: (enabled: boolean) => void
  setExplodeAmount: (amount: number) => void
  // Test Typing
  setTestTypingMode: (enabled: boolean) => void
  // Undo/Redo
  undo: () => void
  redo: () => void
  pushHistory: () => void
  // Groups
  createGroup: (name: string, keyIds: string[]) => void
  deleteGroup: (id: string) => void
  updateGroup: (id: string, patch: Partial<KeyGroup>) => void
  // UI
  setLightingEnv: (env: string) => void
}

const initialBuild = makeDefaultBuild(nanoid(), "My Keyboard")

export const useWorkshopStore = create<WorkshopState & WorkshopActions>()(
  persist(
    (set, get) => ({
      currentBuild: initialBuild,
      savedBuilds: [],
      equippedBuildId: null,
      selectedKeyIds: [],
      selectedPart: "keycaps",
      activeEditorTab: "shape",
      cameraPreset: "isometric",
      explodedView: false,
      explodeAmount: 0,
      testTypingMode: false,
      history: [{ build: initialBuild }],
      historyIndex: 0,
      unsavedChanges: false,
      buildNameDraft: initialBuild.name,
      keyGroups: [],
      lightingEnv: "warm-workshop",

      pushHistory: () => {
        const { currentBuild, history, historyIndex } = get()
        const newHistory = history.slice(0, historyIndex + 1)
        newHistory.push({ build: JSON.parse(JSON.stringify(currentBuild)) })
        set({ history: newHistory.slice(-30), historyIndex: newHistory.length - 1 })
      },

      setBuildName: (name) => {
        set((s) => ({
          buildNameDraft: name,
          currentBuild: { ...s.currentBuild, name, updatedAt: new Date().toISOString() },
          unsavedChanges: false,
        }))
      },

      setLayout: (layoutId) => {
        const layoutKeys = LAYOUTS[layoutId] ?? LAYOUT_75
        const keys: Record<string, KeyCustomization> = {}
        const existing = get().currentBuild.keys
        for (const k of layoutKeys) {
          keys[k.id] = existing[k.id] ?? makeDefaultKey(k.id, k.primaryLegend ?? k.label, k.type)
        }
        get().pushHistory()
        set((s) => ({
          currentBuild: {
            ...s.currentBuild,
            layout: layoutId,
            keys,
            updatedAt: new Date().toISOString(),
          },
          selectedKeyIds: s.selectedKeyIds.filter((id) => Boolean(keys[id])),
          unsavedChanges: false,
        }))
      },

      setModelId: (modelId) => {
        const model = getKeyboardModel(modelId)
        const modelKeys = flattenModelKeys(model)
        const keys: Record<string, KeyCustomization> = {}
        const existing = get().currentBuild.keys
        for (const k of modelKeys) {
          keys[k.id] = existing[k.id] ?? makeDefaultKey(k.id, k.primaryLegend ?? k.label, k.type)
        }
        get().pushHistory()
        set((s) => ({
          currentBuild: {
            ...s.currentBuild,
            modelId,
            layout: model.layoutType,
            keys,
            updatedAt: new Date().toISOString(),
          },
          selectedKeyIds: s.selectedKeyIds.filter((id) => Boolean(keys[id])),
          unsavedChanges: true,
        }))
      },

      saveBuild: () => {
        const { currentBuild, savedBuilds } = get()
        const updated = { ...currentBuild, updatedAt: new Date().toISOString() }
        const idx = savedBuilds.findIndex((b) => b.id === currentBuild.id)
        const newSaved = idx >= 0
          ? savedBuilds.map((b) => (b.id === currentBuild.id ? updated : b))
          : [...savedBuilds, updated]
        set({ savedBuilds: newSaved, currentBuild: updated, unsavedChanges: false })
      },

      saveAsNewBuild: (name) => {
        get().pushHistory()
        const newBuild = { ...get().currentBuild, id: nanoid(), name, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
        set((s) => ({ savedBuilds: [...s.savedBuilds, newBuild], currentBuild: newBuild, buildNameDraft: name, unsavedChanges: false }))
      },

      loadBuild: (id) => {
        const build = get().savedBuilds.find((b) => b.id === id)
        if (!build) return
        const normalizedBuild = normalizeBuildKeys(build)
        set({ currentBuild: normalizedBuild, buildNameDraft: normalizedBuild.name, selectedKeyIds: [], unsavedChanges: false, history: [{ build: normalizedBuild }], historyIndex: 0 })
      },

      deleteBuild: (id) => {
        set((s) => ({ savedBuilds: s.savedBuilds.filter((b) => b.id !== id) }))
      },

      duplicateBuild: (id) => {
        const build = get().savedBuilds.find((b) => b.id === id)
        if (!build) return
        const copy = { ...build, id: nanoid(), name: build.name + " (copy)", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
        set((s) => ({ savedBuilds: [...s.savedBuilds, copy] }))
      },

      equipBuild: (id) => {
        get().saveBuild()
        set({ equippedBuildId: id })
      },

      resetBuild: () => {
        const fresh = makeDefaultBuild(nanoid(), "My Keyboard")
        get().pushHistory()
        set({ currentBuild: fresh, buildNameDraft: fresh.name, selectedKeyIds: [], unsavedChanges: false })
      },

      importBuild: (json) => {
        try {
          const build = normalizeBuildKeys(JSON.parse(json) as KeyboardBuild)
          build.id = nanoid()
          build.updatedAt = new Date().toISOString()
          set((s) => ({ savedBuilds: [...s.savedBuilds, build] }))
        } catch {
          /* ignore malformed import */
        }
      },

      exportBuild: () => JSON.stringify(get().currentBuild, null, 2),

      applyPreset: (patch) => {
        get().pushHistory()
        set((s) => ({
          currentBuild: { ...s.currentBuild, ...patch, updatedAt: new Date().toISOString() },
          unsavedChanges: true,
        }))
      },

      selectKey: (id, multi = false) => {
        const { selectedKeyIds } = get()
        if (multi) {
          if (selectedKeyIds.includes(id)) {
            set({ selectedKeyIds: selectedKeyIds.filter((k) => k !== id) })
          } else {
            set({ selectedKeyIds: [...selectedKeyIds, id] })
          }
        } else {
          set({ selectedKeyIds: selectedKeyIds.length === 1 && selectedKeyIds[0] === id ? [] : [id] })
        }
        set({ selectedPart: "keycaps" })
      },

      deselectAll: () => set({ selectedKeyIds: [] }),

      selectGroup: (keyIds) => set({ selectedKeyIds: keyIds }),

      updateSelectedKeys: (patch) => {
        const { selectedKeyIds, currentBuild } = get()
        if (selectedKeyIds.length === 0) return
        get().pushHistory()
        const keys = { ...currentBuild.keys }
        for (const id of selectedKeyIds) {
          if (keys[id]) {
            keys[id] = deepMerge(keys[id], patch) as KeyCustomization
          }
        }
        set((s) => {
          const currentBuild = { ...s.currentBuild, keys, updatedAt: new Date().toISOString() }
          return {
            currentBuild,
            unsavedChanges: true,
        }})
      },

      resetSelectedKeys: () => {
        const { selectedKeyIds, currentBuild } = get()
        if (selectedKeyIds.length === 0) return
        get().pushHistory()
        const layoutKeys = LAYOUTS[currentBuild.layout] ?? LAYOUT_75
        const keys = { ...currentBuild.keys }
        for (const id of selectedKeyIds) {
          const layoutKey = layoutKeys.find((key) => key.id === id)
          if (layoutKey) keys[id] = makeDefaultKey(id, layoutKey.primaryLegend ?? layoutKey.label, layoutKey.type)
        }
        set((s) => {
          const currentBuild = { ...s.currentBuild, keys, updatedAt: new Date().toISOString() }
          return {
            currentBuild,
            unsavedChanges: true,
        }})
      },

      updateAllKeys: (patch) => {
        const { currentBuild } = get()
        get().pushHistory()
        const keys = Object.fromEntries(
          Object.entries(currentBuild.keys).map(([id, key]) => [id, deepMerge(key, patch) as KeyCustomization])
        )
        set((s) => {
          const currentBuild = { ...s.currentBuild, keys, updatedAt: new Date().toISOString() }
          return {
            currentBuild,
            selectedKeyIds: Object.keys(keys),
            selectedPart: "keycaps",
            unsavedChanges: true,
        }})
      },

      updateKey: (keyId, patch) => {
        const { currentBuild } = get()
        get().pushHistory()
        const keys = { ...currentBuild.keys }
        if (keys[keyId]) keys[keyId] = deepMerge(keys[keyId], patch) as KeyCustomization
        set((s) => {
          const currentBuild = { ...s.currentBuild, keys, updatedAt: new Date().toISOString() }
          return { currentBuild, unsavedChanges: true }
        })
      },

      // Keep a key selection while inspecting another part. Returning to Keycaps
      // should never make the player reselect the work they were editing.
      setSelectedPart: (part) => set({ selectedPart: part }),

      updateCase: (patch) => {
        get().pushHistory()
        set((s) => ({ currentBuild: { ...s.currentBuild, case: { ...s.currentBuild.case, ...patch }, updatedAt: new Date().toISOString() }, unsavedChanges: true }))
      },

      updateFrame: (patch) => {
        get().pushHistory()
        set((s) => ({ currentBuild: { ...s.currentBuild, frame: { ...s.currentBuild.frame, ...patch }, updatedAt: new Date().toISOString() }, unsavedChanges: true }))
      },

      updatePlate: (patch) => {
        get().pushHistory()
        set((s) => ({ currentBuild: { ...s.currentBuild, plate: { ...s.currentBuild.plate, ...patch }, updatedAt: new Date().toISOString() }, unsavedChanges: true }))
      },

      updateSwitch: (patch, keyIds) => {
        get().pushHistory()
        set((s) => {
          const sw = { ...s.currentBuild.switches }
          const targets = keyIds ?? Object.keys(s.currentBuild.keys)
          for (const id of targets) sw[id] = { ...(sw[id] ?? {}), ...patch } as SwitchCustomization
          return { currentBuild: { ...s.currentBuild, switches: sw, updatedAt: new Date().toISOString() }, unsavedChanges: true }
        })
      },

      updateStabilizers: (patch) => {
        get().pushHistory()
        set((s) => ({ currentBuild: { ...s.currentBuild, stabilizers: { ...s.currentBuild.stabilizers, ...patch }, updatedAt: new Date().toISOString() }, unsavedChanges: true }))
      },

      updateKnob: (patch) => {
        get().pushHistory()
        set((s) => ({ currentBuild: { ...s.currentBuild, knob: { ...s.currentBuild.knob, ...patch }, updatedAt: new Date().toISOString() }, unsavedChanges: true }))
      },

      updateBadge: (patch) => {
        get().pushHistory()
        set((s) => ({ currentBuild: { ...s.currentBuild, badge: { ...s.currentBuild.badge, ...patch }, updatedAt: new Date().toISOString() }, unsavedChanges: true }))
      },

      updateLighting: (patch) => {
        get().pushHistory()
        set((s) => ({ currentBuild: { ...s.currentBuild, lighting: { ...s.currentBuild.lighting, ...patch }, updatedAt: new Date().toISOString() }, unsavedChanges: true }))
      },

      updateSound: (patch) => {
        get().pushHistory()
        set((s) => ({ currentBuild: { ...s.currentBuild, sound: { ...s.currentBuild.sound, ...patch }, updatedAt: new Date().toISOString() }, unsavedChanges: true }))
      },

      setActiveEditorTab: (tab) => set({ activeEditorTab: tab }),

      setCameraPreset: (preset) => set({ cameraPreset: preset }),

      setExplodedView: (enabled) => set({ explodedView: enabled, explodeAmount: enabled ? 1 : 0 }),

      setExplodeAmount: (amount) => set({ explodeAmount: amount }),

      setTestTypingMode: (enabled) => {
        useWorkshopTypingStore.getState().clearPressedKeys()
        set({ testTypingMode: enabled })
      },

      undo: () => {
        const { history, historyIndex } = get()
        if (historyIndex <= 0) return
        // Mutations capture the build immediately before they are applied. Swap the
        // live build into that history slot before stepping back, so Redo can restore
        // the exact state that was undone.
        const previous = history[historyIndex].build
        const nextHistory = [...history]
        nextHistory[historyIndex] = { build: JSON.parse(JSON.stringify(get().currentBuild)) }
        set({
          currentBuild: { ...previous },
          history: nextHistory,
          historyIndex: historyIndex - 1,
          unsavedChanges: true,
        })
      },

      redo: () => {
        const { history, historyIndex } = get()
        if (historyIndex >= history.length - 1) return
        const newIndex = historyIndex + 1
        set({ currentBuild: { ...history[newIndex].build }, historyIndex: newIndex, unsavedChanges: true })
      },

      createGroup: (name, keyIds) => {
        set((s) => ({ keyGroups: [...s.keyGroups, { id: nanoid(), name, keyIds }] }))
      },

      deleteGroup: (id) => {
        set((s) => ({ keyGroups: s.keyGroups.filter((g) => g.id !== id) }))
      },

      updateGroup: (id, patch) => {
        set((s) => ({ keyGroups: s.keyGroups.map((g) => g.id === id ? { ...g, ...patch } : g) }))
      },

      setLightingEnv: (env) => set({ lightingEnv: env }),
    }),
    {
      name: "pawtype-workshop",
      partialize: (s) => ({
        savedBuilds: s.savedBuilds,
        equippedBuildId: s.equippedBuildId,
        keyGroups: s.keyGroups,
        currentBuild: s.currentBuild,
        buildNameDraft: s.buildNameDraft,
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<WorkshopState>
        return {
          ...currentState,
          ...persisted,
          currentBuild: persisted.currentBuild
            ? normalizeBuildKeys(persisted.currentBuild)
            : currentState.currentBuild,
          savedBuilds: Array.isArray(persisted.savedBuilds)
            ? persisted.savedBuilds.map(normalizeBuildKeys)
            : currentState.savedBuilds,
        }
      },
    }
  )
)

// ─── Helpers ─────────────────────────────────────────────────────────────────

function deepMerge<T>(target: T, source: Partial<T>): T {
  const result = { ...target }
  for (const key of Object.keys(source) as (keyof T)[]) {
    const sv = source[key]
    const tv = target[key]
    if (sv !== undefined && sv !== null && typeof sv === "object" && !Array.isArray(sv) && typeof tv === "object" && tv !== null) {
      result[key] = deepMerge(tv, sv as Partial<typeof tv>)
    } else if (sv !== undefined) {
      result[key] = sv as T[keyof T]
    }
  }
  return result
}
