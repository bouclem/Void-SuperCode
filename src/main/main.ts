import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { getConfig, setConfig } from './voidscode';
import { logError, logInfo, logWarn } from './logger';
import { createTerminal, writeTerminal, resizeTerminal, killTerminal } from './terminal';
import { getGitStatus, stageFile, unstageFile, commitChanges, pushChanges, pullChanges, fetchRemotes, cloneRepo, getGitConfig, setGitConfig, gitLog, gitPublish, gitHasRemote, gitInit } from './git';
import { runFile as runFileExec, searchFiles, checkForUpdates, downloadAndInstallUpdate } from './auto-update';
import { shell } from 'electron';

function getPkgVersion(): string {
  try {
    const pkgPath = path.join(__dirname, '..', '..', 'package.json');
    const raw = fs.readFileSync(pkgPath, 'utf-8');
    return (JSON.parse(raw) as { version: string }).version;
  } catch {
    return '0.0.0';
  }
}

function isInsiderBuild(): boolean {
  try {
    const pkgPath = path.join(__dirname, '..', '..', 'package.json');
    const raw = fs.readFileSync(pkgPath, 'utf-8');
    return (JSON.parse(raw) as { releaseChannel?: string }).releaseChannel === 'insider';
  } catch {
    return false;
  }
}

let mainWindow: BrowserWindow | null = null;

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
  mainWindow = win;
  win.on('closed', function () {
    mainWindow = null;
  });
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
    logWarn(source, message);
  } else {
    logInfo(source, message);
  }
  return true;
});

ipcMain.handle('terminal-create', async (event, cwd: string) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return false;
  return createTerminal(cwd, win);
});

ipcMain.handle('terminal-input', async (_event, data: string) => {
  writeTerminal(data);
  return true;
});

ipcMain.handle('terminal-resize', async (_event, cols: number, rows: number) => {
  resizeTerminal(cols, rows);
  return true;
});

ipcMain.handle('terminal-kill', async () => {
  killTerminal();
  return true;
});

ipcMain.handle('git-status', async (_event, cwd: string) => {
  return getGitStatus(cwd);
});

ipcMain.handle('git-stage', async (_event, cwd: string, filePath: string) => {
  return stageFile(cwd, filePath);
});

ipcMain.handle('git-unstage', async (_event, cwd: string, filePath: string) => {
  return unstageFile(cwd, filePath);
});

ipcMain.handle('git-commit', async (_event, cwd: string, message: string) => {
  return commitChanges(cwd, message);
});

ipcMain.handle('git-push', async (_event, cwd: string) => {
  return pushChanges(cwd);
});

ipcMain.handle('git-pull', async (_event, cwd: string) => {
  return pullChanges(cwd);
});

ipcMain.handle('git-fetch', async (_event, cwd: string) => {
  return fetchRemotes(cwd);
});

ipcMain.handle('git-clone', async (_event, url: string, destDir: string) => {
  return cloneRepo(url, destDir);
});

ipcMain.handle('git-get-config', async (_event, cwd: string) => {
  return getGitConfig(cwd);
});

ipcMain.handle('git-set-config', async (_event, cwd: string, name: string, email: string) => {
  return setGitConfig(cwd, name, email);
});

ipcMain.handle('git-log', async (_event, cwd: string, maxCount: number) => {
  return gitLog(cwd, maxCount);
});

ipcMain.handle('git-publish', async (_event, cwd: string) => {
  return gitPublish(cwd);
});

ipcMain.handle('git-has-remote', async (_event, cwd: string) => {
  return gitHasRemote(cwd);
});

ipcMain.handle('git-init', async (_event, cwd: string) => {
  return gitInit(cwd);
});

ipcMain.on('settings-changed', (_event, updates: Record<string, unknown>) => {
  setConfig(updates);
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('settings-updated', updates);
  }
});

ipcMain.handle('run-file', async (_event, filePath: string, content: string) => {
  return runFileExec(filePath, content);
});

ipcMain.handle('search-files', async (_event, rootDir: string, query: string) => {
  return searchFiles(rootDir, query);
});

ipcMain.handle('check-for-updates', async () => {
  return checkForUpdates(getPkgVersion(), isInsiderBuild());
});

ipcMain.on('open-external', (_event, url: string) => {
  shell.openExternal(url);
});

ipcMain.handle('install-update', async (event, latestTag: string) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  return downloadAndInstallUpdate(latestTag, function (progress) {
    if (win && !win.isDestroyed()) {
      win.webContents.send('install-progress', progress);
    }
  });
});
