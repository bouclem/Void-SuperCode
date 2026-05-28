# Void Context Engine (VCE)

**Location:** `void_ai/context_engines/`
**Status:** Phase 2 — file discovery implemented (workspace walking,
`.gitignore` parsing, language detection). Parser / storage / queries
still skeletons.

## tsconfig
`void_ai/tsconfig.json` extends `src/tsconfig.base.json`. Adds `node`
types, `noEmit: true`. Type-check only — not yet wired into the build
pipeline.

## Purpose
Workspace-wide code understanding for Void's coding agents. Indexes the
local filesystem (no git required) and exposes architectural context
through a small set of tools.

## Inspiration
[Xanther Context Engine (XCE)](https://xanther.ai/products/context-engine/),
adapted for local workspace use. Key differences:
- No git connection — reads workspace FS directly
- In-process service (DI) instead of external MCP server
- On-disk index at `.void/context/` (workspace root)
- Tools also exposed as VS Code commands for inspection

## Capabilities (planned)
- Semantic Code Search
- Callers & Callees (call chain traversal, dead code)
- Architecture Context (modules, layers, circular deps)
- Impact Analysis (change propagation, test coverage, risk)
- Traceability (req↔code↔test↔issue)

## Indexing pipeline
1. Discover — walk workspace via local FS (respects `.gitignore` if present)
2. Parse — tree-sitter AST per file (`@vscode/tree-sitter-wasm`)
3. Extract — symbols, references, imports, calls
4. Persist — SQLite (`@vscode/sqlite3`) at `.void/context/index.db`
5. Watch — incremental refresh via `@parcel/watcher`

## Tools
| Tool / Command          | Purpose                                |
|-------------------------|----------------------------------------|
| `vce_search` / `vce.search`             | Semantic code search       |
| `vce_architecture` / `vce.architecture` | Module structure & deps    |
| `vce_callers` / `vce.callers`           | Find callers of a symbol   |
| `vce_callees` / `vce.callees`           | Find callees of a symbol   |
| `vce_impact` / `vce.impact`             | Change impact analysis     |
| `vce_trace` / `vce.trace`               | Req↔code↔test traceability |
| `vce_index` / `vce.index`               | Trigger / rebuild index    |

## Layout
```
void_ai/context_engines/
├── README.md
├── core/
│   ├── contextEngine.ts        # IContextEngine + ContextEngineService stub
│   ├── workspaceSource.ts      # LocalWorkspaceSource (no git)
│   ├── ignore.ts               # IgnoreMatcher (.gitignore + builtins)
│   ├── languageMap.ts          # extension → language id
│   ├── indexer/
│   │   ├── indexer.ts
│   │   ├── treeSitterParser.ts
│   │   ├── symbolGraph.ts
│   │   └── callGraph.ts
│   ├── storage/
│   │   ├── sqliteStore.ts
│   │   └── schema.sql          # files, symbols, references, call_edges, import_edges
│   ├── query/
│   │   ├── search.ts
│   │   ├── callers.ts
│   │   ├── callees.ts
│   │   ├── architecture.ts
│   │   ├── impact.ts
│   │   └── trace.ts
│   └── watch/
│       └── fileWatcher.ts
└── tools/
    ├── vce_search.ts
    ├── vce_architecture.ts
    ├── vce_callers.ts
    ├── vce_callees.ts
    ├── vce_impact.ts
    ├── vce_trace.ts
    └── vce_index.ts
```

## Conventions
- File headers: Voidware copyright (matches VS Code style)
- Strict TS — no `any`, no dangerous casts
- ESM imports use `.js` extension
- All stubs throw `vce: <method> not implemented`

## Decisions locked
- Index location: `.void/context/` at workspace root
- Tool exposure: internal service + VS Code commands (both)
- Naming prefix: `vce_*`

## Next steps (not started)
- Implement `TreeSitterParser` (TypeScript first)
- Wire `SqliteStore` to `@vscode/sqlite3`
- `FileWatcher` via `@parcel/watcher`
- Symbol/call graph extraction
- DI registration into `src/vs/` (separate approval required)
