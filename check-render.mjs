import sharp from "sharp"

const w = 2
const d = 1
const U = 18 / 19.05
const profile = { height: 9.4 / 19.05, topScaleX: 0.72, topScaleZ: 0.72, shoulderRoundness: 0.14, topShiftZ: 0, surfaceCurve: 0, topTilt: 0, topSurfaceHeight: 9.4 / 19.05 }
const SIZE = 400
const CHARS = " .:-=+*#%@"

function getTopSurfaceSize(width, depth, p) {
  return { width: width * p.topScaleX, depth: depth * p.topScaleZ }
}
const topSurface = getTopSurfaceSize(w, d, profile)
const topHalfWidth = topSurface.width / 2
const topHalfDepth = topSurface.depth / 2
const baseHalfWidth = w / 2
const baseHalfDepth = d / 2
const height = profile.height
const shoulderHeight = height * (0.72 + profile.shoulderRoundness * 0.13)
const shoulderProgress = shoulderHeight / height
const shoulderHalfWidth = baseHalfWidth + (topHalfWidth - baseHalfWidth) * shoulderProgress
const shoulderHalfDepth = baseHalfDepth + (topHalfDepth - baseHalfDepth) * shoulderProgress
const offset = 0.008

// camera
const VIEW = process.env.VIEW || "iso"
const cams = {
  iso: { pos: [1.9, 1.9, 2.7], tgt: [0, 0.25, 0], fov: 22 },
  front: { pos: [0, 0.5, 2.6], tgt: [0, 0.25, 0], fov: 26 },
  right: { pos: [2.6, 0.5, 0], tgt: [0, 0.25, 0], fov: 26 },
  top: { pos: [0, 2.6, 0.001], tgt: [0, 0.25, 0], fov: 26 },
}
const camPos = cams[VIEW].pos
const target = cams[VIEW].tgt
const up = [0, 1, 0]
const fov = cams[VIEW].fov

// build camera matrix
function normalize(v) { const l = Math.hypot(...v); return v.map((x) => x / l) }
const forward = normalize(target.map((t, i) => t - camPos[i]))
const right = normalize(cross(forward, up))
const trueUp = cross(right, forward)
function cross(a, b) { return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]] }
const camDist = Math.hypot(...target.map((t, i) => t - camPos[i]))
const f = (SIZE / 2) / Math.tan((fov * Math.PI / 180) / 2)
const cam = {
  forward, right, trueUp,
  eye: camPos,
  project(p) {
    const rel = p.map((v, i) => v - this.eye[i])
    const z = rel[0]*this.forward[0] + rel[1]*this.forward[1] + rel[2]*this.forward[2]
    const x = rel[0]*this.right[0] + rel[1]*this.right[1] + rel[2]*this.right[2]
    const y = rel[0]*this.trueUp[0] + rel[1]*this.trueUp[1] + rel[2]*this.trueUp[2]
    const sx = SIZE/2 + (x * f / z)
    const sy = SIZE/2 - (y * f / z)
    return [sx, sy, z]
  },
}

function buildSideMesh(dir) {
  const rows = [
    { y: 0, hw: baseHalfWidth, hd: baseHalfDepth, sz: 0 },
    { y: shoulderHeight, hw: shoulderHalfWidth, hd: shoulderHalfDepth, sz: profile.topShiftZ * 0.55 },
    { y: height, hw: topHalfWidth, hd: topHalfDepth, sz: profile.topShiftZ },
  ]
  const vs = []
  const uvs = []
  for (const { y, hw, hd, sz } of rows) {
    if (dir === "front") { vs.push([-baseHalfWidth, y, hd - sz + offset], [baseHalfWidth, y, hd - sz + offset]) }
    else if (dir === "back") { vs.push([baseHalfWidth, y, -hd - sz - offset], [-baseHalfWidth, y, -hd - sz - offset]) }
    else if (dir === "left") { vs.push([-hw - offset, y, -baseHalfDepth - sz], [-hw - offset, y, baseHalfDepth - sz]) }
    else { vs.push([hw + offset, y, baseHalfDepth - sz], [hw + offset, y, -baseHalfDepth - sz]) }
  }
  const shoulderV = shoulderHeight / height
  const side = dir === "left" || dir === "right"
  const startU = side ? 1 : 0
  const endU = side ? 0 : 1
  for (const v of [0, shoulderV, 1]) uvs.push(startU, v, endU, v)
  const tris = [[0,1,3],[0,3,2],[2,3,5],[2,5,4]]
  return tris.map((t) => ({ v: t.map((i) => vs[i]), uv: t.map((i) => [uvs[i*2], uvs[i*2+1]]) }))
}

