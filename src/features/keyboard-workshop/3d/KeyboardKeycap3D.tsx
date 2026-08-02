"use client"
import { useRef, useMemo, useCallback, useEffect, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Html, Text, useTexture } from "@react-three/drei"
import * as THREE from "three"
import type { KeyPosition } from "../layout-data"
import type { KeyCustomization } from "../types"
import { useWorkshopStore, useWorkshopTypingStore } from "../store"
import type { ResolvedKeycapProfile } from "../keycap-profiles"

const SHOW_HOVER_LABEL = false
const FIXED_KEYCAP_PROFILE: ResolvedKeycapProfile = {
  label: "AULA F75 Cherry",
  family: "uniform",
  heightMm: 9.4,
  height: 9.4 / 19.05,
  // Measured from the bundled 1u wall sprite: its opaque top edge is about
  // 59px across a 82px base. Matching that ratio keeps the 3D silhouette
  // hidden directly behind the artwork's own pixel bevel.
  topScaleX: 0.72,
  topScaleZ: 0.72,
  surfaceCurve: 0,
  shoulderRoundness: 0.14,
  topTilt: 0,
  topShiftZ: 0,
  topSurfaceHeight: 9.4 / 19.05,
}
const DEFAULT_SIDE_COLOR = new THREE.Color("#2c0b3d")
const BUNDLED_SIDE_TINT = new THREE.Color("#858585")
const LIGHT_SIDE_TINT = new THREE.Color("#ffffff")
const BUNDLED_SIDE_ASSET_VERSION = "cream-edge-v2"
const CREAM_SIDE_VERTICAL_OVERSCAN_RATIO = 0.04
// Keep the decal just above the wall to avoid z-fighting without extending it
// into the very narrow seam between adjacent keycaps.
const SIDE_ARTWORK_SURFACE_OFFSET = 0.001
const DOMINANT_COLOR_CACHE = new WeakMap<THREE.Texture, string>()
function sampleDominantTextureColor(texture: THREE.Texture) {
  const cached = DOMINANT_COLOR_CACHE.get(texture)
  if (cached) return cached

  const image = texture.image as CanvasImageSource & {
    width?: number
    height?: number
    naturalWidth?: number
    naturalHeight?: number
  }
  const sourceWidth = image?.naturalWidth ?? image?.width ?? 0
  const sourceHeight = image?.naturalHeight ?? image?.height ?? 0
  if (!sourceWidth || !sourceHeight) return null

  try {
    const sampleScale = Math.min(1, 128 / Math.max(sourceWidth, sourceHeight))
    const width = Math.max(1, Math.round(sourceWidth * sampleScale))
    const height = Math.max(1, Math.round(sourceHeight * sampleScale))
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext("2d", { willReadFrequently: true })
    if (!context) return null
    context.drawImage(image, 0, 0, width, height)

    const pixels = context.getImageData(0, 0, width, height).data
    const buckets = new Map<
      number,
      { count: number; red: number; green: number; blue: number }
    >()

    for (let index = 0; index < pixels.length; index += 4) {
      if (pixels[index + 3] < 64) continue
      const red = pixels[index]
      const green = pixels[index + 1]
      const blue = pixels[index + 2]
      const bucketKey = ((red >> 4) << 8) | ((green >> 4) << 4) | (blue >> 4)
      const bucket = buckets.get(bucketKey) ?? {
        count: 0,
        red: 0,
        green: 0,
        blue: 0,
      }
      bucket.count += 1
      bucket.red += red
      bucket.green += green
      bucket.blue += blue
      buckets.set(bucketKey, bucket)
    }

    const dominant = [...buckets.values()].sort(
      (first, second) => second.count - first.count,
    )[0]
    if (!dominant) return null
    const toHex = (value: number) =>
      Math.round(value / dominant.count)
        .toString(16)
        .padStart(2, "0")
    const color = `#${toHex(dominant.red)}${toHex(dominant.green)}${toHex(dominant.blue)}`
    DOMINANT_COLOR_CACHE.set(texture, color)
    return color
  } catch {
    return null
  }
}

