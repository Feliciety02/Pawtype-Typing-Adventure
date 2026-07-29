"use client"
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import type { KnobCustomization } from "../types"

type Props = {
  position: [number, number, number]
  knob: KnobCustomization
  radius: number
  explodeOffset?: number
  onClick?: () => void
}

export function KeyboardKnob3D({ position, knob, radius, explodeOffset = 0, onClick }: Props) {
  const knobRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (knobRef.current && knob.glow) {
      knobRef.current.rotation.y += delta * 0.3
    }
  })

  if (!knob.enabled) return null

  const color = new THREE.Color(knob.color)
  const h = knob.height

  function KnobShape() {
    switch (knob.shape) {
      case "cylinder":
        return (
          <mesh>
            <cylinderGeometry args={[radius * 0.92, radius, h, 16]} />
            <meshLambertMaterial color={color} flatShading />
          </mesh>
        )
      case "crystal":
        return (
          <mesh>
            <coneGeometry args={[radius, h, 6]} />
            <meshLambertMaterial color={color} flatShading transparent opacity={0.85} />
          </mesh>
        )
      case "gear":
        return (
          <mesh>
            <cylinderGeometry args={[radius, radius, h, 10]} />
            <meshLambertMaterial color={color} flatShading />
          </mesh>
        )
      case "potion":
        return (
          <group>
            <mesh position={[0, -h * 0.12, 0]}>
              <sphereGeometry args={[radius * 0.78, 16, 12]} />
              <meshStandardMaterial color={color} roughness={0.22} metalness={0.08} transparent opacity={0.9} />
            </mesh>
            <mesh position={[0, h * 0.38, 0]}>
              <cylinderGeometry args={[radius * 0.28, radius * 0.34, h * 0.32, 10]} />
              <meshStandardMaterial color="#d7d9dc" roughness={0.35} metalness={0.65} />
            </mesh>
          </group>
        )
      case "star-dial":
        return (
          <mesh rotation={[0, Math.PI / 4, 0]}>
            <cylinderGeometry args={[radius, radius * 0.82, h, 8]} />
            <meshStandardMaterial color={color} roughness={0.28} metalness={0.45} />
          </mesh>
        )
      case "mushroom":
        return (
          <group>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[radius * 0.52, radius * 0.6, h * 0.6, 8]} />
              <meshLambertMaterial color={color} flatShading />
            </mesh>
            <mesh position={[0, h * 0.45, 0]}>
              <sphereGeometry args={[radius, 10, 8]} />
              <meshLambertMaterial color={new THREE.Color(knob.color).lerp(new THREE.Color("#cc2222"), 0.5)} flatShading />
            </mesh>
          </group>
        )
      case "wooden-dial":
      default:
        return (
          <group>
            <mesh>
              <cylinderGeometry args={[radius * 0.96, radius * 1.08, h, 16]} />
              <meshLambertMaterial color={color} flatShading />
            </mesh>
            {/* Grip lines */}
            {Array.from({ length: 8 }).map((_, i) => (
              <mesh key={i} rotation={[0, (i / 8) * Math.PI * 2, 0]} position={[radius * 0.96, h * 0.1, 0]}>
                <boxGeometry args={[0.04, h * 0.6, 0.04]} />
                <meshLambertMaterial color={new THREE.Color(color).lerp(new THREE.Color("#000"), 0.3)} flatShading />
              </mesh>
            ))}
          </group>
        )
    }
  }

  return (
    <group ref={knobRef} position={[position[0], position[1] + explodeOffset, position[2]]} onClick={(event) => { event.stopPropagation(); onClick?.() }}>
      <KnobShape />
      {knob.glow && <pointLight color={knob.glowColor} intensity={1.2} distance={2.4} />}
    </group>
  )
}
