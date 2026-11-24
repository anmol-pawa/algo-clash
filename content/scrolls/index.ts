import type { Scroll } from "@/lib/forge/types";
import { accumulateScroll } from "./accumulate";
import { prefixHashScroll } from "./hashing";
import { oppositePointersScroll } from "./twoPointers";
import { rollingKeyScroll, twoWayMapScroll } from "./harbor";
import { listReversalScroll, lruCacheScroll } from "./caves";
import { nextGreaterScroll, sentinelSweepScroll } from "./spire";
import { monotonicDequeScroll, variableWindowScroll } from "./windows";

export const allScrolls: Scroll[] = [accumulateScroll, prefixHashScroll, oppositePointersScroll, variableWindowScroll, monotonicDequeScroll, twoWayMapScroll, rollingKeyScroll, listReversalScroll, lruCacheScroll, nextGreaterScroll, sentinelSweepScroll];
export const scrollById = (id: string): Scroll | undefined => allScrolls.find((s) => s.id === id);
