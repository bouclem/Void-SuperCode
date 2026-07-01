import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  openFolderDialog: (): Promise<string | null> => ipcRenderer.invoke('open-folder-dialog'),
  openFileDialog: (): Promise<string | null> => ipcRenderer.invoke('open-file-dialog'),
  readDirectory: (dirPath: string): Promise<{ name: string; path: string; isDirectory: boolean }[]> =>
    ipcRenderer.invoke('read-directory', dirPath),
  readFile: (filePath: string): Promise<string> => ipcRenderer.invoke('read-file', filePath),
  createFile: (filePath: string): Promise<boolean> => ipcRenderer.invoke('create-file', filePath),
  saveFile: (filePath: string, content: string): Promise<boolean> => ipcRenderer.invoke('save-file', filePath, content),
  createFolder: (folderPath: string): Promise<boolean> => ipcRenderer.invoke('create-folder', folderPath),
  getConfig: (): Promise<Record<string, unknown>> => ipcRenderer.invoke('get-config'),
  setConfig: (updates: Record<string, unknown>): Promise<boolean> => ipcRenderer.invoke('set-config', updates),
  logMessage: (level: string, source: string, message: string): Promise<boolean> =>
    ipcRenderer.invoke('log-message', level, source, message),
  terminalCreate: (cwd: string): Promise<boolean> => ipcRenderer.invoke('terminal-create', cwd),
  terminalInput: (data: string): Promise<boolean> => ipcRenderer.invoke('terminal-input', data),
  terminalResize: (cols: number, rows: number): Promise<boolean> => ipcRenderer.invoke('terminal-resize', cols, rows),
  terminalKill: (): Promise<boolean> => ipcRenderer.invoke('terminal-kill'),
  terminalOutput: (callback: (_event: unknown, data: string) => void): void => {
    ipcRenderer.on('terminal-output', callback);
  },
  terminalExit: (callback: () => void): void => {
    ipcRenderer.on('terminal-exit', callback);
  },
  gitStatus: (cwd: string): Promise<{ branch: string | null; files: { path: string; status: string; staged: boolean }[]; isRepo: boolean }> =>
    ipcRenderer.invoke('git-status', cwd),
  gitStage: (cwd: string, filePath: string): Promise<boolean> => ipcRenderer.invoke('git-stage', cwd, filePath),
  gitUnstage: (cwd: string, filePath: string): Promise<boolean> => ipcRenderer.invoke('git-unstage', cwd, filePath),
  gitCommit: (cwd: string, message: string): Promise<boolean> => ipcRenderer.invoke('git-commit', cwd, message),
  gitPush: (cwd: string): Promise<boolean> => ipcRenderer.invoke('git-push', cwd),
  gitPull: (cwd: string): Promise<boolean> => ipcRenderer.invoke('git-pull', cwd),
  gitFetch: (cwd: string): Promise<boolean> => ipcRenderer.invoke('git-fetch', cwd),
  gitClone: (url: string, destDir: string): Promise<boolean> => ipcRenderer.invoke('git-clone', url, destDir),
  gitGetConfig: (cwd: string): Promise<{ name: string; email: string }> => ipcRenderer.invoke('git-get-config', cwd),
  gitSetConfig: (cwd: string, name: string, email: string): Promise<boolean> => ipcRenderer.invoke('git-set-config', cwd, name, email),
  openSettingsWindow: (): void => { ipcRenderer.send('open-settings-window'); },
  onSettingsUpdated: (callback: (updates: Record<string, unknown>) => void): void => {
    ipcRenderer.on('settings-updated', (_event, updates) => callback(updates));
  },
  runFile: (filePath: string, content: string): Promise<{ success: boolean; stdout: string; stderr: string; error?: string }> =>
    ipcRenderer.invoke('run-file', filePath, content),
  searchFiles: (rootDir: string, query: string): Promise<{ name: string; path: string; relativePath: string }[]> =>
    ipcRenderer.invoke('search-files', rootDir, query),
  checkForUpdates: (): Promise<{ updateAvailable: boolean; latestVersion: string; downloadUrl: string; currentVersion: string }> =>
    ipcRenderer.invoke('check-for-updates'),
  openExternal: (url: string): void => { ipcRenderer.send('open-external', url); },
  installUpdate: (latestTag: string): Promise<boolean> => ipcRenderer.invoke('install-update', latestTag),
  onInstallProgress: (callback: (progress: { stage: string; message: string; percent?: number }) => void): void => {
    ipcRenderer.on('install-progress', (_event, progress) => callback(progress));
  },
});
