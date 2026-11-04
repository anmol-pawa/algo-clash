// Usage: node scripts/smoke-audio.mjs <baseUrl>. Audio smoke: a spy AudioContext proves music starts after the first gesture, SFX play on button presses, the mute switch silences them, and prefs persist.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium, devices } = require("playwright");
const base = process.argv[2] ?? "http://localhost:3000";
const shots = process.env.SHOT_DIR;
const browser = await chromium.launch();
let failed = false;
const fail = (m) => { console.error("FAIL", m); failed = true; };
const SPY = () => {
  const stats = { oscillators: 0, sources: 0, contexts: 0, sinkGain: [] };
  window.__audio = stats;
  class Param { constructor(g) { this.g = g; this.value = 1; } setValueAtTime() {} linearRampToValueAtTime() {} exponentialRampToValueAtTime() {} setTargetAtTime(v) { this.g.target = v; stats.sinkGain.push(v); } }
  class Node { connect(n) { return n; } }
  class Gain extends Node { constructor() { super(); this.gain = new Param(this); } }
  class Osc extends Node { constructor() { super(); stats.oscillators++; this.frequency = new Param({}); } start() {} stop() {} }
  class Src extends Node { constructor() { super(); stats.sources++; } start() {} stop() {} }
  class Filt extends Node { constructor() { super(); this.frequency = {}; } }
  window.AudioContext = class {
    constructor() { stats.contexts++; this.currentTime = 0; this.state = "running"; this.sampleRate = 8000; this.destination = new Node(); setInterval(() => { this.currentTime += 0.1; }, 100); }
    createGain() { return new Gain(); } createOscillator() { return new Osc(); } createBufferSource() { return new Src(); } createBiquadFilter() { return new Filt(); }
    createBuffer(c, n) { const d = new Float32Array(n); return { getChannelData: () => d }; } resume() { return Promise.resolve(); }
  };
};
for (const [name, opts] of [["desktop", { viewport: { width: 1280, height: 800 } }], ["iphone", devices["iPhone 14"]]]) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  await page.addInitScript(SPY);
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  const stats = () => page.evaluate(() => ({ ...window.__audio }));
  await page.goto(`${base}/`);
  await page.getByRole("link", { name: "GYM" }).waitFor();
  if ((await stats()).contexts !== 0) fail(`${name}: AudioContext created before any gesture`);
  await page.getByRole("button", { name: /Open sound settings/ }).click();
  await page.waitForTimeout(700);
  let s = await stats();
  if (s.contexts !== 1) fail(`${name}: expected 1 context after gesture, got ${s.contexts}`);
  if (s.oscillators < 3) fail(`${name}: music did not schedule notes (${s.oscillators})`);
  const panel = page.getByRole("group", { name: "Sound settings" });
  await panel.waitFor();
  if (shots) await page.screenshot({ path: `${shots}/audio-${name}-panel.png` });
  if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)) fail(`${name}: overflow`);
  await page.waitForTimeout(1500);
  const before = (await stats()).oscillators;
  if (before <= s.oscillators + 2) fail(`${name}: music is not progressing (${s.oscillators} -> ${before})`);
  await page.getByRole("checkbox", { name: "Sound" }).uncheck();
  await page.waitForTimeout(300);
  s = await stats();
  if (s.sinkGain.at(-1) !== 0 || s.sinkGain.at(-2) !== 0) fail(`${name}: mute did not zero the buses (${s.sinkGain.slice(-3)})`);
  const stored = await page.evaluate(() => localStorage.getItem("algo-clash:audio"));
  if (!stored || !JSON.parse(stored).muted) fail(`${name}: muted pref not persisted`);
  await page.reload();
  await page.getByRole("button", { name: /Sound off/ }).waitFor();
  if (before < 1) fail(`${name}: no oscillators before mute`);
  // SFX: a button press while unmuted makes a blip.
  await page.getByRole("button", { name: /Open sound settings/ }).click();
  await page.getByRole("checkbox", { name: "Sound" }).check();
  const o1 = (await stats()).oscillators;
  await page.getByRole("link", { name: "GYM" }).click({ trial: true });
  await page.getByRole("button", { name: /Open sound settings/ }).click();
  await page.waitForTimeout(200);
  if ((await stats()).oscillators <= o1) fail(`${name}: no menu blip on button press`);
  // Overworld has its own song.
  await page.goto(`${base}/play/`);
  await page.waitForTimeout(600);
  if (errors.length) fail(`${name}: console errors ${errors.join(" | ")}`);
  await ctx.close();
}
await browser.close();
if (failed) process.exit(1);
console.log("audio smoke OK");
