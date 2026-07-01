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
    const branch = await runGit(cwd, ['rev-parse', '--abbrev-ref', 'HEAD']);
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
