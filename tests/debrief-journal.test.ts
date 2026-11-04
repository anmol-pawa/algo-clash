import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parseBlocks, parseEditorial, parseInline } from "@/lib/debrief/editorial";
import { EDITORIAL_SECTIONS } from "@/lib/content/validate";
import { diffLines, historyOf, previousBefore, sanitizeEntry, searchJournal, sortNewest, summarize, type JournalEntry } from "@/lib/journal";

const entry = (o: Partial<JournalEntry>): JournalEntry => ({ problemId: "p", at: 1, code: "int x;", seconds: 60, hintsUsed: 0, assisted: false, patterns: ["syntax"], ...o });

describe("editorial parser", () => {
  it("splits inline code and bold, leaving unclosed markers literal", () => {
    expect(parseInline("use `a` and **b** then `open")).toEqual([
      { kind: "text", text: "use " },
      { kind: "code", text: "a" },
      { kind: "text", text: " and " },
      { kind: "bold", text: "b" },
      { kind: "text", text: " then `open" },
    ]);
  });
  it("parses paragraphs, lists (with continuation lines) and fenced code", () => {
    const b = parseBlocks("one\ntwo\n\n- a\n  more\n- b\n\n```cpp\n## not a heading\nint x;\n```\n");
    expect(b.map((x) => x.kind)).toEqual(["p", "list", "code"]);
    expect(b[0]).toEqual({ kind: "p", inline: [{ kind: "text", text: "one two" }] });
    expect((b[1] as { items: unknown[] }).items).toHaveLength(2);
    expect(b[2]).toEqual({ kind: "code", lang: "cpp", text: "## not a heading\nint x;" });
  });
  it("does not treat ## inside a fence as a section and reports missing sections", () => {
    const p = parseEditorial("## Signals\nhello there\n```\n## Optimal\n```\n");
    expect(p.sections.map((s) => s.name)).toEqual(["Signals"]);
    expect(p.missing).toContain("Optimal");
  });
  it("orders known sections by house style and keeps unknown ones last", () => {
    const p = parseEditorial("## Extra\nx\n## Optimal\ny\n## Signals\nz\n");
    expect(p.sections.map((s) => s.name)).toEqual(["Signals", "Optimal", "Extra"]);
  });
  it("parses every shipped editorial with all eight sections and non-empty blocks", () => {
    const root = join(process.cwd(), "content", "problems");
    let n = 0;
    for (const region of readdirSync(root)) {
      for (const id of readdirSync(join(root, region))) {
        const p = parseEditorial(readFileSync(join(root, region, id, "editorial.md"), "utf8"));
        expect(p.missing, id).toEqual([]);
        expect(p.sections.slice(0, 8).map((s) => s.name), id).toEqual([...EDITORIAL_SECTIONS]);
        for (const s of p.sections) expect(s.blocks.length, `${id}/${s.name}`).toBeGreaterThan(0);
        n++;
      }
    }
    expect(n).toBeGreaterThan(20);
  });
});

describe("line diff", () => {
  it("is identical for equal code, ignoring trailing spaces, CRLF and blank edges", () => {
    const d = diffLines("\nint a;  \r\nint b;\n\n", "int a;\nint b;");
    expect(d.similarity).toBe(1);
    expect(d.added + d.removed).toBe(0);
    expect(d.lines.every((l) => l.kind === "same")).toBe(true);
  });
  it("reports additions and deletions in order", () => {
    const d = diffLines("a\nb\nc", "a\nx\nc\nd");
    expect(d.lines).toEqual([
      { kind: "same", text: "a" },
      { kind: "del", text: "b" },
      { kind: "add", text: "x" },
      { kind: "same", text: "c" },
      { kind: "add", text: "d" },
    ]);
    expect(d.added).toBe(2);
    expect(d.removed).toBe(1);
  });
  it("reconstructs both inputs from the ops (100 seeded random cases)", () => {
    let s = 12345;
    const rnd = (k: number) => ((s = (s * 1103515245 + 12345) & 0x7fffffff) % k);
    for (let t = 0; t < 100; t++) {
      const mk = () => Array.from({ length: rnd(12) }, () => "l" + rnd(5)).join("\n");
      const a = mk();
      const b = mk();
      const d = diffLines(a, b);
      const norm = (x: string) => x.split("\n").filter((_, i, arr) => !(x === "" && arr.length === 1));
      expect(d.lines.filter((l) => l.kind !== "add").map((l) => l.text)).toEqual(norm(a).filter((_, __, arr) => arr.length > 0));
      expect(d.lines.filter((l) => l.kind !== "del").map((l) => l.text)).toEqual(norm(b));
    }
  });
  it("handles empty inputs", () => {
    expect(diffLines("", "").similarity).toBe(1);
    expect(diffLines("", "a").added).toBe(1);
    expect(diffLines("a", "").removed).toBe(1);
  });
});

describe("journal entries", () => {
  it("sanitises untrusted entries", () => {
    expect(sanitizeEntry(null)).toBeNull();
    expect(sanitizeEntry({ problemId: "p" })).toBeNull();
    const e = sanitizeEntry({ problemId: "p", at: 5, code: "x".repeat(30000), seconds: -4, hintsUsed: 9, assisted: "yes", patterns: ["a", 3], reflection: { promptId: "q", choice: 2, correct: true } });
    expect(e?.code.length).toBe(20000);
    expect(e).toMatchObject({ seconds: 0, hintsUsed: 3, assisted: false, patterns: ["a"], reflection: { promptId: "q", choice: 2, correct: true } });
    expect(sanitizeEntry({ problemId: "p", code: "x", reflection: { promptId: 1 } })?.reflection).toBeUndefined();
  });
  it("searches by pattern, text and assistance, newest first", () => {
    const list = [entry({ problemId: "a", at: 1, patterns: ["hashmap"], code: "unordered_map<int,int> m;" }), entry({ problemId: "b", at: 3, patterns: ["syntax"], assisted: true }), entry({ problemId: "c", at: 2, patterns: ["hashmap"] })];
    expect(searchJournal(list, {}).map((e) => e.problemId)).toEqual(["b", "c", "a"]);
    expect(searchJournal(list, { pattern: "hashmap" }).map((e) => e.problemId)).toEqual(["c", "a"]);
    expect(searchJournal(list, { text: "UNORDERED_MAP" }).map((e) => e.problemId)).toEqual(["a"]);
    expect(searchJournal(list, { unassistedOnly: true }).map((e) => e.problemId)).toEqual(["c", "a"]);
    expect(sortNewest(list)[0].problemId).toBe("b");
  });
  it("finds the previous attempt and summarises per problem", () => {
    const list = [entry({ at: 10, seconds: 100 }), entry({ at: 20, seconds: 50, assisted: true }), entry({ at: 30, seconds: 80 }), entry({ problemId: "q", at: 40 })];
    expect(historyOf(list, "p").map((e) => e.at)).toEqual([30, 20, 10]);
    expect(previousBefore(list, "p", 30)?.at).toBe(20);
    expect(previousBefore(list, "p", 10)).toBeNull();
    const s = summarize(list);
    expect(s.map((x) => x.problemId)).toEqual(["q", "p"]);
    expect(s[1]).toMatchObject({ count: 3, bestSeconds: 80 });
  });
});
