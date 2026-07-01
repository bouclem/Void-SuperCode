# Changelog

## [0.1.0] - 2026-07-01

- Added: command palette (Ctrl+Shift+P) — fuzzy search and run commands
- Added: global file search (Ctrl+P) — fuzzy find files by name across project
- Added: markdown support — .md files render as formatted preview via Run button
- Added: run file button in tab bar — executes JS/TS files, shows MD preview
- Added: Julia language support — syntax highlighting for .jl files in Monaco
- Added: Julia file icon in src/lang/julia/
- Added: auto-update system — checks GitHub releases for new versions
- Added: auto-update downloads and installs pre-built release binaries (no npm required)
- Added: auto-update respects insider channel — matches -insider tags for insider builds
- Added: auto-update setting in settings window (enable/disable automatic checks)
- Added: install progress dialog with download bar and stage indicators
- Added: features.css — styles for command palette, file search, run button, MD preview, update dialog
- Changed: version bumped to 0.1.0

## [0.0.14] - 2026-07-01

- Fixed: terminal not opening — bottom panel and resize handle were outside #app div, pushed below viewport
- Changed: split style.css into 6 separate CSS files in styles/ folder (base, editor, sidebar, bottom-panel, git, modal)
- Changed: style.css now uses @import to load split CSS files

## [0.0.13] - 2026-07-01

- Added: GitHub & GitLab integration — clone from any remote URL (github.com, gitlab.com, etc.)
- Added: clone dialog with URL and destination folder inputs
- Added: push, pull, fetch buttons in source control panel header
- Added: git settings in settings window — user.name and user.email configuration
- Added: git config get/set via IPC (reads and writes git config for current repo)
- Changed: git action buttons only visible when current folder is a git repo

## [0.0.12] - 2026-07-01

- Added: real settings window — separate Electron BrowserWindow with its own title bar
- Added: settings-window.html — standalone HTML page with inline styles and scripts
- Added: settings changes sent via IPC from settings window to main window
- Added: resizable bottom panel — drag handle between editor and terminal/debug
- Added: git integration — source control panel in sidebar
- Added: git status (branch, staged/unstaged files with M/A/D/U/R status letters)
- Added: stage/unstage files with + / - buttons
- Added: commit input with message field and commit button
- Added: git activity bar button (source control icon)
- Changed: settings now opens as a real OS window, not an overlay or sidebar panel

## [0.0.11] - 2026-07-01

- Added: settings button (gear icon) at bottom of activity bar
- Added: settings panel with autosave toggle and log level dropdown
- Added: settings persisted in .voidscode/config.json (autosave, logLevel)
- Added: log level filtering — Full (INFO+WARN+ERROR), Normal (WARN+ERROR), Minimal (ERROR only)
- Added: terminal integration using node-pty + xterm.js
- Added: terminal opens in current folder root
- Added: bottom panel tab switcher (Debug Console / Terminal)
- Changed: autosave now reads enabled setting from config
- Changed: debug button no longer at bottom (settings button takes that spot)

## [0.0.10] - 2026-07-01

- Changed: debug console button moved to bottom left of activity bar
- Added: autosave system — saves current file every 15 seconds if it has unsaved changes
- Added: autosave.ts module with start/stop controls
- Fixed: double-clicking a file in the explorer now opens it instead of creating a new file
- Fixed: double-clicking a folder expands/collapses it
- Added: close confirmation modal when closing a tab with unsaved changes
- Added: modal with Save / Don't Save / Cancel buttons (custom styled, not native dialog)

## [0.0.9] - 2026-07-01

- Added: JavaScript language support with bracket pair colorization and auto-closing brackets/quotes
- Added: .jsx and .mjs file extension support (mapped to JavaScript in Monaco)
- Added: JavaScript-specific file icons in src/lang/javascript/icons/ (js-file.svg, jsx-file.svg, mjs-file.svg)
- Added: src/lang/javascript/ folder with lang.config.json for language configuration
- Added: bottom panel with Debug Console for logs and DevTools console output
- Added: debug-console.ts module — intercepts console.log/error/warn and runtime errors
- Added: debug.svg (bug icon) and close.svg icons in activity bar
- Added: Debug Console toggle button in activity bar
- Fixed: inline input blur event no longer prevents file creation (committed flag fix)

## [0.0.8] - 2026-07-01

- Added: "INSIDER" text on app icon for insider builds
- Fixed: file explorer sidebar now auto-opens when a folder is loaded (both on startup via last folder and on manual open)
- Added: showSidebar/hideSidebar methods to App module for programmatic sidebar control

## [0.0.7] - 2026-07-01

- Added: last opened folder is remembered and auto-loaded on next startup
- Added: .voidscode directory in user home for config and logs
- Added: config.json for persisting user settings (lastFolder)
- Added: daily log files in .voidscode/logs/ for IDE and code errors
- Added: voidscode.ts module for .voidscode directory and config management
- Added: logger.ts module for daily logging with ERROR/WARN/INFO levels
- Added: uncaught exception logging in main process
- Added: insider version badge in titlebar (amber "Insider" tag)
- Added: releaseChannel field in package.json
- Fixed: app icon now uses PNG format (Windows compatible) instead of SVG
- Added: generate-icon.ps1 script for PNG icon generation

## [0.0.6] - 2026-07-01

- Fixed: Monaco editor no longer editable when welcome page is visible
- Fixed: Welcome page layout is now responsive and scrollable on small windows
- Fixed: File explorer sidebar is now closed by default on startup
- Replaced browser prompt() popups with inline input field in file tree (Enter to create, Escape to cancel)
- Added new folder creation button with new-folder.svg icon
- Added create-folder IPC handler (fs.mkdirSync with recursive)
- Remade app icon with space-vibe gradient design (glowing brackets, orbit circles, star accents)

## [0.0.5] - 2026-07-01

- Added open file dialog for opening individual files
- Added welcome/tutorial page shown when no files are open
- Added activity bar on far left with stacked files icon button
- Added toggle sidebar via activity bar button
- Added open-file.svg and files-activity.svg icons
- Added Welcome module for empty state management

## [0.0.4] - 2026-07-01

- Added file tabs for multiple open files with switch/close support
- Added save file functionality (Ctrl+S / Cmd+S)
- Added dirty indicator (dot) on unsaved tabs
- Added save-file IPC handler in main process
- Restructured renderer code into modules folder (editor, tabs, file-explorer, app)
- Moved type declarations into separate types folder

## [0.0.3] - 2026-07-01

- Added create new file via + icon button in sidebar
- Added create new file via double-click on file explorer
- Added custom SVG icons (plus, folder, file, new-file)
- Split renderer code into separate TypeScript modules (editor, file-explorer, app)
- Added separate tsconfig for renderer (no module wrapping)

## [0.0.2] - 2026-07-01

- Added file explorer sidebar with folder open dialog
- Added expandable/collapsible directory tree
- Added file click to open in editor with syntax detection
- Added app icon (icon.svg)
- Added preload script for secure IPC communication

## [0.0.1] - 2026-07-01

- Added simple Electron desktop window
- Added Monaco editor with dark theme
- Basic project structure (main process + renderer)
