/** Builds the editor starter code for a problem from its driver spec (pure). */
import type { DriverSpec, MethodSpec, Param } from "./harness/driver";

const params = (ps: readonly Param[]): string => ps.map((p) => `${p.type} ${p.name}`).join(", ");
const body = (indent: string): string => `${indent}    // TODO\n${indent}`;

function method(m: MethodSpec): string {
  return `    ${m.returns} ${m.name}(${params(m.params)}) {\n${body("    ")}}\n`;
}

export function starterFor(spec: DriverSpec): string {
  if (spec.kind === "function") {
    return `class ${spec.className ?? "Solution"} {\npublic:\n${method(spec)}};\n`;
  }
  const ctor = `    ${spec.className}(${params(spec.ctor)}) {\n${body("    ")}}\n`;
  return `class ${spec.className} {\npublic:\n${ctor}${spec.methods.map(method).join("")}};\n`;
}
