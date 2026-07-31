import { mkdir } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const [source, outputDirectory] = process.argv.slice(2)

if (!source || !outputDirectory) {
  console.error("Usage: node scripts/crop-keycap-atlas.mjs <atlas.png> <output-directory>")
  process.exit(1)
}

const ROW_KEYS = [
  [
    "Escape",
    "F1",
    "F2",
    "F3",
    "F4",
    "F5",
    "F6",
    "F7",
    "F8",
    "F9",
    "F10",
    "F11",
    "F12",
    "Knob",
  ],
  [
    "Backtick",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    "Minus",
    "Equal",
    "Backspace",
    "Delete",
  ],
  [
    "Tab",
    "Q",
    "W",
    "E",
    "R",
    "T",
    "Y",
    "U",
    "I",
    "O",
    "P",
    "BracketL",
    "BracketR",
    "Backslash",
    "PageUp",
  ],
  [
    "CapsLock",
    "A",
    "S",
    "D",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "Semicolon",
    "Quote",
    "Enter",
    "PageDown",
  ],
  [
    "ShiftL",
    "Z",
    "X",
    "C",
    "V",
    "B",
    "N",
    "M",
    "Comma",
    "Period",
    "Slash",
    "ShiftR",
    "ArrowUp",
    "End",
  ],
  [
    "CtrlL",
    "Win",
    "AltL",
    "Space",
    "AltR",
    "Fn",
    "CtrlR",
    "ArrowLeft",
    "ArrowDown",
    "ArrowRight",
  ],
]

const KEY_WIDTH_UNITS = {
  Backspace: 2,
  Tab: 1.5,
  Backslash: 1.5,
  CapsLock: 1.75,
  Enter: 2.25,
  ShiftL: 2.25,
  ShiftR: 1.75,
  CtrlL: 1.25,
  Win: 1.25,
  AltL: 1.25,
  Space: 6.25,
  AltR: 1.25,
}
const TOP_FACE_TRIM_PX = 4
const OUTPUT_UNIT_PX = 104
const KEYCAP_GAP_MM = 1.05
const KEYCAP_UNIT_MM = 18

// The supplied royal-cream sheet deliberately lets adjacent pixel shadows
// overlap. These cell boundaries isolate each cap before its visible bounds
// are tightened, avoiding accidental multi-key crops.
const ROYAL_CREAM_ATLAS = {
  width: 1942,
  height: 809,
  rowBands: [
    [52, 154],
    [177, 278],
    [288, 389],
    [398, 500],
    [510, 609],
    [620, 722],
  ],
  columnStarts: [
    [37, 202, 313, 424, 535, 710, 821, 936, 1051, 1219, 1334, 1447, 1566, 1754],
    [37, 150, 260, 371, 482, 593, 704, 815, 926, 1037, 1148, 1259, 1370, 1490, 1754],
    [37, 202, 313, 424, 535, 646, 757, 868, 979, 1090, 1201, 1312, 1423, 1547, 1754],
    [37, 226, 337, 448, 559, 670, 781, 892, 1003, 1114, 1225, 1336, 1462, 1754],
    [37, 281, 392, 503, 614, 725, 836, 947, 1058, 1169, 1280, 1403, 1614, 1754],
    [37, 178, 317, 463, 1106, 1243, 1376, 1497, 1608, 1721],
  ],
}

function contiguousRuns(values) {
  if (!values.length) return []

  const runs = []
  let start = values[0]
  let previous = values[0]

  for (const value of values.slice(1)) {
    if (value > previous + 1) {
      runs.push([start, previous])
      start = value
    }
    previous = value
  }

  runs.push([start, previous])
  return runs
}

function isArtworkPixel(data, index) {
  return (
    data[index + 3] >= 24 &&
    Math.max(data[index], data[index + 1], data[index + 2]) > 20
  )
}

function trimBounds(bounds, inset) {
  return {
    left: bounds.left + inset,
    top: bounds.top + inset,
    width: Math.max(1, bounds.width - inset * 2),
    height: Math.max(1, bounds.height - inset * 2),
  }
}

