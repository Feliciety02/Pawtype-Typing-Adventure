"use client"
import { useRef, useMemo, useCallback, useEffect, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Html, Text, useTexture } from "@react-three/drei"
import * as THREE from "three"
import type { KeyPosition } from "../layout-data"
import type { KeyCustomization } from "../types"

// ─── Keycap profile definitions ───────────────────────────────────────────────
// Each profile defines how much the top face is inset from the base,
// the keycap height, and front-wall taper.

const PROFILES: Record<string, {
  topScaleX: number
  topScaleZ: number
  height: number
  /** How far back the top is shifted (sculpted tilt) */
  topShiftZ: number
}> = {
  // "Classic Sculpted" — the primary profile for V1
  "cherry": {
    topScaleX:  0.95,
    topScaleZ:  0.93,
    height:     0.28,
    topShiftZ:  0.01,
  },
  "pixel-flat": {
    topScaleX:  0.92,
    topScaleZ:  0.90,
    height:     0.28,
    topShiftZ:  0.0,
  },
  "oem": {
    topScaleX:  0.86,
    topScaleZ:  0.82,
    height:     0.50,
    topShiftZ:  0.015,
  },
  "xda": {
    topScaleX:  0.91,
    topScaleZ:  0.89,
    height:     0.38,
    topShiftZ:  0.0,
  },
  "dsa": {
    topScaleX:  0.92,
    topScaleZ:  0.90,
    height:     0.34,
    topShiftZ:  0.0,
  },
  "sa": {
    topScaleX:  0.84,
    topScaleZ:  0.80,
    height:     0.62,
    topShiftZ:  0.02,
  },
  "rounded-fantasy": {
    topScaleX:  0.86,
    topScaleZ:  0.82,
    height:     0.44,
    topShiftZ:  0.01,
  },
  "artisan": {
    topScaleX:  0.84,
    topScaleZ:  0.80,
    height:     0.58,
    topShiftZ:  0.015,
  },
  "crystal": {
    topScaleX:  0.88,
    topScaleZ:  0.84,
    height:     0.42,
    topShiftZ:  0.01,
  },
  "stone": {
    topScaleX:  0.87,
    topScaleZ:  0.83,
    height:     0.46,
    topShiftZ:  0.01,
  },
  "typewriter": {
    topScaleX:  0.78,
    topScaleZ:  0.74,
    height:     0.55,
    topShiftZ:  0.0,
  },
}

function getLegendFontSize(label: string, keyWidth: number, keyDepth: number) {
  const base = Math.min(keyWidth, keyDepth) * 0.28
  if (label.length >= 9) return base * 0.5
  if (label.length >= 6) return base * 0.65
  if (label.length >= 3) return base * 0.82
  return base
}

// ─── Geometry builder ─────────────────────────────────────────────────────────
// Builds a frustum-like keycap body: rectangular base, slightly smaller and
// raised top face. Uses 10 faces (6 quads = 12 triangles) for proper normals.

function buildKeycapGeometry(w: number, d: number, profile: string): THREE.BufferGeometry {
  const p = PROFILES[profile] ?? PROFILES["cherry"]
  const h = p.height
  const tw = w * p.topScaleX
  const td = d * p.topScaleZ
  const sz = p.topShiftZ * d  // slight backward tilt of top face

  const hw = w / 2, hd = d / 2
  const thw = tw / 2, thd = td / 2

  // 8 corners: 4 base (y=0), 4 top (y=h, inset, slight back shift)
  const verts = new Float32Array([
    // base — front-left, front-right, back-right, back-left
    -hw, 0,  hd,   // 0
     hw, 0,  hd,   // 1
     hw, 0, -hd,   // 2
    -hw, 0, -hd,   // 3
    // top — front-left, front-right, back-right, back-left
    -thw, h,  thd - sz,   // 4
     thw, h,  thd - sz,   // 5
     thw, h, -thd - sz,   // 6
    -thw, h, -thd - sz,   // 7
  ])

  const idx: number[] = [
    // top face
    4, 5, 6,   4, 6, 7,
    // bottom face (facing down)
    0, 1, 2,   0, 2, 3,
    // front face (z positive)
    0, 5, 1,   0, 4, 5,
    // back face (z negative)
    2, 3, 7,   2, 7, 6,
    // left face (x negative)
    3, 0, 4,   3, 4, 7,
    // right face (x positive)
    1, 2, 6,   1, 6, 5,
  ]

  const geo = new THREE.BufferGeometry()
  geo.setAttribute("position", new THREE.BufferAttribute(verts, 3))
  geo.setIndex(idx)
  // Top face first, then the keycap walls. This makes the color controls
  // independently visible in the 3D preview.
  geo.clearGroups()
  geo.addGroup(0, 6, 0)
  geo.addGroup(6, idx.length - 6, 1)
  geo.computeVertexNormals()
  return geo
}

// ─── Selection outline geometry (slightly enlarged) ────────────────────────

// ─── Component ────────────────────────────────────────────────────────────────

type Props = {
  position: KeyPosition
  customization: KeyCustomization
  isSelected: boolean
  isPressed: boolean
  isHovered: boolean
  onClick: (id: string, multi: boolean) => void
  explodeOffset?: number
}

