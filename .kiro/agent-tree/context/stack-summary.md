# Stack Summary

## Languages
- **TypeScript** (primary) — `typescript@6.0.0-dev`, `@typescript/native-preview`
- **Rust** — CLI in `cli/`
- **JavaScript** — build scripts, gulp tasks

## Runtime
- **Electron** 39.8.8
- **Node.js** 22.18.10 (`@types/node`)

## Build & Tooling
- **Gulp** 4 — main build orchestrator (`gulpfile.mjs`)
- **tsgo** — TypeScript native compiler (faster than tsc)
- **ESLint** 9.36 + custom local plugin
- **rspack** — used in `build/rspack/`
- **esbuild** — used per-extension

## Test
- **Mocha** 10.8 — unit tests (`test/unit/node/`, `test/unit/browser/`)
- **Playwright** 1.56 — browser/E2E
- **@vscode/test-electron** — extension tests

## Key Runtime Deps
- `@anthropic-ai/sdk` 0.82.0 — Claude API
- `@anthropic-ai/claude-agent-sdk` 0.2.128 (devDep) — agent SDK
- `@vscode/ripgrep`, `@vscode/sqlite3`, `@vscode/spdlog` — native deps
- `@xterm/*` 6.1.0-beta — terminal
- `node-pty` 1.2.0-beta — PTY
- `@parcel/watcher` 2.5.6 — file watching
- `tas-client` 0.3.1 — A/B experimentation
- `undici` 7.25.0 — HTTP

## NPM Scripts (key ones)
- `npm run watch` — full dev watch (client + transpile + extensions)
- `npm run compile` — gulp compile
- `npm run test-node` / `test-browser` / `test-extension`
- `npm run eslint` / `stylelint` / `hygiene`
- `./scripts/code` (Linux/Mac) or `.\scripts\code.bat` (Win) — launch
