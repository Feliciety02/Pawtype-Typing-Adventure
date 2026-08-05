import { lazy, Suspense, useEffect, useState, type RefObject } from "react"
import { useTestTyping } from "./hooks/useTestTyping"
import { WorkshopHeader } from "./components/WorkshopHeader"
import { WorkshopToolbar } from "./components/WorkshopToolbar"
import { PropertiesPanel } from "./components/PropertiesPanel"
import { PartsSidebar } from "./components/PartsSidebar"
import { QuickSelectionBar } from "./components/QuickSelectionBar"
import { WorkshopOverview } from "./components/WorkshopOverview"
import { useWorkshopStore } from "./store"

// Dynamically import the 3D scene to avoid SSR issues
const KeyboardScene = lazy(() =>
  import("./3d/KeyboardScene").then((m) => ({ default: m.KeyboardScene }))
)

function SceneLoader() {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: "#100c06" }}
      aria-live="polite"
      aria-label="Loading 3D keyboard scene"
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "#c8803a", borderTopColor: "transparent" }}
        />
        <span className="text-sm font-medium" style={{ color: "#c8a060" }}>
          Loading workshop...
        </span>
      </div>
    </div>
  )
}

function TestTypingBanner() {
  const { testTypingMode, setTestTypingMode } = useWorkshopStore()
  if (!testTypingMode) return null

  return (
    <div
      className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-4 py-2 rounded-full text-sm font-medium shadow-lg"
      style={{ background: "#1e4025", color: "#80e0a0", border: "1px solid #3a7048" }}
      role="status"
    >
      <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#60e080" }} />
      Test Typing Mode — press any key
      <button
        onClick={() => setTestTypingMode(false)}
        className="ml-1 text-xs underline opacity-70 hover:opacity-100"
        style={{ color: "#80e0a0" }}
      >
        Exit
      </button>
    </div>
  )
}

export default function KeyboardWorkshopPage({
  embedded = false,
  onBack,
  backButtonRef,
}: {
  embedded?: boolean
  onBack?: () => void
  backButtonRef?: RefObject<HTMLButtonElement | null>
}) {
  const [mounted, setMounted] = useState(false)
  const [isViewingKeyboard, setIsViewingKeyboard] = useState(false)
  useTestTyping()

  useEffect(() => setMounted(true), [])

  return (
    <div
      className={`keyboard-workshop ${embedded ? "keyboard-workshop--embedded" : ""} flex flex-col`}
      style={{ background: "#100c06", color: "#e8d5a0" }}
    >
      {!embedded && (
        <WorkshopHeader
          onBack={onBack}
          backButtonRef={backButtonRef}
        />
      )}
      {!embedded && <WorkshopOverview />}
      {/* Main workspace */}
      <div
        className={`workshop-layout flex flex-1 overflow-hidden ${isViewingKeyboard ? "workshop-layout--camera-active" : ""}`}
      >
        <PartsSidebar
          ornate={embedded}
        />
        {/* Left sidebar — parts */}
        {/* Center — 3D viewport */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          <div className="flex-1 relative">
            <TestTypingBanner />
            {mounted ? (
              <Suspense fallback={<SceneLoader />}>
                <KeyboardScene
                  accountForPanelInsets={embedded}
                  onViewInteractionChange={setIsViewingKeyboard}
                />
              </Suspense>
            ) : (
              <SceneLoader />
            )}
          </div>
          {/* Bottom toolbar */}
          {!embedded && <QuickSelectionBar />}
          <WorkshopToolbar ornate={embedded} />
        </main>

        {/* Right sidebar — properties */}
        <aside className="workshop-drawer"><PropertiesPanel /></aside>
      </div>
    </div>
  )
}
