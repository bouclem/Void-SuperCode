import * as fs from 'fs';
import * as path from 'path';
import { getLogsDir } from './voidscode';

type LogLevel = 'ERROR' | 'WARN' | 'INFO';

function getLogFilePath(): string {
  const date = new Date().toISOString().slice(0, 10);
  return path.join(getLogsDir(), date + '.log');
}

function formatTimestamp(): string {
  return new Date().toISOString();
}

export function log(level: LogLevel, source: string, message: string): void {
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
