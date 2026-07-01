import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { getConfig, setConfig } from './voidscode';
import { logError, logInfo } from './logger';

function createWindow(): void {
  const iconPath = path.join(__dirname, '..', 'icon.png');
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 600,
    minHeight: 400,
    title: 'Void SuperCode',
    backgroundColor: '#1e1e1e',
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));
  win.setMenuBarVisibility(false);
}

app.whenReady().then(() => {
  logInfo('main', 'Application started');
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

process.on('uncaughtException', (err) => {
  logError('main', 'Uncaught exception: ' + err.message + '\n' + err.stack);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('open-folder-dialog', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });
  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }
  return result.filePaths[0]!;
});

ipcMain.handle('open-file-dialog', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
  });
  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }
  return result.filePaths[0]!;
});

ipcMain.handle('read-directory', async (_event, dirPath: string) => {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const items = entries
      .filter((e) => !e.name.startsWith('.'))
      .map((e) => ({
        name: e.name,
        path: path.join(dirPath, e.name),
        isDirectory: e.isDirectory(),
      }))
      .sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });
    return items;
  } catch {
    return [];
  }
});

ipcMain.handle('read-file', async (_event, filePath: string) => {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return '';
  }
});

ipcMain.handle('create-file', async (_event, filePath: string) => {
  try {
    const normalized = path.normalize(filePath);
    if (fs.existsSync(normalized)) {
      logError('create-file', 'File already exists: ' + normalized);
      return false;
    }
    fs.writeFileSync(normalized, '', 'utf-8');
    logInfo('create-file', 'Created file: ' + normalized);
    return true;
  } catch (err) {
    logError('create-file', 'Failed to create file: ' + filePath + ' - ' + (err as Error).message);
    return false;
  }
});

ipcMain.handle('save-file', async (_event, filePath: string, content: string) => {
  try {
    const normalized = path.normalize(filePath);
    fs.writeFileSync(normalized, content, 'utf-8');
    return true;
  } catch (err) {
    logError('save-file', 'Failed to save: ' + filePath + ' - ' + (err as Error).message);
    return false;
  }
});

ipcMain.handle('create-folder', async (_event, folderPath: string) => {
  try {
    const normalized = path.normalize(folderPath);
    if (fs.existsSync(normalized)) {
      logError('create-folder', 'Folder already exists: ' + normalized);
      return false;
    }
    fs.mkdirSync(normalized, { recursive: true });
    logInfo('create-folder', 'Created folder: ' + normalized);
    return true;
  } catch (err) {
    logError('create-folder', 'Failed to create folder: ' + folderPath + ' - ' + (err as Error).message);
    return false;
  }
});

ipcMain.handle('get-config', async () => {
  return getConfig();
});

ipcMain.handle('set-config', async (_event, updates: Record<string, unknown>) => {
  setConfig(updates);
  return true;
});

ipcMain.handle('log-message', async (_event, level: string, source: string, message: string) => {
  if (level === 'ERROR') {
    logError(source, message);
  } else if (level === 'WARN') {
    logInfo(source, message);
  } else {
    logInfo(source, message);
  }
  return true;
});
