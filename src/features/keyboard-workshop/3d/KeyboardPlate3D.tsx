"use client"
import { useMemo } from "react"
import * as THREE from "three"
import type { PlateCustomization } from "../types"

type Props = {
  bounds: { w: number; h: number }
  plateConfig: PlateCustomization
  explodeOffset?: number
  onClick?: () => void
}

export function KeyboardPlate3D({ bounds, plateConfig, explodeOffset = 0, onClick }: Props) {
  const color = useMemo(() => new THREE.Color(plateConfig.color), [plateConfig.color])

  return (
    <group position={[0, explodeOffset, 0]} onClick={(event) => { event.stopPropagation(); onClick?.() }}>
      <mesh receiveShadow castShadow>
        <boxGeometry args={[bounds.w + 0.08, 0.08, bounds.h + 0.08]} />
        <meshLambertMaterial color={color} flatShading />
      </mesh>
    </group>
  )
}
