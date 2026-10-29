/** Minimal, safe markdown for problem statements: paragraphs, bullet lists, `code` and **bold**. No HTML is ever emitted. */

export type Inline = { kind: "text" | "code" | "bold"; text: string };
export type Block = { kind: "p"; inline: Inline[] } | { kind: "ul"; items: Inline[][] };
export interface Section {
  heading: string;
  blocks: Block[];
}
export interface Statement {
  title: string;
  /** Sections in order; the first has an empty heading when prose precedes any `##`. */
  sections: Section[];
}

export function parseInline(src: string): Inline[] {
  const out: Inline[] = [];
  const re = /`([^`]+)`|\*\*([^*]+)\*\*/g;
  let last = 0;
  for (let m = re.exec(src); m; m = re.exec(src)) {
    if (m.index > last) out.push({ kind: "text", text: src.slice(last, m.index) });
    out.push(m[1] !== undefined ? { kind: "code", text: m[1] } : { kind: "bold", text: m[2] });
    last = m.index + m[0].length;
  }
  if (last < src.length) out.push({ kind: "text", text: src.slice(last) });
  return out;
}

export function parseStatement(md: string): Statement {
  let title = "";
  const sections: Section[] = [];
  let cur: Section = { heading: "", blocks: [] };
  let para: string[] = [];
  let list: Inline[][] | null = null;
  const flush = () => {
    if (para.length) cur.blocks.push({ kind: "p", inline: parseInline(para.join(" ")) });
    if (list) cur.blocks.push({ kind: "ul", items: list });
    para = [];
    list = null;
  };
  const push = () => {
    flush();
    if (cur.heading || cur.blocks.length) sections.push(cur);
  };
  for (const raw of md.split("\n")) {
    const line = raw.trimEnd();
    if (line.startsWith("# ")) title = line.slice(2).trim();
    else if (line.startsWith("## ")) {
      push();
      cur = { heading: line.slice(3).trim(), blocks: [] };
    } else if (/^[-*] /.test(line)) {
      if (para.length) flush();
      (list ??= []).push(parseInline(line.slice(2)));
    } else if (line.trim() === "") flush();
    else {
      if (list) flush();
      para.push(line.trim());
    }
  }
  push();
  return { title, sections };
}

/** Constraint bullets as "stat" chips: the `code` part is the value, the remaining prose the label. */
export interface Stat {
  value: string;
  label: string;
}
export function constraintStats(section: Section | undefined): Stat[] {
  const stats: Stat[] = [];
  for (const b of section?.blocks ?? []) {
    if (b.kind !== "ul") continue;
    for (const item of b.items) {
      const code = item.filter((s) => s.kind === "code").map((s) => s.text).join("  ");
      const label = item.filter((s) => s.kind !== "code").map((s) => s.text).join("").replace(/\s+/g, " ").trim();
      stats.push({ value: code || label, label: code ? label : "" });
    }
  }
  return stats;
}
