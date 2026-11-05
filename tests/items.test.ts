import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { HINT_RUNGS, parseHints } from "@/lib/items/hints";
import { ITEMS, applyCompassPenalty, buy, consume, countOf, grantStarterKit, isAssisted, NO_ASSISTANCE, rematchNow, spendRematchTicket } from "@/lib/items/items";
import { newCoreSave, sanitizeCore } from "@/lib/save/schema";
import { emptyMastery } from "@/lib/srs/scheduler";

const rich = () => ({ ...newCoreSave(0), profile: { ...newCoreSave(0).profile, bits: 100 } });

describe("hint ladder", () => {
  it("parses the three rungs in order", () => {
    const h = parseHints("## Key insight\nC\n\n## Nudge\nA\nmore\n\n## Approach\nB\n## Other\nignored");
    expect(h.map((x) => x.rung)).toEqual([...HINT_RUNGS]);
    expect(h.map((x) => x.text)).toEqual(["A\nmore", "B", "C"]);
  });
  it("every shipped problem has a full ladder", () => {
    let n = 0;
    for (const region of readdirSync("content/problems")) {
      for (const slug of readdirSync(join("content/problems", region))) {
        const f = join("content/problems", region, slug, "hints.md");
        if (!existsSync(f)) continue;
        expect(parseHints(readFileSync(f, "utf8")).length, f).toBe(3);
        n++;
      }
    }
    expect(n).toBeGreaterThan(20);
  });
});

describe("Mart and inventory", () => {
  it("starter kit is granted once", () => {
    const a = grantStarterKit(newCoreSave(0));
    expect(countOf(a, "hint-token")).toBe(3);
    expect(countOf(grantStarterKit(a), "hint-token")).toBe(3);
  });
  it("buys, spends Bits, and refuses without partial effects", () => {
    const r = buy(rich(), "debug-lens", 2);
    expect(r.ok && r.core.profile.bits).toBe(20);
    expect(r.ok && countOf(r.core, "debug-lens")).toBe(2);
    const broke = buy(rich(), "debug-lens", 3);
    expect(broke).toEqual({ ok: false, reason: "bits" });
    expect(buy(rich(), "nope")).toEqual({ ok: false, reason: "unknown" });
    expect(buy(rich(), "hint-token", 0)).toEqual({ ok: false, reason: "qty" });
    const full = { ...rich(), inventory: { "rematch-ticket": 10 } };
    expect(buy(full, "rematch-ticket")).toEqual({ ok: false, reason: "cap" });
  });
  it("consume needs stock", () => {
    expect(consume(newCoreSave(0), "hint-token")).toBeNull();
    const c = consume(grantStarterKit(newCoreSave(0)), "hint-token");
    expect(c && countOf(c, "hint-token")).toBe(2);
  });
  it("nothing for sale touches mastery", () => {
    for (const it of ITEMS) {
      const r = buy(rich(), it.id);
      expect(r.ok && r.core.mastery).toEqual({});
    }
  });
  it("sanitises the inventory", () => {
    const c = sanitizeCore({ inventory: { a: 3.4, b: -2, c: "x", d: 5000 } }, 0);
    expect(c.inventory).toEqual({ a: 3, d: 999 });
    expect(sanitizeCore({}, 0).inventory).toEqual({});
  });
});

describe("mastery rules", () => {
  it("assisted after 3 hints, lens, editorial or guided; compass alone is not assisted", () => {
    expect(isAssisted({ ...NO_ASSISTANCE, hintsUsed: 2 })).toBe(false);
    expect(isAssisted({ ...NO_ASSISTANCE, hintsUsed: 3 })).toBe(true);
    expect(isAssisted({ ...NO_ASSISTANCE, lens: true })).toBe(true);
    expect(isAssisted({ ...NO_ASSISTANCE, editorialRead: true })).toBe(true);
    expect(isAssisted({ ...NO_ASSISTANCE, guided: true })).toBe(true);
    expect(isAssisted({ ...NO_ASSISTANCE, compass: true })).toBe(false);
  });
  it("compass cuts a tier gain by one but never lowers", () => {
    const before = { ...emptyMastery(), state: "learning" as const };
    const after = { ...before, state: "practiced" as const, solves: 2 };
    expect(applyCompassPenalty(before, after).state).toBe("learning");
    expect(applyCompassPenalty(before, after).solves).toBe(2);
    const same = { ...before, solves: 2 };
    expect(applyCompassPenalty(before, same)).toEqual(same);
    const seen = { ...emptyMastery(), state: "seen" as const };
    expect(applyCompassPenalty(emptyMastery(), { ...seen, state: "learning" }).state).toBe("seen");
  });
  it("rematch ticket makes a problem due now, only if known", () => {
    const base = newCoreSave(0);
    expect(rematchNow(base, "p", 1000)).toBeNull();
    const c = { ...base, mastery: { p: { ...emptyMastery(), due: 99_999 } } };
    expect(rematchNow(c, "p", 1000)?.mastery.p.due).toBe(1000);
    const overdue = { ...base, mastery: { p: { ...emptyMastery(), due: 500 } } };
    expect(rematchNow(overdue, "p", 1000)?.mastery.p.due).toBe(500);
  });
});

describe("assisted wins in the Rift", () => {
  it("an assisted solve never advances the tier", async () => {
    const { applyRiftProblem } = await import("@/lib/rift/progress");
    const now = Date.UTC(2026, 10, 5);
    const clean = applyRiftProblem(newCoreSave(0), "p", true, now, 60, 600);
    const assisted = applyRiftProblem(newCoreSave(0), "p", true, now, 60, 600, true);
    expect(clean.mastery.p.state).toBe("learning");
    expect(assisted.mastery.p.state).not.toBe("learning");
  });
});

describe("rematch ticket spend", () => {
  it("consumes one ticket and makes the problem due now; refuses without a ticket or record", () => {
    const m = { ...emptyMastery(), solves: 1, due: 9_000 };
    const held = { ...newCoreSave(0), inventory: { "rematch-ticket": 2 }, mastery: { p: m } };
    const out = spendRematchTicket(held, "p", 1_000);
    expect(out?.mastery.p.due).toBe(1_000);
    expect(countOf(out!, "rematch-ticket")).toBe(1);
    expect(spendRematchTicket({ ...held, inventory: {} }, "p", 1_000)).toBeNull();
    expect(spendRematchTicket(held, "unknown", 1_000)).toBeNull();
  });
});
