import { exec, execSync } from 'child_process';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { app } from 'electron';

export interface InstallProgress {
  stage: 'downloading' | 'extracting' | 'installing' | 'done' | 'error';
  message: string;
  percent?: number;
}

interface ReleaseAsset {
  name: string;
  browser_download_url: string;
  size: number;
  content_type: string;
}

interface GitHubRelease {
  tag_name: string;
  assets: ReleaseAsset[];
  html_url: string;
}

function getPlatformAssetPattern(): RegExp {
  const platform = process.platform;
  if (platform === 'win32') return /supercode.*\.zip$/i;
  if (platform === 'darwin') return /supercode.*\.dmg$/i;
  if (platform === 'linux') return /supercode.*\.(appimage|tar\.gz)$/i;
  return /supercode.*/i;
}

export function downloadAndInstallUpdate(
  latestTag: string,
  onProgress: (progress: InstallProgress) => void
): Promise<boolean> {
  return new Promise(function (resolve) {
    fetchReleaseAssets(latestTag).then(function (assets) {
      const pattern = getPlatformAssetPattern();
      const asset = assets.find(function (a) { return pattern.test(a.name); });

      if (!asset) {
        onProgress({ stage: 'error', message: 'No matching release asset found for platform: ' + process.platform });
        resolve(false);
        return;
      }

      const tmpDir = path.join(os.tmpdir(), 'void-supercode-update-' + Date.now());
      try {
        fs.mkdirSync(tmpDir, { recursive: true });
      } catch {
        onProgress({ stage: 'error', message: 'Failed to create temp directory' });
        resolve(false);
        return;
      }

      const archivePath = path.join(tmpDir, asset.name);

      onProgress({ stage: 'downloading', message: 'Downloading ' + asset.name + '...', percent: 0 });

      downloadFile(asset.browser_download_url, archivePath, function (percent) {
        onProgress({ stage: 'downloading', message: 'Downloading ' + asset.name + '...', percent });
      }).then(function () {
        onProgress({ stage: 'extracting', message: 'Extracting...' });

        const extractDir = path.join(tmpDir, 'extracted');
        fs.mkdirSync(extractDir, { recursive: true });

        try {
          if (asset.name.endsWith('.zip')) {
            execSync('powershell -Command "Expand-Archive -Path \'' + archivePath + '\' -DestinationPath \'' + extractDir + '\' -Force"', { stdio: 'ignore', timeout: 60000 });
          } else if (asset.name.endsWith('.tar.gz')) {
            execSync('tar -xzf "' + archivePath + '" -C "' + extractDir + '"', { stdio: 'ignore', timeout: 60000 });
          } else if (asset.name.endsWith('.AppImage')) {
            fs.copyFileSync(archivePath, path.join(extractDir, asset.name));
            fs.chmodSync(path.join(extractDir, asset.name), 0o755);
          } else if (asset.name.endsWith('.dmg')) {
            onProgress({ stage: 'error', message: 'DMG files require manual installation. Please open the downloaded file.' });
            execSync('open "' + archivePath + '"', { stdio: 'ignore' });
            resolve(false);
            return;
          }

          onProgress({ stage: 'installing', message: 'Installing update...' });

          const appDir = path.join(__dirname, '..', '..');
          const entries = fs.readdirSync(extractDir);

          let sourceDir = extractDir;
          if (entries.length === 1 && fs.statSync(path.join(extractDir, entries[0]!)).isDirectory()) {
            sourceDir = path.join(extractDir, entries[0]!);
          }

          copyDirSync(sourceDir, appDir, ['.git', 'node_modules', '.voidscode', 'dist']);

          onProgress({ stage: 'done', message: 'Update installed. Restarting...' });

          setTimeout(function () {
            app.relaunch();
            app.exit(0);
          }, 1500);

          resolve(true);
        } catch (err) {
          onProgress({ stage: 'error', message: 'Installation failed: ' + (err as Error).message });
          resolve(false);
        }
      }).catch(function (err) {
        onProgress({ stage: 'error', message: 'Download failed: ' + (err as Error).message });
        resolve(false);
      });
    }).catch(function () {
      onProgress({ stage: 'error', message: 'Failed to fetch release assets' });
      resolve(false);
    });
  });
}

