import type { Scroll } from "@/lib/forge/types";
import { accumulateScroll } from "./accumulate";
import { prefixHashScroll } from "./hashing";
import { monotonicDequeScroll } from "./monotonicDeque";
import { oppositePointersScroll } from "./twoPointers";
import { variableWindowScroll } from "./variableWindow";

export const allScrolls: Scroll[] = [accumulateScroll, prefixHashScroll, oppositePointersScroll, variableWindowScroll, monotonicDequeScroll];
export const scrollById = (id: string): Scroll | undefined => allScrolls.find((s) => s.id === id);
