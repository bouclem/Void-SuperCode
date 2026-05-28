# integrated_ext/ — Integrated (Non-Removable) Extensions

## Purpose
Extensions that ship built into the IDE and **cannot be removed** by the
user. Distinct from `extensions/`, which holds removable extensions.

Both folders coexist by design:
- `integrated_ext/` — permanent, always-available language/tooling support
- `extensions/`     — standard removable extensions

## Entry point
`integrated_ext/integrated_ext.ts` — registration/loader (contents not
yet inspected).

## Languages bundled
cpp, csharp, css, css-language-features, diff, git, git-base, github,
github-authentication, gitlab, go, html, html-language-features, java,
javascript, json, json-language-features, julia, lua, markdown-basics,
markdown-language-features, markdown-math, powershell, python, rust,
shellscript, sql, swift, typescript-basics, typescript-language-features,
xml, yaml

## Structure pattern
Each extension follows VS Code extension layout:
- `package.json`, `package.nls.json` — manifest
- `language-configuration.json` — bracket/comment rules
- `syntaxes/` — TextMate grammars
- `snippets/` — code snippets (where applicable)
- `src/` + `esbuild.mts` — for extensions with TypeScript code
