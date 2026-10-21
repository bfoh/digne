// Derives every brand/media asset the site needs from the supplied originals in
// /source-assets. Re-run with `npm run assets` whenever an original changes.
//
// Outputs
//   src/assets/brand/digne-badge.png      transparent badge (static import → next/image)
//   src/assets/brand/digne-mark.json      vector trace of the emblem + wordmark (currentColor SVG)
//   src/assets/images/*.webp              originals, re-encoded and size-capped
//   src/assets/images/details/*.webp      4:5 close-ups of single pieces, cut from the originals
//   src/app/icon.png, apple-icon.png, favicon.ico, opengraph-image.jpg
import { createRequire } from 'node:module';
import { mkdir, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const sharp = require('sharp');
const potrace = require('potrace');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = (p) => path.join(root, 'source-assets', p);
const out = (p) => path.join(root, p);

const BURGUNDY = { r: 0x4b, g: 0x08, b: 0x13 };

// Badge geometry measured from source-assets/logo.webp (1254×1254).
const LOGO_CENTER = 627;
const INNER_CONTENT_RADIUS = 432; // inside the cream inner ring; farthest glyph sits at r≈418

await mkdir(out('src/assets/brand'), { recursive: true });
await mkdir(out('src/assets/images/details'), { recursive: true });

// 1. Transparent badge, trimmed to the gold ring.
const badge = await sharp(src('logo.webp')).trim({ threshold: 1 }).resize(720, 720, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png({ compressionLevel: 9 }).toBuffer();
await writeFile(out('src/assets/brand/digne-badge.png'), badge);

// 2. Knockout emblem: the cream suit/bow-tie mark + script, isolated from the red field.
//    Alpha is derived from the green channel (red field ≈ 0–20, cream ≈ 240).
const { data, info } = await sharp(src('logo.webp')).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;
const mask = Buffer.alloc(W * H);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const dx = x - LOGO_CENTER;
    const dy = y - LOGO_CENTER;
    if (dx * dx + dy * dy > INNER_CONTENT_RADIUS * INNER_CONTENT_RADIUS) continue;
    const g = data[(y * W + x) * C + 1];
    mask[y * W + x] = Math.max(0, Math.min(255, Math.round(((g - 40) / 170) * 255)));
  }
}
const maskImage = sharp(mask, { raw: { width: W, height: H, channels: 1 } });
const trimmedMask = await maskImage.png().toBuffer();

// Trace as black-on-white for potrace (it traces dark shapes).
const traceSource = await sharp(trimmedMask).negate().png().toBuffer();
const svg = await new Promise((resolve, reject) => {
  potrace.trace(traceSource, { threshold: 128, turdSize: 8, optTolerance: 0.25, alphaMax: 1, color: '#000' }, (err, s) => (err ? reject(err) : resolve(s)));
});
// One decimal is visually lossless at this scale and trims the bundled path data substantially.
const pathData = [...svg.matchAll(/ d="([^"]+)"/g)]
  .map((m) => m[1])
  .join(' ')
  .replace(/-?\d+\.\d+/g, (n) => String(Math.round(Number(n) * 10) / 10))
  .replace(/,\s+/g, ',');

// Split subpaths into emblem / script / tagline so the preloader can stage them.
// The emblem's stem dot doubles as the dot of the "i" in Digne, so it sits with the script.
const bboxOf = (d) => {
  const n = d.match(/-?\d+(\.\d+)?/g).map(Number);
  const xs = n.filter((_, i) => i % 2 === 0);
  const ys = n.filter((_, i) => i % 2 === 1);
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
};
const union = (boxes) =>
  boxes.reduce(
    (a, b) => ({ minX: Math.min(a.minX, b.minX), maxX: Math.max(a.maxX, b.maxX), minY: Math.min(a.minY, b.minY), maxY: Math.max(a.maxY, b.maxY) }),
    { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity },
  );
const toViewBox = (b, pad = 4) => [b.minX - pad, b.minY - pad, b.maxX - b.minX + pad * 2, b.maxY - b.minY + pad * 2].map((v) => Math.round(v)).join(' ');

const groups = { emblem: [], script: [], tagline: [] };
for (const sub of pathData.split(/(?=M )/).map((s) => s.trim()).filter(Boolean)) {
  const b = bboxOf(sub);
  if (b.minY < 700) groups.emblem.push(sub);
  else if (b.minX > 630 && b.minY > 840) groups.tagline.push(sub);
  else groups.script.push(sub);
}
const all = [...groups.emblem, ...groups.script, ...groups.tagline];
await writeFile(
  out('src/assets/brand/digne-mark.json'),
  JSON.stringify({
    viewBox: toViewBox(union(all.map(bboxOf))),
    /** Tight box around the "Digne" script alone — used as a large signature. */
    scriptViewBox: toViewBox(union(groups.script.map(bboxOf)), 2),
    emblem: groups.emblem.join(' '),
    script: groups.script.join(' '),
    tagline: groups.tagline.join(' '),
  }),
);
const viewBox = toViewBox(union(all.map(bboxOf)));

