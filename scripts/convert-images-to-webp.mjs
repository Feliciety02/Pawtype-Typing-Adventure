import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT_DIR = process.cwd();
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const SOURCE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".gif", ".bmp", ".tif", ".tiff"]);

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return walk(fullPath);
      }
      return [fullPath];
    }),
  );
  return files.flat();
}

function backupPathFor(filePath) {
  return `${filePath}.bak`;
}

function targetPathFor(filePath) {
  const parsed = path.parse(filePath);
  return path.join(parsed.dir, `${parsed.name}.webp`);
}

async function ensureReadable(filePath) {
  const stats = await fs.stat(filePath);
  if (stats.size <= 0) {
    throw new Error(`Output file is empty: ${filePath}`);
  }

  const metadata = await sharp(filePath).metadata();
  if (!metadata.width || !metadata.height || metadata.format !== "webp") {
    throw new Error(`Output file did not validate as webp: ${filePath}`);
  }
}

async function convertFile(filePath) {
  const backupPath = backupPathFor(filePath);
  const targetPath = targetPathFor(filePath);

  if (await exists(backupPath)) {
    throw new Error(`Backup already exists, refusing to continue: ${backupPath}`);
  }

  if (await exists(targetPath)) {
    await ensureReadable(targetPath);
    throw new Error(`Target already exists, refusing to overwrite: ${targetPath}`);
  }

  await fs.copyFile(filePath, backupPath);

  try {
    await sharp(backupPath).webp({ quality: 90 }).toFile(targetPath);
    await ensureReadable(targetPath);
    await fs.unlink(filePath);
    await fs.unlink(backupPath);
    return {
      filePath,
      targetPath,
      status: "converted",
    };
  } catch (error) {
    await safeCleanup(targetPath);
    await restoreOriginal(filePath, backupPath);
    throw error;
  }
}

async function restoreOriginal(filePath, backupPath) {
  if (!(await exists(backupPath))) {
    return;
  }

  if (!(await exists(filePath))) {
    await fs.copyFile(backupPath, filePath);
  }
}

async function safeCleanup(filePath) {
  if (await exists(filePath)) {
    await fs.unlink(filePath);
  }
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const allFiles = await walk(PUBLIC_DIR);
  const imageFiles = allFiles
    .filter((filePath) => SOURCE_EXTENSIONS.has(path.extname(filePath).toLowerCase()))
    .sort((a, b) => a.localeCompare(b));

  const results = [];

  for (const filePath of imageFiles) {
    const result = await convertFile(filePath);
    results.push(result);
    if (results.length % 25 === 0 || results.length === imageFiles.length) {
      console.log(`Converted ${results.length}/${imageFiles.length} files...`);
    }
  }

  console.log(`Converted ${results.length} files to webp.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? (error.stack ?? error.message) : error);
  process.exitCode = 1;
});
