import type { Card, ComputedMap } from "@/lib/cards/types";
import generated from "./generated.json";
import { forgeCards } from "./R0/forge";
import { r1Cards } from "./R1/scout";
import { r2Cards } from "./R2/atoll";
import { forgeR2Cards } from "./R2/forge";
import { s1Cards } from "./R0/s1";
import { s2Cards } from "./R0/s2";
import { s3Cards } from "./R0/s3";
import { s4Cards } from "./R0/s4";
import { syntaxCards } from "./R0/syntax";

export const allCards: Card[] = [...syntaxCards, ...s1Cards, ...s2Cards, ...s3Cards, ...s4Cards, ...forgeCards, ...r1Cards, ...r2Cards, ...forgeR2Cards];
export const computed = generated as ComputedMap;
