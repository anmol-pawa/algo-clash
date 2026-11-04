import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { diffLines, diffStats } from "../lib/journal/diff";
import { EDITORIAL_TITLES, inlineTokens, parseEditorial, sectionsForDebrief } from "../lib/journal/editorial";
import { previousEntry, sanitizeJournalEntry, searchJournal, type JournalEntry } from "../lib/journal/entry";
import { MemoryBackend } from "../lib/save/backend";
import { SaveService } from "../lib/save/service";

const entry = (o: Partial<JournalEntry> = {}): JournalEntry => ({
  problemId: "cargo-total", at: 1000, code: "int main(){}", seconds: 90, hintsUsed: 0, assisted: false, patterns: ["prefix-sum"], promptChoice: 1, promptCorrect: true, ...o,
});

describe("editorial parser", () => {
  it("parses every shipped editorial into the eight house sections in order", () => {
    const root = join(process.cwd(), "content", "problems");
    let n = 0;
    for (const region of readdirSync(root)) {
      for (const id of readdirSync(join(root, region))) {
        let md: string;
        try { md = readFileSync(join(root, region, id, "editorial.md"), "utf8"); } catch { continue; }
        n++;
        expect(parseEditorial(md).map((s) => s.title), id).toEqual([...EDITORIAL_TITLES]);
        expect(sectionsForDebrief(md).every((s) => s.body.length > 0), id).toBe(true);
      }
    }
    expect(n).toBeGreaterThan(20);
  });
  it("reorders for the debrief and keeps unknown sections last", () => {
    const md = "intro\n## Follow-ups\nf\n## Weird\nw\n## Signals\ns\n";
    expect(sectionsForDebrief(md).map((s) => s.title)).toEqual(["Signals", "Follow-ups", "Weird"]);
  });
  it("tokenises inline code and bold without HTML", () => {
    expect(inlineTokens("use `long long` for **sums** now")).toEqual([
      { kind: "text", text: "use " }, { kind: "code", text: "long long" }, { kind: "text", text: " for " }, { kind: "bold", text: "sums" }, { kind: "text", text: " now" },
    ]);
    expect(inlineTokens("<b>x</b>")).toEqual([{ kind: "text", text: "<b>x</b>" }]);
  });
});

describe("line diff", () => {
  it("is empty-safe and identity for equal text", () => {
    expect(diffLines("", "")).toEqual([]);
    expect(diffLines("a\nb\n", "a\nb").every((o) => o.op === "same")).toBe(true);
    expect(diffStats(diffLines("", "")).similarity).toBe(1);
  });
  it("finds adds and deletes", () => {
    const ops = diffLines("a\nb\nc", "a\nx\nc\nd");
    expect(ops.filter((o) => o.op === "del").map((o) => o.text)).toEqual(["b"]);
    expect(ops.filter((o) => o.op === "add").map((o) => o.text)).toEqual(["x", "d"]);
    expect(diffStats(ops)).toMatchObject({ added: 2, removed: 1, same: 2 });
  });
  it("reconstructs both sides (property test)", () => {
    let seed = 7;
    const rnd = (n: number) => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) % n);
    for (let t = 0; t < 200; t++) {
      const gen = () => Array.from({ length: rnd(9) }, () => "ab c"[rnd(4)] + rnd(3)).join("\n");
      const a = gen();
      const b = gen();
      const ops = diffLines(a, b);
      const norm = (s: string) => (s.trim() === "" ? [] : s.split("\n").map((l) => l.replace(/\s+$/, "")));
      expect(ops.filter((o) => o.op !== "add").map((o) => o.text.replace(/\s+$/, ""))).toEqual(norm(a));
      expect(ops.filter((o) => o.op !== "del").map((o) => o.text.replace(/\s+$/, ""))).toEqual(norm(b));
    }
  });
  it("ignores trailing whitespace when matching", () => {
    expect(diffLines("a  \nb", "a\nb").every((o) => o.op === "same")).toBe(true);
  });
});

describe("journal entries", () => {
  it("sanitises untrusted data", () => {
    expect(sanitizeJournalEntry(null)).toBeNull();
    expect(sanitizeJournalEntry({ problemId: "x" })).toBeNull();
    const e = sanitizeJournalEntry({ problemId: "p", code: "c", seconds: -5, hintsUsed: 99, assisted: "yes", patterns: ["a", 1, "b"], promptChoice: 50, at: "no" });
    expect(e).toMatchObject({ seconds: 0, hintsUsed: 3, assisted: false, patterns: ["a", "b"], promptChoice: 9, at: 0, promptCorrect: false });
  });
  it("searches by id, title, pattern and code, newest first", () => {
    const list = [entry({ at: 1 }), entry({ problemId: "calm-window", at: 5, patterns: ["sliding-window"], code: "while(r<n)" })];
    expect(searchJournal(list, "").map((e) => e.at)).toEqual([5, 1]);
    expect(searchJournal(list, "SLIDING").map((e) => e.problemId)).toEqual(["calm-window"]);
    expect(searchJournal(list, "while").length).toBe(1);
    expect(searchJournal(list, "Quiet", (id) => (id === "calm-window" ? "Quiet Window" : id)).length).toBe(1);
  });
  it("picks the latest earlier attempt of the same problem", () => {
    const list = [entry({ at: 1 }), entry({ at: 5 }), entry({ at: 9 }), entry({ problemId: "other", at: 6 })];
    expect(previousEntry(list, "cargo-total", 9)?.at).toBe(5);
    expect(previousEntry(list, "cargo-total", 1)).toBeUndefined();
  });
});

describe("journal persistence", () => {
  it("records, filters, exports and imports", async () => {
    const svc = new SaveService(new MemoryBackend(), () => 5);
    await svc.recordJournal(entry());
    await svc.recordJournal(entry({ problemId: "b", at: 2 }));
    await expect(svc.recordJournal({ ...entry(), code: undefined as unknown as string })).rejects.toThrow();
    expect((await svc.journal()).length).toBe(2);
    expect((await svc.journal("b")).length).toBe(1);
    const json = await svc.exportJson();
    const other = new SaveService(new MemoryBackend(), () => 5);
    await other.importJson(json);
    expect((await other.journal()).map((e) => e.problemId)).toEqual(["cargo-total", "b"]);
    await other.reset();
    expect(await other.journal()).toEqual([]);
  });
  it("imports files exported before the journal existed", async () => {
    const svc = new SaveService(new MemoryBackend(), () => 5);
    const old = JSON.parse(await svc.exportJson());
    delete old.journal;
    await svc.importJson(JSON.stringify(old));
    expect(await svc.journal()).toEqual([]);
  });
});
