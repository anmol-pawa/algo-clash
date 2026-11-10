// Usage: node scripts/smoke-gym-atoll.mjs <baseUrl>. Atoll gym smoke: blitz (all right), core battle, signature battle with a -Wconversion narrowing first, badge + persistence.
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
const require = createRequire(import.meta.url);
const { chromium, devices } = require("playwright");
const base = process.argv[2] ?? "http://localhost:3000";
const shots = process.env.SHOT_DIR;
const answers = [...readFileSync("content/gyms/r2.ts", "utf8").matchAll(/answer: "((?:[^"\\]|\\.)*)"/g)].map((m) => m[1].replace(/\\"/g, '"'));
const sol = (id) => readFileSync(`content/problems/R2/${id}/solution.cpp`, "utf8");
const browser = await chromium.launch();
let failed = false;
const fail = (m) => { console.error("FAIL", m); failed = true; };
for (const [name, opts] of [["desktop", { viewport: { width: 1280, height: 800 } }], ["iphone", devices["iPhone 14"]]].filter(([n]) => !process.env.ONLY || process.env.ONLY === n)) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  const shot = async (n) => { if (shots) await page.screenshot({ path: `${shots}/gym-atoll-${name}-${n}.png`, fullPage: true }); };
  const overflow = async (n) => { if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)) fail(`${name}: overflow at ${n}`); };
  await page.goto(`${base}/gym/atoll/`);
  await page.getByTestId("gym-intro").waitFor();
  await shot("intro"); await overflow("intro");
  await page.getByRole("button", { name: /Challenge Mira/ }).click();
  for (let i = 0; i < answers.length; ++i) {
    await page.getByTestId("blitz").waitFor();
    await page.getByRole("group", { name: "Options" }).getByRole("button", { name: answers[i], exact: true }).click();
    await page.getByTestId("blitz-why").waitFor();
    if (i === 1) { await shot("blitz-answered"); await overflow("blitz"); }
    await page.getByTestId("blitz-why").getByRole("button").click();
  }
  await page.getByTestId("gym-interstitial").waitFor();
  const text = await page.getByTestId("gym-interstitial").innerText();
  if (!/8\/8/.test(text)) fail(`${name}: expected 8/8 blitz, got: ${text}`);
  await shot("core-card");
  await page.getByRole("button", { name: /Begin/ }).click();
  const solve = async (code) => {
    if (name === "iphone") await page.getByRole("tab", { name: "Code" }).click();
    await page.locator(".cm-content").waitFor({ timeout: 60000 });
    await page.waitForTimeout(2000);
    await page.locator(".cm-content").click();
    await page.keyboard.press("Control+A");
    await page.keyboard.insertText(code);
    await page.getByRole("button", { name: /^Submit/ }).click();
  };
  const debrief = async () => {
    await page.getByTestId("debrief").waitFor({ timeout: 15000 }).catch(() => fail(`${name}: no debrief`));
    await page.getByTestId("debrief").getByRole("button", { name: /^Continue/ }).click();
  };
  await page.waitForTimeout(2500);
  if (name === "iphone") await page.getByRole("tab", { name: "Stage" }).click();
  await page.waitForTimeout(800); await shot("battle-stage"); await overflow("stage");
  await solve(sol("exact-stretches"));
  await page.getByRole("button", { name: /Foe beaten/ }).waitFor({ timeout: 180000 });
  await page.getByRole("button", { name: /Foe beaten/ }).click();
  await debrief();
  await page.getByTestId("gym-interstitial").waitFor();
  await page.getByRole("button", { name: /Begin/ }).click();
  // a narrowing long long -> int conversion is a warning, which the twist turns into a compile error
  await solve(sol("tide-pools").replace(/(long long poolVolume\(vector<int> heights\) \{)/, "$1\n        long long wide = 7; int narrow = wide; (void)narrow;"));
  await page.getByText(/conversion/i).first().waitFor({ timeout: 120000 }).catch(() => fail(`${name}: -Wconversion did not surface the narrowing`));
  await shot("sig-narrowing");
  await solve(sol("tide-pools"));
  await page.getByRole("button", { name: /Foe beaten/ }).waitFor({ timeout: 180000 });
  await page.getByRole("button", { name: /Foe beaten/ }).click();
  await debrief();
  await page.getByTestId("gym-end").waitFor({ timeout: 15000 });
  const end = await page.getByTestId("gym-end").innerText();
  if (!/Tidal Badge earned/.test(end)) fail(`${name}: no badge: ${end}`);
  await shot("badge"); await overflow("badge");
  await page.reload();
  await page.getByText(/already hold the Tidal Badge/).waitFor({ timeout: 15000 }).catch(() => fail(`${name}: badge not persisted`));
  if (errors.length) fail(`${name}: console errors: ${errors.join(" | ")}`);
  await ctx.close();
}
await browser.close();
process.exit(failed ? 1 : 0);
