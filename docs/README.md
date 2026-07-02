# Void SuperCode

A lightweight desktop code editor built with Electron, TypeScript, and Monaco Editor.

![Version](https://img.shields.io/badge/version-0.1.7-blue) ![License](https://img.shields.io/badge/license-MIT-green) ![Platform](https://img.shields.io/badge/platform-Windows-blue)

## Features

- Monaco editor with syntax highlighting for JavaScript, TypeScript, HTML, CSS, JSON, Julia, Markdown, and more
- File explorer with create/rename/delete support and context menu
- Tabbed editing with unsaved change indicators
- Autosave (every 15 seconds, configurable in settings)
- Close confirmation dialog for unsaved files
- Integrated terminal (opens in current folder root)
- Debug Console with console.log/error/warn interception and runtime error capture
- Settings window — separate Electron window with autosave, log level, git config, and auto-update settings
- Git integration — source control panel with stage/unstage/commit, init repository button
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
- TypeScript language support — syntax highlighting for .ts and .tsx files
- Auto-update — checks GitHub releases, downloads and installs pre-built binaries (no npm required)
- Auto-update respects insider channel — matches -insider tags for insider builds
- Persistent config and daily logs in `~/.voidscode/`
- Insider version tagging with badge
- Custom file icons for JavaScript, TypeScript, and Julia files in `src/lang/`
- Drag & drop file open — drop files from OS explorer onto the editor area
- Double-click folder to create a new file inside it
- Find & replace in file (Ctrl+F / Ctrl+H)
- Find across files (Ctrl+Shift+F) — content search with grouped results
- Keyboard shortcuts settings — rebindable, persisted in config
- Code folding in Monaco editor — indentation-based folding with command palette actions
- HTML live preview — open .html files and click run button to toggle rendered iframe preview

## Quick Start (For Users)

### Download the Installer

1. Go to [Releases](https://github.com/bouclem/Void-SuperCode/releases)
2. Download the latest `Void SuperCode Setup x.x.x.exe`
3. Run the installer and follow the setup wizard
4. Launch **Void SuperCode** from the Start Menu or desktop shortcut

### Portable Version

If you prefer no installation:

1. Download `void-supercode-x.x.x-win.zip` from [Releases](https://github.com/bouclem/Void-SuperCode/releases)
2. Extract the zip to any folder
3. Run `Void SuperCode.exe`

### First Launch Tutorial

1. **Open a folder** — Click the folder icon in the sidebar (or `Ctrl+O`) to open a project folder
2. **Open files** — Double-click any file in the explorer to open it in a tab
3. **Search files** — Press `Ctrl+P` and type a filename to quickly find any file in your project
4. **Command palette** — Press `Ctrl+Shift+P` to search and run commands (save, git, toggle views, etc.)
5. **Run a file** — Open a `.js` or `.ts` file and click the `▶` button at the top-left of the editor to execute it. Output appears in the Debug Console.
6. **Markdown preview** — Open a `.md` file and click `▶` to toggle between editor and rendered preview
7. **Terminal** — Click the Terminal tab at the bottom to open an integrated terminal in your project folder
8. **Git** — Click the source control icon in the activity bar to stage, commit, push, and pull changes
9. **Settings** — Click the gear icon to open the settings window (autosave, log level, git config, auto-update)

## Quick Start (For Developers)

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ (includes npm)
- [Git](https://git-scm.com/)

### Run from Source

```bash
git clone https://github.com/bouclem/Void-SuperCode.git
cd Void-SuperCode
npm install
npm start
```

This compiles TypeScript and launches the app in development mode.

### Build the .exe Installer

```bash
npm install
npm run dist
```

This will:
1. Compile all TypeScript source files
2. Copy assets (HTML, CSS, icons, Monaco, xterm)
3. Package everything with electron-builder
4. Output the installer and portable zip to the `release/` folder

**Output files in `release/`:**
- `Void SuperCode Setup x.x.x.exe` — NSIS installer with desktop/start menu shortcuts
- `void-supercode-x.x.x-win.zip` — portable version (no install needed)

## Publishing a Release on GitHub

### Option A — Auto-publish via CLI

```bash
# 1. Create a GitHub Personal Access Token with "repo" scope
#    https://github.com/settings/tokens

# 2. Set it as an environment variable
set GH_TOKEN=your_token_here

# 3. Tag the release (use -insider suffix for insider builds)
git tag v0.1.1-insider
git push origin v0.1.1-insider

# 4. Build and publish
npm run release
```

This builds the `.exe` and `.zip`, creates a GitHub Release with the tag, and uploads both files as assets.

### Option B — Manual upload

```bash
# 1. Build the binaries
npm run dist

# 2. Go to GitHub:
#    https://github.com/bouclem/Void-SuperCode/releases/new

# 3. Create tag: v0.1.1-insider

# 4. Upload files from release/ folder:
#    - Void SuperCode Setup 0.1.1.exe
#    - void-supercode-0.1.1-win.zip

# 5. Add release notes and publish
```

### Version Numbering

| Release type | `package.json` version | Tag | `releaseChannel` |
|---|---|---|---|
| Insider build | `0.1.1` | `v0.1.1-insider` | `insider` |
| Stable release | `0.1.1` | `v0.1.1` | `stable` |

> The auto-update system matches tags based on the `releaseChannel` field. Insider builds only get `-insider` tags, stable builds only get plain version tags.

## Tech Stack

- **Electron** — desktop application framework
- **TypeScript** — type-safe development
- **Monaco Editor** — the same editor that powers VS Code
- **xterm.js** — terminal frontend
- **node-pty** — pseudo-terminal backend
- **electron-builder** — packaging and auto-update distribution

## Project Structure

```
src/
  main/           Electron main process (window, IPC, terminal, git, logging, config, auto-update)
    main.ts       App entry, IPC handlers
    preload.ts    Context bridge for renderer
    terminal.ts   PTY management for integrated terminal
    git.ts        Git status, stage, unstage, commit, push, pull, fetch, clone, log, publish
    logger.ts     Daily log files with level filtering
    voidscode.ts  Config and .voidscode directory management
    auto-update.ts  Run file, file search, GitHub release check and binary install
  renderer/
    modules/      UI logic split by feature
      app/        App init, activity bar, sidebar/panel control, command registration
      editor/     Monaco editor integration
      tabs/       Tab management with close confirmation
      file-explorer/  File tree, create/open/rename/delete files, drag & drop
      welcome/    Welcome page
      debug-console/  Debug console with console interception
      autosave/   Periodic autosave
      settings/   Settings window launcher
      terminal/   xterm.js terminal frontend
      git/        Source control panel (status, stage, commit, push, pull, fetch, clone, history)
      command-palette/  Ctrl+Shift+P command fuzzy search
      file-search/      Ctrl+P global file fuzzy search
      markdown/         Markdown preview renderer
      run-file/         Run/preview button handler
      auto-update/      Update check, download, install progress UI
      find-in-files/    Find across files (Ctrl+Shift+F)
      shortcuts/        Rebindable keyboard shortcuts
      settings-screen/  Settings screen UI
      code-folding/     Code folding commands (fold/unfold all, toggle, levels)
      html-preview/     HTML live preview via sandboxed iframe
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
release/          Build output (gitignored)
```

## License

MIT
