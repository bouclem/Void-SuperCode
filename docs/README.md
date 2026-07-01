# Void SuperCode

A lightweight desktop code editor built with Electron, TypeScript, and Monaco Editor.

## Features

- Monaco editor with syntax highlighting for JavaScript, TypeScript, HTML, CSS, JSON, Julia, Markdown, and more
- File explorer with create/rename/delete support
- Tabbed editing with unsaved change indicators
- Autosave (every 15 seconds, configurable in settings)
- Close confirmation dialog for unsaved files
- Integrated terminal (opens in current folder root)
- Debug Console with console.log/error/warn interception and runtime error capture
- Settings window — separate Electron window with autosave, log level, git config, and auto-update settings
- Git integration — source control panel with stage/unstage/commit
- GitHub & GitLab integration — clone from any remote URL, push, pull, fetch
- Git publish button — push branch to remote with -u origin when no remote is set
- Git commit history — view last 50 commits with hash, author, date, and message
- Git settings — user.name and user.email configuration in settings window
- Resizable bottom panel — drag to resize terminal/debug console
- Command palette (Ctrl+Shift+P) — fuzzy search and execute commands
- Global file search (Ctrl+P) — fuzzy find files by name across project
- Markdown support — .md files render as formatted preview via Run button
- Run file button — execute JS/TS files, preview markdown
- Julia language support — syntax highlighting for .jl files
- Auto-update — checks GitHub releases, downloads and installs pre-built binaries (no npm required)
- Auto-update respects insider channel — matches -insider tags for insider builds
- Persistent config and daily logs in `~/.voidscode/`
- Insider version tagging with badge
- JavaScript language support with bracket pair colorization and auto-closing brackets
- Custom file icons for JavaScript and Julia files in `src/lang/`

## Tech Stack

- **Electron** — desktop application framework
- **TypeScript** — type-safe development
- **Monaco Editor** — the same editor that powers VS Code
- **xterm.js** — terminal frontend
- **node-pty** — pseudo-terminal backend

## Getting Started

```bash
npm install
npm start
```

## Project Structure

```
src/
  main/           Electron main process (window, IPC, terminal, git, logging, config, auto-update)
    main.ts       App entry, IPC handlers
    preload.ts    Context bridge for renderer
    terminal.ts   PTY management for integrated terminal
    git.ts        Git status, stage, unstage, commit, push, pull, fetch, clone via child_process
    logger.ts     Daily log files with level filtering
    voidscode.ts  Config and .voidscode directory management
    auto-update.ts  Run file, file search, GitHub release check and binary install
  renderer/
    modules/      UI logic split by feature
      app/        App init, activity bar, sidebar/panel control, command registration
      editor/     Monaco editor integration
      tabs/       Tab management with close confirmation
      file-explorer/  File tree, create/open files
      welcome/    Welcome page
      debug-console/  Debug console with console interception
      autosave/   Periodic autosave
      settings/   Settings window launcher
      terminal/   xterm.js terminal frontend
      git/        Source control panel (status, stage, commit, push, pull, fetch, clone)
      command-palette/  Ctrl+Shift+P command fuzzy search
      file-search/      Ctrl+P global file fuzzy search
      markdown/         Markdown preview renderer
      run-file/         Run/preview button handler
      auto-update/      Update check, download, install progress UI
    types/        TypeScript declaration files (globals, window interfaces)
    icons/        SVG icons for sidebar, activity bar, and file tree
    index.html    Main renderer HTML
    style.css     CSS entry point (imports from styles/)
    styles/       Split CSS files (base, editor, sidebar, bottom-panel, git, modal, features)
  lang/
    javascript/   JavaScript language support (config, icons)
    julia/        Julia language support (config, icons)
    typescript/   TypeScript language support (config, icons)
docs/             Project documentation
```
