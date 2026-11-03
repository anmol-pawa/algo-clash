import type { Card, ComputedMap } from "@/lib/cards/types";
import generated from "./generated.json";
import { s1Cards } from "./R0/s1";
import { s2Cards } from "./R0/s2";
import { s3Cards } from "./R0/s3";
import { syntaxCards } from "./R0/syntax";

export const allCards: Card[] = [...syntaxCards, ...s1Cards, ...s2Cards, ...s3Cards];
export const computed = generated as ComputedMap;
