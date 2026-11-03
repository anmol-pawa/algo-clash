import type { Card, ComputedMap } from "@/lib/cards/types";
import generated from "./generated.json";
import { syntaxCards } from "./R0/syntax";

export const allCards: Card[] = [...syntaxCards];
export const computed = generated as ComputedMap;
