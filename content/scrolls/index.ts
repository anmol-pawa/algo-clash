import type { Scroll } from "@/lib/forge/types";
import { accumulateScroll } from "./accumulate";

export const allScrolls: Scroll[] = [accumulateScroll];
export const scrollById = (id: string): Scroll | undefined => allScrolls.find((s) => s.id === id);
