"use client"
import { useMemo } from "react"
import * as THREE from "three"
import type { KeyPosition } from "../layout-data"
import type { SwitchCustomization } from "../types"
import { DEFAULT_SWITCH } from "../defaults"

type Props = {
  positions: KeyPosition[]
  switches: Record<string, SwitchCustomization>
  pressedKeys?: Set<string>
  explodeOffset?: number
}

export function KeyboardSwitch3D({ positions, switches, pressedKeys = new Set(), explodeOffset = 0 }: Props) {
  return (
    <group position={[0, explodeOffset + 0.09, 0]}>
      {positions.map((pos) => {
        const sw = switches[pos.keyId] ?? DEFAULT_SWITCH
        const isPressed = pressedKeys.has(pos.keyId)
        const housingColor = new THREE.Color(sw.housingColor)
        const stemColor = new THREE.Color(sw.stemColor)

        return (
          <group key={pos.keyId} position={[pos.x, 0, -pos.y]}>
            {/* Housing */}
            <mesh>
              <boxGeometry args={[0.55, 0.22, 0.55]} />
              <meshLambertMaterial color={housingColor} flatShading />
            </mesh>
            {/* Stem */}
            <mesh position={[0, isPressed ? 0.04 : 0.1, 0]}>
              <boxGeometry args={[0.14, 0.14, 0.14]} />
              <meshLambertMaterial color={stemColor} flatShading />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}
