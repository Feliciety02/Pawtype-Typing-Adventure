"use client"
import {
  useRef,
  useEffect,
  useMemo,
  useCallback,
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
  // Canonical startup/reset/release composition shown in the Blacksmith UI.
  typing:           [0, 12, 13],
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

const TYPING_VIEW_SCALE = 0.8
const TYPING_VIEW_DOWN_SHIFT = -0.15
const CAMERA_RETURN_DURATION_MS = 900
const INSPECTION_RECENTER_DURATION_MS = 240
const PRIMARY_DRAG_THRESHOLD_PX = 1
const CAMERA_WORLD_UP = new THREE.Vector3(0, 1, 0)

type CameraReturnTransition = {
  camera: THREE.Camera
  startedAt: number
  target: THREE.Vector3
  toPosition: THREE.Vector3
  toQuaternion: THREE.Quaternion
  fromSpherical: THREE.Spherical
  toSpherical: THREE.Spherical
  azimuthDelta: number
  workingSpherical: THREE.Spherical
  workingOffset: THREE.Vector3
  fromViewEnabled: boolean
  fromViewOffsetY: number
  toViewEnabled: boolean
  toViewOffsetY: number
  lastViewOffsetY: number
  viewWidth: number
  viewHeight: number
}

type InspectionProjectionTransition = {
  camera: THREE.Camera
  startedAt: number
  fromViewOffsetY: number
  lastViewOffsetY: number
  viewWidth: number
  viewHeight: number
}

function CameraController({
  contentRef,
  fitKey,
  accountForPanelInsets,
  onViewInteractionChange,
  onPrimaryOrbitEnd,
  isPrimaryPressed,
}: {
  contentRef: RefObject<THREE.Group | null>
  fitKey: string
  accountForPanelInsets: boolean
  onViewInteractionChange?: (isInteracting: boolean) => void
  onPrimaryOrbitEnd: () => void
  isPrimaryPressed: () => boolean
}) {
  const controlsRef = useRef<OrbitControlsImpl>(null!)
  const { camera, size, invalidate, set } = useThree()
  const preset = useWorkshopStore((s) => s.cameraPreset)
  const resetNonce = useWorkshopStore((s) => s.cameraResetNonce)
  const handledResetNonceRef = useRef(resetNonce)
  const returnTransitionRef = useRef<CameraReturnTransition | null>(null)
  const inspectionProjectionRef = useRef<InspectionProjectionTransition | null>(null)
  const primaryOrbitRef = useRef(false)
  const perspectiveCameraRef = useRef<THREE.PerspectiveCamera | null>(
    camera instanceof THREE.PerspectiveCamera ? camera : null,
  )
  const orthographicCamera = useMemo(
    () => new THREE.OrthographicCamera(-10, 10, 10, -10, 0.1, 100),
    [],
  )

  if (camera instanceof THREE.PerspectiveCamera) {
    perspectiveCameraRef.current = camera
  }

  useFrame(() => {
    const transition = returnTransitionRef.current
    if (!transition || transition.camera !== camera) {
      const projectionTransition = inspectionProjectionRef.current
      if (!projectionTransition || projectionTransition.camera !== camera) return

      const progress = THREE.MathUtils.clamp(
        (performance.now() - projectionTransition.startedAt) /
          INSPECTION_RECENTER_DURATION_MS,
        0,
        1,
      )
      const eased = progress * progress * (3 - 2 * progress)
      const viewOffsetY = THREE.MathUtils.lerp(
        projectionTransition.fromViewOffsetY,
        0,
        eased,
      )

      if (
        camera instanceof THREE.PerspectiveCamera ||
        camera instanceof THREE.OrthographicCamera
      ) {
        if (
          Math.abs(viewOffsetY - projectionTransition.lastViewOffsetY) >= 0.1 ||
          progress >= 1
        ) {
          projectionTransition.lastViewOffsetY = viewOffsetY
          if (progress >= 1) {
            camera.clearViewOffset()
          } else {
            camera.setViewOffset(
              projectionTransition.viewWidth,
              projectionTransition.viewHeight,
              0,
              viewOffsetY,
              projectionTransition.viewWidth,
              projectionTransition.viewHeight,
            )
          }
          camera.updateProjectionMatrix()
        }
      }

      if (progress >= 1) inspectionProjectionRef.current = null
      invalidate()
      return
    }

    const progress = THREE.MathUtils.clamp(
      (performance.now() - transition.startedAt) / CAMERA_RETURN_DURATION_MS,
      0,
      1,
    )
    // Smootherstep eases both ends without overshoot or residual momentum.
    const eased = progress * progress * progress * (progress * (progress * 6 - 15) + 10)
    transition.workingSpherical.set(
      THREE.MathUtils.lerp(
        transition.fromSpherical.radius,
        transition.toSpherical.radius,
        eased,
      ),
      THREE.MathUtils.lerp(
        transition.fromSpherical.phi,
        transition.toSpherical.phi,
        eased,
      ),
      transition.fromSpherical.theta + transition.azimuthDelta * eased,
    )
    transition.workingOffset.setFromSpherical(transition.workingSpherical)
    camera.position.copy(transition.target).add(transition.workingOffset)
    // Orbit back around the keyboard with a fixed world-up reference. Keeping
    // the horizon level on every frame prevents the return from introducing a
    // sideways tilt that was never part of the user's drag.
    camera.up.copy(CAMERA_WORLD_UP)
    camera.lookAt(transition.target)

    if (camera instanceof THREE.PerspectiveCamera || camera instanceof THREE.OrthographicCamera) {
      const viewOffsetY = THREE.MathUtils.lerp(
        transition.fromViewOffsetY,
        transition.toViewOffsetY,
        eased,
      )
      // Projection updates are more expensive than transforms. Only update
      // when the sub-pixel offset has changed enough to affect the image.
      if (Math.abs(viewOffsetY - transition.lastViewOffsetY) >= 0.1 || progress >= 1) {
        transition.lastViewOffsetY = viewOffsetY
        if (transition.fromViewEnabled || transition.toViewEnabled) {
          camera.setViewOffset(
            transition.viewWidth,
            transition.viewHeight,
            0,
            viewOffsetY,
            transition.viewWidth,
            transition.viewHeight,
          )
        } else {
          camera.clearViewOffset()
        }
        camera.updateProjectionMatrix()
      }
    }

    camera.updateMatrixWorld()
    if (progress >= 1) {
      // End on the exact fitted Typing camera—not an approximation from the
      // orbital interpolation—and synchronize OrbitControls before re-enabling
      // input so its next update cannot restore the released sideways view.
      camera.position.copy(transition.toPosition)
      camera.quaternion.copy(transition.toQuaternion)
      camera.up.copy(CAMERA_WORLD_UP)
      camera.updateMatrixWorld()
      if (controlsRef.current) {
        controlsRef.current.target.copy(transition.target)
        // The animated frame already owns the exact final transform. Calling
        // update() here made OrbitControls apply one more constraint pass after
        // the keyboard had visibly settled, producing a small second movement.
        controlsRef.current.saveState()
        controlsRef.current.enabled = true
      }
      returnTransitionRef.current = null
    } else if (controlsRef.current) {
      controlsRef.current.enabled = false
    }
    invalidate()
  })

  const safeViewportWidth = useMemo(() => {
    if (!accountForPanelInsets || typeof window === "undefined") return size.width

    const viewportWidth = window.innerWidth
    if (viewportWidth <= 700) return size.width

    const clamp = (minimum: number, preferred: number, maximum: number) =>
      Math.min(Math.max(preferred, minimum), maximum)
    const leftRail = viewportWidth <= 980
      ? clamp(280, viewportWidth * 0.32, 320)
      : clamp(320, viewportWidth * 0.22, 380)
    const rightDrawer = viewportWidth <= 980
      ? clamp(220, viewportWidth * 0.25, 260)
      : clamp(250, viewportWidth * 0.18, 320)

    return Math.max(size.width - leftRail - rightDrawer, size.width * 0.25)
  }, [accountForPanelInsets, size.width])

  useEffect(() => {
    // Size and panel updates can land during the 900 ms return. Do not restart
    // an in-flight Typing return from its current frame; that looked like a
    // second animation after the keyboard had already reached the right spot.
    if (
      preset === "typing" &&
      returnTransitionRef.current?.camera === camera &&
      handledResetNonceRef.current === resetNonce
    ) {
      return
    }

    const shouldAnimateReturn = handledResetNonceRef.current !== resetNonce
    const fromPosition = camera.position.clone()
    const fromQuaternion = camera.quaternion.clone()
    const fromViewEnabled =
      (camera instanceof THREE.PerspectiveCamera || camera instanceof THREE.OrthographicCamera) &&
      Boolean(camera.view?.enabled)
    const fromViewOffsetY =
      camera instanceof THREE.PerspectiveCamera || camera instanceof THREE.OrthographicCamera
        ? camera.view?.offsetY ?? 0
        : 0
    const pos = CAMERA_PRESETS[preset] ?? CAMERA_PRESETS.isometric
    const target = new THREE.Vector3()
    const direction = new THREE.Vector3(...pos).normalize()
    camera.up.set(0, 1, 0)
    if (camera instanceof THREE.PerspectiveCamera || camera instanceof THREE.OrthographicCamera) {
      camera.clearViewOffset()
      camera.updateProjectionMatrix()
    }

    if (preset === "front" && camera !== orthographicCamera) {
      set({ camera: orthographicCamera })
      return
    }

    if (preset !== "front" && camera === orthographicCamera) {
      const perspectiveCamera = perspectiveCameraRef.current
      if (perspectiveCamera) set({ camera: perspectiveCamera })
      return
    }

    if (preset === "front" && camera instanceof THREE.OrthographicCamera) {
      const box = contentRef.current
        ? new THREE.Box3().setFromObject(contentRef.current)
        : new THREE.Box3()

      if (!box.isEmpty()) box.getCenter(target)
      camera.position.copy(target).addScaledVector(direction, 24)
      camera.lookAt(target)
      camera.updateMatrixWorld()

      let halfWidth = 8
      let halfHeight = 4
      if (!box.isEmpty()) {
        halfWidth = 0
        halfHeight = 0
        const min = box.min
        const max = box.max
        for (const x of [min.x, max.x]) {
          for (const y of [min.y, max.y]) {
            for (const z of [min.z, max.z]) {
              const corner = new THREE.Vector3(x, y, z).applyMatrix4(camera.matrixWorldInverse)
              halfWidth = Math.max(halfWidth, Math.abs(corner.x))
              halfHeight = Math.max(halfHeight, Math.abs(corner.y))
            }
          }
        }
      }

      const fullAspect = Math.max(size.width / Math.max(size.height, 1), 0.01)
      const safeAspect = Math.max(safeViewportWidth / Math.max(size.height, 1), 0.01)
      const verticalHalf = Math.max(halfHeight * 1.14, (halfWidth * 1.14) / safeAspect)
      const horizontalHalf = verticalHalf * fullAspect
      camera.left = -horizontalHalf
      camera.right = horizontalHalf
      camera.top = verticalHalf
      camera.bottom = -verticalHalf
      camera.zoom = 1
      camera.updateProjectionMatrix()
      controlsRef.current?.target.copy(target)
      controlsRef.current?.update()
      invalidate()
      return
    }

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
        const safeWidthRatio = safeViewportWidth / Math.max(size.width, 1)
        const horizontalTangent = Math.tan(horizontalFov / 2) * safeWidthRatio
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

        const fittedDistance = preset === "typing"
          ? distance / TYPING_VIEW_SCALE
          : distance
        camera.position.copy(target).addScaledVector(direction, fittedDistance)
      }
    } else {
      camera.position.set(...pos)
    }

    camera.lookAt(target)
    camera.updateMatrixWorld()
    camera.updateProjectionMatrix()

    if (
      preset === "typing" &&
      contentRef.current &&
      camera instanceof THREE.PerspectiveCamera
    ) {
      const box = new THREE.Box3().setFromObject(contentRef.current)
      if (!box.isEmpty()) {
        const min = box.min
        const max = box.max
        let minProjectedY = Infinity
        let maxProjectedY = -Infinity

        for (const x of [min.x, max.x]) {
          for (const y of [min.y, max.y]) {
            for (const z of [min.z, max.z]) {
              const projectedY = new THREE.Vector3(x, y, z).project(camera).y
              minProjectedY = Math.min(minProjectedY, projectedY)
              maxProjectedY = Math.max(maxProjectedY, projectedY)
            }
          }
        }

        const displayedHeight = ((maxProjectedY - minProjectedY) * size.height) / 2
        const downwardShift = displayedHeight * TYPING_VIEW_DOWN_SHIFT
        camera.setViewOffset(
          Math.max(size.width, 1),
          Math.max(size.height, 1),
          0,
          -downwardShift,
          Math.max(size.width, 1),
          Math.max(size.height, 1),
        )
        camera.updateProjectionMatrix()
      }
    }

    controlsRef.current?.target.copy(target)
    controlsRef.current?.update()

    if (shouldAnimateReturn) {
      inspectionProjectionRef.current = null
      handledResetNonceRef.current = resetNonce
      const toPosition = camera.position.clone()
      const toQuaternion = camera.quaternion.clone()
      const supportsViewOffset =
        camera instanceof THREE.PerspectiveCamera || camera instanceof THREE.OrthographicCamera
      const toViewEnabled = supportsViewOffset && Boolean(camera.view?.enabled)
      const toViewOffsetY = supportsViewOffset ? camera.view?.offsetY ?? 0 : 0
      const alreadyAtDestination =
        fromPosition.distanceToSquared(toPosition) < 1e-8 &&
        1 - Math.abs(fromQuaternion.dot(toQuaternion)) < 1e-8 &&
        fromViewEnabled === toViewEnabled &&
        Math.abs(fromViewOffsetY - toViewOffsetY) < 0.1

      // A click at rest can still produce a reset request through the redundant
      // DOM/control release safety paths. Keep the exact fitted destination that
      // is already on screen instead of constructing a zero-distance animation.
      if (alreadyAtDestination) {
        returnTransitionRef.current = null
        if (controlsRef.current) {
          controlsRef.current.target.copy(target)
          controlsRef.current.saveState()
          controlsRef.current.enabled = true
        }
        invalidate()
        return
      }

      camera.position.copy(fromPosition)
      camera.quaternion.copy(fromQuaternion)
      if (supportsViewOffset) {
        if (fromViewEnabled || toViewEnabled) {
          camera.setViewOffset(
            Math.max(size.width, 1),
            Math.max(size.height, 1),
            0,
            fromViewOffsetY,
            Math.max(size.width, 1),
            Math.max(size.height, 1),
          )
        } else {
          camera.clearViewOffset()
        }
        camera.updateProjectionMatrix()
      }
      camera.updateMatrixWorld()
      if (controlsRef.current) controlsRef.current.enabled = false
      const fromSpherical = new THREE.Spherical().setFromVector3(
        fromPosition.clone().sub(target),
      )
      const toSpherical = new THREE.Spherical().setFromVector3(
        toPosition.clone().sub(target),
      )
      const azimuthDelta = THREE.MathUtils.euclideanModulo(
        toSpherical.theta - fromSpherical.theta + Math.PI,
        Math.PI * 2,
      ) - Math.PI
      returnTransitionRef.current = {
        camera,
        startedAt: performance.now(),
        target: target.clone(),
        toPosition,
        toQuaternion,
        fromSpherical,
        toSpherical,
        azimuthDelta,
        workingSpherical: new THREE.Spherical(),
        workingOffset: new THREE.Vector3(),
        fromViewEnabled,
        fromViewOffsetY,
        toViewEnabled,
        toViewOffsetY,
        lastViewOffsetY: fromViewOffsetY,
        viewWidth: Math.max(size.width, 1),
        viewHeight: Math.max(size.height, 1),
      }
    } else {
      handledResetNonceRef.current = resetNonce
      returnTransitionRef.current = null
      if (controlsRef.current) controlsRef.current.enabled = true
    }
    invalidate()
  }, [
    preset,
    resetNonce,
    camera,
    contentRef,
    fitKey,
    invalidate,
    size.width,
    size.height,
    safeViewportWidth,
    set,
    orthographicCamera,
  ])

  useEffect(
    () => () => onViewInteractionChange?.(false),
    [onViewInteractionChange],
  )

  const handleInteractionStart = useCallback(() => {
    primaryOrbitRef.current = isPrimaryPressed()
    returnTransitionRef.current = null
    inspectionProjectionRef.current = null
    if (controlsRef.current) controlsRef.current.enabled = true
    onViewInteractionChange?.(true)
  }, [isPrimaryPressed, onViewInteractionChange])

  const handleInteractionEnd = useCallback(() => {
    onViewInteractionChange?.(false)
    if (!primaryOrbitRef.current) return

    // OrbitControls also emits an end event after every wheel step. When the
    // primary button is still held, that event belongs to zooming inside the
    // current inspection view—not to the end of the drag. Keep the current
    // angle/zoom untouched and wait for the real primary-button release.
    if (isPrimaryPressed()) return

    primaryOrbitRef.current = false
    onPrimaryOrbitEnd()
  }, [isPrimaryPressed, onPrimaryOrbitEnd, onViewInteractionChange])

  const handleControlsChange = useCallback(() => {
    if (
      !isPrimaryPressed() ||
      returnTransitionRef.current ||
      inspectionProjectionRef.current ||
      !(camera instanceof THREE.PerspectiveCamera || camera instanceof THREE.OrthographicCamera) ||
      !camera.view?.enabled
    ) return

    const fromViewOffsetY = camera.view.offsetY
    if (Math.abs(fromViewOffsetY) < 0.1) return
    inspectionProjectionRef.current = {
      camera,
      startedAt: performance.now(),
      fromViewOffsetY,
      lastViewOffsetY: fromViewOffsetY,
      viewWidth: Math.max(size.width, 1),
      viewHeight: Math.max(size.height, 1),
    }
    invalidate()
  }, [camera, invalidate, isPrimaryPressed, size.height, size.width])

  return (
    <OrbitControls
      ref={controlsRef}
      target={[0, 0, 0]}
      minPolarAngle={0.01}
      maxPolarAngle={Math.PI - 0.01}
      minAzimuthAngle={-Infinity}
      maxAzimuthAngle={Infinity}
      minDistance={6}
      maxDistance={48}
      enableDamping={false}
      rotateSpeed={0.9}
      zoomSpeed={1.1}
      panSpeed={0.75}
      screenSpacePanning
      onStart={handleInteractionStart}
      onChange={handleControlsChange}
      onEnd={handleInteractionEnd}
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

function KeyboardAssembly({
  accountForPanelInsets,
  onViewInteractionChange,
  onPrimaryOrbitEnd,
  isPrimaryPressed,
}: {
  accountForPanelInsets: boolean
  onViewInteractionChange?: (isInteracting: boolean) => void
  onPrimaryOrbitEnd: () => void
  isPrimaryPressed: () => boolean
}) {
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
      <CameraController
        contentRef={assemblyRef}
        fitKey={cameraFitKey}
        accountForPanelInsets={accountForPanelInsets}
        onViewInteractionChange={onViewInteractionChange}
        onPrimaryOrbitEnd={onPrimaryOrbitEnd}
        isPrimaryPressed={isPrimaryPressed}
      />

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

export function KeyboardScene({
  accountForPanelInsets = false,
  onViewInteractionChange,
}: {
  accountForPanelInsets?: boolean
  onViewInteractionChange?: (isInteracting: boolean) => void
}) {
  const { deselectAll, setSelectedPart, resetCamera } = useWorkshopStore()
  const interactionRef = useRef({
    orbit: false,
    primaryPress: false,
    primaryDragged: false,
    primaryPointerId: -1,
    primaryStartX: 0,
    primaryStartY: 0,
    wheel: false,
    active: false,
  })
  const wheelEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const returnFrameRef = useRef<number | null>(null)

  const updateInteraction = useCallback((source: "orbit" | "primaryPress" | "wheel", value: boolean) => {
    const interaction = interactionRef.current
    interaction[source] = value
    const isActive = interaction.orbit || interaction.primaryPress || interaction.wheel

    if (isActive !== interaction.active) {
      interaction.active = isActive
      onViewInteractionChange?.(isActive)
    }
  }, [onViewInteractionChange])

  useEffect(() => () => {
    if (wheelEndTimerRef.current) clearTimeout(wheelEndTimerRef.current)
    if (returnFrameRef.current !== null) cancelAnimationFrame(returnFrameRef.current)
    onViewInteractionChange?.(false)
  }, [onViewInteractionChange])

  const handleWheel = () => {
    updateInteraction("wheel", true)
    if (wheelEndTimerRef.current) clearTimeout(wheelEndTimerRef.current)
    wheelEndTimerRef.current = setTimeout(() => {
      wheelEndTimerRef.current = null
      updateInteraction("wheel", false)
    }, 220)
  }

  const handleOrbitInteraction = useCallback((isInteracting: boolean) => {
    updateInteraction("orbit", isInteracting)
  }, [updateInteraction])

  const isPrimaryPressed = useCallback(
    () => interactionRef.current.primaryPress,
    [],
  )

  const requestCameraReturn = useCallback(() => {
    // DOM pointer-up and OrbitControls end normally fire during the same native
    // release. Coalesce both safety paths into one store reset and one return.
    if (returnFrameRef.current !== null) return
    returnFrameRef.current = requestAnimationFrame(() => {
      returnFrameRef.current = null
      resetCamera()
    })
  }, [resetCamera])

  const finishPrimaryInteraction = useCallback(() => {
    const interaction = interactionRef.current
    const wasPressed = interaction.primaryPress
    const wasDragged = interaction.primaryDragged
    interaction.primaryDragged = false
    interaction.primaryPointerId = -1
    updateInteraction("primaryPress", false)
    if (!wasPressed || !wasDragged) return

    // Let the canvas and OrbitControls finish the native pointer-up event
    // before capturing the return animation's starting camera. This removes
    // release-order races that previously produced direction-dependent jumps.
    requestCameraReturn()
  }, [requestCameraReturn, updateInteraction])

  useEffect(() => {
    const handleWindowPointerMove = (event: PointerEvent) => {
      const interaction = interactionRef.current
      if (
        !interaction.primaryPress ||
        interaction.primaryDragged ||
        event.pointerType !== "mouse" ||
        event.pointerId !== interaction.primaryPointerId
      ) return

      const deltaX = event.clientX - interaction.primaryStartX
      const deltaY = event.clientY - interaction.primaryStartY
      if (Math.hypot(deltaX, deltaY) >= PRIMARY_DRAG_THRESHOLD_PX) {
        interaction.primaryDragged = true
      }
    }
    const handleWindowPointerEnd = (event: PointerEvent) => {
      const interaction = interactionRef.current
      if (
        event.pointerType === "mouse" &&
        event.pointerId === interaction.primaryPointerId &&
        (event.type === "pointercancel" || event.button === 0)
      ) {
        finishPrimaryInteraction()
      }
    }
    const handleWindowBlur = () => finishPrimaryInteraction()

    // Window-level movement distinguishes an actual orbit drag from a click,
    // even after the pointer leaves the canvas. The end listeners are the final
    // safety net for releases over 3D children, outside the canvas, or before
    // window blur. finishPrimaryInteraction is idempotent, so local handlers
    // remain safe.
    window.addEventListener("pointermove", handleWindowPointerMove, true)
    window.addEventListener("pointerup", handleWindowPointerEnd, true)
    window.addEventListener("pointercancel", handleWindowPointerEnd, true)
    window.addEventListener("blur", handleWindowBlur)
    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove, true)
      window.removeEventListener("pointerup", handleWindowPointerEnd, true)
      window.removeEventListener("pointercancel", handleWindowPointerEnd, true)
      window.removeEventListener("blur", handleWindowBlur)
    }
  }, [finishPrimaryInteraction])

  return (
    <div
      className="w-full h-full"
      aria-label="Interactive 3D keyboard preview"
      onPointerDownCapture={(event) => {
        if (event.pointerType === "mouse" && event.button === 0) {
          if (returnFrameRef.current !== null) {
            cancelAnimationFrame(returnFrameRef.current)
            returnFrameRef.current = null
          }
          const interaction = interactionRef.current
          interaction.primaryDragged = false
          interaction.primaryPointerId = event.pointerId
          interaction.primaryStartX = event.clientX
          interaction.primaryStartY = event.clientY
          updateInteraction("primaryPress", true)
        }
      }}
      onPointerUpCapture={(event) => {
        if (event.pointerType === "mouse" && event.button === 0) {
          finishPrimaryInteraction()
        }
      }}
      onPointerCancelCapture={finishPrimaryInteraction}
      onLostPointerCapture={finishPrimaryInteraction}
      onWheelCapture={handleWheel}
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
          <KeyboardAssembly
            accountForPanelInsets={accountForPanelInsets}
            onViewInteractionChange={handleOrbitInteraction}
            onPrimaryOrbitEnd={requestCameraReturn}
            isPrimaryPressed={isPrimaryPressed}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
