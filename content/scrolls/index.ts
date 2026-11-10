import type { Scroll } from "@/lib/forge/types";
import { accumulateScroll } from "./accumulate";
import { prefixHashScroll } from "./hashing";
import { oppositePointersScroll } from "./twoPointers";

export const allScrolls: Scroll[] = [accumulateScroll, prefixHashScroll, oppositePointersScroll];
export const scrollById = (id: string): Scroll | undefined => allScrolls.find((s) => s.id === id);
