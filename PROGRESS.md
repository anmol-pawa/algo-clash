# Algo Clash progress

Append a dated entry after every run: what changed, how it was verified (commands, screenshot notes), known gaps, what's next. Newest entries at the bottom.

## 2026-10-28: Project seeded
- Added the design set: `CLAUDE.md` (routine protocol and quality bars), `ROADMAP.md` (phases A–F), `docs/GAME_DESIGN.md`, `docs/CURRICULUM.md` and `docs/ARCHITECTURE.md`.
- Toolchain lead: `@yowasp/clang` ships libc++ headers and `libc++.a` for wasm32-wasip1 (package listing checked; nothing compiled yet). The A2 spike must measure it.
- Next: ROADMAP A1 (scaffold from Query Clash).

## 2026-10-28: A1 Scaffold from Query Clash
- Added Next.js 16 + React 19 + Pixi 8 + Tailwind 4 app: title screen (`/`), placeholder `/play`, 404 page, manifest, pixel font, pixel UI CSS (`.px-btn`, `.px-window`, `.px-menu-item`), PWA register + `scripts/gen-sw.mjs` (cache `algo-clash-*`, worker-fragment fix kept), `ci.yml` + `pages.yml`, eslint/tsconfig/vitest config, `.gitignore`, README, smoke test. No SQL/PGlite code carried over.
- Verified: `npm run lint`, `typecheck`, `test` (1 test), `build`, `build:pages` all pass. Playwright against the static `out/` served at `/algo-clash/`: desktop 1280×800 and iPhone 14, `/` and `/play/`, no console errors, no horizontal overflow; screenshots viewed (title readable, 56px tap target).
- CI/Pages confirmation skipped: GitHub Actions quota exhausted until 2026-11-01.
- Known gaps: `app/icon.png`, `apple-icon.png`, `public/icon-*.png` are still Query Clash's placeholders (to replace with original art in B1/polish); CodeMirror/Pixi deps installed but unused yet; the work was pushed to branch `claude/eloquent-ritchie-wcl1m5` (session branch rule), not `main`, so Pages will not deploy until it is merged.
- Next: A2 (C++ toolchain spike, `@yowasp/clang`).

## 2026-10-28: A2 C++ toolchain spike
- `@yowasp/clang` compiles and runs STL-heavy C++ in the browser: `/dev/judge` (compile worker + fresh run worker with an in-repo WASI host, timeout via `terminate()`). Details and numbers in `docs/adr/0001-cpp-runtime.md`: ~27 MB gzip download, cold compile ~10–13 s, warm ~5.8 s, run under 10 ms.
- Key findings: C++ exceptions do not link (judge uses `-fno-exceptions`); `bits/stdc++.h` shim works; the stack-size flag works but V8's engine stack caps recursion depth; the `runClang` API in the README does not exist in this version (`commands["clang++"]`).
- Infra: `scripts/copy-toolchain.mjs` (run by dev/build/build:pages) copies the toolchain to gitignored `public/toolchain/`; `gen-sw.mjs` no longer precaches it and caches it on demand in a deploy-surviving cache; eslint ignores it.
- Verified: `npm run lint`, `typecheck`, `test`, `build`, `build:pages` pass; Playwright on the static `out/`: desktop and `devices["iPhone 14"]`, two compile+run rounds each, correct stdout, no console errors, no horizontal overflow, screenshot viewed (readable, tap target ≥ 44 px). CI/Pages confirmation skipped: Actions quota exhausted until 2026-11-01.
- Known gaps: real iPhone Safari memory is unmeasured (only Chromium emulation); max recursion depth unmeasured; the SW toolchain caching path is untested in a browser; work is on branch `claude/eloquent-ritchie-upifrq` (session branch rule), not `main`.
- Next: A3 (judge core: harness, verdicts, clang-error table, tests).
