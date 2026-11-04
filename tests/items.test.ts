import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { ITEMS, buyItem, spendItem } from "../lib/items/items";
import { masteryCredit, parseHints, requestHint } from "../lib/items/hints";
import { newCoreSave, sanitizeCore } from "../lib/save/schema";

describe("Mart", () => {
  it("buys with Bits and caps ownership", () => {
    const w = { bits: 100, inventory: {} };
    const r = buyItem(w, "hint-token", 3);
    expect(r.ok && r.wallet).toEqual({ bits: 10, inventory: { "hint-token": 3 } });
    expect(buyItem(w, "debug-lens", 2)).toEqual({ ok: false, reason: "poor" });
    expect(buyItem(w, "nope")).toEqual({ ok: false, reason: "unknown-item" });
    expect(buyItem({ bits: 9999, inventory: { "debug-lens": 5 } }, "debug-lens")).toEqual({ ok: false, reason: "full" });
    expect(buyItem(w, "hint-token", 0).ok).toBe(false);
  });
  it("spends one at a time", () => {
    expect(spendItem({ "hint-token": 2 }, "hint-token")).toEqual({ "hint-token": 1 });
    expect(spendItem({ "hint-token": 1 }, "hint-token")).toEqual({});
    expect(spendItem({}, "hint-token")).toBeNull();
  });
  it("has unique ids and positive prices", () => {
    expect(new Set(ITEMS.map((i) => i.id)).size).toBe(ITEMS.length);
    for (const i of ITEMS) expect(i.price).toBeGreaterThan(0);
  });
  it("round-trips inventory through the save sanitiser", () => {
    const c = newCoreSave(0);
    expect(c.inventory).toEqual({});
    const s = sanitizeCore({ inventory: { "hint-token": 3, bad: -2, x: "no", big: 5000 } }, 0);
    expect(s.inventory).toEqual({ "hint-token": 3, big: 99 });
  });
});

describe("hint ladder", () => {
  it("charges tokens only in Standard and stops at 3", () => {
    expect(requestHint("standard", 0, 1)).toEqual({ ok: true, rung: 1, spendToken: true });
    expect(requestHint("standard", 0, 0)).toEqual({ ok: false, reason: "no-token" });
    expect(requestHint("guided", 2, 0)).toEqual({ ok: true, rung: 3, spendToken: false });
    expect(requestHint("standard", 3, 5)).toEqual({ ok: false, reason: "no-more" });
    expect(requestHint("interview", 0, 5)).toEqual({ ok: false, reason: "mode" });
    expect(requestHint("contest", 0, 5)).toEqual({ ok: false, reason: "mode" });
  });
  it("applies the mastery rules", () => {
    const base = { mode: "standard" as const, hintsUsed: 0, lens: false, editorialRead: false, compass: false };
    expect(masteryCredit(base)).toBe("full");
    expect(masteryCredit({ ...base, hintsUsed: 2 })).toBe("full");
    expect(masteryCredit({ ...base, hintsUsed: 3 })).toBe("none");
    expect(masteryCredit({ ...base, lens: true })).toBe("none");
    expect(masteryCredit({ ...base, compass: true })).toBe("reduced");
    expect(masteryCredit({ ...base, mode: "guided" })).toBe("none");
    expect(masteryCredit({ ...base, editorialRead: true })).toBe("none");
  });
  it("parses every shipped hints.md into three rungs", () => {
    const root = join(__dirname, "..", "content", "problems");
    let n = 0;
    for (const region of readdirSync(root)) {
      for (const id of readdirSync(join(root, region))) {
        const md = readFileSync(join(root, region, id, "hints.md"), "utf8");
        expect(() => parseHints(md), id).not.toThrow();
        n++;
      }
    }
    expect(n).toBeGreaterThan(20);
  });
  it("rejects malformed hint files", () => {
    expect(() => parseHints("## Nudge\na\n## Approach\nb")).toThrow();
    expect(() => parseHints("## Approach\na\n## Nudge\nb\n## Key insight\nc")).toThrow();
    expect(() => parseHints("## Nudge\n\n## Approach\nb\n## Key insight\nc")).toThrow();
  });
});
