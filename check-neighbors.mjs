// Check whether the Backspace's side sprites overlap its neighbors' side sprites
// at the actual app camera, using the real layout positions.
import sharp from "sharp"

const U = 18 / 19.05
const GAP = 0.15 / 19.05
const profile = { height: 9.4 / 19.05, topScaleX: 0.72, topScaleZ: 0.72, surfaceCurve: 0, shoulderRoundness: 0.14, topTilt: 0, topShiftZ: 0 }
const SIZE = 900
const focal = 1 / Math.tan((40 * Math.PI) / 360)

function getTopSurfaceSize(width, depth, p) {
  const horizontalInset = depth * (1 - p.topScaleX)
  return { width: Math.max(0.01, width - horizontalInset), depth: depth * p.topScaleZ }
}
// 2D key layout (from layout-data) -> {id, x(center), width, depth, row}
function layout() {
  const rows = {
    1: [
      ["Backtick",1],["1",1],["2",1],["3",1],["4",1],["5",1],["6",1],["7",1],["8",1],["9",1],["0",1],["Minus",1],["Equal",1],["Backspace",2],["Delete",1,0.1],
    ],
    2: [
      ["Tab",1.5],["Q",1],["W",1],["E",1],["R",1],["T",1],["Y",1],["U",1],["I",1],["O",1],["P",1],["BracketL",1],["BracketR",1],["Backslash",1.5],["PageUp",1,0.1],
    ],
  }
  const out = []
  for (const [rowStr, keys] of Object.entries(rows)) {
    const row = parseInt(rowStr)
    let x = 0
    for (const k of keys) {
      const gapBefore = k[2] ?? 0
      x += gapBefore * (U + GAP)
      const w = k[1] * U + (k[1] - 1) * GAP
      out.push({ id: k[0], x: x + w / 2, y: -(row * (U + GAP)), width: w, depth: U })
      x += w + GAP
    }
  }
  // center on backspace x
  const bs = out.find((k) => k.id === "Backspace")
  for (const k of out) k.x -= bs.x
  return out
}

