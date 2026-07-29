"use client"
import { useMemo } from "react"
import * as THREE from "three"
import type { FrameCustomization } from "../types"

type Props = {
  bounds: { w: number; h: number }
  frameConfig: FrameCustomization
  explodeOffset?: number
  onClick?: () => void
}

const FRAME_STYLE_COLORS: Record<string, { outer: string; inner: string; corner: string }> = {
  minimal:         { outer: "#8b6840", inner: "#6b4820", corner: "#a07840" },
  explorer:        { outer: "#5c4030", inner: "#3c2010", corner: "#7c6040" },
  forest:          { outer: "#4a6a30", inner: "#2a4a10", corner: "#6a8a50" },
  sakura:          { outer: "#c88090", inner: "#a86070", corner: "#e8a0b0" },
  royal:           { outer: "#2a2a5a", inner: "#1a1a3a", corner: "#c8a830" },
  stardust:        { outer: "#2a1a50", inner: "#1a0a30", corner: "#9060d0" },
  "tide-pool":     { outer: "#1a3a4a", inner: "#0a2030", corner: "#40a0b0" },
  cafe:            { outer: "#6b3a1f", inner: "#4b2a0f", corner: "#d4854a" },
  blacksmith:      { outer: "#2a2420", inner: "#1a1410", corner: "#806030" },
  "ancient-library":{ outer: "#3a2a1a", inner: "#2a1a0a", corner: "#c8a040" },
  crystal:         { outer: "#3a5a7a", inner: "#2a4a6a", corner: "#80c0e0" },
  custom:          { outer: "#6b4820", inner: "#4b2800", corner: "#a07840" },
}

export function KeyboardFrame3D({ bounds, frameConfig, explodeOffset = 0, onClick }: Props) {
  const { w, h } = bounds
  const fw = 0.35 // frame width (each side)
  const fh = 0.12  // frame height

  const style = FRAME_STYLE_COLORS[frameConfig.style] ?? FRAME_STYLE_COLORS.minimal
  const mainColor = useMemo(() => new THREE.Color(frameConfig.mainColor || style.outer), [frameConfig.mainColor, style.outer])
  const accentColor = useMemo(() => new THREE.Color(frameConfig.accentColor || style.corner), [frameConfig.accentColor, style.corner])

  const outerW = w + fw * 2
  const outerH = h + fw * 2

  // Y position: just above the plate
  const yPos = 0.05 + explodeOffset

  return (
    <group position={[0, yPos, 0]} onClick={(event) => { event.stopPropagation(); onClick?.() }}>
      {/* A frame is a complete ring. Avoid partial top/bottom rails that make the case edge look broken. */}
      {frameConfig.sideRails && (
        <>
          <mesh position={[0, 0, -(h / 2 + fw / 2)]}>
            <boxGeometry args={[outerW, fh, fw]} />
            <meshLambertMaterial color={mainColor} flatShading />
          </mesh>
          <mesh position={[0, 0, h / 2 + fw / 2]}>
            <boxGeometry args={[outerW, fh, fw]} />
            <meshLambertMaterial color={mainColor} flatShading />
          </mesh>
          <mesh position={[-(w / 2 + fw / 2), 0, 0]}>
            <boxGeometry args={[fw, fh, h]} />
            <meshLambertMaterial color={mainColor} flatShading />
          </mesh>
          <mesh position={[w / 2 + fw / 2, 0, 0]}>
            <boxGeometry args={[fw, fh, h]} />
            <meshLambertMaterial color={mainColor} flatShading />
          </mesh>
        </>
      )}

      {/* Corner accents */}
      {frameConfig.cornerDecorations && [
        [-outerW / 2 + fw / 2, 0, -outerH / 2 + fw / 2],
        [outerW / 2 - fw / 2, 0, -outerH / 2 + fw / 2],
        [-outerW / 2 + fw / 2, 0, outerH / 2 - fw / 2],
        [outerW / 2 - fw / 2, 0, outerH / 2 - fw / 2],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[fw, fh + 0.02, fw]} />
          <meshLambertMaterial color={accentColor} flatShading />
        </mesh>
      ))}

      {/* Screw hints */}
      {[
        [-outerW / 2 + 0.22, fh / 2 + 0.01, -outerH / 2 + 0.22],
        [outerW / 2 - 0.22, fh / 2 + 0.01, -outerH / 2 + 0.22],
        [-outerW / 2 + 0.22, fh / 2 + 0.01, outerH / 2 - 0.22],
        [outerW / 2 - 0.22, fh / 2 + 0.01, outerH / 2 - 0.22],
      ].map((pos, i) => (
        <mesh key={`screw-${i}`} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.03, 6]} />
          <meshLambertMaterial color={accentColor} flatShading />
        </mesh>
      ))}
    </group>
  )
}
