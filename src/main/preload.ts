import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  openFolderDialog: (): Promise<string | null> => ipcRenderer.invoke('open-folder-dialog'),
  readDirectory: (dirPath: string): Promise<{ name: string; path: string; isDirectory: boolean }[]> =>
    ipcRenderer.invoke('read-directory', dirPath),
  readFile: (filePath: string): Promise<string> => ipcRenderer.invoke('read-file', filePath),
  createFile: (filePath: string): Promise<boolean> => ipcRenderer.invoke('create-file', filePath),
  saveFile: (filePath: string, content: string): Promise<boolean> => ipcRenderer.invoke('save-file', filePath, content),
});
