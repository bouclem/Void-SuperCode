# Void Context Engine (VCE)

Deep workspace understanding for Void's coding agents. VCE indexes the
local workspace and exposes precise architectural context to every agent
tool call — so the agent always knows where it is and what matters.

> Inspired by [Xanther Context Engine](https://xanther.ai/products/context-engine/),
> adapted for local workspaces. **No git connection required** — VCE
> reads the workspace filesystem directly.

---

## Capabilities

| Capability             | What it does                                                |
|------------------------|-------------------------------------------------------------|
| Semantic Code Search   | Symbols, functions, NL queries, cross-file references       |
| Callers & Callees      | Full call chain traversal, transitive deps, dead code       |
| Architecture Context   | Module boundaries, dependency layers, circular dep detection|
| Impact Analysis        | Change propagation, test coverage mapping, risk scoring     |
| Traceability           | Requirement→code, test→code, issue→patch links              |

---

## How it works

1. **Discover** — walk the workspace via local FS (respects `.gitignore` if
   present, but doesn't require git)
2. **Parse** — tree-sitter AST per file, language auto-detected
3. **Extract** — symbols, references, imports, calls
4. **Persist** — SQLite index in `.void/context/`
5. **Watch** — incremental refresh via `@parcel/watcher`

---

## Tools

Exposed both as an internal service (consumed by `void_ai/` modes via DI)
and as VS Code commands (for inspection / power-user access).

| Tool               | Description                                          |
|--------------------|------------------------------------------------------|
| `vce_search`       | Semantic code search across the workspace index      |
| `vce_architecture` | Get module structure and dependency context          |
| `vce_callers`      | Find all callers of a function or method             |
| `vce_callees`      | Find all callees of a function or method             |
| `vce_impact`       | Analyze impact of changes to a symbol                |
| `vce_trace`        | Trace requirements to code and tests                 |
| `vce_index`        | Trigger workspace indexing / rebuild                 |

---

## Layout

```
context_engines/
├── README.md
├── core/
│   ├── contextEngine.ts        # IContextEngine + service stub
│   ├── workspaceSource.ts      # local FS source
│   ├── indexer/
│   │   ├── indexer.ts          # orchestrator
│   │   ├── treeSitterParser.ts
│   │   ├── symbolGraph.ts
│   │   └── callGraph.ts
│   ├── storage/
│   │   ├── sqliteStore.ts
│   │   └── schema.sql
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

---

## Status

**Step 1 — Skeleton.** Interfaces defined, stubs in place, no logic yet.
