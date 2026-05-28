# Project Overview

**Name:** void-supercode
**Version:** 1.121.0
**Author:** Voidware
**License:** MIT
**Visibility:** Private project (sole owner)
**Type:** VS Code fork → future IDE with integrated AI

## What it is
A customized fork of VS Code (Microsoft) being shaped into a standalone IDE
with first-class AI capabilities. Retains the full VS Code architecture
(Electron + Monaco + extension host) and adds Void-specific subsystems.

## Top-level folders
| Folder            | Purpose                                              |
|-------------------|------------------------------------------------------|
| `src/`            | Core sources (`vs/`, bootstrap, CLIs)                |
| `void_ai/`        | Void AI subsystem (modes, engines)                   |
| `integrated_ext/` | Integrated (non-removable) bundled extensions        |
| `extensions/`     | Standard removable extensions                        |
| `.agents/skills/` | Agent skill definitions                              |
| `.eslint-plugin-local/` | Custom ESLint rules (30+)                       |
| `cli/`            | Rust CLI                                             |
| `build/`          | Gulp build scripts                                   |
| `remote/`         | Remote/server runtime                                |
| `resources/`      | Icons, app resources                                 |
| `scripts/`        | Helper scripts (perf, dev launchers)                 |
| `test/`           | Mocha + Playwright tests                             |
