// Rasterize OPAQUE sprite pixels for each side face of the Backspace and check pairwise overlap.
import sharp from "sharp"

const U = 18 / 19.05
const GAP = 0.15 / 19.05
const w = 2 * U + GAP
const d = U
const profile = {
  height: 9.4 / 19.05,
  topScaleX: 0.72,
  topScaleZ: 0.72,
  surfaceCurve: 0,
  shoulderRoundness: 0.14,
  topTilt: 0,
  topShiftZ: 0,
}
function getTopSurfaceSize(width, depth, p) {
  const horizontalInset = depth * (1 - p.topScaleX)
  return { width: Math.max(0.01, width - horizontalInset), depth: depth * p.topScaleZ }
}
function buildMesh(direction, width, depth, p) {
  const baseHalfWidth = width / 2
  const baseHalfDepth = depth / 2
  const topSurface = getTopSurfaceSize(width, depth, p)
  const topHalfWidth = topSurface.width / 2
  const topHalfDepth = topSurface.depth / 2
  const shoulderHeight = p.height * (0.72 + p.shoulderRoundness * 0.13)
  const shoulderProgress = shoulderHeight / p.height
  const shoulderHalfWidth = baseHalfWidth + (topHalfWidth - baseHalfWidth) * shoulderProgress
  const shoulderHalfDepth = baseHalfDepth + (topHalfDepth - baseHalfDepth) * shoulderProgress
  const offset = 0.008
  const rows = [
    { y: 0, hw: baseHalfWidth, hd: baseHalfDepth, shiftZ: 0 },
    { y: shoulderHeight, hw: shoulderHalfWidth, hd: shoulderHalfDepth, shiftZ: p.topShiftZ * 0.55 },
    { y: p.height, hw: topHalfWidth, hd: topHalfDepth, shiftZ: p.topShiftZ },
  ]
  const pos = rows.flatMap(({ y, hw, hd, shiftZ }) =>
    direction === "front"
      ? [[-baseHalfWidth, y, hd - shiftZ + offset], [baseHalfWidth, y, hd - shiftZ + offset]]
      : direction === "back"
        ? [[baseHalfWidth, y, -hd - shiftZ - offset], [-baseHalfWidth, y, -hd - shiftZ - offset]]
        : direction === "left"
          ? [[-hw - offset, y, -baseHalfDepth - shiftZ], [-hw - offset, y, baseHalfDepth - shiftZ]]
          : [[hw + offset, y, baseHalfDepth - shiftZ], [hw + offset, y, -baseHalfDepth - shiftZ]],
  )
  const v = (i) => pos[i]
  const tris = [[0,1,3],[0,3,2],[2,3,5],[2,5,4]].map((t) => t.map((i) => v(i)))
  const shoulderV = shoulderHeight / p.height
  const sideProfile = direction === "left" || direction === "right"
  const startU = sideProfile ? 1 : 0
  const endU = sideProfile ? 0 : 1
  const uv = [startU, 0, endU, 0, startU, shoulderV, endU, shoulderV, startU, 1, endU, 1]
  // per-triangle uv coords matching index order [0,1,3, 0,3,2, 2,3,5, 2,5,4]
  const triUv = [[0,1,3],[0,3,2],[2,3,5],[2,5,4]].map((t) => t.map((i) => [uv[i*2], uv[i*2+1]]))
  return { tris, triUv }
}

// load sprite alpha as a grid
async function loadAlpha(path) {
  const { data, info } = await sharp(path).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const alpha = new Float32Array(info.width * info.height)
  for (let i = 0; i < alpha.length; i++) alpha[i] = data[i * 4 + 3]
  return { alpha, w: info.width, h: info.height }
}

// projection
function cross(a, b) { return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]] }
function dot(a, b) { return a[0]*b[0]+a[1]*b[1]+a[2]*b[2] }
const SIZE = 700
const focal = 1 / Math.tan((40 * Math.PI) / 360)
const PRESETS = {
  isometric: [12, 12, 17],
  top: [0, 24, 0.001],
  front: [0, 3, 20],
  left: [-20, 3, 0],
  right: [20, 3, 0],
  typing: [0, 6, 13],
  defaultCanvas: [14, 11, 16],
}
function setup(eyePos) {
  const eye = eyePos
  const target = [0, 0, 0]
  const fwd = target.map((v, i) => v - eye[i])
  const fl = Math.hypot(...fwd)
  const fwdN = fwd.map((x) => x / fl)
  const up = [0, 1, 0]
  const rightRaw = cross(fwdN, up)
  const rightU = rightRaw.map((x) => x / Math.hypot(...rightRaw))
  const upN = cross(rightU, fwdN)
  return { eye, fwdN, rightU, upN }
}
let cam = setup([12, 12, 17])
function project(p) {
  const v = [p[0]-cam.eye[0], p[1]-cam.eye[1], p[2]-cam.eye[2]]
  const z = dot(v, cam.fwdN)
  if (z < 0.05) return null
  const x = dot(v, cam.rightU) * focal / z
  const y = dot(v, cam.upN) * focal / z
  return [(x * 240 + SIZE/2) / 1, (SIZE/2 - y * 240) / 1]
}
function ptInTri(px, py, t) {
  const s = (ax,ay,bx,by,cx,cy) => (bx-ax)*(cy-ay)-(by-ay)*(cx-ax)
  const d1 = s(px,py,t[0][0],t[0][1],t[1][0],t[1][1])
  const d2 = s(px,py,t[1][0],t[1][1],t[2][0],t[2][1])
  const d3 = s(px,py,t[2][0],t[2][1],t[0][0],t[0][1])
  const neg = d1<0||d2<0||d3<0, pos = d1>0||d2>0||d3>0
  return !(neg&&pos)
}

