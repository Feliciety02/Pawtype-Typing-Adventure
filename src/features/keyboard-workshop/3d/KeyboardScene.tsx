"use client"
import {
  useRef,
  useEffect,
  useMemo,
  Suspense,
  type ComponentProps,
  type RefObject,
} from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import * as THREE from "three"
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib"
import { useWorkshopStore, useWorkshopTypingStore } from "../store"
import { LAYOUTS, computeKeyPositions, GAP, U, getKeyboardModel } from "../layout-data"
import { LAYOUT_75 } from "../layout-data"
import { KeyboardKeycap3D } from "./KeyboardKeycap3D"
import { KeyboardCase3D } from "./KeyboardCase3D"
import { KeyboardPlate3D } from "./KeyboardPlate3D"
import { KeyboardFrame3D } from "./KeyboardFrame3D"
import { KeyboardSwitch3D } from "./KeyboardSwitch3D"
import { KeyboardStabilizer3D } from "./KeyboardStabilizer3D"
import { KeyboardKnob3D } from "./KeyboardKnob3D"
import { KeyboardBadge3D } from "./KeyboardBadge3D"
import type { LightingCustomization } from "../types"
import { makeDefaultKey } from "../defaults"

// ─── Camera presets ───────────────────────────────────────────────────────────

const CAMERA_PRESETS: Record<string, [number, number, number]> = {
  isometric:        [12, 12, 17],
  top:              [0, 24, 0.001],
  front:            [0, 3, 20],
  left:             [-20, 3, 0],
  right:            [20, 3, 0],
  typing:           [0, 6, 13],
  "keycap-closeup": [4, 3, 5],
  "case-closeup":   [0, 5, 9],
}

const FULL_KEYBOARD_PRESETS = new Set([
  "isometric",
  "top",
  "front",
  "left",
  "right",
  "typing",
])

function CameraController({
  contentRef,
  fitKey,
}: {
  contentRef: RefObject<THREE.Group | null>
  fitKey: string
}) {
  const controlsRef = useRef<OrbitControlsImpl>(null!)
  const { camera, size, invalidate } = useThree()
  const preset = useWorkshopStore((s) => s.cameraPreset)

  useEffect(() => {
    const pos = CAMERA_PRESETS[preset] ?? CAMERA_PRESETS.isometric
    const target = new THREE.Vector3()
    const direction = new THREE.Vector3(...pos).normalize()

    if (
      FULL_KEYBOARD_PRESETS.has(preset) &&
      contentRef.current &&
      camera instanceof THREE.PerspectiveCamera
    ) {
      const box = new THREE.Box3().setFromObject(contentRef.current)

      if (!box.isEmpty()) {
        box.getCenter(target)

        // Build the selected view orientation first, then measure every corner
        // in camera space. This fits wide and shallow viewports without relying
        // on a fixed distance that can crop the keyboard behind side panels.
        camera.position.copy(target).add(direction)
        camera.lookAt(target)
        camera.updateMatrixWorld()

        const worldToViewRotation = camera.quaternion.clone().invert()
        const verticalFov = THREE.MathUtils.degToRad(camera.fov)
        const horizontalFov =
          2 * Math.atan(Math.tan(verticalFov / 2) * Math.max(camera.aspect, 0.01))
        const verticalTangent = Math.tan(verticalFov / 2)
        const horizontalTangent = Math.tan(horizontalFov / 2)
        const min = box.min
        const max = box.max
        let distance = 0

        for (const x of [min.x, max.x]) {
          for (const y of [min.y, max.y]) {
            for (const z of [min.z, max.z]) {
              const corner = new THREE.Vector3(x, y, z)
                .sub(target)
                .applyQuaternion(worldToViewRotation)

              distance = Math.max(
                distance,
                corner.z + (Math.abs(corner.x) * 1.14) / horizontalTangent,
                corner.z + (Math.abs(corner.y) * 1.14) / verticalTangent,
              )
            }
          }
        }

        camera.position.copy(target).addScaledVector(direction, distance)
      }
    } else {
      camera.position.set(...pos)
    }

    camera.lookAt(target)
    camera.updateProjectionMatrix()
    controlsRef.current?.target.copy(target)
    controlsRef.current?.update()
    invalidate()
  }, [
    preset,
    camera,
    contentRef,
    fitKey,
    invalidate,
    size.width,
    size.height,
  ])

  return (
    <OrbitControls
      ref={controlsRef}
      target={[0, 0, 0]}
      // Permit a complete orbit: top, back, sides, and underside.
      minPolarAngle={0.01}
      maxPolarAngle={Math.PI - 0.01}
      minDistance={6}
      maxDistance={48}
      enableDamping
      dampingFactor={0.07}
    />
  )
}

