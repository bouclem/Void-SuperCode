# Changelog

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
