/** libc++ has no <bits/stdc++.h>; judged programs get this shim at `shim/bits/stdc++.h`. */
const HEADERS = [
  "algorithm", "array", "bitset", "cassert", "climits", "cmath", "cstdint", "cstdio", "cstdlib", "cstring",
  "deque", "functional", "iostream", "iterator", "limits", "list", "map", "memory", "numeric", "optional",
  "queue", "set", "sstream", "stack", "string", "tuple", "unordered_map", "unordered_set", "utility", "vector",
];

export const BITS_STDCXX = `#pragma once\n${HEADERS.map((h) => `#include <${h}>`).join("\n")}\n`;

export const SHIM_FILES = { shim: { bits: { "stdc++.h": BITS_STDCXX } } };

/** Clang flags for judged programs. No exceptions: this libc++abi build has no __cxa_throw (ADR 0001). */
export const CLANG_FLAGS = (stackBytes = 64 * 1024 * 1024) => [
  "--target=wasm32-wasip1", "-std=c++20", "-O2", "-fno-exceptions", "-isystem", "shim",
  `-Wl,-z,stack-size=${stackBytes}`, "main.cc", "-o", "a.wasm",
];
