import { describe, expect, it } from "vitest";
import { applySymbol, DEFAULT_EDITOR_SETTINGS, FONT_MAX, FONT_MIN, sanitizeSettings, SYMBOL_KEYS } from "../lib/editor/settings";

describe("sanitizeSettings", () => {
  it("returns defaults for junk", () => {
    expect(sanitizeSettings(null)).toEqual(DEFAULT_EDITOR_SETTINGS);
    expect(sanitizeSettings("x")).toEqual(DEFAULT_EDITOR_SETTINGS);
    expect(sanitizeSettings({ fontSize: NaN, theme: 3 })).toEqual(DEFAULT_EDITOR_SETTINGS);
  });
  it("clamps and rounds font size, keeps valid fields", () => {
    expect(sanitizeSettings({ fontSize: 2 }).fontSize).toBe(FONT_MIN);
    expect(sanitizeSettings({ fontSize: 99 }).fontSize).toBe(FONT_MAX);
    expect(sanitizeSettings({ fontSize: 15.6 }).fontSize).toBe(16);
    expect(sanitizeSettings({ theme: "paper", autocomplete: false })).toMatchObject({ theme: "paper", autocomplete: false });
  });
});

describe("applySymbol", () => {
  const key = (label: string) => SYMBOL_KEYS.find((k) => k.label === label)!;
  it("inserts a pair and puts the cursor between", () => {
    expect(applySymbol("ab", 1, 1, key("( )"))).toEqual({ doc: "a()b", cursor: 2 });
  });
  it("replaces a selection and tolerates reversed or out-of-range offsets", () => {
    expect(applySymbol("abcd", 3, 1, key(";"))).toEqual({ doc: "a;d", cursor: 2 });
    expect(applySymbol("ab", 9, 9, key("->"))).toEqual({ doc: "ab->", cursor: 4 });
  });
});