function getNormalizedWidth(units) {
  const physicalWidth =
    units * KEYCAP_UNIT_MM + (units - 1) * KEYCAP_GAP_MM
  return Math.round(OUTPUT_UNIT_PX * (physicalWidth / KEYCAP_UNIT_MM))
}

function findVisibleBounds(data, info, [cellLeft, cellRight], [cellTop, cellBottom]) {
  const cellWidth = cellRight - cellLeft + 1
  const cellHeight = cellBottom - cellTop + 1
  const visited = new Uint8Array(cellWidth * cellHeight)
  const isCorePixel = (x, y) => {
    const index = (y * info.width + x) * 4
    return (
      data[index + 3] >= 96 &&
      Math.max(data[index], data[index + 1], data[index + 2]) > 20
    )
  }
  let largest = null

  for (let localY = 0; localY < cellHeight; localY += 1) {
    for (let localX = 0; localX < cellWidth; localX += 1) {
      const localIndex = localY * cellWidth + localX
      if (visited[localIndex]) continue
      visited[localIndex] = 1

      const startX = cellLeft + localX
      const startY = cellTop + localY
      if (!isCorePixel(startX, startY)) continue

      const stack = [[localX, localY]]
      let count = 0
      let left = startX
      let right = startX
      let top = startY
      let bottom = startY

      while (stack.length) {
        const [x, y] = stack.pop()
        const globalX = cellLeft + x
        const globalY = cellTop + y
        count += 1
        left = Math.min(left, globalX)
        right = Math.max(right, globalX)
        top = Math.min(top, globalY)
        bottom = Math.max(bottom, globalY)

        for (const [nextX, nextY] of [
          [x - 1, y],
          [x + 1, y],
          [x, y - 1],
          [x, y + 1],
        ]) {
          if (
            nextX < 0 ||
            nextX >= cellWidth ||
            nextY < 0 ||
            nextY >= cellHeight
          ) {
            continue
          }
          const nextIndex = nextY * cellWidth + nextX
          if (visited[nextIndex]) continue
          visited[nextIndex] = 1
          if (isCorePixel(cellLeft + nextX, cellTop + nextY)) {
            stack.push([nextX, nextY])
          }
        }
      }

      if (!largest || count > largest.count) {
        largest = { count, left, right, top, bottom }
      }
    }
  }

  if (!largest) {
    throw new Error(
      `No visible keycap artwork found in cell ${JSON.stringify([
        cellLeft,
        cellTop,
        cellRight,
        cellBottom,
      ])}`,
    )
  }

  return {
    left: Math.max(cellLeft, largest.left - 1),
    top: Math.max(cellTop, largest.top - 1),
    width:
      Math.min(cellRight, largest.right + 1) -
      Math.max(cellLeft, largest.left - 1) +
      1,
    height:
      Math.min(cellBottom, largest.bottom + 1) -
      Math.max(cellTop, largest.top - 1) +
      1,
  }
}

const { data, info } = await sharp(source)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

async function writeKeyCrop(keyId, bounds, widthUnits = null) {
  const extracted = await sharp(source)
    .extract(bounds)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  for (let index = 0; index < extracted.data.length; index += 4) {
    const maxChannel = Math.max(
      extracted.data[index],
      extracted.data[index + 1],
      extracted.data[index + 2],
    )
    if (maxChannel <= 3 || extracted.data[index + 3] < 24) {
      extracted.data[index + 3] = 0
    }
  }

  let output = sharp(extracted.data, {
    raw: {
      width: extracted.info.width,
      height: extracted.info.height,
      channels: 4,
    },
  })

  if (widthUnits !== null) {
    output = output.resize({
      width: getNormalizedWidth(widthUnits),
      height: OUTPUT_UNIT_PX,
      fit: "fill",
      kernel: sharp.kernel.nearest,
    })
  }

  await output
    .png({ compressionLevel: 9, palette: true })
    .toFile(path.join(outputDirectory, `${keyId}.png`))
}

