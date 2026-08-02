import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT_DIR = process.cwd();
const requestedDirectory = process.argv[2] ?? "public";
const SOURCE_DIR = path.resolve(ROOT_DIR, requestedDirectory);
const SOURCE_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".bmp",
  ".tif",
  ".tiff",
]);

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);
      return entry.isDirectory() ? walk(fullPath) : [fullPath];
    }),
  );
  return files.flat();
}

function targetPathFor(filePath) {
  const parsed = path.parse(filePath);
  return path.join(parsed.dir, `${parsed.name}.webp`);
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function decodedRgba(filePath) {
  return sharp(filePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
}

function assertVisiblePixelsEqual(source, target, filePath) {
  if (
    source.info.width !== target.info.width ||
    source.info.height !== target.info.height ||
    source.data.length !== target.data.length
  ) {
    throw new Error(`Dimensions changed during conversion: ${filePath}`);
  }

  for (let index = 0; index < source.data.length; index += 4) {
    const sourceAlpha = source.data[index + 3];
    const targetAlpha = target.data[index + 3];
    if (sourceAlpha !== targetAlpha) {
      throw new Error(`Alpha changed at pixel ${index / 4}: ${filePath}`);
    }
    if (
      sourceAlpha > 0 &&
      (source.data[index] !== target.data[index] ||
        source.data[index + 1] !== target.data[index + 1] ||
        source.data[index + 2] !== target.data[index + 2])
    ) {
      throw new Error(`Visible color changed at pixel ${index / 4}: ${filePath}`);
    }
  }
}

async function convertAndValidate(filePath) {
  const targetPath = targetPathFor(filePath);
  if (await exists(targetPath)) {
    throw new Error(`Target already exists, refusing to overwrite: ${targetPath}`);
  }

  const sourcePixels = await decodedRgba(filePath);
  await sharp(filePath)
    .webp({ lossless: true, effort: 6 })
    .toFile(targetPath);

  const metadata = await sharp(targetPath).metadata();
  if (
    metadata.format !== "webp" ||
    metadata.width !== sourcePixels.info.width ||
    metadata.height !== sourcePixels.info.height
  ) {
    throw new Error(`Output did not validate as WebP: ${targetPath}`);
  }

  const targetPixels = await decodedRgba(targetPath);
  assertVisiblePixelsEqual(sourcePixels, targetPixels, filePath);
  return targetPath;
}

async function main() {
  const allFiles = await walk(SOURCE_DIR);
  const imageFiles = allFiles
    .filter((filePath) =>
      SOURCE_EXTENSIONS.has(path.extname(filePath).toLowerCase()),
    )
    .sort((a, b) => a.localeCompare(b));

  if (imageFiles.length === 0) {
    console.log(`No convertible images found under ${SOURCE_DIR}.`);
    return;
  }

  const sourceBytes = (
    await Promise.all(imageFiles.map((filePath) => fs.stat(filePath)))
  ).reduce((total, stats) => total + stats.size, 0);
  const createdTargets = [];

  try {
    for (const [index, filePath] of imageFiles.entries()) {
      createdTargets.push(await convertAndValidate(filePath));
      if ((index + 1) % 25 === 0 || index + 1 === imageFiles.length) {
        console.log(`Converted and validated ${index + 1}/${imageFiles.length} files...`);
      }
    }
  } catch (error) {
    await Promise.all(
      createdTargets.map((filePath) => fs.unlink(filePath).catch(() => {})),
    );
    throw error;
  }

  // Originals are removed only after every replacement has decoded and passed
  // the pixel, alpha, format, and dimension checks above.
  await Promise.all(imageFiles.map((filePath) => fs.unlink(filePath)));

  const webpBytes = (
    await Promise.all(createdTargets.map((filePath) => fs.stat(filePath)))
  ).reduce((total, stats) => total + stats.size, 0);
  const savings = sourceBytes - webpBytes;
  const savingsPercent = (savings / sourceBytes) * 100;
  console.log(
    `Converted ${imageFiles.length} images losslessly: ${sourceBytes} -> ${webpBytes} bytes (${savingsPercent.toFixed(1)}% smaller).`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? (error.stack ?? error.message) : error);
  process.exitCode = 1;
});
