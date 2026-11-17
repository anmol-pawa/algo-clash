// Usage: node scripts/smoke-gym-spire.mjs <baseUrl>. Stackspire gym smoke: intro, blitz (one miss), core battle with the reference solution, signature battle (Iron stack) with an recursive evaluator first that the rule rejects, then the badge screen + persistence.
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
const require = createRequire(import.meta.url);
const { chromium, devices } = require("playwright");
const base = process.argv[2] ?? "http://localhost:3000";
const shots = process.env.SHOT_DIR;
const answers = [...readFileSync("content/gyms/r6.ts", "utf8").matchAll(/answer: "((?:[^"\\]|\\.)*)"/g)].map((m) => m[1].replace(/\\"/g, '"'));
const sol = (id) => readFileSync(`content/problems/R6/${id}/solution.cpp`, "utf8");
const bad = `class Solution {
  int expr(const string& s, int& i) { int v = term(s, i); while (i < (int)s.size() && (s[i] == '+' || s[i] == '-')) { char o = s[i++]; int t = term(s, i); v = o == '+' ? v + t : v - t; } return v; }
  int term(const string& s, int& i) { if (s[i] == '(') { ++i; int v = expr(s, i); ++i; return v; } int v = 0; while (i < (int)s.size() && isdigit(s[i])) v = v * 10 + (s[i++] - '0'); return v; }
public:
  int foldLedger(string ledger) { int i = 0; return expr(ledger, i); }
};`;
const browser = await chromium.launch();
let failed = false;
const fail = (m) => { console.error("FAIL", m); failed = true; };
for (const [name, opts] of [["desktop", { viewport: { width: 1280, height: 800 } }], ["iphone", devices["iPhone 14"]]]) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  const shot = async (n) => { if (shots) await page.screenshot({ path: `${shots}/gym-spire-${name}-${n}.png`, fullPage: true }); };
  const overflow = async (n) => { if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)) fail(`${name}: overflow at ${n}`); };
  await page.goto(`${base}/gym/spire/`);
  await page.getByTestId("gym-intro").waitFor();
  await shot("intro"); await overflow("intro");
  await page.getByRole("button", { name: /Challenge the Sentinel/ }).click();
  for (let i = 0; i < answers.length; ++i) {
    await page.getByTestId("blitz").waitFor();
    const group = page.getByRole("group", { name: "Options" });
    if (i === 3) await group.getByRole("button").filter({ hasNotText: answers[i] }).first().click();
    else await group.getByRole("button", { name: answers[i], exact: true }).click();
    await page.getByTestId("blitz-why").waitFor();
    if (i === 1) { await shot("blitz-answered"); await overflow("blitz"); }
    await page.getByTestId("blitz-why").getByRole("button").click();
  }
  await page.getByTestId("gym-interstitial").waitFor();
  const text = await page.getByTestId("gym-interstitial").innerText();
  if (!/7\/8/.test(text)) fail(`${name}: expected 7/8 blitz, got: ${text}`);
  await shot("core-card"); await overflow("core-card");
  await page.getByRole("button", { name: /Begin/ }).click();
  await page.locator(".cm-content").waitFor({ timeout: 60000 });
  await page.waitForTimeout(2500);
  if (name === "iphone") await page.getByRole("tab", { name: "Stage" }).click();
  await page.waitForTimeout(500);
  await shot("battle-stage");
  if (name === "iphone") await page.getByRole("tab", { name: "Code" }).click();
  // After a win the Debrief (editorial, reference diff) shows before the gym continues.
  const debrief = async (tag) => {
    await page.getByTestId("debrief").waitFor({ timeout: 15000 }).catch(() => fail(`${name}: no debrief after ${tag}`));
    if (tag === "core") {
      await page.getByText("Editorial (").click();
      await page.getByText("Your code vs the reference").click();
      if (!(await page.getByTestId("debrief-editorial").innerText()).includes("Key insight")) fail(`${name}: editorial missing Key insight`);
      if (!(await page.getByTestId("debrief-diff").innerText()).length) fail(`${name}: empty diff`);
      await shot("debrief"); await overflow("debrief");
    }
    await page.getByTestId("debrief").getByRole("button", { name: /^Continue/ }).click();
  };
  const solve = async (id, code, tag) => {
    if (name === "iphone") await page.getByRole("tab", { name: "Code" }).click();
    await page.locator(".cm-content").waitFor({ timeout: 60000 });
    await page.locator(".cm-content").click();
    await page.keyboard.press("Control+A");
    await page.keyboard.insertText(code);
    if (name === "iphone") await page.getByRole("tab", { name: "Code" }).click();
    await page.getByRole("button", { name: /^Submit/ }).click();
    return tag;
  };
  await solve("heat-wave", sol("heat-wave"), "core");
  await page.getByRole("button", { name: /Foe beaten/ }).waitFor({ timeout: 180000 });
  await shot("core-won"); await overflow("core-won");
  await page.getByRole("button", { name: /Foe beaten/ }).click();
  await debrief("core");
  await page.getByTestId("gym-interstitial").waitFor();
  await page.getByRole("button", { name: /Begin/ }).click();
  // signature: an recursive evaluator is rejected by the Iron stack rule before compiling
  await solve("ledger-fold", bad, "sig-bad");
  await page.getByText(/Iron stack/).first().waitFor({ state: "attached", timeout: 120000 }).catch(() => fail(`${name}: Iron stack did not reject the recursion`));
  await shot("sig-rejected"); await overflow("sig-rejected");
  await solve("ledger-fold", sol("ledger-fold"), "sig");
  await page.getByRole("button", { name: /Foe beaten/ }).waitFor({ timeout: 90000 }).catch(async () => { await shot("sig-stuck"); console.error(await page.locator("body").innerText()); throw new Error("signature not won"); });
  await page.getByRole("button", { name: /Foe beaten/ }).click();
  await debrief("sig");
  await page.getByTestId("gym-end").waitFor();
  const end = await page.getByTestId("gym-end").innerText();
  if (!/Slab Badge earned/.test(end)) fail(`${name}: no badge: ${end}`);
  await shot("badge"); await overflow("badge");
  await page.reload();
  await page.getByText(/already hold the Slab Badge/).waitFor({ timeout: 15000 }).catch(() => fail(`${name}: badge not persisted`));
  if (errors.length) fail(`${name}: console errors: ${errors.join(" | ")}`);
  await ctx.close();
}
await browser.close();
process.exit(failed ? 1 : 0);