function cross(a, b) { return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]] }
function dot(a, b) { return a[0]*b[0]+a[1]*b[1]+a[2]*b[2] }
const PRESETS = { isometric: [12, 12, 17], top: [0, 24, 0.001], front: [0, 3, 20], typing: [0, 6, 13], right: [20, 3, 0], left: [-20, 3, 0] }
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
  return [(x * 300 + SIZE/2), (SIZE/2 - y * 300)]
}
function ptInTri(px, py, t) {
  const s = (ax,ay,bx,by,cx,cy) => (bx-ax)*(cy-ay)-(by-ay)*(cx-ax)
  const d1 = s(px,py,t[0][0],t[0][1],t[1][0],t[1][1])
  const d2 = s(px,py,t[1][0],t[1][1],t[2][0],t[2][1])
  const d3 = s(px,py,t[2][0],t[2][1],t[0][0],t[0][1])
  const neg = d1<0||d2<0||d3<0, pos = d1>0||d2>0||d3>0
  return !(neg&&pos)
}
async function loadAlpha(path) {
  const { data, info } = await sharp(path).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const alpha = new Float32Array(info.width * info.height)
  for (let i = 0; i < alpha.length; i++) alpha[i] = data[i * 4 + 3]
  return { alpha, w: info.width, h: info.height }
}
// build a side face mesh for a key at (ox, oy, oz=0), returns {tris, triUv, path}
function sideFaces(key, direction) {
  const w = key.width, d = key.depth
  const baseHalfWidth = w / 2, baseHalfDepth = d / 2
  const topSurface = getTopSurfaceSize(w, d, profile)
  const topHalfWidth = topSurface.width / 2, topHalfDepth = topSurface.depth / 2
  const shoulderHeight = profile.height * (0.72 + profile.shoulderRoundness * 0.13)
  const shoulderProgress = shoulderHeight / profile.height
  const shoulderHalfWidth = baseHalfWidth + (topHalfWidth - baseHalfWidth) * shoulderProgress
  const shoulderHalfDepth = baseHalfDepth + (topHalfDepth - baseHalfDepth) * shoulderProgress
  const offset = 0.008
  const rows = [
    { y: 0, hw: baseHalfWidth, hd: baseHalfDepth, sz: 0 },
    { y: shoulderHeight, hw: shoulderHalfWidth, hd: shoulderHalfDepth, sz: profile.topShiftZ * 0.55 },
    { y: profile.height, hw: topHalfWidth, hd: topHalfDepth, sz: profile.topShiftZ },
  ]
  const pos = rows.flatMap(({ y, hw, hd, sz }) =>
    direction === "front"
      ? [[-baseHalfWidth, y, hd - sz + offset], [baseHalfWidth, y, hd - sz + offset]]
      : direction === "back"
        ? [[baseHalfWidth, y, -hd - sz - offset], [-baseHalfWidth, y, -hd - sz - offset]]
        : direction === "left"
          ? [[-hw - offset, y, -baseHalfDepth - sz], [-hw - offset, y, baseHalfDepth - sz]]
          : [[hw + offset, y, baseHalfDepth - sz], [hw + offset, y, -baseHalfDepth - sz]],
  )
  const translated = pos.map(([x, y, z]) => [x + key.x, y + key.y, z])
  const shoulderV = shoulderHeight / profile.height
  const side = direction === "left" || direction === "right"
  const startU = side ? 1 : 0, endU = side ? 0 : 1
  const uv = [startU, 0, endU, 0, startU, shoulderV, endU, shoulderV, startU, 1, endU, 1]
  const idx = [[0,1,3],[0,3,2],[2,3,5],[2,5,4]]
  const tris = idx.map((t) => t.map((i) => translated[i]))
  const triUv = idx.map((t) => t.map((i) => [uv[i*2], uv[i*2+1]]))
  return { tris, triUv }
}
// face path for a key
function facePath(key, direction) {
  const token = (u) => u <= 1 ? "1u" : u <= 1.25 ? "1-25u" : u <= 1.5 ? "1-5u" : u <= 1.75 ? "1-75u" : u <= 2 ? "2u" : u <= 2.25 ? "2-25u" : "2-75u"
  const long = token(key.width / U), short = token(key.depth / U)
  const p = direction === "front" || direction === "back" ? long : short
  const orient = direction === "front" ? "back" : direction === "back" ? "front" : "front"
  return `public/workshop/keycaps/sides/royal-purple/${p}/${orient}.png`
}
async function rasterFaces(key) {
  const perFace = {}
  for (const dir of ["front", "back", "left", "right"]) {
    const { tris, triUv } = sideFaces(key, dir)
    const spr = await loadAlpha(facePath(key, dir))
    const grid = new Uint8Array(SIZE * SIZE)
    for (let ti = 0; ti < tris.length; ti++) {
      const pr = tris[ti].map(project)
      if (pr.some((p) => !p)) continue
      const px = pr.map((p) => p[0]), py = pr.map((p) => p[1])
      let minX = Math.floor(Math.min(...px)), maxX = Math.ceil(Math.max(...px))
      let minY = Math.floor(Math.min(...py)), maxY = Math.ceil(Math.max(...py))
      minX = Math.max(0, minX); maxX = Math.min(SIZE-1, maxX)
      minY = Math.max(0, minY); maxY = Math.min(SIZE-1, maxY)
      const [u0, u1, u2] = triUv[ti]
      for (let j = minY; j <= maxY; j++) for (let i = minX; i <= maxX; i++) {
        if (!ptInTri(i+0.5, j+0.5, [[px[0],py[0]],[px[1],py[1]],[px[2],py[2]]])) continue
        const a0 = tris[ti][0], a1 = tris[ti][1], a2 = tris[ti][2]
        const denom = (a1[1]-a2[1])*(a0[0]-a2[0]) + (a2[0]-a1[0])*(a0[1]-a2[1])
        const l0 = ((a1[1]-a2[1])*((i+0.5)-a2[0]) + (a2[0]-a1[0])*((j+0.5)-a2[1])) / denom
        const l1 = ((a2[1]-a0[1])*((i+0.5)-a2[0]) + (a0[0]-a2[0])*((j+0.5)-a2[1])) / denom
        const l2 = 1 - l0 - l1
        const u = l0*u0[0] + l1*u1[0] + l2*u2[0]
        const vv = l0*u0[1] + l1*u1[1] + l2*u2[1]
        const sx = Math.max(0, Math.min(spr.w-1, Math.round(u * (spr.w-1))))
        const sy = Math.max(0, Math.min(spr.h-1, Math.round((1-vv) * (spr.h-1))))
        if (spr.alpha[sy*spr.w+sx] > 24) grid[j*SIZE+i] = 1
      }
    }
    perFace[dir] = grid
  }
  return perFace
}
function orGrids(a, b) {
  const g = new Uint8Array(SIZE*SIZE)
  for (let i = 0; i < g.length; i++) g[i] = (a[i]||b[i]) ? 1 : 0
  return g
}
function countOverlap(a, b) { let n = 0; for (let i = 0; i < a.length; i++) if (a[i] && b[i]) n++; return n }

const keys = layout()
const bs = keys.find((k) => k.id === "Backspace")
const neighbors = keys.filter((k) => ["Equal", "Delete", "BracketR", "Backslash"].includes(k.id))
console.log("backspace pos", bs.x.toFixed(3), bs.y.toFixed(3), "width", bs.width.toFixed(3))
for (const n of neighbors) console.log("  neighbor", n.id.padEnd(9), "x", n.x.toFixed(3), "y", n.y.toFixed(3), "w", n.width.toFixed(3))

const bsFaces = await rasterFaces(bs)
// combine each neighbor's 4 faces into one grid
for (const [camName, pos] of Object.entries(PRESETS)) {
  cam = setup(pos)
  const bsGrid = orGrids(bsFaces.front, orGrids(bsFaces.back, orGrids(bsFaces.left, bsFaces.right)))
  let line = camName.padEnd(10)
  for (const n of neighbors) {
    const nFaces = await rasterFaces(n)
    const nGrid = orGrids(nFaces.front, orGrids(nFaces.back, orGrids(nFaces.left, nFaces.right)))
    line += ` ${n.id}:${countOverlap(bsGrid, nGrid)}`
  }
  console.log(line)
}
