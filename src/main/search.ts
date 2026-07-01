import * as fs from 'fs';
import * as path from 'path';

export interface ContentSearchMatch {
  line: number;
  text: string;
  column: number;
}

export interface ContentSearchResult {
  filePath: string;
  relativePath: string;
  matches: ContentSearchMatch[];
}

export function searchInFiles(
  rootDir: string,
  query: string,
  options?: { caseSensitive?: boolean; maxResults?: number }
): Promise<ContentSearchResult[]> {
  return new Promise(function (resolve) {
    const results: ContentSearchResult[] = [];
    const caseSensitive = options?.caseSensitive ?? false;
    const maxResults = options?.maxResults ?? 200;
    const searchQuery = caseSensitive ? query : query.toLowerCase();

    const binaryExtensions = new Set([
      '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.ico', '.webp', '.svg',
      '.pdf', '.zip', '.gz', '.tar', '.exe', '.dll', '.so', '.dylib',
      '.node', '.wasm', '.mp3', '.mp4', '.wav', '.avi', '.mov',
    ]);

    function walk(dir: string, relativeBase: string): void {
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
          const fullPath = path.join(dir, entry.name);
          const relPath = relativeBase ? relativeBase + '/' + entry.name : entry.name;

          if (entry.isDirectory()) {
            walk(fullPath, relPath);
          } else {
            if (results.length >= maxResults) break;

            const ext = path.extname(entry.name).toLowerCase();
            if (binaryExtensions.has(ext)) continue;

            const fileResult = searchFile(fullPath, relPath, searchQuery, caseSensitive);
            if (fileResult && fileResult.matches.length > 0) {
              results.push(fileResult);
            }
          }
        }
      } catch {
        // Permission errors etc
      }
    }

    walk(rootDir, '');
    resolve(results);
  });
}

function searchFile(
  filePath: string,
  relativePath: string,
  query: string,
  caseSensitive: boolean
): ContentSearchResult | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const matches: ContentSearchMatch[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]!;
      const searchLine = caseSensitive ? line : line.toLowerCase();
      const col = searchLine.indexOf(query);
      if (col !== -1) {
        const trimmed = line.length > 200 ? line.substring(0, 200) + '...' : line;
        matches.push({ line: i + 1, text: trimmed, column: col });
        if (matches.length >= 50) break;
      }
    }

    if (matches.length === 0) return null;
    return { filePath, relativePath, matches };
  } catch {
    return null;
  }
}
