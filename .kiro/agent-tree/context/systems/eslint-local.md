# .eslint-plugin-local/ — Custom Lint Rules

30+ project-specific rules enforcing VS Code architecture and safety
conventions. Loaded via `eslint.config.js`.

## Rule categories

### Architecture / Imports
- `code-amd-node-module` — AMD/Node module hygiene
- `code-import-patterns` — allowed import paths per layer
- `code-layering` — enforces base/platform/editor/workbench layering
- `code-no-deep-import-of-internal` — block reaching into internals
- `code-no-http-import` — block runtime HTTP imports
- `code-no-runtime-import` — block runtime imports
- `code-no-static-node-module-import` — block static node:* imports
- `code-no-standalone-editor` — guards monaco standalone boundary
- `code-no-nls-in-standalone-editor` — i18n boundary

### Type safety
- `code-no-any-casts`
- `code-no-dangerous-type-assertions`
- `code-no-declare-const-enum`
- `code-no-in-operator`
- `code-must-use-result`
- `code-declare-service-brand` — DI service marker

### Disposables / Lifecycle
- `code-must-use-super-dispose`
- `code-no-potentially-unsafe-disposables`
- `code-ensure-no-disposables-leak-in-test`

### Async safety
- `code-no-accessor-after-await`
- `code-no-reader-after-await`
- `code-no-test-async-suite`

### Localization
- `code-no-icons-in-localized-strings`
- `code-no-localization-template-literals`
- `code-no-localized-model-description`

### Misc
- `code-limited-top-functions`
- `code-no-global-document-listener`
- `code-no-observable-get-in-reactive-context`
- `code-no-static-self-ref`
- `code-no-telemetry-common-property`
- `code-no-test-only`

## When to consult
Before writing or modifying code in `src/vs/`, check the relevant rule
to avoid lint failures.