function KeycapArtwork({ source, wrap, width, depth, height, scale }: { source: string; wrap: boolean; width: number; depth: number; height: number; scale: number }) {
  const texture = useTexture(source)
  useEffect(() => { texture.wrapS = THREE.RepeatWrapping; texture.wrapT = THREE.RepeatWrapping; texture.repeat.set(scale, scale); texture.needsUpdate = true }, [texture, scale])
  const image = () => <meshBasicMaterial map={texture} transparent alphaTest={0.03} side={THREE.DoubleSide} />
  return <group>
    <mesh position={[0, height + .012, 0]} rotation={[-Math.PI / 2, 0, 0]}>{image()}<planeGeometry args={[width * .94, depth * .92]} /></mesh>
    {wrap && <><mesh position={[0, height / 2, depth / 2 + .003]}>{image()}<planeGeometry args={[width, height]} /></mesh><mesh position={[0, height / 2, -depth / 2 - .003]} rotation={[0, Math.PI, 0]}>{image()}<planeGeometry args={[width, height]} /></mesh><mesh position={[-width / 2 - .003, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>{image()}<planeGeometry args={[depth, height]} /></mesh><mesh position={[width / 2 + .003, height / 2, 0]} rotation={[0, Math.PI / 2, 0]}>{image()}<planeGeometry args={[depth, height]} /></mesh></>}
  </group>
}

export function KeyboardKeycap3D({
  position,
  customization,
  isSelected,
  isPressed,
  onClick,
  explodeOffset = 0,
}: Props) {
  const [hovered, setHovered] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const groupRef = useRef<THREE.Group>(null)
  const currentY = useRef(0)
  const PRESS_DEPTH = -0.09

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const target = isPressed || isClicking ? PRESS_DEPTH : isSelected ? 0.025 : hovered ? 0.012 : 0
    currentY.current += (target - currentY.current) * Math.min(1, delta * 20)
    groupRef.current.position.y = currentY.current + explodeOffset
  })

  // Keep neighbouring keycaps close enough to read as one finished keyboard,
  // while retaining a narrow physical seam for separation.
  const w = position.width  * 0.998
  const d = position.depth  * 0.998

  const geo = useMemo(
    () => buildKeycapGeometry(w, d, customization.profile),
    [w, d, customization.profile]
  )

  const topColor = useMemo(
    () => new THREE.Color(customization.colors.top),
    [customization.colors.top]
  )
  const materialProps = useMemo(() => customization.material === "silver" ? { roughness: .26, metalness: .8 } : customization.material === "walnut" ? { roughness: .72, metalness: 0 } : { roughness: .46, metalness: .03 }, [customization.material])
  const keycapHeight = PROFILES[customization.profile]?.height ?? .4

  const handleClick = useCallback(
    (e: { stopPropagation?: () => void; shiftKey?: boolean }) => {
      e.stopPropagation?.()
      setIsClicking(true)
      window.setTimeout(() => setIsClicking(false), 120)
      onClick(position.keyId, e.shiftKey ?? false)
    },
    [position.keyId, onClick]
  )

  // The printed legend identifies the physical key and is fixed by the layout.
  const primaryLegend = position.primaryLegend
  const legendColor = customization.legend.color

  // Determine if secondary legend should show
  const showSecondary = !!(
    position.secondaryLegend &&
    customization.legend.visible
  )
  const showPrimary = customization.legend.visible && !!primaryLegend

  return (
    <group
      ref={groupRef}
      position={[position.x, explodeOffset, -position.y]}
    >
      {/* Main keycap body */}
      <mesh
        geometry={geo}
        // @ts-ignore
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        // Keycaps cast a soft shadow onto the plate, but never receive one
        // from a neighbouring cap. This prevents dark square artifacts.
        receiveShadow={false}
      >
        {/* Use one material on every face so a keycap remains a solid color. */}
        <meshStandardMaterial color={topColor} side={THREE.DoubleSide} {...materialProps} />
        <meshStandardMaterial color={topColor} side={THREE.DoubleSide} {...materialProps} />
      </mesh>

      {customization.artwork.source && <KeycapArtwork source={customization.artwork.source} wrap={customization.artwork.mapping === "full-wrap"} width={w} depth={d} height={keycapHeight} scale={customization.artwork.scale} />}

      {/* Selection outline — slightly larger, rendered as back-face only */}

      {/* Legends via Html overlay — rendered at top face center */}
      {(showPrimary || showSecondary) && (
        <group
          position={[0, keycapHeight + 0.016, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          {showPrimary && (
            <Text
              position={[0, 0, 0]}
              fontSize={getLegendFontSize(showSecondary ? `${primaryLegend} ${position.secondaryLegend}` : primaryLegend, w, d) * Math.max(0.45, customization.legend.size / 0.35)}
              color={legendColor}
              anchorX="center"
              anchorY="middle"
              maxWidth={w * 0.78}
            >
              {showSecondary ? `${primaryLegend} ${position.secondaryLegend}` : primaryLegend}
            </Text>
          )}
        </group>
      )}
      {false && hovered && !isSelected && (
        <Html position={[0, 0.9, 0]} center style={{ pointerEvents: "none" }}>
          <div style={{ background: "#202428", color: "#f2f4f5", border: "1px solid #8c969e", borderRadius: 4, fontSize: 10, padding: "3px 6px", whiteSpace: "nowrap" }}>
            {primaryLegend} · click to edit
          </div>
        </Html>
      )}
    </group>
  )
}
