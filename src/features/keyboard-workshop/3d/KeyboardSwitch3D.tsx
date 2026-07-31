"use client"
import { useCallback, useEffect, useRef } from "react"
import * as THREE from "three"
import type { KeyPosition } from "../layout-data"
import type { SwitchCustomization } from "../types"
import { DEFAULT_SWITCH } from "../defaults"
import { useWorkshopTypingStore } from "../store"

type Props = {
  positions: KeyPosition[]
  switches: Record<string, SwitchCustomization>
  explodeOffset?: number
}

export function KeyboardSwitch3D({ positions, switches, explodeOffset = 0 }: Props) {
  const stemRefs = useRef(new Map<string, THREE.Mesh>())
  const registerStem = useCallback((keyId: string, stem: THREE.Mesh | null) => {
    if (!stem) {
      stemRefs.current.delete(keyId)
      return
    }
    stemRefs.current.set(keyId, stem)
    stem.position.y = useWorkshopTypingStore
      .getState()
      .pressedKeys.has(keyId)
      ? 0.04
      : 0.1
  }, [])

  useEffect(
    () =>
      useWorkshopTypingStore.subscribe((state, previousState) => {
        if (state.pressedKeys === previousState.pressedKeys) return

        for (const keyId of state.pressedKeys) {
          if (!previousState.pressedKeys.has(keyId)) {
            const stem = stemRefs.current.get(keyId)
            if (stem) stem.position.y = 0.04
          }
        }
        for (const keyId of previousState.pressedKeys) {
          if (!state.pressedKeys.has(keyId)) {
            const stem = stemRefs.current.get(keyId)
            if (stem) stem.position.y = 0.1
          }
        }
      }),
    [],
  )

  return (
    <group position={[0, explodeOffset + 0.09, 0]}>
      {positions.map((pos) => {
        const sw = switches[pos.keyId] ?? DEFAULT_SWITCH
        return (
          <KeyboardSwitch
            key={pos.keyId}
            position={pos}
            customization={sw}
            registerStem={registerStem}
          />
        )
      })}
    </group>
  )
}

function KeyboardSwitch({
  position,
  customization,
  registerStem,
}: {
  position: KeyPosition
  customization: SwitchCustomization
  registerStem: (keyId: string, stem: THREE.Mesh | null) => void
}) {
  return (
    <group position={[position.x, 0, -position.y]}>
      <mesh>
        <boxGeometry args={[0.55, 0.22, 0.55]} />
        <meshLambertMaterial color={customization.housingColor} flatShading />
      </mesh>
      <mesh
        ref={(stem) => registerStem(position.keyId, stem)}
        position={[0, 0.1, 0]}
      >
        <boxGeometry args={[0.14, 0.14, 0.14]} />
        <meshLambertMaterial color={customization.stemColor} flatShading />
      </mesh>
    </group>
  )
}