if (
  info.width === ROYAL_CREAM_ATLAS.width &&
  info.height === ROYAL_CREAM_ATLAS.height
) {
  await mkdir(outputDirectory, { recursive: true })

  for (let rowIndex = 0; rowIndex < ROW_KEYS.length; rowIndex += 1) {
    const keyIds = ROW_KEYS[rowIndex]
    const columnStarts = ROYAL_CREAM_ATLAS.columnStarts[rowIndex]
    const columnCells = columnStarts.map((left, index) => [
      left,
      (columnStarts[index + 1] ?? ROYAL_CREAM_ATLAS.width) - 1,
    ])
    const rowBand = ROYAL_CREAM_ATLAS.rowBands[rowIndex]

    if (columnCells.length !== keyIds.length) {
      throw new Error(`Royal-cream row ${rowIndex + 1} has an invalid cell map.`)
    }

    for (let keyIndex = 0; keyIndex < keyIds.length; keyIndex += 1) {
      const visibleBounds = findVisibleBounds(
        data,
        info,
        columnCells[keyIndex],
        rowBand,
      )
      const keyId = keyIds[keyIndex]
      const topFaceBounds = trimBounds(visibleBounds, TOP_FACE_TRIM_PX)
      await writeKeyCrop(
        keyId,
        topFaceBounds,
        KEY_WIDTH_UNITS[keyId] ?? 1,
      )
    }
  }

  console.log(
    `Cropped ${ROW_KEYS.flat().length} royal-cream keycap tops from ${path.basename(source)}.`,
  )
  process.exit(0)
}

const populatedRows = []

for (let y = 0; y < info.height; y += 1) {
  let populated = false
  for (let x = 0; x < info.width; x += 1) {
    if (isArtworkPixel(data, (y * info.width + x) * 4)) {
      populated = true
      break
    }
  }
  if (populated) populatedRows.push(y)
}

const rowRuns = contiguousRuns(populatedRows)
if (rowRuns.length !== ROW_KEYS.length) {
  throw new Error(`Expected ${ROW_KEYS.length} key rows, found ${rowRuns.length}`)
}

await mkdir(outputDirectory, { recursive: true })

for (let rowIndex = 0; rowIndex < rowRuns.length; rowIndex += 1) {
  const [top, bottom] = rowRuns[rowIndex]
  const populatedColumns = []

  for (let x = 0; x < info.width; x += 1) {
    let populated = false
    for (let y = top; y <= bottom; y += 1) {
      if (isArtworkPixel(data, (y * info.width + x) * 4)) {
        populated = true
        break
      }
    }
    if (populated) populatedColumns.push(x)
  }

  const keyRuns = contiguousRuns(populatedColumns)
  const keyIds = ROW_KEYS[rowIndex]

  // The normalized source contains one redundant zero key immediately before
  // the correctly shifted ") / 0" cap. Ignore that extra generated cell.
  if (rowIndex === 1 && keyRuns.length === keyIds.length + 1) {
    keyRuns.splice(10, 1)
  }
  if (rowIndex === 2 && keyRuns.length === keyIds.length + 1) {
    keyRuns.splice(12, 1)
  }
  if (rowIndex === 3 && keyRuns.length === keyIds.length + 1) {
    keyRuns.splice(11, 1)
  }
  if (rowIndex === 4 && keyRuns.length === keyIds.length + 1) {
    keyRuns.splice(10, 1)
  }

  if (keyRuns.length !== keyIds.length) {
    throw new Error(
      `Row ${rowIndex + 1}: expected ${keyIds.length} keys, found ${keyRuns.length}: ${JSON.stringify(keyRuns)}`,
    )
  }

  for (let keyIndex = 0; keyIndex < keyRuns.length; keyIndex += 1) {
    const [left, right] = keyRuns[keyIndex]
    const width = right - left + 1
    const height = bottom - top + 1
    await writeKeyCrop(keyIds[keyIndex], { left, top, width, height })
  }
}

console.log(
  `Cropped ${ROW_KEYS.flat().length} individual keycap assets from ${path.basename(source)}.`,
)