// rasterize each face -> grid of max sprite alpha per pixel (from this face)
async function rasterFace(direction, texPath) {
  const { tris, triUv } = buildMesh(direction, w, d, profile)
  const spr = await loadAlpha(texPath)
  const grid = new Float32Array(SIZE * SIZE)
  const depth = new Float32Array(SIZE * SIZE).fill(Infinity)
  for (let ti = 0; ti < tris.length; ti++) {
    const tri = tris[ti]
    const pr = tri.map(project)
    if (pr.some((p) => !p)) continue
    const px = pr.map((p) => p[0]), py = pr.map((p) => p[1])
    let minX = Math.floor(Math.min(...px)), maxX = Math.ceil(Math.max(...px))
    let minY = Math.floor(Math.min(...py)), maxY = Math.ceil(Math.max(...py))
    minX = Math.max(0, minX); maxX = Math.min(SIZE-1, maxX)
    minY = Math.max(0, minY); maxY = Math.min(SIZE-1, maxY)
    // sample sprite opacity at triangle uv barycenter? per-pixel we approximate with the 3 uvs
    const [u0,u1,u2] = triUv[ti]
    const a0 = tri[0], a1 = tri[1], a2 = tri[2]
    for (let j = minY; j <= maxY; j++) {
      for (let i = minX; i <= maxX; i++) {
        const cx = i + 0.5, cy = j + 0.5
        if (!ptInTri(cx, cy, [[px[0],py[0]],[px[1],py[1]],[px[2],py[2]]])) continue
        // compute world depth via barycentric
        const denom = (a1[1]-a2[1])*(a0[0]-a2[0]) + (a2[0]-a1[0])*(a0[1]-a2[1])
        const l0 = ((a1[1]-a2[1])*(cx-a2[0]) + (a2[0]-a1[0])*(cy-a2[1])) / denom
        const l1 = ((a2[1]-a0[1])*(cx-a2[0]) + (a0[0]-a2[0])*(cy-a2[1])) / denom
        const l2 = 1 - l0 - l1
        const wPt = [l0*a0[0]+l1*a1[0]+l2*a2[0], l0*a0[1]+l1*a1[1]+l2*a2[1], l0*a0[2]+l1*a1[2]+l2*a2[2]]
        const vVec = [wPt[0]-cam.eye[0], wPt[1]-cam.eye[1], wPt[2]-cam.eye[2]]
        const z = dot(vVec, cam.fwdN)
        if (z >= depth[j*SIZE+i]) continue
        depth[j*SIZE+i] = z
        // sample sprite alpha at uv (three.js Texture.flipY=true -> image row 0 is v=1)
        const u = l0*u0[0] + l1*u1[0] + l2*u2[0]
        const vv = l0*u0[1] + l1*u1[1] + l2*u2[1]
        const sx = Math.min(spr.w-1, Math.max(0, u * (spr.w-1)))
        const sy = Math.min(spr.h-1, Math.max(0, (1 - vv) * (spr.h-1)))
        grid[j*SIZE+i] = spr.alpha[Math.round(sy)*spr.w + Math.round(sx)]
      }
    }
  }
  return grid
}

const THRESH = 8 // alphaTest is 0.03 (~7.65/255); count any pixel that would draw
function overlapAlpha(a, b) {
  let n = 0
  for (let i = 0; i < a.length; i++) if (a[i] > THRESH && b[i] > THRESH) n++
  return n
}
for (const [name, pos] of Object.entries(PRESETS)) {
  cam = setup(pos)
  const f = await rasterFace("front", "public/workshop/keycaps/sides/royal-purple/2u/back.webp")
  const b = await rasterFace("back", "public/workshop/keycaps/sides/royal-purple/2u/front.webp")
  const l = await rasterFace("left", "public/workshop/keycaps/sides/royal-purple/1u/front.webp")
  const r = await rasterFace("right", "public/workshop/keycaps/sides/royal-purple/1u/front.webp")
  const res = [
    `front-left:${overlapAlpha(f, l)}`,
    `front-right:${overlapAlpha(f, r)}`,
    `back-left:${overlapAlpha(b, l)}`,
    `back-right:${overlapAlpha(b, r)}`,
    `front-back:${overlapAlpha(f, b)}`,
    `left-right:${overlapAlpha(l, r)}`,
  ]
  console.log(name.padEnd(14), res.join("  "))
}
