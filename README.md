# Algo Clash

A handheld-style creature RPG that teaches **data structures and algorithms in C++**. Every battle is a real interview problem: recognise the pattern, pick the data structure, write the C++ by hand, and a real in-browser compiler judges it.

Play: https://anmol-pawa.github.io/algo-clash/

## Develop

```bash
npm ci
npm run dev          # http://localhost:3000
npm run lint && npm run typecheck && npm test
npm run build        # normal Next.js build
npm run build:pages  # static export + service worker into out/
```

Design docs live in `docs/` (game design, curriculum, architecture); the build plan is `ROADMAP.md` and the log is `PROGRESS.md`. See `CLAUDE.md` for the hourly routine protocol.
