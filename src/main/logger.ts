import * as fs from 'fs';
import * as path from 'path';
import { getLogsDir, getConfig } from './voidscode';

type LogLevel = 'ERROR' | 'WARN' | 'INFO';

function shouldLog(level: LogLevel): boolean {
  const config = getConfig();
  const setting = config.logLevel || 'normal';
  if (setting === 'full') return true;
  if (setting === 'normal') return level === 'ERROR' || level === 'WARN';
  if (setting === 'minimal') return level === 'ERROR';
  return true;
}

function getLogFilePath(): string {
  const date = new Date().toISOString().slice(0, 10);
  return path.join(getLogsDir(), date + '.log');
}

function formatTimestamp(): string {
  return new Date().toISOString();
}

export function log(level: LogLevel, source: string, message: string): void {
  if (!shouldLog(level)) return;
  try {
    const line = `[${formatTimestamp()}] [${level}] [${source}] ${message}\n`;
    fs.appendFileSync(getLogFilePath(), line, 'utf-8');
  } catch {
    // Silently fail — logging is non-critical
  }
}

export function logError(source: string, message: string): void {
  log('ERROR', source, message);
}

export function logWarn(source: string, message: string): void {
  log('WARN', source, message);
}

export function logInfo(source: string, message: string): void {
  log('INFO', source, message);
}
