"use client"
import { useMemo } from "react"
import * as THREE from "three"
import { Text } from "@react-three/drei"
import type { BadgeCustomization } from "../types"

type Props = {
  position: [number, number, number]
  badge: BadgeCustomization
  onClick?: () => void
}

const PAW_PATHS = [
  { x: 0, z: 0, r: 0.07 },
  { x: -0.09, z: -0.07, r: 0.04 },
  { x: 0.09, z: -0.07, r: 0.04 },
  { x: -0.13, z: -0.15, r: 0.035 },
  { x: 0.13, z: -0.15, r: 0.035 },
]

export function KeyboardBadge3D({ position, badge, onClick }: Props) {
  const color = useMemo(() => new THREE.Color(badge.color), [badge.color])
  if (!badge.enabled || badge.type === "none") return null

  return (
    <group position={position} onClick={(event) => { event.stopPropagation(); onClick?.() }}>
      {/* Badge plate */}
      <mesh>
        <boxGeometry args={[0.5, 0.06, 0.3]} />
        <meshLambertMaterial color={new THREE.Color(badge.color).lerp(new THREE.Color("#000"), 0.3)} flatShading />
      </mesh>

      {badge.type === "paw" && PAW_PATHS.map((p, i) => (
        <mesh key={i} position={[p.x, 0.04, p.z]}>
          <cylinderGeometry args={[p.r, p.r, 0.03, 8]} />
          <meshLambertMaterial color={color} flatShading />
        </mesh>
      ))}

      {(badge.type === "initial" || badge.type === "rune") && (
        <Text
          position={[0, 0.04, 0]}
          fontSize={0.15}
          color={badge.color}
          anchorX="center"
          anchorY="middle"
          font="/fonts/Geist-Bold.ttf"
          rotation={[-Math.PI / 2, 0, 0]}
        >
          {badge.text || "P"}
        </Text>
      )}
    </group>
  )
}
