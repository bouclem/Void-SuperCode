# package.json — Summary

**Name:** void-supercode  **Version:** 1.121.0  **Type:** module (ESM)
**Main:** `./out/main.js`  **Private:** true

## Notable scripts
| Script | What it does |
|--------|--------------|
| `watch` | Parallel: watch-client-transpile + watch-client + watch-extensions |
| `compile` | `npm run gulp compile` |
| `test-node` | Mocha against `test/unit/node/index.js` |
| `test-browser` | Playwright + browser unit tests |
| `test-extension` | `vscode-test` |
| `eslint` | `node build/eslint.ts` |
| `hygiene` | `npm run gulp hygiene` (precommit-style checks) |
| `precommit` | `node --experimental-strip-types build/hygiene.ts` |
| `compile-cli` | Build Rust CLI via gulp |
| `monaco-compile-check` | Type-check standalone monaco surface |
| `valid-layers-check` | Enforce layer boundaries via tsgo |

## Notable runtime deps
- `@anthropic-ai/sdk` — Claude API client
- `@vscode/ripgrep`, `@vscode/sqlite3`, `@vscode/spdlog` — native helpers
- `@xterm/*` 6.1.0-beta — terminal
- `node-pty` 1.2.0-beta — PTY
- `@parcel/watcher` — file watching
- `undici` — HTTP client

## Notable devDeps
- `electron` 39.8.8
- `typescript` 6.0.0-dev (next), `@typescript/native-preview` (tsgo)
- `@anthropic-ai/claude-agent-sdk` 0.2.128
- `gulp` 4, `mocha` 10, `playwright-core` 1.59
- `eslint` 9.36, `typescript-eslint` 8.45

## Overrides
- `node-gyp-build` 4.8.1
- `serialize-javascript` 7.0.3
- `ssh2.cpu-features` 0.0.0
