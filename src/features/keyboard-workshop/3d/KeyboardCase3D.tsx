"use client"
import { useMemo } from "react"
import { RoundedBox } from "@react-three/drei"
import * as THREE from "three"
import type { CaseCustomization, KeyboardCaseConfig } from "../types"

type Props = {
  bounds: { minX: number; maxX: number; minY: number; maxY: number; w: number; h: number }
  caseConfig: CaseCustomization
  modelCaseConfig?: KeyboardCaseConfig
  explodeOffset?: number
  onClick?: () => void
}

// Default case config for layouts without a model (65%, 60%)
const DEFAULT_MODEL_CASE: KeyboardCaseConfig = {
  bezelX:      0.40,
  bezelTop:    0.50,
  bezelBottom: 0.65,
  cornerRadius: 0.12,
  caseHeight:  0.44,
  bottomHeight: 0.28,
  typingAngle: 6,
}

export function KeyboardCase3D({
  bounds,
  caseConfig,
  modelCaseConfig,
  explodeOffset = 0,
  onClick,
}: Props) {
  const mc = modelCaseConfig ?? DEFAULT_MODEL_CASE

  const caseW = bounds.w + mc.bezelX * 2 + (mc.rightExtension ?? 0)
  const caseH = bounds.h + mc.bezelTop + mc.bezelBottom
  const ch    = mc.caseHeight
  const bh    = mc.bottomHeight

  // Center offset: if there is a right extension, shift the case center right slightly
  const centerOffsetX = (mc.rightExtension ?? 0) / 2
  // The case center in Y (3D Z) shifts toward the front bezel
  const centerOffsetZ = (mc.bezelBottom - mc.bezelTop) / 2

  const mainColor = useMemo(() => new THREE.Color(caseConfig.mainColor), [caseConfig.mainColor])
  const sideColor = useMemo(() => new THREE.Color(caseConfig.sideColor), [caseConfig.sideColor])
  const cornerRadius = caseConfig.cornerStyle === "sharp"
    ? 0
    : Math.min(mc.cornerRadius, caseConfig.cornerStyle === "beveled" ? 0.08 : mc.cornerRadius)

  // Screw positions (four corners, two per side rail)
  const screwPositions: [number, number, number][] = [
    [ caseW / 2 - 0.25 + centerOffsetX, ch / 2 + 0.005, -caseH / 2 + 0.22 + centerOffsetZ],
    [-caseW / 2 + 0.25 + centerOffsetX, ch / 2 + 0.005, -caseH / 2 + 0.22 + centerOffsetZ],
    [ caseW / 2 - 0.25 + centerOffsetX, ch / 2 + 0.005,  caseH / 2 - 0.22 + centerOffsetZ],
    [-caseW / 2 + 0.25 + centerOffsetX, ch / 2 + 0.005,  caseH / 2 - 0.22 + centerOffsetZ],
  ]

  return (
    <group onClick={(event) => { event.stopPropagation(); onClick?.() }}>
      {/* ── Top case body ── */}
      <group position={[centerOffsetX, explodeOffset, centerOffsetZ]}>
        {/* One continuous, rounded shell keeps the outer sides clean. */}
        {cornerRadius > 0 ? (
          <RoundedBox args={[caseW, ch, caseH]} radius={cornerRadius} smoothness={4} castShadow receiveShadow>
            <meshLambertMaterial color={mainColor} flatShading />
          </RoundedBox>
        ) : (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[caseW, ch, caseH]} />
            <meshLambertMaterial color={mainColor} flatShading />
          </mesh>
        )}

        {/* Inner recess — darker plate mount surface */}
        <mesh position={[0, ch / 2 + 0.008, 0]} receiveShadow>
          <boxGeometry args={[bounds.w + 0.08, 0.018, bounds.h + 0.08]} />
          <meshLambertMaterial color={sideColor} flatShading />
        </mesh>

        {/* Screw heads */}
        {screwPositions.map((pos, i) => (
          <mesh key={i} position={pos}>
            <cylinderGeometry args={[0.038, 0.038, 0.014, 8]} />
            <meshLambertMaterial color={sideColor} flatShading />
          </mesh>
        ))}
      </group>

      {/* ── Bottom case ── */}
      <group position={[centerOffsetX, explodeOffset * -0.8, centerOffsetZ]}>
        {/* Bottom slab */}
        {cornerRadius > 0 ? (
          <RoundedBox
            args={[caseW, bh, caseH]}
            radius={Math.min(cornerRadius, bh / 2)}
            smoothness={4}
            position={[0, -ch / 2 - bh / 2, 0]}
            castShadow
            receiveShadow
          >
            <meshLambertMaterial color={sideColor} flatShading />
          </RoundedBox>
        ) : (
          <mesh position={[0, -ch / 2 - bh / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[caseW, bh, caseH]} />
            <meshLambertMaterial color={sideColor} flatShading />
          </mesh>
        )}

        {/* Rubber feet — four corners */}
        {[
          [-caseW / 2 + 0.28,  -ch / 2 - bh - 0.04, -caseH / 2 + 0.25],
          [ caseW / 2 - 0.28,  -ch / 2 - bh - 0.04, -caseH / 2 + 0.25],
          [-caseW / 2 + 0.28,  -ch / 2 - bh - 0.04,  caseH / 2 - 0.25],
          [ caseW / 2 - 0.28,  -ch / 2 - bh - 0.04,  caseH / 2 - 0.25],
        ].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]}>
            <cylinderGeometry args={[0.10, 0.11, 0.08, 8]} />
            <meshLambertMaterial color={new THREE.Color("#222")} flatShading />
          </mesh>
        ))}
      </group>
    </group>
  )
}
