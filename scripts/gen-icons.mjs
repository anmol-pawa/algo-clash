// Generates the PWA icons (pixel-art "{ }" braces around a node) without any
// image dependency: a tiny PNG encoder on top of node:zlib.
import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";

const PAL = { ".": [11, 16, 32], o: [6, 8, 18], t: [94, 234, 212], d: [32, 150, 150], a: [251, 191, 36], w: [255, 247, 214] };
// 16x16 grid: outlined braces, a glowing node in the middle
const GRID = [
  "................",
  "....oooo..oooo..",
  "...ottdo..odttdo",
  "...otdoo..oodtdo",
  "...otdo....odtdo",
  "...otdo....odtdo",
  "..ottdo.oo..odttd",
  "..otdo.owao..odto",
  "..otdo.oaao..odto",
  "..ottdo.oo..odttd",
  "...otdo....odtdo",
  "...otdo....odtdo",
  "...otdoo..oodtdo",
  "...ottdo..odttdo",
  "....oooo..oooo..",
  "................",
].map((r) => r.padEnd(16, ".").slice(0, 16));

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const c = Buffer.alloc(4);
  c.writeUInt32BE(crc(td));
  return Buffer.concat([len, td, c]);
};

function png(size, pad) {
  const cells = 16 + pad * 2;
  const scale = Math.floor(size / cells);
  const off = Math.floor((size - cells * scale) / 2);
  const raw = Buffer.alloc((size * 3 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 3 + 1)] = 0;
    for (let x = 0; x < size; x++) {
      const gx = Math.floor((x - off) / scale) - pad;
      const gy = Math.floor((y - off) / scale) - pad;
      const ch = gx >= 0 && gy >= 0 && gx < 16 && gy < 16 ? GRID[gy][gx] : ".";
      const [r, g, b] = PAL[ch] ?? PAL["."];
      const i = y * (size * 3 + 1) + 1 + x * 3;
      raw[i] = r; raw[i + 1] = g; raw[i + 2] = b;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]);
}

writeFileSync("public/icon-192.png", png(192, 1));
writeFileSync("public/icon-512.png", png(512, 3)); // extra padding keeps the maskable safe zone
writeFileSync("app/icon.png", png(256, 1));
writeFileSync("app/apple-icon.png", png(180, 1));
console.log("icons written");