function buildFlatSide(dir) {
  const h = height
  const o = 0.003
  // flat rectangles around full body dims (custom-image path)
  const rect = (x, z, sx, sz) => [
    [x - sx, 0, z - sz], [x + sx, 0, z - sz], [x + sx, h, z - sz],
    [x - sx, 0, z - sz], [x + sx, h, z - sz], [x - sx, h, z - sz],
  ]
  if (dir === "front") {
    const pts = rect(0, baseHalfDepth + o, baseHalfWidth, 0)
    return [0,1,2].length ? [
      { v: [pts[0], pts[1], pts[2]], uv: [[0,1],[1,1],[1,0]] },
      { v: [pts[3], pts[4], pts[5]], uv: [[0,1],[1,0],[0,0]] },
    ] : []
  }
  if (dir === "back") {
    const pts = rect(0, -baseHalfDepth - o, baseHalfWidth, 0)
    return [
      { v: [pts[0], pts[1], pts[2]], uv: [[1,1],[0,1],[0,0]] },
      { v: [pts[3], pts[4], pts[5]], uv: [[1,1],[0,0],[1,0]] },
    ]
  }
  if (dir === "left") {
    const pts = rect(-baseHalfWidth - o, 0, 0, baseHalfDepth)
    return [
      { v: [pts[0], pts[1], pts[2]], uv: [[0,1],[1,1],[1,0]] },
      { v: [pts[3], pts[4], pts[5]], uv: [[0,1],[1,0],[0,0]] },
    ]
  }
  const pts = rect(baseHalfWidth + o, 0, 0, baseHalfDepth)
  return [
    { v: [pts[0], pts[1], pts[2]], uv: [[1,1],[0,1],[0,0]] },
    { v: [pts[3], pts[4], pts[5]], uv: [[1,1],[0,0],[1,0]] },
  ]
}

function buildBody() {
  // keycap body: top face (front slanted) + walls, octagon-ish
  const top = [
    [-topHalfWidth, height, topHalfDepth],
    [0, height, topHalfDepth],
    [topHalfWidth, height, topHalfDepth],
    [topHalfWidth, height, 0],
    [topHalfWidth, height, -topHalfDepth],
    [0, height, -topHalfDepth],
    [-topHalfWidth, height, -topHalfDepth],
    [-topHalfWidth, height, 0],
  ]
  const bot = top.map(([x, , z]) => [x, 0, z])
  const tris = []
  // top fan
  const center = [0, height, 0]
  for (let i = 0; i < top.length; i++) tris.push({ v: [top[i], top[(i+1)%top.length], center], kind: "top" })
  // walls
  for (let i = 0; i < top.length; i++) {
    const j = (i+1)%top.length
    tris.push({ v: [bot[i], bot[j], top[j]], kind: "wall" })
    tris.push({ v: [bot[i], top[j], top[i]], kind: "wall" })
  }
  return tris
}

function buildTopArt() {
  const surfaceOffset = 0.004
  const pts = [
    [-topHalfWidth, topHalfDepth], [0, topHalfDepth], [topHalfWidth, topHalfDepth],
    [topHalfWidth, 0], [topHalfWidth, -topHalfDepth], [0, -topHalfDepth],
    [-topHalfWidth, -topHalfDepth], [-topHalfWidth, 0],
  ]
  const c = [0, height + surfaceOffset, 0]
  const uv = (x, z) => [x / topSurface.width + 0.5, 0.5 - z / topSurface.depth]
  const tris = []
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i+1)%pts.length]
    tris.push({
      v: [[a[0], height + surfaceOffset, a[1]], [b[0], height + surfaceOffset, b[1]], c],
      uv: [uv(a[0], a[1]), uv(b[0], b[1]), uv(0, 0)],
      art: 1,
    })
  }
  return tris
}

const sidePaths = {
  front: "public/workshop/keycaps/sides/royal-purple/2u/back.webp",
  back: "public/workshop/keycaps/sides/royal-purple/2u/front.webp",
  left: "public/workshop/keycaps/sides/royal-purple/1u/front.webp",
  right: "public/workshop/keycaps/sides/royal-purple/1u/front.webp",
}
const texCache = {}
async function loadSpr(p) {
  if (texCache[p]) return texCache[p]
  const { data, info } = await sharp(p).raw().toBuffer({ resolveWithObject: true })
  texCache[p] = { data, w: info.width, h: info.height }
  return texCache[p]
}
function sample(tex, u, v) {
  let x = Math.round(u * (tex.w - 1)), y = Math.round((1 - v) * (tex.h - 1))
  x = Math.max(0, Math.min(tex.w - 1, x)); y = Math.max(0, Math.min(tex.h - 1, y))
  const i = (y * tex.w + x) * 4
  return { r: tex.data[i], g: tex.data[i+1], b: tex.data[i+2], a: tex.data[i+3] }
}

const depth = new Float32Array(SIZE * SIZE).fill(Infinity)
const color = new Float32Array(SIZE * SIZE * 3).fill(0)
const alpha = new Float32Array(SIZE * SIZE).fill(0)

// body colors: artwork keys -> topColor = sampled dominant (cream-ish for royal-cream top w/ purple arrow... we use the tinted shell colors)
// sideColor = dominant side * tint. For rendering overlap, use opaque body fill first.
const BODY_TOP = [58, 50, 143]  // purple-ish (royal purple dominant)
const BODY_SIDE = [80, 72, 138]

