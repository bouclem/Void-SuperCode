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
  getConfig: (): Promise<{ lastFolder: string | null }> => ipcRenderer.invoke('get-config'),
  setConfig: (updates: Record<string, unknown>): Promise<boolean> => ipcRenderer.invoke('set-config', updates),
  logMessage: (level: string, source: string, message: string): Promise<boolean> =>
    ipcRenderer.invoke('log-message', level, source, message),
});