// ─── Lighting environment map ─────────────────────────────────────────────────

type EnvironmentPreset = NonNullable<
  ComponentProps<typeof Environment>["preset"]
>

const ENV_MAP: Record<string, EnvironmentPreset> = {
  "neutral-studio":    "studio",
  "warm-workshop":     "sunset",
  morning:             "dawn",
  sunset:              "sunset",
  moonlight:           "night",
  "forest-glow":       "forest",
  "sakura-light":      "park",
  "royal-candlelight": "lobby",
  stardust:            "night",
  cafe:                "apartment",
}

const BACKLIGHT_COLORS = ["#7c5cff", "#00d9ff", "#ff4fc3", "#72f6aa", "#ffd34d"]

function backlightColorForKey(keyId: string) {
  const hash = Array.from(keyId).reduce((value, character) => value + character.charCodeAt(0), 0)
  return BACKLIGHT_COLORS[hash % BACKLIGHT_COLORS.length]
}

function KeyboardLighting({ lighting }: { lighting: LightingCustomization }) {
  const keyLight = useRef<THREE.PointLight>(null)
  const fillLight = useRef<THREE.PointLight>(null)
  const primary = useMemo(() => new THREE.Color(lighting.primaryColor), [lighting.primaryColor])
  const secondary = useMemo(() => new THREE.Color(lighting.secondaryColor), [lighting.secondaryColor])

  useFrame(({ clock }) => {
    const pressedCount =
      useWorkshopTypingStore.getState().pressedKeys.size
    const time = clock.getElapsedTime()
    const speed = 0.35 + lighting.speed * 4
    const wave = (Math.sin(time * speed) + 1) / 2
    const active = lighting.trigger === "on-keypress" ? pressedCount > 0 : lighting.trigger === "idle" ? pressedCount === 0 : true
    const animated = lighting.effect === "static" ? 1 : 0.35 + wave * 0.65
    const intensity = active ? (0.15 + lighting.intensity * 2.2) * animated : 0
    const colorMix = lighting.effect === "static" ? 0 : wave
    if (keyLight.current) {
      keyLight.current.color.copy(primary).lerp(secondary, colorMix)
      keyLight.current.intensity = intensity
      const travel = Math.sin(time * speed) * 5
      if (lighting.direction === "top-bottom" || lighting.direction === "bottom-top") keyLight.current.position.set(0, 2.2, travel)
      else if (lighting.direction === "radial" || lighting.direction === "center-out") keyLight.current.position.set(Math.cos(time * speed) * 4, 2.2, Math.sin(time * speed) * 3)
      else keyLight.current.position.set(lighting.direction === "right-left" ? -travel : travel, 2.2, 0)
    }
    if (fillLight.current) {
      fillLight.current.color.copy(secondary)
      fillLight.current.intensity = intensity * 0.45
    }
  })

  return (
    <>
      <ambientLight intensity={0.08 + lighting.ambientLight * 0.8} />
      {/* Only the high, broad key light creates shadows.  A fixed bias avoids
          self-shadow acne when a keycap sits close to the plate. */}
      <directionalLight
        position={[8, 16, 10]}
        intensity={0.35 + lighting.brightness * 1.25}
        color={lighting.primaryColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.00008}
        shadow-normalBias={0.035}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      {/* Fill light is intentionally shadow-free so dark side faces stay readable. */}
      <directionalLight position={[-6, 10, -4]} intensity={0.32 + lighting.brightness * 0.32} color={lighting.secondaryColor} />
      <pointLight ref={keyLight} position={[0, 2.2, 0]} distance={15} />
      <pointLight ref={fillLight} position={[0, 1.5, -3]} distance={12} />
    </>
  )
}

