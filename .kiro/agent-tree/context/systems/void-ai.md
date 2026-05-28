# void_ai/ — Void AI Subsystem

## Status
Skeleton stage. Folders exist but most are empty.

## Structure
```
void_ai/
├── ai/
│   └── modes/
│       ├── multi-agents_mode/   # multi-agent orchestration mode
│       ├── specs_mode/          # spec-driven workflow (Kiro-style)
│       └── vibecoding_mode/     # conversational/exploratory mode
├── context_engines/             # EMPTY — to be implemented
└── session_engines/             # EMPTY — to be implemented
```

## Notes
- Mode names mirror Kiro session types (Vibe, Spec) plus a multi-agent variant
- `context_engines/` likely intended for context retrieval/management
- `session_engines/` likely intended for session lifecycle management
- No source files inspected yet — refresh on demand when work touches `void_ai/`
