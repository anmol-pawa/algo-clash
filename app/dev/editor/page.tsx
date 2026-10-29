"use client";

import { useState } from "react";
import CodeEditor from "@/components/CodeEditor";
import { DEFAULT_EDITOR_SETTINGS, FONT_MAX, FONT_MIN, type EditorSettings } from "@/lib/editor/settings";

const STARTER = `class Solution {
public:
    int longestCalm(string s, int k) {
        // at most k distinct characters
        return 0;
    }
};
`;

/** Editor playground (A5a): theme, font size, autocomplete and the mobile symbol bar. */
export default function DevEditor() {
  const [code, setCode] = useState(STARTER);
  const [s, setS] = useState<EditorSettings>(DEFAULT_EDITOR_SETTINGS);
  const btn = "px-btn px-3 text-sm";
  return (
    <main className="mx-auto flex h-dvh max-w-3xl flex-col gap-2 px-4 py-4">
      <h1 className="font-display text-2xl text-[var(--gold)]">Editor playground</h1>
      <div className="flex flex-wrap items-center gap-2">
        <button className={btn} onClick={() => setS({ ...s, theme: s.theme === "night" ? "paper" : "night" })}>Theme: {s.theme}</button>
        <button className={btn} aria-label="Smaller font" onClick={() => setS({ ...s, fontSize: Math.max(FONT_MIN, s.fontSize - 1) })}>A−</button>
        <span className="text-sm">{s.fontSize}px</span>
        <button className={btn} aria-label="Larger font" onClick={() => setS({ ...s, fontSize: Math.min(FONT_MAX, s.fontSize + 1) })}>A+</button>
        <button className={btn} onClick={() => setS({ ...s, autocomplete: !s.autocomplete })}>Autocomplete: {s.autocomplete ? "on" : "off"}</button>
      </div>
      <div className="min-h-0 flex-1">
        <CodeEditor value={code} onChange={setCode} settings={s} />
      </div>
      <div id="len" className="text-xs opacity-70">{code.length} chars</div>
    </main>
  );
}