function isLightArtworkColor(color: string | null) {
  if (!color || !/^#[\da-f]{6}$/i.test(color)) return false
  const red = Number.parseInt(color.slice(1, 3), 16)
  const green = Number.parseInt(color.slice(3, 5), 16)
  const blue = Number.parseInt(color.slice(5, 7), 16)
  const luminance = red * 0.2126 + green * 0.7152 + blue * 0.0722
  return luminance >= 145
}

function getBundledSideVariant(color: string | null): BundledSideVariant {
  if (isLightArtworkColor(color)) return "royal-cream"
  if (!color || !/^#[\da-f]{6}$/i.test(color)) return "royal-purple"

  const channels = [
    Number.parseInt(color.slice(1, 3), 16),
    Number.parseInt(color.slice(3, 5), 16),
    Number.parseInt(color.slice(5, 7), 16),
  ]
  return Math.max(...channels) - Math.min(...channels) <= 20
    ? "royal-charcoal"
    : "royal-purple"
}

// ─── Keycap profile definitions ───────────────────────────────────────────────
// Each profile defines how much the top face is inset from the base,
// the keycap height, and front-wall taper.

  // "Classic Sculpted" — the primary profile for V1

function getLegendFontSize(label: string, keyWidth: number, keyDepth: number) {
  const base = Math.min(keyWidth, keyDepth) * 0.28
  if (label.length >= 9) return base * 0.5
  if (label.length >= 6) return base * 0.65
  if (label.length >= 3) return base * 0.82
  return base
}

function getTopSurfaceSize(
  width: number,
  depth: number,
  profile: ResolvedKeycapProfile,
) {
  // A wide key extends the flat center span; it does not scale up the bevel.
  // Derive the horizontal inset from a 1u-deep key so Space, modifiers, and
  // normal caps all keep the same physical wall angle.
  const horizontalInset = depth * (1 - profile.topScaleX)
  return {
    width: Math.max(0.01, width - horizontalInset),
    depth: depth * profile.topScaleZ,
  }
}

// ─── Geometry builder ─────────────────────────────────────────────────────────
// Builds a frustum-like keycap body: rectangular base, slightly smaller and
// raised top face. Uses 10 faces (6 quads = 12 triangles) for proper normals.

function buildKeycapGeometry(
  w: number,
  d: number,
): THREE.BufferGeometry {
  const p = FIXED_KEYCAP_PROFILE
  const baseHalfWidth = w / 2
  const baseHalfDepth = d / 2
  const topSurface = getTopSurfaceSize(w, d, p)
  const topHalfWidth = topSurface.width / 2
  const topHalfDepth = topSurface.depth / 2
  const shoulderHeight =
    p.height * (0.72 + p.shoulderRoundness * 0.13)
  const shoulderProgress = shoulderHeight / p.height
  const shoulderHalfWidth =
    baseHalfWidth + (topHalfWidth - baseHalfWidth) * shoulderProgress
  const shoulderHalfDepth =
    baseHalfDepth + (topHalfDepth - baseHalfDepth) * shoulderProgress

  const ring = (
    halfWidth: number,
    halfDepth: number,
    y: (z: number, index: number) => number,
    shiftZ = 0,
  ) => {
    const points: Array<[number, number]> = [
      [-halfWidth, halfDepth],
      [0, halfDepth],
      [halfWidth, halfDepth],
      [halfWidth, 0],
      [halfWidth, -halfDepth],
      [0, -halfDepth],
      [-halfWidth, -halfDepth],
      [-halfWidth, 0],
    ]
    return points.flatMap(([x, z], index) => [x, y(z, index), z - shiftZ])
  }

  const tiltedHeight = (z: number) =>
    p.height + (z / Math.max(0.001, topHalfDepth)) * (p.topTilt / 2)
  const edgeCurve = p.surfaceCurve * 0.32

  // 8 corners: 4 base (y=0), 4 top (y=h, inset, slight back shift)
  /*
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
  */

  const vertices = [
    ...ring(baseHalfWidth, baseHalfDepth, () => 0),
    ...ring(
      shoulderHalfWidth,
      shoulderHalfDepth,
      () => shoulderHeight,
      p.topShiftZ * 0.55,
    ),
    ...ring(
      topHalfWidth,
      topHalfDepth,
      (z, index) =>
        tiltedHeight(z) + (index % 2 === 1 ? edgeCurve : 0),
      p.topShiftZ,
    ),
    0,
    p.height + p.surfaceCurve,
    -p.topShiftZ,
  ]

  const topIndices: number[] = []
  const wallIndices: number[] = []
  const topStart = 16
  const center = 24

  for (let index = 0; index < 8; index += 1) {
    const next = (index + 1) % 8
    topIndices.push(center, topStart + index, topStart + next)
    wallIndices.push(index, 8 + index, 8 + next, index, 8 + next, next)
    wallIndices.push(
      8 + index,
      topStart + index,
      topStart + next,
      8 + index,
      topStart + next,
      8 + next,
    )
  }
  wallIndices.push(0, 4, 2, 0, 6, 4)
  const indices = [...topIndices, ...wallIndices]

  const geo = new THREE.BufferGeometry()
  geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3))
  geo.setIndex(indices)
  // Top face first, then the keycap walls. This makes the color controls
  // independently visible in the 3D preview.
  geo.clearGroups()
  geo.addGroup(0, topIndices.length, 0)
  geo.addGroup(topIndices.length, wallIndices.length, 1)
  geo.computeVertexNormals()
  return geo
}

