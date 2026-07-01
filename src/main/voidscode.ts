import * as path from 'path';
import * as fs from 'fs';
import { app } from 'electron';

interface VoidCodeConfig {
  lastFolder: string | null;
  autosave: boolean;
  logLevel: 'full' | 'normal' | 'minimal';
  autoUpdate: boolean;
  releaseChannel: string;
  shortcuts?: Record<string, string>;
}

const defaultConfig: VoidCodeConfig = {
  lastFolder: null,
  autosave: true,
  logLevel: 'normal',
  autoUpdate: true,
  releaseChannel: 'insider',
};

function getVoidCodeDir(): string {
  return path.join(app.getPath('home'), '.voidscode');
}

function getConfigPath(): string {
  return path.join(getVoidCodeDir(), 'config.json');
}

function ensureDir(): void {
  const dir = getVoidCodeDir();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const logsDir = path.join(dir, 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
}

export function getConfig(): VoidCodeConfig {
  try {
    ensureDir();
    const configPath = getConfigPath();
    if (!fs.existsSync(configPath)) {
      return { ...defaultConfig };
    }
    const raw = fs.readFileSync(configPath, 'utf-8');
    const parsed = JSON.parse(raw);
    return { ...defaultConfig, ...parsed };
  } catch {
    return { ...defaultConfig };
  }
}

export function setConfig(updates: Partial<VoidCodeConfig>): void {
  try {
    ensureDir();
    const current = getConfig();
    const merged = { ...current, ...updates };
    fs.writeFileSync(getConfigPath(), JSON.stringify(merged, null, 2), 'utf-8');
  } catch {
    // Silently fail — config is non-critical
  }
}

export function getLogsDir(): string {
  ensureDir();
  return path.join(getVoidCodeDir(), 'logs');
}
