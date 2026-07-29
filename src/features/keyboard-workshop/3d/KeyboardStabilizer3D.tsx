"use client"
import { useMemo } from "react"
import * as THREE from "three"
import type { KeyPosition } from "../layout-data"
import type { StabilizerCustomization } from "../types"
import { STABILIZER_KEYS } from "../layout-data"

type Props = {
  positions: KeyPosition[]
  stabilizers: StabilizerCustomization
  explodeOffset?: number
}

export function KeyboardStabilizer3D({ positions, stabilizers, explodeOffset = 0 }: Props) {
  const stabPositions = positions.filter((p) => STABILIZER_KEYS.has(p.keyId))
  const housingColor = useMemo(() => new THREE.Color(stabilizers.housingColor), [stabilizers.housingColor])
  const wireColor = useMemo(() => new THREE.Color(stabilizers.wireColor), [stabilizers.wireColor])

  return (
    <group position={[0, explodeOffset + 0.06, 0]}>
      {stabPositions.map((pos) => {
        const wireSpan = pos.width * 0.7
        return (
          <group key={pos.keyId} position={[pos.x, 0, -pos.y]}>
            {/* Left housing */}
            <mesh position={[-wireSpan / 2, 0.04, 0]}>
              <boxGeometry args={[0.14, 0.16, 0.14]} />
              <meshLambertMaterial color={housingColor} flatShading />
            </mesh>
            {/* Right housing */}
            <mesh position={[wireSpan / 2, 0.04, 0]}>
              <boxGeometry args={[0.14, 0.16, 0.14]} />
              <meshLambertMaterial color={housingColor} flatShading />
            </mesh>
            {/* Wire */}
            <mesh position={[0, 0.04, 0]}>
              <boxGeometry args={[wireSpan, 0.03, 0.03]} />
              <meshLambertMaterial color={wireColor} flatShading />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}
