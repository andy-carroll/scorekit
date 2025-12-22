import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import sharp from "sharp";

function getArgValue(args, name) {
  const idx = args.indexOf(name);
  if (idx === -1) return undefined;
  return args[idx + 1];
}

async function main() {
  const args = process.argv.slice(2);

  const dirArg = getArgValue(args, "--dir");
  const densityArg = getArgValue(args, "--density");
  const maxWidthArg = getArgValue(args, "--max-width");

  const svgDir = path.resolve(process.cwd(), dirArg ?? "apps/web/public/logos");
  const density = densityArg ? Number(densityArg) : 300;
  const maxWidth = maxWidthArg ? Number(maxWidthArg) : 800;

  if (!Number.isFinite(density) || density <= 0) {
    throw new Error(`Invalid --density: ${densityArg}`);
  }

  if (!Number.isFinite(maxWidth) || maxWidth <= 0) {
    throw new Error(`Invalid --max-width: ${maxWidthArg}`);
  }

  const entries = await fs.readdir(svgDir, { withFileTypes: true });
  const svgFiles = entries
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".svg"))
    .map((e) => e.name);

  if (svgFiles.length === 0) {
    process.stdout.write(`No SVG files found in ${svgDir}\n`);
    return;
  }

  for (const svgFile of svgFiles) {
    const inPath = path.join(svgDir, svgFile);
    const outPath = path.join(svgDir, `${path.basename(svgFile, ".svg")}.png`);

    await sharp(inPath, { density })
      .resize({ width: maxWidth, fit: "inside", withoutEnlargement: true })
      .png()
      .toFile(outPath);

    process.stdout.write(`Converted ${path.relative(process.cwd(), inPath)} -> ${path.relative(process.cwd(), outPath)}\n`);
  }
}

await main();