function shadeTriangle(tri, colors, tex) {
  const proj = tri.v.map((v) => cam.project(v))
  const minX = Math.max(0, Math.floor(Math.min(...proj.map((p) => p[0]))))
  const maxX = Math.min(SIZE - 1, Math.ceil(Math.max(...proj.map((p) => p[0]))))
  const minY = Math.max(0, Math.floor(Math.min(...proj.map((p) => p[1]))))
  const maxY = Math.min(SIZE - 1, Math.ceil(Math.max(...proj.map((p) => p[1]))))
  const [p0, p1, p2] = proj
  const area = (p1[0]-p0[0])*(p2[1]-p0[1]) - (p1[1]-p0[1])*(p2[0]-p0[0])
  if (Math.abs(area) < 1e-9) return
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const b0 = ((p1[0]-x)*(p2[1]-y) - (p1[1]-y)*(p2[0]-x)) / area
      const b1 = ((p2[0]-x)*(p0[1]-y) - (p2[1]-y)*(p0[0]-x)) / area
      const b2 = 1 - b0 - b1
      if (b0 < -0.001 || b1 < -0.001 || b2 < -0.001) continue
      const z = b0*p0[2] + b1*p1[2] + b2*p2[2]
      const i = y*SIZE + x
      if (z >= depth[i] - 1e-6) continue
      let c = colors, a = 1
      if (tex) {
        const u = b0*tri.uv[0][0] + b1*tri.uv[1][0] + b2*tri.uv[2][0]
        const v = b0*tri.uv[0][1] + b1*tri.uv[1][1] + b2*tri.uv[2][1]
        const s = sample(tex, u, v)
        a = s.a / 255
        if (a < 0.04) continue
        c = [s.r, s.g, s.b]
      }
      if (!c) continue
      depth[i] = z
      alpha[i] = a
      color[i*3] = c[0]; color[i*3+1] = c[1]; color[i*3+2] = c[2]
    }
  }
}

// painter order: body first (opaque), then side sprites (transparent w/ alphaTest), then top art on top
// but true three.js: transparent rendered after opaque, sorted by depth. Simplify: opaque body, then transparent sorted by tri depth (far->near).
const bodyTris = buildBody()
const topArtTris = buildTopArt()

async function render() {
  // load side sprites
  const sprites = {}
  for (const dir of ["front", "back", "left", "right"]) sprites[dir] = await loadSpr(sidePaths[dir])

  // 1. opaque body
  for (const t of bodyTris) shadeTriangle(t, t.kind === "top" ? BODY_TOP : BODY_SIDE, null)

  // 2. transparent layers: side sprites + top art, painter far->near
  let trans = []
  const topTex = await loadSpr("public/workshop/keycaps/royal-cream/Backspace.webp")
  const CUSTOM_PATH = process.env.CUSTOM === "1"
  if (CUSTOM_PATH) {
    for (const dir of ["front", "back", "left", "right"]) {
      const tris = buildFlatSide(dir)
      for (const t of tris) trans.push({ tri: t, tex: topTex })
    }
  } else {
    for (const dir of ["front", "back", "left", "right"]) {
      const tris = buildSideMesh(dir)
      for (const t of tris) trans.push({ tri: t, tex: sprites[dir] })
    }
  }
  for (const t of topArtTris) trans.push({ tri: t, tex: topTex })
  // sort by average depth far first
  trans.sort((A, B) => {
    const za = (A.tri.v[0][0]*cam.forward[0] + A.tri.v[0][1]*cam.forward[1] + A.tri.v[0][2]*cam.forward[2]
              + A.tri.v[1][0]*cam.forward[0] + A.tri.v[1][1]*cam.forward[1] + A.tri.v[1][2]*cam.forward[2]
              + A.tri.v[2][0]*cam.forward[0] + A.tri.v[2][1]*cam.forward[1] + A.tri.v[2][2]*cam.forward[2]) / 3
    const zb = (B.tri.v[0][0]*cam.forward[0] + B.tri.v[0][1]*cam.forward[1] + B.tri.v[0][2]*cam.forward[2]
              + B.tri.v[1][0]*cam.forward[0] + B.tri.v[1][1]*cam.forward[1] + B.tri.v[1][2]*cam.forward[2]
              + B.tri.v[2][0]*cam.forward[0] + B.tri.v[2][1]*cam.forward[1] + B.tri.v[2][2]*cam.forward[2]) / 3
    return zb - za
  })
  for (const { tri, tex } of trans) shadeTriangle(tri, null, tex)

  // ASCII out
  const W = 110, H = Math.round(W * 0.42)
  for (let r = 0; r < H; r++) {
    let line = ""
    for (let c = 0; c < W; c++) {
      const x = Math.floor(c / W * SIZE), y = Math.floor(r / H * SIZE)
      const i = y*SIZE + x
      if (depth[i] === Infinity) { line += " "; continue }
      const lum = (color[i*3]*0.299 + color[i*3+1]*0.587 + color[i*3+2]*0.114) / 255
      line += CHARS[Math.min(CHARS.length-1, Math.floor(lum * (CHARS.length-1)))]
    }
    console.log(line)
  }
}
render()
