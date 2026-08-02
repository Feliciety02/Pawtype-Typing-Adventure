import { mkdir } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const [source, outputDirectory] = process.argv.slice(2)

if (!source || !outputDirectory) {
  console.error(
    "Usage: node scripts/crop-keycap-sides.mjs <atlas.webp> <output-directory>",
  )
  process.exit(1)
}

const profiles = {
  "1u": {
    front: [72, 82, 108, 58],
    back: [72, 140, 108, 57],
    left: [72, 200, 108, 53],
    right: [72, 256, 108, 52],
  },
  "1-25u": {
    front: [202, 82, 112, 58],
    back: [202, 140, 112, 57],
    left: [202, 200, 112, 53],
    right: [202, 256, 112, 52],
  },
  "1-5u": {
    front: [344, 82, 124, 58],
    back: [344, 140, 124, 57],
    left: [344, 200, 124, 53],
    right: [344, 256, 124, 52],
  },
  "1-75u": {
    front: [505, 82, 146, 58],
    back: [505, 140, 146, 57],
    left: [505, 200, 146, 53],
    right: [505, 256, 146, 52],
  },
  "2u": {
    front: [688, 82, 164, 58],
    back: [688, 140, 164, 57],
    left: [688, 200, 164, 53],
    right: [688, 256, 164, 52],
  },
  "2-25u": {
    front: [62, 360, 196, 58],
    back: [62, 418, 196, 52],
    left: [62, 470, 196, 58],
    right: [62, 528, 196, 58],
  },
  "2-75u": {
    front: [292, 360, 258, 58],
    back: [292, 418, 258, 52],
    left: [292, 470, 258, 58],
    right: [292, 528, 258, 58],
  },
  "6-25u": {
    front: [60, 622, 370, 58],
    back: [60, 680, 370, 46],
    left: [60, 726, 370, 42],
    right: [60, 768, 370, 42],
  },
}
const RENDERED_ORIENTATIONS = new Set(["front", "back"])

function removeChroma(data) {
  for (let index = 0; index < data.length; index += 4) {
    const red = data[index]
    const green = data[index + 1]
    const blue = data[index + 2]
    if (green > 45 && green > red * 1.35 && green > blue * 1.35) {
      data[index + 3] = 0
    }
  }
}

await mkdir(outputDirectory, { recursive: true })

let cropCount = 0
for (const [size, orientations] of Object.entries(profiles)) {
  const sizeDirectory = path.join(outputDirectory, size)
  await mkdir(sizeDirectory, { recursive: true })

  for (const [orientation, [left, top, width, height]] of Object.entries(
    orientations,
  )) {
    if (!RENDERED_ORIENTATIONS.has(orientation)) continue

    const extracted = await sharp(source)
      .extract({ left, top, width, height })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })

    removeChroma(extracted.data)

    await sharp(extracted.data, {
      raw: {
        width: extracted.info.width,
        height: extracted.info.height,
        channels: 4,
      },
    })
      .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 4 })
      .webp({ lossless: true, effort: 6 })
      .toFile(path.join(sizeDirectory, `${orientation}.webp`))

    cropCount += 1
  }
}

console.log(`Cropped ${cropCount} directional keycap side assets.`)
