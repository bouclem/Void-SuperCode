# Void SuperCode

A lightweight desktop code editor built with Electron, TypeScript, and Monaco Editor.

## Tech Stack

- **Electron** — desktop application framework
- **TypeScript** — type-safe development
- **Monaco Editor** — the same editor that powers VS Code

## Getting Started

```bash
npm install
npm start
```

## Project Structure

```
src/
  main/         Electron main process (window creation, IPC, app lifecycle)
  renderer/
    modules/    UI logic split by feature (editor, tabs, welcome, file-explorer, app)
    types/      TypeScript declaration files (globals, window interfaces)
    icons/      SVG icons for sidebar, activity bar, and file tree
    index.html  Main renderer HTML
    style.css   Global styles
docs/           Project documentation
```
