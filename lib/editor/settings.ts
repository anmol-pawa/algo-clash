export type EditorTheme = "night" | "paper";

export interface EditorSettings {
  theme: EditorTheme;
  fontSize: number;
  autocomplete: boolean;
}

export const FONT_MIN = 12;
export const FONT_MAX = 24;

export const DEFAULT_EDITOR_SETTINGS: EditorSettings = { theme: "night", fontSize: 16, autocomplete: true };

/** Coerce untrusted (e.g. stored) settings into a valid object. */
export function sanitizeSettings(raw: unknown): EditorSettings {
  const r = (raw && typeof raw === "object" ? raw : {}) as Partial<Record<keyof EditorSettings, unknown>>;
  const size = typeof r.fontSize === "number" && Number.isFinite(r.fontSize) ? Math.round(r.fontSize) : DEFAULT_EDITOR_SETTINGS.fontSize;
  return {
    theme: r.theme === "paper" ? "paper" : "night",
    fontSize: Math.min(FONT_MAX, Math.max(FONT_MIN, size)),
    autocomplete: typeof r.autocomplete === "boolean" ? r.autocomplete : DEFAULT_EDITOR_SETTINGS.autocomplete,
  };
}

/** A key on the mobile symbol toolbar: `text` is inserted, `back` moves the cursor left after inserting. */
export interface SymbolKey {
  label: string;
  text: string;
  back: number;
}

export const SYMBOL_KEYS: readonly SymbolKey[] = [
  { label: "Tab", text: "    ", back: 0 },
  { label: "{ }", text: "{}", back: 1 },
  { label: "( )", text: "()", back: 1 },
  { label: "[ ]", text: "[]", back: 1 },
  { label: "< >", text: "<>", back: 1 },
  { label: ";", text: ";", back: 0 },
  { label: "::", text: "::", back: 0 },
  { label: "&", text: "&", back: 0 },
  { label: "*", text: "*", back: 0 },
  { label: "->", text: "->", back: 0 },
  { label: "\"", text: "\"\"", back: 1 },
  { label: "=", text: "=", back: 0 },
  { label: "!", text: "!", back: 0 },
  { label: "|", text: "|", back: 0 },
];

export interface Edit {
  doc: string;
  cursor: number;
}

/** Replace the selection [from, to) with the key's text and place the cursor (pure; used by tests and the toolbar). */
export function applySymbol(doc: string, from: number, to: number, key: SymbolKey): Edit {
  const a = Math.max(0, Math.min(from, to, doc.length));
  const b = Math.min(doc.length, Math.max(from, to));
  return { doc: doc.slice(0, a) + key.text + doc.slice(b), cursor: a + key.text.length - key.back };
}
