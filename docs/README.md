# Void SuperCode

A lightweight desktop code editor built with Electron, TypeScript, and Monaco Editor.

## Features

- Monaco editor with syntax highlighting for JavaScript, TypeScript, HTML, CSS, JSON, and more
- File explorer with create/rename/delete support
- Tabbed editing with unsaved change indicators
- Autosave (every 15 seconds, configurable in settings)
- Close confirmation dialog for unsaved files
- Integrated terminal (opens in current folder root)
- Debug Console with console.log/error/warn interception and runtime error capture
- Settings panel with autosave toggle and log level control
- Persistent config and daily logs in `~/.voidscode/`
- Insider version tagging with badge
- JavaScript language support with bracket pair colorization and auto-closing brackets
- Custom file icons for JavaScript files in `src/lang/javascript/`

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
  main/           Electron main process (window, IPC, terminal, logging, config)
    main.ts       App entry, IPC handlers
    preload.ts    Context bridge for renderer
    terminal.ts   PTY management for integrated terminal
    logger.ts     Daily log files with level filtering
    voidscode.ts  Config and .voidscode directory management
  renderer/
    modules/      UI logic split by feature
      app/        App init, activity bar, sidebar/panel control
      editor/     Monaco editor integration
      tabs/       Tab management with close confirmation
      file-explorer/  File tree, create/open files
      welcome/    Welcome page
      debug-console/  Debug console with console interception
      autosave/   Periodic autosave
      settings/   Settings panel
      terminal/   xterm.js terminal frontend
    types/        TypeScript declaration files (globals, window interfaces)
    icons/        SVG icons for sidebar, activity bar, and file tree
    index.html    Main renderer HTML
    style.css     Global styles
  lang/
    javascript/   JavaScript language support (config, icons)
docs/             Project documentation
```
