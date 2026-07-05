#!/usr/bin/env node
/**
 * Download every Lovable CDN asset referenced by a `.asset.json` pointer
 * under src/assets/ into public/media/, preserving the sub-path.
 *
 * Idempotent: skips files already on disk with a non-zero size.
 * Usage:  bun run download-media   (or)   node scripts/download-media.mjs
 */
import { readdir, readFile, mkdir, stat } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { pipeline } from "node:stream/promises";

const ROOT = resolve(process.cwd());
const ASSETS_DIR = join(ROOT, "src", "assets");
const OUT_DIR = join(ROOT, "public", "media");
const CDN_BASES = [
  process.env.LOVABLE_ASSET_BASE?.replace(/\/+$/, ""),
  "https://terostudios.lovable.app",
  "https://12ac4244-7645-4fb2-a900-5ab683320d3c.lovableproject.com",
].filter(Boolean);

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.isFile() && entry.name.endsWith(".asset.json")) yield full;
  }
}

async function fileExistsWithSize(path) {
  try {
    const s = await stat(path);
    return s.isFile() && s.size > 0;
  } catch {
    return false;
  }
}

async function fetchWithFallback(cdnPath) {
  let lastErr;
  for (const base of CDN_BASES) {
    const url = `${base}${cdnPath}`;
    try {
      const res = await fetch(url);
      if (res.ok && res.body) return res;
      lastErr = new Error(`HTTP ${res.status} for ${url}`);
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr ?? new Error(`No CDN base reachable for ${cdnPath}`);
}

let downloaded = 0;
let skipped = 0;
let failed = 0;

for await (const pointerPath of walk(ASSETS_DIR)) {
  const raw = await readFile(pointerPath, "utf8");
  let pointer;
  try {
    pointer = JSON.parse(raw);
  } catch {
    console.warn(`skip (bad JSON): ${relative(ROOT, pointerPath)}`);
    continue;
  }
  if (!pointer?.url || !pointer?.original_filename) continue;

  // Preserve sub-path: src/assets/videos/foo.mp4.asset.json → public/media/videos/foo.mp4
  const relFromAssets = relative(ASSETS_DIR, pointerPath).replace(/\.asset\.json$/, "");
  const outPath = join(OUT_DIR, relFromAssets);

  if (await fileExistsWithSize(outPath)) {
    skipped++;
    continue;
  }

  await mkdir(dirname(outPath), { recursive: true });
  process.stdout.write(`↓ ${relative(ROOT, outPath)} ... `);
  try {
    const res = await fetchWithFallback(pointer.url);
    await pipeline(res.body, createWriteStream(outPath));
    downloaded++;
    console.log("ok");
  } catch (err) {
    failed++;
    console.log(`FAILED (${err.message})`);
  }
}

console.log(`\nDone. downloaded=${downloaded} skipped=${skipped} failed=${failed}`);
if (failed > 0) process.exit(1);