// ─── Selection outline geometry (slightly enlarged) ────────────────────────

// ─── Component ────────────────────────────────────────────────────────────────

type Props = {
  position: KeyPosition
  customization: KeyCustomization
  isSelected: boolean
  isHovered: boolean
  backlightColor: string
  onClick: (id: string, multi: boolean) => void
  explodeOffset?: number
}

function KeyBacklight({
  width,
  depth,
  color,
  active,
  pressedRef,
}: {
  width: number
  depth: number
  color: string
  active: boolean
  pressedRef: { readonly current: boolean }
}) {
  const materialRef = useRef<THREE.MeshBasicMaterial>(null)
  const intensity = useRef(0.18)

  useFrame((_, delta) => {
    const target = active || pressedRef.current ? 1 : 0.18
    const response = target > intensity.current ? 90 : 28
    intensity.current +=
      (target - intensity.current) * Math.min(1, delta * response)
    if (materialRef.current) materialRef.current.opacity = intensity.current * 0.78
  })

  return (
    <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={-1}>
      <planeGeometry args={[width, depth]} />
      <meshBasicMaterial
        ref={materialRef}
        color={color}
        transparent
        opacity={0.14}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

const SIDE_PROFILE_SIZES = [
  { units: 1, token: "1u" },
  { units: 1.25, token: "1-25u" },
  { units: 1.5, token: "1-5u" },
  { units: 1.75, token: "1-75u" },
  { units: 2, token: "2u" },
  { units: 2.25, token: "2-25u" },
  { units: 2.75, token: "2-75u" },
  { units: 3, token: "3u" },
  { units: 6.25, token: "6-25u" },
  { units: 7, token: "7u" },
] as const

function getSideProfileToken(width: number) {
  return SIDE_PROFILE_SIZES.reduce((closest, candidate) =>
    Math.abs(candidate.units - width) < Math.abs(closest.units - width)
      ? candidate
      : closest
  ).token
}

function configurePixelTexture(texture: THREE.Texture) {
  texture.colorSpace = THREE.SRGBColorSpace
  texture.magFilter = THREE.NearestFilter
  // Transparent sprite pixels contain black RGB data. Mipmapping blends that
  // hidden black into the visible edge at oblique camera angles, producing
  // dark seams around otherwise opaque cream and purple artwork.
  texture.minFilter = THREE.NearestFilter
  texture.generateMipmaps = false
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.needsUpdate = true
}

type SideDirection = "front" | "back" | "left" | "right"
type BundledSideVariant =
  | "royal-purple"
  | "royal-cream"
  | "royal-charcoal"

function buildSideArtworkGeometry(
  direction: SideDirection,
  width: number,
  depth: number,
  profile: ResolvedKeycapProfile,
  verticalOverscan = 0,
) {
  const baseHalfWidth = width / 2
  const baseHalfDepth = depth / 2
  const topSurface = getTopSurfaceSize(width, depth, profile)
  const topHalfWidth = topSurface.width / 2
  const topHalfDepth = topSurface.depth / 2
  const shoulderHeight =
    profile.height * (0.72 + profile.shoulderRoundness * 0.13)
  const shoulderProgress = shoulderHeight / profile.height
  const shoulderHalfWidth =
    baseHalfWidth + (topHalfWidth - baseHalfWidth) * shoulderProgress
  const shoulderHalfDepth =
    baseHalfDepth + (topHalfDepth - baseHalfDepth) * shoulderProgress
  const height = profile.height
  const stretchedHeight = height + verticalOverscan * 2
  const stretchY = (y: number) =>
    (y / height) * stretchedHeight - verticalOverscan
  const profileRows = [
    {
      y: stretchY(0),
      halfWidth: baseHalfWidth,
      halfDepth: baseHalfDepth,
      shiftZ: 0,
    },
    {
      y: stretchY(shoulderHeight),
      halfWidth: shoulderHalfWidth,
      halfDepth: shoulderHalfDepth,
      shiftZ: profile.topShiftZ * 0.55,
    },
    {
      y: stretchY(height),
      halfWidth: topHalfWidth,
      halfDepth: topHalfDepth,
      shiftZ: profile.topShiftZ,
    },
  ]
  const positions = profileRows.flatMap(
    ({ y, halfWidth, halfDepth, shiftZ }) =>
      direction === "front"
        ? [
            -halfWidth, y, halfDepth - shiftZ + SIDE_ARTWORK_SURFACE_OFFSET,
            halfWidth, y, halfDepth - shiftZ + SIDE_ARTWORK_SURFACE_OFFSET,
          ]
        : direction === "back"
          ? [
              halfWidth, y, -halfDepth - shiftZ - SIDE_ARTWORK_SURFACE_OFFSET,
              -halfWidth, y, -halfDepth - shiftZ - SIDE_ARTWORK_SURFACE_OFFSET,
            ]
          : direction === "left"
            ? [
                -halfWidth - SIDE_ARTWORK_SURFACE_OFFSET, y, -halfDepth - shiftZ,
                -halfWidth - SIDE_ARTWORK_SURFACE_OFFSET, y, halfDepth - shiftZ,
              ]
            : [
                halfWidth + SIDE_ARTWORK_SURFACE_OFFSET, y, halfDepth - shiftZ,
                halfWidth + SIDE_ARTWORK_SURFACE_OFFSET, y, -halfDepth - shiftZ,
              ],
  )
  const shoulderV = shoulderHeight / height
  const sideProfile = direction === "left" || direction === "right"
  const uvs = profileRows.flatMap(({ halfWidth, halfDepth }, rowIndex) => {
    // Crop each texture row to the wall's actual span. This preserves the
    // sprite's physical scale while clipping decorative edge pixels that sit
    // outside a keycap's narrowing shoulder or top face.
    const halfSpan = sideProfile ? halfDepth : halfWidth
    const baseHalfSpan = sideProfile ? baseHalfDepth : baseHalfWidth
    const inset = Math.max(0, (1 - halfSpan / baseHalfSpan) / 2)
    const startU = sideProfile ? 1 - inset : inset
    const endU = sideProfile ? inset : 1 - inset
    const v = rowIndex === 0 ? 0 : rowIndex === 1 ? shoulderV : 1
    return [startU, v, endU, v]
  })

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  )
  geometry.setAttribute(
    "uv",
    new THREE.Float32BufferAttribute(uvs, 2),
  )
  geometry.setIndex([
    0, 1, 3,
    0, 3, 2,
    2, 3, 5,
    2, 5, 4,
  ])
  geometry.computeVertexNormals()
  return geometry
}

function KeycapProfileSides({
  width,
  depth,
  profile,
  variant,
  onDominantColor,
}: {
  width: number
  depth: number
  profile: ResolvedKeycapProfile
  variant: BundledSideVariant
  onDominantColor: (color: string) => void
}) {
  const longSideToken = getSideProfileToken(width)
  const shortSideToken = getSideProfileToken(depth)
  const longSidePath =
    `/workshop/keycaps/sides/${variant}/${longSideToken}`
  const shortSidePath =
    `/workshop/keycaps/sides/${variant}/${shortSideToken}`
  const [front, back, left, right] = useTexture([
    `${longSidePath}/back.png?v=${BUNDLED_SIDE_ASSET_VERSION}`,
    `${longSidePath}/front.png?v=${BUNDLED_SIDE_ASSET_VERSION}`,
    `${shortSidePath}/front.png?v=${BUNDLED_SIDE_ASSET_VERSION}`,
    `${shortSidePath}/front.png?v=${BUNDLED_SIDE_ASSET_VERSION}`,
  ])

  useEffect(() => {
    for (const texture of [front, back, left, right]) {
      configurePixelTexture(texture)
    }
    const dominantColor = sampleDominantTextureColor(front)
    if (dominantColor) onDominantColor(dominantColor)
  }, [front, back, left, right, onDominantColor])
  const geometries = useMemo(
    () => {
      const verticalOverscan =
        variant === "royal-cream"
          ? profile.height * CREAM_SIDE_VERTICAL_OVERSCAN_RATIO
          : 0
      return (
      (["front", "back", "left", "right"] as const).map((direction) =>
        buildSideArtworkGeometry(
          direction,
          width,
          depth,
          profile,
          verticalOverscan,
        ),
      )
      )
    },
    [width, depth, profile, variant],
  )

  useEffect(
    () => () => {
      for (const geometry of geometries) geometry.dispose()
    },
    [geometries],
  )

  const material = (texture: THREE.Texture) => (
    <meshBasicMaterial
      map={texture}
      color={variant === "royal-purple" ? BUNDLED_SIDE_TINT : LIGHT_SIDE_TINT}
      transparent
      alphaTest={0.03}
      side={THREE.DoubleSide}
    />
  )

  return (
    <>
      <mesh geometry={geometries[0]}>
        {material(front)}
      </mesh>
      <mesh geometry={geometries[1]}>
        {material(back)}
      </mesh>
      <mesh geometry={geometries[2]}>
        {material(left)}
      </mesh>
      <mesh geometry={geometries[3]}>
        {material(right)}
      </mesh>
    </>
  )
}

function buildTopArtworkGeometry(
  width: number,
  depth: number,
  profile: ResolvedKeycapProfile,
) {
  const topSurface = getTopSurfaceSize(width, depth, profile)
  const halfWidth = topSurface.width / 2
  const halfDepth = topSurface.depth / 2
  const surfaceOffset = 0.004
  const edgeCurve = profile.surfaceCurve * 0.32
  const points: Array<[number, number]> = [
    [-halfWidth, halfDepth],
    [0, halfDepth],
    [halfWidth, halfDepth],
    [halfWidth, 0],
    [halfWidth, -halfDepth],
    [0, -halfDepth],
    [-halfWidth, -halfDepth],
    [-halfWidth, 0],
  ]
  const tiltedHeight = (z: number) =>
    profile.height +
    (z / Math.max(0.001, halfDepth)) * (profile.topTilt / 2)
  const positions = points.flatMap(([x, z], index) => [
    x,
    tiltedHeight(z) +
      (index % 2 === 1 ? edgeCurve : 0) +
      surfaceOffset,
    z - profile.topShiftZ,
  ])
  positions.push(
    0,
    profile.height + profile.surfaceCurve + surfaceOffset,
    -profile.topShiftZ,
  )

  const uvs = points.flatMap(([x, z]) => [
    x / topSurface.width + 0.5,
    0.5 - z / topSurface.depth,
  ])
  uvs.push(0.5, 0.5)

  const indices: number[] = []
  const center = points.length
  for (let index = 0; index < points.length; index += 1) {
    indices.push(center, index, (index + 1) % points.length)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  )
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

function KeycapArtwork({
  source,
  wrap,
  showTop,
  useProfileSides,
  width,
  depth,
  profile,
  scale,
  fit,
  sideVariant,
  onTopDominantColor,
  onSideDominantColor,
}: {
  source: string
  wrap: boolean
  showTop: boolean
  useProfileSides: boolean
  width: number
  depth: number
  profile: ResolvedKeycapProfile
  scale: number
  fit: KeyCustomization["artwork"]["fit"]
  sideVariant: BundledSideVariant
  onTopDominantColor: (color: string) => void
  onSideDominantColor: (color: string) => void
}) {
  const texture = useTexture(source)
  useEffect(() => {
    configurePixelTexture(texture)
    const wrapMode =
      scale === 1 ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping
    texture.wrapS = wrapMode
    texture.wrapT = wrapMode
    texture.repeat.set(scale, scale)
    texture.offset.set(0, 0)
    texture.needsUpdate = true
    const dominantColor = sampleDominantTextureColor(texture)
    if (dominantColor) onTopDominantColor(dominantColor)
  }, [texture, scale, onTopDominantColor])
  const image = () => <meshBasicMaterial map={texture} transparent alphaTest={0.03} side={THREE.DoubleSide} />
  const topSurface = getTopSurfaceSize(width, depth, profile)
  const topAngle = Math.atan2(
    profile.topTilt,
    topSurface.depth,
  )
  const textureImage = texture.image as {
    width?: number
    height?: number
    naturalWidth?: number
    naturalHeight?: number
  }
  const textureWidth = textureImage?.naturalWidth ?? textureImage?.width ?? 1
  const textureHeight = textureImage?.naturalHeight ?? textureImage?.height ?? 1
  const textureAspect = textureWidth / Math.max(1, textureHeight)
  const surfaceAspect = topSurface.width / topSurface.depth
  const preserveArtworkAspect = fit === "contain"
  const artworkWidth =
    preserveArtworkAspect && textureAspect < surfaceAspect
      ? topSurface.depth * textureAspect
      : topSurface.width
  const artworkDepth =
    preserveArtworkAspect && textureAspect > surfaceAspect
      ? topSurface.width / textureAspect
      : topSurface.depth
  const wrappedTopGeometry = useMemo(
    () => buildTopArtworkGeometry(width, depth, profile),
    [width, depth, profile],
  )
  useEffect(
    () => () => wrappedTopGeometry.dispose(),
    [wrappedTopGeometry],
  )
  const height = profile.topSurfaceHeight
  return <group>
    {showTop && (fit === "stretch"
      ? <mesh geometry={wrappedTopGeometry}>{image()}</mesh>
      : <mesh position={[0, height + .012, -profile.topShiftZ]} rotation={[-Math.PI / 2 - topAngle, 0, 0]}>{image()}<planeGeometry args={[artworkWidth, artworkDepth]} /></mesh>)}
    {wrap && (useProfileSides
      ? <KeycapProfileSides width={width} depth={depth} profile={profile} variant={sideVariant} onDominantColor={onSideDominantColor} />
      : <><mesh position={[0, height / 2, depth / 2 + .003]}>{image()}<planeGeometry args={[width, height]} /></mesh><mesh position={[0, height / 2, -depth / 2 - .003]} rotation={[0, Math.PI, 0]}>{image()}<planeGeometry args={[width, height]} /></mesh><mesh position={[-width / 2 - .003, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>{image()}<planeGeometry args={[depth, height]} /></mesh><mesh position={[width / 2 + .003, height / 2, 0]} rotation={[0, Math.PI / 2, 0]}>{image()}<planeGeometry args={[depth, height]} /></mesh></>)}
  </group>
}

export function KeyboardKeycap3D({
  position,
  customization,
  isSelected,
  backlightColor,
  onClick,
  explodeOffset = 0,
}: Props) {
  const [hovered, setHovered] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [artworkPalette, setArtworkPalette] = useState<{
    source: string | null
    top: string | null
    side: string | null
  }>({
    source: null,
    top: null,
    side: null,
  })
  const isPressedRef = useRef(
    useWorkshopTypingStore.getState().pressedKeys.has(position.keyId),
  )
  const groupRef = useRef<THREE.Group>(null)
  const currentY = useRef(0)
  const PRESS_DEPTH = -0.09

  useEffect(() => {
    isPressedRef.current = useWorkshopTypingStore
      .getState()
      .pressedKeys.has(position.keyId)
    return useWorkshopTypingStore.subscribe((state) => {
      isPressedRef.current = state.pressedKeys.has(position.keyId)
    })
  }, [position.keyId])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const pressing = isPressedRef.current || isClicking
    const target = pressing ? PRESS_DEPTH : isSelected ? 0.025 : hovered ? 0.012 : 0
    const response = pressing ? 90 : 32
    currentY.current +=
      (target - currentY.current) * Math.min(1, delta * response)
    groupRef.current.position.y = currentY.current + explodeOffset
  })

  // Layout dimensions already model an 18 mm cap on a 19.05 mm key pitch.
  const w = position.width
  const d = position.depth
  const profile = FIXED_KEYCAP_PROFILE

  const geo = useMemo(
    () => buildKeycapGeometry(w, d),
    [w, d]
  )

  const artworkSource = customization.artwork.source
  const setTopDominantColor = useCallback(
    (color: string) => {
      setArtworkPalette((current) => {
        const side = current.source === artworkSource ? current.side : null
        if (
          current.source === artworkSource &&
          current.top === color &&
          current.side === side
        ) {
          return current
        }
        return { source: artworkSource, top: color, side }
      })
    },
    [artworkSource],
  )
  const setSideDominantColor = useCallback(
    (color: string) => {
      setArtworkPalette((current) => {
        const top = current.source === artworkSource ? current.top : null
        if (
          current.source === artworkSource &&
          current.side === color &&
          current.top === top
        ) {
          return current
        }
        return { source: artworkSource, top, side: color }
      })
    },
    [artworkSource],
  )
  const sampledTopColor =
    artworkPalette.source === artworkSource ? artworkPalette.top : null
  const sampledSideColor =
    artworkPalette.source === artworkSource
      ? artworkPalette.side ?? artworkPalette.top
      : null
  const bundledSideVariant = customization.artwork.useDefault
    ? getBundledSideVariant(sampledTopColor)
    : "royal-purple"
  const topColor = useMemo(
    () =>
      new THREE.Color(
        artworkSource && sampledTopColor
          ? sampledTopColor
          : customization.colors.top,
      ),
    [artworkSource, sampledTopColor, customization.colors.top]
  )
  const sideColor = useMemo(
    () => {
      const sampledColor = new THREE.Color(
        artworkSource && sampledSideColor
          ? sampledSideColor
          : customization.artwork.useDefault
            ? DEFAULT_SIDE_COLOR
            : customization.colors.side,
      )
      const artworkTint =
        customization.artwork.useDefault &&
        bundledSideVariant === "royal-purple"
          ? BUNDLED_SIDE_TINT
          : LIGHT_SIDE_TINT
      return artworkSource ? sampledColor.multiply(artworkTint) : sampledColor
    },
    [
      artworkSource,
      sampledSideColor,
      bundledSideVariant,
      customization.artwork.useDefault,
      customization.colors.side,
    ]
  )
  const materialProps = useMemo(() => customization.material === "silver" ? { roughness: .26, metalness: .8 } : customization.material === "walnut" ? { roughness: .72, metalness: 0 } : { roughness: .46, metalness: .03 }, [customization.material])
  const topSurface = getTopSurfaceSize(w, d, profile)
  const topAngle = Math.atan2(profile.topTilt, topSurface.depth)

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
      {/* RGB backlight glows through the seams and flares on every key press. */}
      <KeyBacklight
        width={w * 1.035}
        depth={d * 1.035}
        color={backlightColor}
        active={isClicking}
        pressedRef={isPressedRef}
      />

      {/* Main keycap body */}
      <mesh
        geometry={geo}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        // Keycaps cast a soft shadow onto the plate, but never receive one
        // from a neighbouring cap. This prevents dark square artifacts.
        receiveShadow={false}
      >
        {/* Artwork-backed shells stay unlit so transparent sprite margins
            reveal the exact sampled color instead of a nearly black shadow. */}
        {artworkSource
          ? <meshBasicMaterial color={topColor} side={THREE.DoubleSide} />
          : <meshStandardMaterial color={topColor} side={THREE.DoubleSide} flatShading={profile.shoulderRoundness < 0.2} {...materialProps} />}
        {artworkSource
          ? <meshBasicMaterial color={sideColor} side={THREE.DoubleSide} />
          : <meshStandardMaterial color={sideColor} side={THREE.DoubleSide} flatShading={profile.shoulderRoundness < 0.2} {...materialProps} />}
      </mesh>

      {customization.artwork.source && <KeycapArtwork source={customization.artwork.source} wrap={customization.artwork.mapping === "full-wrap"} showTop useProfileSides={customization.artwork.useDefault} width={w} depth={d} profile={profile} scale={customization.artwork.scale} fit={customization.artwork.fit} sideVariant={bundledSideVariant} onTopDominantColor={setTopDominantColor} onSideDominantColor={setSideDominantColor} />}

      {/* Selection outline — slightly larger, rendered as back-face only */}

      {/* Legends via Html overlay — rendered at top face center */}
      {(showPrimary || showSecondary) && (
        <group
          position={[0, profile.topSurfaceHeight + 0.016, -profile.topShiftZ]}
          rotation={[-Math.PI / 2 - topAngle, 0, 0]}
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
      {SHOW_HOVER_LABEL && hovered && !isSelected && (
        <Html position={[0, 0.9, 0]} center style={{ pointerEvents: "none" }}>
          <div style={{ background: "#202428", color: "#f2f4f5", border: "1px solid #8c969e", borderRadius: 4, fontSize: 10, padding: "3px 6px", whiteSpace: "nowrap" }}>
            {primaryLegend} · click to edit
          </div>
        </Html>
      )}
    </group>
  )
}
