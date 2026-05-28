# Architecture Rules

## Fork Origin
- Based on VS Code (Microsoft) — MIT licensed
- Fork name: Void SuperCode by Voidware
- Distro hash tracked in `package.json` field `distro`

## Layering (VS Code conventions)
- `src/vs/base/`     — platform-agnostic primitives
- `src/vs/platform/` — services (DI-based)
- `src/vs/editor/`   — Monaco editor core
- `src/vs/workbench/`— UI shell, contributions
- `src/vs/code/`     — Electron entry points
- `src/vs/server/`   — remote/server runtime
- Layering enforced by ESLint rules in `.eslint-plugin-local/code-layering.ts`
  and `code-import-patterns.ts`

## Custom Folders (Void-specific)
- `void_ai/`        — AI subsystem (modes, context engines, session engines)
- `integrated_ext/` — renamed `extensions/` folder for bundled language exts
- `.agents/skills/` — agent skill definitions
- `.eslint-plugin-local/` — 30+ custom lint rules

## Build
- Gulp pipeline (`gulpfile.mjs`)
- TypeScript compiled via `tsgo` (typescript native preview)
- Electron 39 host, Node 22 runtime
- Rust CLI in `cli/` (separate Cargo workspace)