// ─── Keyboard code → key id map ───────────────────────────────────────────────

const CODE_TO_KEY_ID: Record<string, string> = {
  Escape: "Escape", F1: "F1", F2: "F2", F3: "F3", F4: "F4",
  F5: "F5", F6: "F6", F7: "F7", F8: "F8", F9: "F9",
  F10: "F10", F11: "F11", F12: "F12", Delete: "Delete",
  Backquote: "Backtick", Digit1: "1", Digit2: "2", Digit3: "3",
  Digit4: "4", Digit5: "5", Digit6: "6", Digit7: "7",
  Digit8: "8", Digit9: "9", Digit0: "0", Minus: "Minus",
  Equal: "Equal", Backspace: "Backspace",
  Tab: "Tab", KeyQ: "Q", KeyW: "W", KeyE: "E", KeyR: "R",
  KeyT: "T", KeyY: "Y", KeyU: "U", KeyI: "I", KeyO: "O",
  KeyP: "P", BracketLeft: "BracketL", BracketRight: "BracketR",
  Backslash: "Backslash", PageUp: "PageUp",
  CapsLock: "CapsLock", KeyA: "A", KeyS: "S", KeyD: "D",
  KeyF: "F", KeyG: "G", KeyH: "H", KeyJ: "J", KeyK: "K",
  KeyL: "L", Semicolon: "Semicolon", Quote: "Quote",
  Enter: "Enter", PageDown: "PageDown",
  ShiftLeft: "ShiftL", KeyZ: "Z", KeyX: "X", KeyC: "C",
  KeyV: "V", KeyB: "B", KeyN: "N", KeyM: "M",
  Comma: "Comma", Period: "Period", Slash: "Slash",
  ShiftRight: "ShiftR", ArrowUp: "ArrowUp", End: "End",
  ControlLeft: "CtrlL", MetaLeft: "Win", AltLeft: "AltL",
  Space: "Space",
  ControlRight: "CtrlR", ArrowLeft: "ArrowLeft",
  ArrowDown: "ArrowDown", ArrowRight: "ArrowRight",
}

// ─── Inner 3D assembly ────────────────────────────────────────────────────────

