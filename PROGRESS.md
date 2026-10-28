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
