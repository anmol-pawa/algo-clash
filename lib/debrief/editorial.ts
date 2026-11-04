/** Pure editorial parser (GDD §8.3): markdown text -> typed sections and blocks the UI can render safely (no HTML). */
import { EDITORIAL_SECTIONS } from "../content/validate";

export type Inline = { kind: "text"; text: string } | { kind: "code"; text: string } | { kind: "bold"; text: string };

export type Block =
  | { kind: "p"; inline: Inline[] }
  | { kind: "code"; lang: string; text: string }
  | { kind: "list"; items: Inline[][] };

export interface EditorialSection {
  name: string;
  blocks: Block[];
}

export interface ParsedEditorial {
  sections: EditorialSection[];
  /** Section names from GDD §8.3 that are absent. */
  missing: string[];
}

/** Splits `code` and **bold** spans out of a line of prose. Unclosed markers stay literal. */
export function parseInline(s: string): Inline[] {
  const out: Inline[] = [];
  const re = /`([^`\n]+)`|\*\*([^*\n]+)\*\*/g;
  let at = 0;
  for (let m = re.exec(s); m; m = re.exec(s)) {
    if (m.index > at) out.push({ kind: "text", text: s.slice(at, m.index) });
    out.push(m[1] !== undefined ? { kind: "code", text: m[1] } : { kind: "bold", text: m[2] });
    at = m.index + m[0].length;
  }
  if (at < s.length) out.push({ kind: "text", text: s.slice(at) });
  return out;
}

/** Parses a block list: fenced code, `-`/`*`/`1.` lists and paragraphs separated by blank lines. */
export function parseBlocks(md: string): Block[] {
  const lines = md.replace(/\r\n?/g, "\n").split("\n");
  const blocks: Block[] = [];
  let para: string[] = [];
  let list: Inline[][] | null = null;
  const flush = () => {
    if (para.length) blocks.push({ kind: "p", inline: parseInline(para.join(" ")) });
    if (list) blocks.push({ kind: "list", items: list });
    para = [];
    list = null;
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const fence = /^```(\w*)\s*$/.exec(line);
    if (fence) {
      flush();
      const body: string[] = [];
      for (i++; i < lines.length && !/^```\s*$/.test(lines[i]); i++) body.push(lines[i]);
      blocks.push({ kind: "code", lang: fence[1], text: body.join("\n") });
      continue;
    }
    const item = /^\s*(?:[-*]|\d+\.)\s+(.*)$/.exec(line);
    if (item) {
      if (para.length) {
        blocks.push({ kind: "p", inline: parseInline(para.join(" ")) });
        para = [];
      }
      (list ??= []).push(parseInline(item[1]));
    } else if (line.trim() === "") flush();
    else if (list) list[list.length - 1] = [...list[list.length - 1], ...parseInline(" " + line.trim())];
    else para.push(line.trim());
  }
  flush();
  return blocks;
}

/** Parses an editorial in the house style. Unknown `##` sections are kept after the known ones, in file order. */
export function parseEditorial(md: string): ParsedEditorial {
  const text = md.replace(/\r\n?/g, "\n");
  const heads: { name: string; at: number; end: number }[] = [];
  let inFence = false;
  let pos = 0;
  for (const line of text.split("\n")) {
    if (/^```/.test(line)) inFence = !inFence;
    const m = !inFence ? /^##\s+(.+?)\s*$/.exec(line) : null;
    if (m) heads.push({ name: m[1], at: pos, end: pos + line.length });
    pos += line.length + 1;
  }
  const sections = heads.map((h, i) => ({ name: h.name, blocks: parseBlocks(text.slice(h.end, heads[i + 1]?.at ?? text.length)) }));
  const rank = (n: string) => {
    const i = (EDITORIAL_SECTIONS as readonly string[]).indexOf(n);
    return i < 0 ? EDITORIAL_SECTIONS.length : i;
  };
  const ordered = sections.map((s, i) => ({ s, i })).sort((a, b) => rank(a.s.name) - rank(b.s.name) || a.i - b.i).map((x) => x.s);
  const have = new Set(sections.map((s) => s.name));
  return { sections: ordered, missing: EDITORIAL_SECTIONS.filter((n) => !have.has(n)) };
}
