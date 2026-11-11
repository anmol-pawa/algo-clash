/** A visualiser is a pure function from user input to a list of frames; the UI only plays frames. */
export type MarkKind = "compare" | "swap" | "sorted" | "found" | "inWindow" | "key";

export interface Mark {
  index: number;
  kind: MarkKind;
}

export interface Pointer {
  label: string;
  index: number;
}

export interface Frame {
  /** The array as it is at this step. */
  array: number[];
  marks: Mark[];
  pointers: Pointer[];
  /** Inclusive window [lo, hi], when the algorithm keeps one. */
  window?: [number, number];
  /** One plain sentence about what just happened and why. */
  note: string;
  /** Named running values, e.g. the current sum. */
  state?: Record<string, number | string>;
  /** Optional rows drawn under the array (hash buckets, seen-hash index...). `hot` highlights the row being touched. */
  table?: TableRow[];
  tableTitle?: string;
}

export interface TableRow {
  label: string;
  items: string[];
  hot?: boolean;
}

export interface Trace {
  frames: Frame[];
  /** The final answer, so tests can compare it with an independent brute force. */
  result: number | string | number[] | null;
}

export const MAX_VIS_LENGTH = 16;
