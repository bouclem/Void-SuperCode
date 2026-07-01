import * as os from 'os';
import { BrowserWindow } from 'electron';

let pty: any = null;

export function createTerminal(cwd: string, win: BrowserWindow): boolean {
  try {
    const shell = process.platform === 'win32' ? 'powershell.exe' : 'bash';
    const args = process.platform === 'win32' ? ['-NoLogo'] : [];

    const nodePty = require('node-pty');
    pty = nodePty.spawn(shell, args, {
      name: 'xterm-color',
      cols: 80,
      rows: 24,
      cwd: cwd || os.homedir(),
      env: process.env,
    });

    pty.onData((data: string) => {
      win.webContents.send('terminal-output', data);
    });

    pty.onExit(() => {
      win.webContents.send('terminal-exit');
      pty = null;
    });

    return true;
  } catch (err) {
    return false;
  }
}

export function writeTerminal(data: string): void {
  if (pty) {
    pty.write(data);
  }
}

export function resizeTerminal(cols: number, rows: number): void {
  if (pty) {
    try {
      pty.resize(cols, rows);
    } catch {
      // Non-critical
    }
  }
}

export function killTerminal(): void {
  if (pty) {
    try {
      pty.kill();
    } catch {
      // Non-critical
    }
    pty = null;
  }
}
