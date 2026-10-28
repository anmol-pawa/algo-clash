// Generates the original pixel-art app icons (public/icon-*.png, app/icon.png, app/apple-icon.png).
import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";

const G = 16;
const BG = [7, 11, 20], TEAL = [94, 234, 212], DK = [20, 60, 70], MID = [40, 120, 130];
const A = ["...XXXX...", "..XX..XX..", ".XX....XX.", ".XX....XX.", ".XXXXXXXX.", ".XX....XX.", ".XX....XX.", ".XX....XX."];
const grid = Array.from({ length: G }, () => Array.from({ length: G }, () => BG));
A.forEach((row, y) => [...row].forEach((c, x) => { if (c === "X") grid[y + 2][x + 3] = TEAL; }));
for (let x = 1; x < 15; x++) { grid[12][x] = DK; grid[13][x] = x % 2 ? MID : DK; }

const crcT = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc = (b) => { let c = 0xffffffff; for (const x of b) c = crcT[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const chunk = (t, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
function png(n) {
  const s = n / G, raw = [];
  for (let y = 0; y < n; y++) { raw.push(0); for (let x = 0; x < n; x++) raw.push(...grid[Math.floor(y / s)][Math.floor(x / s)]); }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(n, 0); ihdr.writeUInt32BE(n, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", deflateSync(Buffer.from(raw))), chunk("IEND", Buffer.alloc(0))]);
}
writeFileSync("public/icon-192.png", png(192));
writeFileSync("public/icon-512.png", png(512));
writeFileSync("app/icon.png", png(512));
writeFileSync("app/apple-icon.png", png(192));
