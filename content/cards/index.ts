import type { Card, ComputedMap } from "@/lib/cards/types";
import generated from "./generated.json";
import { s1Cards } from "./R0/s1";
import { syntaxCards } from "./R0/syntax";

export const allCards: Card[] = [...syntaxCards, ...s1Cards];
export const computed = generated as ComputedMap;
