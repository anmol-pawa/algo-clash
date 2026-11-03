// Usage: node scripts/smoke-forge.mjs <baseUrl>. Forge smoke: trace tier, both cloze tiers (filled with the reference tokens), Blank tier with the reference solution.
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
const require = createRequire(import.meta.url);
const { chromium, devices } = require("playwright");
const base = process.argv[2] ?? "http://localhost:3000";
const shots = process.env.SHOT_DIR;
const solution = readFileSync("content/problems/R0/pouch-sum/solution.cpp", "utf8");
/** The masked text is the reference with some tokens removed: put the removed tokens back by matching the gaps. */
function recover(parts, full) {
  const n = parts.length - 1;
  const go = (i, pos) => {
    if (i === n) return pos === full.length ? [] : null;
    for (let end = pos + 1; end <= Math.min(full.length, pos + 12); ++end) {
      const tok = full.slice(pos, end);
      if (/\s/.test(tok) || !full.startsWith(parts[i + 1], end)) continue;
      const rest = go(i + 1, end + parts[i + 1].length);
      if (rest) return [tok, ...rest];
    }
    return null;
  };
  return full.startsWith(parts[0]) ? go(0, parts[0].length) : null;
}
const browser = await chromium.launch();
let failed = false;
const fail = (m) => { console.error("FAIL", m); failed = true; };
for (const [name, opts] of [["desktop", { viewport: { width: 1280, height: 800 } }], ["iphone", devices["iPhone 14"]]]) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  const shot = async (n) => { if (shots) await page.screenshot({ path: `${shots}/forge-${name}-${n}.png`, fullPage: true }); };
  const overflow = async (n) => { if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)) fail(`${name}: overflow at ${n}`); };
  await page.goto(`${base}/forge/`);
  await page.getByRole("list", { name: "Scrolls" }).waitFor();
  await shot("list"); await overflow("list");
  await page.getByRole("button", { name: /Scroll of the Running Total/ }).click();
  // locked tiers
  const tiers = page.getByRole("navigation", { name: "Tiers" });
  if (!(await tiers.getByRole("button", { name: /Cloze 30/ }).isDisabled())) fail(`${name}: Cloze 30% should be locked`);
  await shot("trace"); await overflow("trace");
  // answer the 5 trace cards from the natively computed outputs shown after a wrong answer: type nothing smart, so read expected
  const cardsRoot = page.getByRole("region", { name: "Concept card" });
  for (let i = 0; i < 5; ++i) {
    const ta = cardsRoot.locator("textarea");
    await ta.fill("0");
    await cardsRoot.getByRole("button", { name: "Check" }).click();
    const expected = await cardsRoot.getByTestId("expected").innerText().catch(() => "");
    const real = expected.replace(/^Real output:\s*/, "").replace(/ ⏎ /g, "\n");
    await cardsRoot.getByRole("button", { name: /Next|Finish/ }).click();
    (globalThis.__answers ??= []).push(real || "0");
  }
  // all wrong on purpose: must not pass
  await page.getByTestId("trace-result").waitFor();
  if (/passed/.test(await page.getByTestId("trace-result").innerText())) fail(`${name}: trace passed with wrong answers`);
  await shot("trace-failed");
  // redo, answering correctly using the recorded real outputs (deck order is seeded, so answers align by card order on retry)
  await page.getByRole("button", { name: "Again" }).click();
  for (let i = 0; i < 5; ++i) {
    // read the expected output by answering wrong first is not possible twice; use the recorded list by matching prompt order
    await cardsRoot.locator("textarea").fill(globalThis.__answers[i]);
    await cardsRoot.getByRole("button", { name: "Check" }).click();
    await cardsRoot.getByRole("button", { name: /Next|Finish/ }).click();
  }
  await page.getByTestId("trace-result").filter({ hasText: "Trace passed" }).waitFor();
  await shot("trace-passed");
  for (const [label, tid] of [["Cloze 30", "cloze30"], ["Cloze 70", "cloze70"]]) {
    await tiers.getByRole("button", { name: new RegExp(label) }).click();
    const code = page.getByLabel("template with blanks");
    await code.waitFor();
    await shot(`${tid}-empty`); await overflow(tid);
    const n = await code.locator("input").count();
    // wrong fill first: the judge must reject
    for (let i = 0; i < n; ++i) await code.locator("input").nth(i).fill("0");
    await page.getByRole("button", { name: /Check with the judge/ }).click();
    await page.getByText(/Compile error|Wrong answer|Time limit|Runtime error/).first().waitFor({ timeout: 120000 });
    await shot(`${tid}-wrong`);
    // right fill: reconstruct from the reference by reading the mask (template text with ___) is in DOM as input positions; use data from page
    const parts = await code.evaluate((el) => { const c = el.cloneNode(true); c.querySelectorAll("input").forEach((i) => i.replaceWith("\u0000")); return c.textContent.split("\u0000"); });
    const answers = recover(parts, solution.replace(/\n$/, ""));
    if (!answers) { console.error(JSON.stringify(parts)); fail(`${name}: could not recover the reference tokens for ${tid}`); break; }
    for (let i = 0; i < n; ++i) await code.locator("input").nth(i).fill(answers[i]);
    await page.getByRole("button", { name: /Check with the judge/ }).click();
    await page.getByText("Accepted").first().waitFor({ timeout: 120000 });
    await shot(`${tid}-ac`);
  }
  await tiers.getByRole("button", { name: /Blank/ }).click();
  await page.getByRole("button", { name: "Start the clock" }).click();
  await page.getByTestId("forge-timer").waitFor();
  // replace editor contents with the reference solution
  const editor = page.locator(".cm-content");
  await editor.click();
  await page.keyboard.press("Control+A");
  await page.keyboard.insertText(solution);
  await shot("blank-typed"); await overflow("blank");
  await page.getByRole("button", { name: "Submit" }).click();
  await page.getByText("Accepted").first().waitFor({ timeout: 120000 });
  await page.getByText(/Under par|over par/).waitFor();
  await shot("blank-ac");
  const st = await page.getByTestId("scroll-status").innerText();
  if (st !== "Inscribed") fail(`${name}: status ${st}`);
  // progress persists across reload
  await page.reload();
  await page.getByRole("list", { name: "Scrolls" }).waitFor();
  await page.getByText("Inscribed").first().waitFor();
  await shot("list-after");
  if (errors.length) fail(`${name}: console errors: ${errors.join(" | ")}`);
  await ctx.close();
}
await browser.close();
if (failed) process.exit(1);
console.log("forge smoke OK");