function KeyboardAssembly() {
  const assemblyRef = useRef<THREE.Group>(null)
  const currentBuild = useWorkshopStore((state) => state.currentBuild)
  const selectedKeyIds = useWorkshopStore((state) => state.selectedKeyIds)
  const explodedView = useWorkshopStore((state) => state.explodedView)
  const explodeAmount = useWorkshopStore((state) => state.explodeAmount)
  const selectKey = useWorkshopStore((state) => state.selectKey)
  const setSelectedPart = useWorkshopStore((state) => state.setSelectedPart)
  const lightingEnv = useWorkshopStore((state) => state.lightingEnv)

  // Resolve the active keyboard model
  const model = useMemo(
    () => getKeyboardModel(currentBuild.modelId ?? "pawtype-75-knob-v1"),
    [currentBuild.modelId]
  )

  const layoutKeys = useMemo(
    () => LAYOUTS[currentBuild.layout] ?? LAYOUT_75,
    [currentBuild.layout]
  )

  const positions = useMemo(
    () => computeKeyPositions(layoutKeys, U, GAP),
    [layoutKeys]
  )

  // Tight bounds of the key layout
  const bounds = useMemo(() => {
    const xs = positions.flatMap((p) => [p.x - p.width / 2, p.x + p.width / 2])
    const ys = positions.flatMap((p) => [p.y - p.depth / 2, p.y + p.depth / 2])
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys),
      w: Math.max(...xs) - Math.min(...xs),
      h: Math.max(...ys) - Math.min(...ys),
    }
  }, [positions])

  const EX = explodeAmount * 1.6

  // Knob world position — upper-right, aligned with function row (row 0, topmost)
  const knobPos = useMemo((): [number, number, number] => {
    const f12 = positions.find((position) => position.keyId === "F12")
    const navColumnKey = positions.find((position) => position.keyId === "Delete")
    if (!model.knobConfig || !f12) return [bounds.maxX - 0.45, 0.3, -bounds.maxY]
    // The knob is a first-row member of the right navigation column, so it
    // always shares that column's exact centerline.
    const x = navColumnKey?.x ?? f12.x + f12.width / 2 + model.knobConfig.rightOffset + model.knobConfig.radius
    const z = -f12.y
    return [x, 0.3, z]
  }, [model.knobConfig, positions, bounds])

  const envPreset = ENV_MAP[lightingEnv] ?? "studio"
  const cameraFitKey = `${model.id}:${currentBuild.layout}:${explodedView}:${explodeAmount}`

  return (
    <>
      {/* Lighting */}
      <KeyboardLighting lighting={currentBuild.lighting} />
      <Environment preset={envPreset} />
      <CameraController contentRef={assemblyRef} fitKey={cameraFitKey} />

      <group ref={assemblyRef}>
        {/* Case — tightly wraps the layout */}
        <KeyboardCase3D
          bounds={bounds}
          caseConfig={currentBuild.case}
          modelCaseConfig={model.caseConfig}
          explodeOffset={explodedView ? -EX * 1.2 : 0}
          onClick={() => setSelectedPart("case")}
        />

        <KeyboardFrame3D
          bounds={bounds}
          frameConfig={currentBuild.frame}
          explodeOffset={explodedView ? EX * 0.2 : 0}
          onClick={() => setSelectedPart("frame")}
        />

        {/* Plate */}
        <KeyboardPlate3D
          bounds={bounds}
          plateConfig={currentBuild.plate}
          explodeOffset={explodedView ? EX * 0.5 : 0}
          onClick={() => setSelectedPart("plate")}
        />

        <KeyboardBadge3D
          position={[bounds.minX + 0.48, 0.33, -bounds.minY + 0.35]}
          badge={currentBuild.badge}
          onClick={() => setSelectedPart("badge")}
        />

        {/* Stabilizers */}
        <KeyboardStabilizer3D
          positions={positions}
          stabilizers={currentBuild.stabilizers}
          explodeOffset={explodedView ? EX * 0.7 : 0}
        />

        {/* Switches */}
        <KeyboardSwitch3D
          positions={positions}
          switches={currentBuild.switches}
          explodeOffset={explodedView ? EX * 0.9 : 0}
        />

        {/* Keycaps */}
        {positions.map((pos) => {
          // Older locally saved builds may predate keys added to the current
          // layout. Render a safe default instead of leaving an empty gap.
          const key = currentBuild.keys[pos.keyId] ?? makeDefaultKey(pos.keyId, pos.primaryLegend, pos.type)
          return (
            <KeyboardKeycap3D
              key={pos.keyId}
              position={pos}
              customization={key}
              isSelected={selectedKeyIds.includes(pos.keyId)}
              isHovered={false}
              backlightColor={backlightColorForKey(pos.keyId)}
              onClick={(id, multi) => {
                selectKey(id, multi)
                setSelectedPart("keycaps")
              }}
              explodeOffset={explodedView ? EX * 1.15 : 0}
            />
          )
        })}

        {/* Knob — upper-right corner, aligned with function row */}
        {currentBuild.layout === "75%" && currentBuild.knob.enabled && model.hasKnob && model.knobConfig && (
          <KeyboardKnob3D
            position={knobPos}
            knob={currentBuild.knob}
            radius={model.knobConfig.radius}
            explodeOffset={explodedView ? EX * 1.3 : 0}
            onClick={() => setSelectedPart("knob")}
          />
        )}
      </group>
    </>
  )
}

// ─── Canvas wrapper ───────────────────────────────────────────────────────────

export function KeyboardScene() {
  const { deselectAll, setSelectedPart } = useWorkshopStore()

  return (
    <div
      className="w-full h-full"
      aria-label="Interactive 3D keyboard preview"
    >
      <Canvas
        shadows="soft"
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        camera={{ position: [14, 11, 16], fov: 40 }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
        onPointerMissed={() => {
          deselectAll()
          setSelectedPart("keycaps")
        }}
      >
        <Suspense fallback={null}>
          <KeyboardAssembly />
        </Suspense>
      </Canvas>
    </div>
  )
}
