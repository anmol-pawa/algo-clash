"use client";

import { useEffect, useRef } from "react";
import { EditorState, Compartment } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLine, drawSelection } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { cpp } from "@codemirror/lang-cpp";
import { bracketMatching, indentOnInput, syntaxHighlighting, HighlightStyle } from "@codemirror/language";
import { autocompletion, closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { tags as t } from "@lezer/highlight";
import { applySymbol, SYMBOL_KEYS, type EditorSettings } from "@/lib/editor/settings";

const PALETTES = {
  night: { bg: "#0d1226", fg: "#e6ecff", gutter: "#6b7bb3", sel: "#2b3a7a", kw: "#c792ea", ty: "#5eead4", st: "#fbbf24", nu: "#f78c6c", cm: "#6b7bb3", dark: true },
  paper: { bg: "#f6f1e3", fg: "#2a2a3a", gutter: "#8a8570", sel: "#d7cfae", kw: "#7a2fb5", ty: "#0b7a6c", st: "#a56a00", nu: "#b5461b", cm: "#8a8570", dark: false },
} as const;

function themeExtensions(s: EditorSettings) {
  const p = PALETTES[s.theme];
  const view = EditorView.theme(
    {
      "&": { backgroundColor: p.bg, color: p.fg, fontSize: `${s.fontSize}px`, height: "100%" },
      ".cm-scroller": { fontFamily: "var(--font-jetbrains), ui-monospace, monospace", lineHeight: "1.5" },
      ".cm-gutters": { backgroundColor: p.bg, color: p.gutter, border: "none" },
      ".cm-activeLine": { backgroundColor: p.dark ? "#ffffff10" : "#00000010" },
      ".cm-activeLineGutter": { backgroundColor: "transparent" },
      "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": { backgroundColor: p.sel },
      ".cm-cursor": { borderLeftColor: p.fg },
      "&.cm-focused": { outline: "none" },
    },
    { dark: p.dark },
  );
  const hl = HighlightStyle.define([
    { tag: [t.keyword, t.controlKeyword, t.operatorKeyword], color: p.kw },
    { tag: [t.typeName, t.className, t.standard(t.typeName)], color: p.ty },
    { tag: [t.string, t.character], color: p.st },
    { tag: [t.number, t.bool], color: p.nu },
    { tag: [t.lineComment, t.blockComment], color: p.cm, fontStyle: "italic" },
    { tag: t.processingInstruction, color: p.cm },
  ]);
  return [view, syntaxHighlighting(hl)];
}

interface Props {
  value: string;
  onChange: (code: string) => void;
  settings: EditorSettings;
  /** Show the symbol toolbar (on by default; meant for touch devices). */
  symbolBar?: boolean;
}

/** CodeMirror 6 C++ editor. `value` seeds the document; later edits flow out through `onChange`. */
export default function CodeEditor({ value, onChange, settings, symbolBar = true }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const themeC = useRef(new Compartment());
  const completeC = useRef(new Compartment());
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });
  const initial = useRef({ value, settings });

  useEffect(() => {
    const { value: doc, settings: s } = initial.current;
    const v = new EditorView({
      parent: host.current!,
      state: EditorState.create({
        doc,
        extensions: [
          lineNumbers(),
          history(),
          drawSelection(),
          highlightActiveLine(),
          indentOnInput(),
          bracketMatching(),
          closeBrackets(),
          cpp(),
          EditorState.tabSize.of(4),
          keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap, indentWithTab]),
          themeC.current.of(themeExtensions(s)),
          completeC.current.of(s.autocomplete ? autocompletion() : []),
          EditorView.contentAttributes.of({ "aria-label": "C++ code", autocapitalize: "off", autocorrect: "off", spellcheck: "false" }),
          EditorView.updateListener.of((u) => {
            if (u.docChanged) onChangeRef.current(u.state.doc.toString());
          }),
        ],
      }),
    });
    view.current = v;
    return () => v.destroy();
  }, []);

  useEffect(() => {
    view.current?.dispatch({
      effects: [
        themeC.current.reconfigure(themeExtensions(settings)),
        completeC.current.reconfigure(settings.autocomplete ? autocompletion() : []),
      ],
    });
  }, [settings]);

  // Replace the document when the parent swaps in different text (e.g. a new problem).
  useEffect(() => {
    const v = view.current;
    if (v && v.state.doc.toString() !== value) v.dispatch({ changes: { from: 0, to: v.state.doc.length, insert: value } });
  }, [value]);

  function insert(i: number) {
    const v = view.current;
    if (!v) return;
    const { from, to } = v.state.selection.main;
    const e = applySymbol(v.state.doc.toString(), from, to, SYMBOL_KEYS[i]);
    v.dispatch({ changes: { from: 0, to: v.state.doc.length, insert: e.doc }, selection: { anchor: e.cursor } });
    v.focus();
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div ref={host} className="panel min-h-0 flex-1 overflow-hidden" />
      {symbolBar && (
        <div role="toolbar" aria-label="Code symbols" className="flex gap-1 overflow-x-auto py-1">
          {SYMBOL_KEYS.map((k, i) => (
            <button
              key={k.label}
              type="button"
              className="px-btn min-w-11 shrink-0 px-2 font-mono text-sm"
              onPointerDown={(e) => e.preventDefault()}
              onClick={() => insert(i)}
            >
              {k.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
