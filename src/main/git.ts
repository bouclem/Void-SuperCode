import { exec } from 'child_process';
import * as path from 'path';

export interface GitFile {
  path: string;
  status: 'modified' | 'added' | 'deleted' | 'untracked' | 'renamed';
  staged: boolean;
}

export interface GitStatus {
  branch: string | null;
  files: GitFile[];
  isRepo: boolean;
}

function runGit(cwd: string, args: string[]): Promise<string> {
  return new Promise(function (resolve, reject) {
    const cmd = 'git ' + args.join(' ');
    exec(cmd, { cwd: cwd, maxBuffer: 1024 * 1024 }, function (err, stdout, stderr) {
      if (err) {
        reject(new Error(stderr || err.message));
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

export async function getGitStatus(cwd: string): Promise<GitStatus> {
  try {
    const inWorkTree = await runGit(cwd, ['rev-parse', '--is-inside-work-tree']);
    if (inWorkTree.trim() !== 'true') {
      return { branch: null, files: [], isRepo: false };
    }

    let branch: string = 'main';
    try {
      branch = await runGit(cwd, ['rev-parse', '--abbrev-ref', 'HEAD']);
    } catch {
      // Empty repo with no commits yet — default to 'main'
    }

    const porcelain = await runGit(cwd, ['status', '--porcelain']);

    const files: GitFile[] = [];
    const lines = porcelain.split('\n').filter(function (l) { return l.length > 0; });

    for (const line of lines) {
      const x = line[0]!;
      const y = line[1]!;
      const filePath = line.slice(3);

      let status: GitFile['status'] = 'modified';
      let staged = false;

      const code = x !== ' ' ? x : y;
      staged = x !== ' ' && x !== '?';

      if (code === 'M') status = 'modified';
      else if (code === 'A') status = 'added';
      else if (code === 'D') status = 'deleted';
      else if (code === 'R') status = 'renamed';
      else if (code === '?' || code === '!') status = 'untracked';

      files.push({ path: filePath, status: status, staged: staged });
    }

    return { branch: branch, files: files, isRepo: true };
  } catch {
    return { branch: null, files: [], isRepo: false };
  }
}

export async function stageFile(cwd: string, filePath: string): Promise<boolean> {
  try {
    await runGit(cwd, ['add', '--', filePath]);
    return true;
  } catch {
    return false;
  }
}

export async function unstageFile(cwd: string, filePath: string): Promise<boolean> {
  try {
    await runGit(cwd, ['reset', 'HEAD', '--', filePath]);
    return true;
  } catch {
    return false;
  }
}

export async function commitChanges(cwd: string, message: string): Promise<boolean> {
  try {
    await runGit(cwd, ['commit', '-m', message]);
    return true;
  } catch {
    return false;
  }
}

export async function pushChanges(cwd: string): Promise<boolean> {
  try {
    await runGit(cwd, ['push']);
    return true;
  } catch {
    return false;
  }
}

export async function pullChanges(cwd: string): Promise<boolean> {
  try {
    await runGit(cwd, ['pull']);
    return true;
  } catch {
    return false;
  }
}

export async function fetchRemotes(cwd: string): Promise<boolean> {
  try {
    await runGit(cwd, ['fetch']);
    return true;
  } catch {
    return false;
  }
}

export async function cloneRepo(url: string, destDir: string): Promise<boolean> {
  try {
    await runGit(destDir, ['clone', url]);
    return true;
  } catch {
    return false;
  }
}

export async function getGitConfig(cwd: string): Promise<{ name: string; email: string }> {
  try {
    const name = await runGit(cwd, ['config', 'user.name']);
    const email = await runGit(cwd, ['config', 'user.email']);
    return { name: name || '', email: email || '' };
  } catch {
    return { name: '', email: '' };
  }
}

export async function setGitConfig(cwd: string, name: string, email: string): Promise<boolean> {
  try {
    if (name) await runGit(cwd, ['config', 'user.name', name]);
    if (email) await runGit(cwd, ['config', 'user.email', email]);
    return true;
  } catch {
    return false;
  }
}

export interface GitLogEntry {
  hash: string;
  shortHash: string;
  author: string;
  date: string;
  message: string;
}

export async function gitLog(cwd: string, maxCount: number): Promise<GitLogEntry[]> {
  try {
    const format = '%H%x1f%h%x1f%an%x1f%ad%x1f%s';
    const output = await runGit(cwd, ['log', '-' + maxCount, '--pretty=format:' + format, '--date=short']);
    if (!output) return [];

    const entries: GitLogEntry[] = [];
    const lines = output.split('\n');
    for (const line of lines) {
      const parts = line.split('\x1f');
      if (parts.length >= 5) {
        entries.push({
          hash: parts[0]!,
          shortHash: parts[1]!,
          author: parts[2]!,
          date: parts[3]!,
          message: parts[4]!,
        });
      }
    }
    return entries;
  } catch {
    return [];
  }
}

export async function gitHasRemote(cwd: string): Promise<boolean> {
  try {
    const output = await runGit(cwd, ['remote']);
    return output.length > 0;
  } catch {
    return false;
  }
}

export async function gitPublish(cwd: string): Promise<boolean> {
  try {
    const branch = await runGit(cwd, ['rev-parse', '--abbrev-ref', 'HEAD']);
    await runGit(cwd, ['push', '-u', 'origin', branch]);
    return true;
  } catch {
    return false;
  }
}

export async function gitInit(cwd: string): Promise<boolean> {
  try {
    await runGit(cwd, ['init']);
    return true;
  } catch {
    return false;
  }
}
