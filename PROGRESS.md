# Algo Clash progress

Append a dated entry after every run: what changed, how it was verified (commands, screenshot notes), known gaps, what's next. Newest entries at the bottom.

## 2026-10-28: Project seeded
- Added the design set: `CLAUDE.md` (routine protocol and quality bars), `ROADMAP.md` (phases A–F), `docs/GAME_DESIGN.md`, `docs/CURRICULUM.md` and `docs/ARCHITECTURE.md`.
- Toolchain lead: `@yowasp/clang` ships libc++ headers and `libc++.a` for wasm32-wasip1 (package listing checked; nothing compiled yet). The A2 spike must measure it.
- Next: ROADMAP A1 (scaffold from Query Clash).

## 2026-10-28: A1 scaffold from Query Clash
- Copied and adapted Query Clash's Next.js 16 + React 19 + Pixi 8 + Tailwind 4 setup: `next.config.ts` (static export, basePath `/algo-clash`), PWA manifest and `PwaRegister`, `scripts/gen-sw.mjs` (with the worker-response fix), `ci.yml` and `pages.yml`, the pixel-UI CSS (`.px-window`, `.px-menu-item`…), the pixel font setup, and icons (placeholder Query Clash icons for now; Algo Clash icons come with the art tasks).
- Removed all SQL/PGlite pieces. Added `@codemirror/lang-cpp` as a dependency for A5. New title screen (`/`) and an empty `/play` placeholder. `.routine/` lock convention kept.
- Verified: `npm run lint`, `typecheck`, `test` (manifest test), `build`, `build:pages` all pass. Playwright on the static export at desktop 1280×800 and iPhone 14: no console errors, no horizontal overflow, title and `/play` screenshots checked (readable, Start button ≥ 44 px).
- Known gaps: icons are placeholders; no game logic yet. Work was committed to the session branch `claude/eloquent-ritchie-fhxen9` (not `main`) per the session's branch rule. CI/Pages deploy confirmation skipped because of the Actions quota.
- Next: A2 (C++ toolchain spike with `@yowasp/clang`).
