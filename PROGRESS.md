# Algo Clash progress

Append a dated entry after every run: what changed, how it was verified (commands, screenshot notes), known gaps, what's next. Newest entries at the bottom.

## 2026-10-28: Project seeded
- Added the design set: `CLAUDE.md` (routine protocol and quality bars), `ROADMAP.md` (phases A–F), `docs/GAME_DESIGN.md`, `docs/CURRICULUM.md` and `docs/ARCHITECTURE.md`.
- Toolchain lead: `@yowasp/clang` ships libc++ headers and `libc++.a` for wasm32-wasip1 (package listing checked; nothing compiled yet). The A2 spike must measure it.
- Next: ROADMAP A1 (scaffold from Query Clash).

## 2026-10-28: A1 scaffold from Query Clash
- Added Next.js 16 + React 19 + Pixi 8 + Tailwind 4 scaffold: pixel-UI CSS, fonts, PWA manifest + generated service worker (`scripts/gen-sw.mjs`), `ci.yml` + `pages.yml` (basePath `/algo-clash`), original pixel icons (`scripts/gen-icons.mjs`), title screen and an empty `/play` (Mainville placeholder), a README and a manifest test. No Query/SQL/PGlite code carried over.
- Verified: `npm run lint`, `typecheck`, `test` (1 passed), `build`, `build:pages` all pass. Playwright on the static `out/` served under `/algo-clash/` at 1280×800 and iPhone 14: title and `/play` render, START navigates, no console errors, no horizontal overflow, text readable.
- Process notes: this session was assigned branch `claude/eloquent-ritchie-d2e4cs`, so work was pushed there rather than `main` (merge to `main` to deploy). CI/Pages confirmation skipped (GitHub Actions quota exhausted until 2026-11-01).
- Known gaps: CodeMirror not added yet (A5); service worker's offline behaviour not exercised in a browser this run.
- Next: A2 (C++ toolchain spike with `@yowasp/clang`).