function fetchReleaseAssets(tag: string): Promise<ReleaseAsset[]> {
  return new Promise(function (resolve, reject) {
    const options: https.RequestOptions = {
      hostname: 'api.github.com',
      path: '/repos/bouclem/Void-SuperCode/releases/tags/' + tag,
      method: 'GET',
      headers: { 'User-Agent': 'Void-SuperCode' },
    };

    const req = https.request(options, function (res) {
      let data = '';
      res.on('data', function (chunk) { data += chunk; });
      res.on('end', function () {
        try {
          const release = JSON.parse(data) as GitHubRelease;
          resolve(release.assets || []);
        } catch {
          reject(new Error('Failed to parse release data'));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(10000, function () { req.destroy(); reject(new Error('Request timed out')); });
    req.end();
  });
}

function downloadFile(url: string, dest: string, onProgress: (percent: number) => void): Promise<void> {
  return new Promise(function (resolve, reject) {
    const file = fs.createWriteStream(dest);

    function makeRequest(targetUrl: string): void {
      https.get(targetUrl, function (res) {
        if (res.statusCode === 302 || res.statusCode === 301) {
          res.resume();
          if (res.headers.location) {
            makeRequest(res.headers.location);
            return;
          }
        }

        if (res.statusCode !== 200) {
          file.close();
          fs.unlinkSync(dest);
          reject(new Error('HTTP ' + res.statusCode));
          return;
        }

        const totalBytes = parseInt(res.headers['content-length'] || '0', 10);
        let receivedBytes = 0;

        res.pipe(file);

        res.on('data', function (chunk: Buffer) {
          receivedBytes += chunk.length;
          if (totalBytes > 0) {
            onProgress(Math.round((receivedBytes / totalBytes) * 100));
          }
        });

        file.on('finish', function () {
          file.close();
          resolve();
        });

        file.on('error', function (err) {
          fs.unlinkSync(dest);
          reject(err);
        });
      }).on('error', function (err) {
        file.close();
        reject(err);
      });
    }

    makeRequest(url);
  });
}

function copyDirSync(src: string, dest: string, exclude: string[]): void {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    if (exclude.indexOf(entry.name) !== -1) continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      copyDirSync(srcPath, destPath, exclude);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

export interface RunResult {
  success: boolean;
  stdout: string;
  stderr: string;
  error?: string;
}

export function runFile(filePath: string, _content: string): Promise<RunResult> {
  return new Promise(function (resolve) {
    const ext = path.extname(filePath).toLowerCase();
    let cmd: string;

    if (ext === '.ts') {
      cmd = 'npx tsx "' + filePath + '"';
    } else if (ext === '.js' || ext === '.mjs') {
      cmd = 'node "' + filePath + '"';
    } else {
      resolve({ success: false, stdout: '', stderr: '', error: 'Unsupported file type: ' + ext });
      return;
    }

    exec(cmd, { maxBuffer: 1024 * 1024 * 5, timeout: 30000 }, function (err, stdout, stderr) {
      if (err) {
        resolve({ success: false, stdout: stdout || '', stderr: stderr || '', error: err.message });
      } else {
        resolve({ success: true, stdout: stdout || '', stderr: stderr || '' });
      }
    });
  });
}

export interface SearchResult {
  name: string;
  path: string;
  relativePath: string;
}

export function searchFiles(rootDir: string, query: string): Promise<SearchResult[]> {
  return new Promise(function (resolve) {
    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    function walk(dir: string, relativeBase: string) {
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
          const fullPath = path.join(dir, entry.name);
          const relPath = relativeBase ? relativeBase + '/' + entry.name : entry.name;

          if (entry.isDirectory()) {
            walk(fullPath, relPath);
          } else {
            if (!query || entry.name.toLowerCase().indexOf(lowerQuery) !== -1) {
              results.push({ name: entry.name, path: fullPath, relativePath: relPath });
            }
          }
          if (results.length >= 100) break;
        }
      } catch {
        // Permission errors etc
      }
    }

    walk(rootDir, '');
    resolve(results.slice(0, 50));
  });
}

export interface UpdateCheckResult {
  updateAvailable: boolean;
  latestVersion: string;
  downloadUrl: string;
  currentVersion: string;
}

export function checkForUpdates(currentVersion: string, isInsider: boolean): Promise<UpdateCheckResult> {
  return new Promise(function (resolve) {
    const options: https.RequestOptions = {
      hostname: 'api.github.com',
      path: '/repos/bouclem/Void-SuperCode/tags',
      method: 'GET',
      headers: {
        'User-Agent': 'Void-SuperCode',
      },
    };

    const req = https.request(options, function (res) {
      let data = '';
      res.on('data', function (chunk) { data += chunk; });
      res.on('end', function () {
        try {
          const tags = JSON.parse(data) as Array<{ name: string }>;
          if (!tags || tags.length === 0) {
            resolve({ updateAvailable: false, latestVersion: currentVersion, downloadUrl: '', currentVersion });
            return;
          }

          let latestTag: string | null = null;
          for (const tag of tags) {
            const tagName = tag.name;
            if (isInsider && tagName.indexOf('-insider') !== -1) {
              if (!latestTag || tagName > latestTag) latestTag = tagName;
            } else if (!isInsider && tagName.indexOf('-insider') === -1) {
              if (!latestTag || tagName > latestTag) latestTag = tagName;
            }
          }

          if (!latestTag) {
            resolve({ updateAvailable: false, latestVersion: currentVersion, downloadUrl: '', currentVersion });
            return;
          }

          const latestVersion = latestTag.replace(/^v/, '');
          const updateAvailable = compareVersions(latestVersion, currentVersion) > 0;

          resolve({
            updateAvailable,
            latestVersion: latestTag,
            downloadUrl: 'https://github.com/bouclem/Void-SuperCode/releases/tag/' + latestTag,
            currentVersion,
          });
        } catch {
          resolve({ updateAvailable: false, latestVersion: currentVersion, downloadUrl: '', currentVersion });
        }
      });
    });

    req.on('error', function () {
      resolve({ updateAvailable: false, latestVersion: currentVersion, downloadUrl: '', currentVersion });
    });
    req.setTimeout(10000, function () {
      req.destroy();
      resolve({ updateAvailable: false, latestVersion: currentVersion, downloadUrl: '', currentVersion });
    });
    req.end();
  });
}

function compareVersions(a: string, b: string): number {
  const partsA = a.replace(/-insider$/, '').split('.').map(function (n) { return parseInt(n, 10) || 0; });
  const partsB = b.replace(/-insider$/, '').split('.').map(function (n) { return parseInt(n, 10) || 0; });
  const maxLen = Math.max(partsA.length, partsB.length);
  for (let i = 0; i < maxLen; i++) {
    const va = partsA[i] ?? 0;
    const vb = partsB[i] ?? 0;
    if (va > vb) return 1;
    if (va < vb) return -1;
  }
  return 0;
}
