import { mkdir, readdir } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const [sourceDirectory, outputDirectory, palette = "cream"] =
  process.argv.slice(2)

if (
  !sourceDirectory ||
  !outputDirectory ||
  !["cream", "charcoal"].includes(palette)
) {
  console.error(
    "Usage: node scripts/recolor-keycap-sides.mjs <source-directory> <output-directory> [cream|charcoal]",
  )
  process.exit(1)
}

const clamp = (value, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value))
const mix = (start, end, amount) =>
  Math.round(start + (end - start) * amount)

function recolorPurpleSides(data) {
  const darkColor = palette === "charcoal" ? [22, 23, 24] : [184, 132, 82]
  const lightColor = palette === "charcoal" ? [61, 62, 63] : [249, 216, 172]

  for (let index = 0; index < data.length; index += 4) {
    if (data[index + 3] === 0) continue

    const red = data[index]
    const green = data[index + 1]
    const blue = data[index + 2]
    const maximum = Math.max(red, green, blue)

    if (green > 45 && green > red * 1.35 && green > blue * 1.35) {
      data[index + 3] = 0
      continue
    }

    // Preserve the sheet's gold corner glints and highlights.
    const isGold =
      red > 105 &&
      green > 45 &&
      red > blue * 1.35 &&
      green > blue * 0.75
    if (isGold) continue

    // Turn the purple shell and its dark outline into the matching warm
    // cream/brown ramp used by the supplied light keycaps.
    const isPurple =
      blue > green * 1.2 &&
      red > green * 1.15
    if (maximum < 52) {
      const amount = clamp(maximum / 52)
      // The source sprite uses a near-black outer outline. Keep that treatment
      // for charcoal, but lift it into the cream ramp for light keycaps so an
      // oblique end face cannot collapse it into a black vertical stripe.
      const darkest = palette === "charcoal" ? [10, 11, 12] : [178, 128, 78]
      const brightest = palette === "charcoal" ? [30, 31, 32] : [224, 181, 126]
      data[index] = mix(darkest[0], brightest[0], amount)
      data[index + 1] = mix(darkest[1], brightest[1], amount)
      data[index + 2] = mix(darkest[2], brightest[2], amount)
      continue
    }

    if (isPurple) {
      const purpleBrightness = red * 0.42 + blue * 0.58
      const amount = clamp((purpleBrightness - 35) / 100)
      data[index] = mix(darkColor[0], lightColor[0], amount)
      data[index + 1] = mix(darkColor[1], lightColor[1], amount)
      data[index + 2] = mix(darkColor[2], lightColor[2], amount)
    }

    if (palette === "cream") {
      const outputBrightness =
        (data[index] + data[index + 1] + data[index + 2]) / 3
      if (outputBrightness < 96) {
        const amount = clamp(outputBrightness / 96)
        data[index] = mix(178, 210, amount)
        data[index + 1] = mix(128, 168, amount)
        data[index + 2] = mix(78, 116, amount)
      }
    }
  }
}

async function recolorDirectory(source, output) {
  await mkdir(output, { recursive: true })
  const entries = await readdir(source, { withFileTypes: true })
  let count = 0

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name)
    const outputPath = path.join(output, entry.name)

    if (entry.isDirectory()) {
      count += await recolorDirectory(sourcePath, outputPath)
      continue
    }
    if (!entry.isFile() || path.extname(entry.name).toLowerCase() !== ".webp") {
      continue
    }

    const extracted = await sharp(sourcePath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })
    recolorPurpleSides(extracted.data)

    await sharp(extracted.data, {
      raw: {
        width: extracted.info.width,
        height: extracted.info.height,
        channels: 4,
      },
    })
      .webp({ lossless: true, effort: 6 })
      .toFile(outputPath)
    count += 1
  }

  return count
}

const count = await recolorDirectory(sourceDirectory, outputDirectory)
console.log(`Created ${count} ${palette} keycap side assets.`)