// 3. Site imagery — re-encode, cap the long edge at 2000px (originals are ~1450px).
const images = (await readdir(src(''))).filter((f) => f.endsWith('.webp') && f !== 'logo.webp');
for (const f of images) {
  await sharp(src(f)).resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true }).webp({ quality: 86, effort: 6 }).toFile(out(`src/assets/images/${f}`));
}

// 3b. Detail views — the "second picture" a product card reveals on hover until
// real packshots and on-model photography exist. Each is a genuine region of a
// showroom photo (no generation, no upscaling): x, y, w are fractions of the
// source and the height follows a 4:5 portrait crop. The safari crop stops above
// the third-party hang tag (docs/BUSINESS-INPUTS.md).
const DETAILS = [
  { name: 'waistcoat', from: 'burgundy.webp', x: 0.22, y: 0.11, w: 0.5 },
  { name: 'safari', from: 'charcoal.webp', x: 0.31, y: 0.1, w: 0.38 },
  { name: 'pearl', from: 'embellished.webp', x: 0.38, y: 0.08, w: 0.5 },
  { name: 'royal-blue', from: 'showroom.webp', x: 0.52, y: 0.25, w: 0.28 },
  { name: 'check-cuffs', from: 'maroon-check.webp', x: 0.42, y: 0.45, w: 0.3 },
  { name: 'burgundy-cuffs', from: 'maroon-check.webp', x: 0.7, y: 0.45, w: 0.3 },
  { name: 'suit-rails', from: 'suit-wall.webp', x: 0.25, y: 0.2, w: 0.37 },
  { name: 'shirt-shelves', from: 'reception.webp', x: 0.55, y: 0.03, w: 0.27 },
  { name: 'trouser-rail', from: 'boutique.webp', x: 0.56, y: 0.36, w: 0.26 },
];
for (const d of DETAILS) {
  const { width, height } = await sharp(src(d.from)).metadata();
  const w = Math.round(d.w * width);
  const h = Math.round((w * 5) / 4);
  const left = Math.round(d.x * width);
  const top = Math.round(d.y * height);
  if (left + w > width || top + h > height) throw new Error(`Detail crop "${d.name}" falls outside ${d.from}`);
  await sharp(src(d.from)).extract({ left, top, width: w, height: h }).webp({ quality: 88, effort: 6 }).toFile(out(`src/assets/images/details/${d.name}.webp`));
}

// 4. App icons.
async function iconPng(size, bg, scale) {
  const inner = await sharp(badge).resize(Math.round(size * scale)).png().toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: bg } })
    .composite([{ input: inner, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}
const transparent = { r: 0, g: 0, b: 0, alpha: 0 };
await writeFile(out('src/app/icon.png'), await iconPng(512, transparent, 1));
await writeFile(out('src/app/apple-icon.png'), await iconPng(180, { ...BURGUNDY, alpha: 1 }, 0.86));

// favicon.ico with embedded PNG entries (16/32/48) — avoids the default /favicon.ico 404.
const icoSizes = [16, 32, 48];
const pngs = await Promise.all(icoSizes.map((s) => iconPng(s, transparent, 1)));
const header = Buffer.alloc(6 + 16 * pngs.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(pngs.length, 4);
let offset = header.length;
pngs.forEach((png, i) => {
  const e = 6 + i * 16;
  header.writeUInt8(icoSizes[i], e);
  header.writeUInt8(icoSizes[i], e + 1);
  header.writeUInt8(0, e + 2);
  header.writeUInt8(0, e + 3);
  header.writeUInt16LE(1, e + 4);
  header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(png.length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += png.length;
});
await writeFile(out('src/app/favicon.ico'), Buffer.concat([header, ...pngs]));

// 5. Social sharing image: burgundy field with badge (left), boutique photograph (right).
const ogW = 1200;
const ogH = 630;
const photo = await sharp(src('burgundy.webp')).resize(560, ogH, { fit: 'cover', position: 'attention' }).toBuffer();
const ogBadge = await sharp(badge).resize(360).png().toBuffer();
const hairline = Buffer.from(`<svg width="${ogW}" height="${ogH}" xmlns="http://www.w3.org/2000/svg"><rect x="40" y="40" width="${ogW - 80}" height="${ogH - 80}" fill="none" stroke="#C4A46A" stroke-opacity=".55" stroke-width="1"/></svg>`);
await sharp({ create: { width: ogW, height: ogH, channels: 3, background: BURGUNDY } })
  .composite([
    { input: photo, left: ogW - 560, top: 0 },
    { input: ogBadge, left: Math.round((ogW - 560 - 360) / 2), top: Math.round((ogH - 360) / 2) },
    { input: hairline, left: 0, top: 0 },
  ])
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile(out('src/app/opengraph-image.jpg'));

console.log(`brand assets written · mark viewBox ${viewBox} · ${images.length} images · ${DETAILS.length} details`);
