/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Voidware. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Workspace source — reads files directly from the local filesystem.
 * No git required. `.gitignore` is honored when present.
 */

import { readdir, readFile, stat } from 'fs/promises';
import { join, relative, resolve, sep } from 'path';

import { IgnoreMatcher } from './ignore.js';
import { languageFromPath } from './languageMap.js';

/** Maximum file size considered for indexing (bytes). Larger files are skipped. */
export const MAX_INDEXABLE_SIZE = 2 * 1024 * 1024; // 2 MiB

export interface WorkspaceFile {
	/** Path relative to the workspace root, using forward slashes. */
	readonly path: string;
	readonly language: string;
	readonly size: number;
}

export interface IWorkspaceSource {
	readonly rootPath: string;
	listFiles(): AsyncIterable<WorkspaceFile>;
	readFile(relativePath: string): Promise<string>;
}

export class LocalWorkspaceSource implements IWorkspaceSource {

	public readonly rootPath: string;
	private _ignore: IgnoreMatcher | undefined;

	constructor(rootPath: string) {
		this.rootPath = resolve(rootPath);
	}

	async *listFiles(): AsyncIterable<WorkspaceFile> {
		const ignore = await this._getIgnore();
		yield* this._walk(this.rootPath, ignore);
	}

	async readFile(relativePath: string): Promise<string> {
		const absolute = resolve(this.rootPath, relativePath);
		this._assertInsideRoot(absolute);
		return readFile(absolute, 'utf8');
	}

	private async _getIgnore(): Promise<IgnoreMatcher> {
		if (this._ignore) {
			return this._ignore;
		}
		const matcher = new IgnoreMatcher();
		try {
			const content = await readFile(join(this.rootPath, '.gitignore'), 'utf8');
			matcher.add(content);
		} catch {
			// No .gitignore — built-in defaults still apply via the matcher.
		}
		this._ignore = matcher;
		return matcher;
	}

	private async *_walk(dir: string, ignore: IgnoreMatcher): AsyncIterable<WorkspaceFile> {
		let entries;
		try {
			entries = await readdir(dir, { withFileTypes: true });
		} catch {
			return; // unreadable dir — skip silently
		}

		for (const entry of entries) {
			const absolute = join(dir, entry.name);
			const rel = toForwardSlash(relative(this.rootPath, absolute));
			if (rel.length === 0) {
				continue;
			}

			const isDir = entry.isDirectory();
			if (ignore.isIgnored(rel, isDir)) {
				continue;
			}

			if (isDir) {
				yield* this._walk(absolute, ignore);
				continue;
			}

			if (!entry.isFile()) {
				continue; // skip symlinks / sockets / fifos
			}

			const language = languageFromPath(rel);
			if (!language) {
				continue;
			}

			let size: number;
			try {
				size = (await stat(absolute)).size;
			} catch {
				continue;
			}

			if (size > MAX_INDEXABLE_SIZE) {
				continue;
			}

			yield { path: rel, language, size };
		}
	}

	private _assertInsideRoot(absolute: string): void {
		const root = this.rootPath.endsWith(sep) ? this.rootPath : this.rootPath + sep;
		if (absolute !== this.rootPath && !absolute.startsWith(root)) {
			throw new Error(`vce: path escapes workspace root: ${absolute}`);
		}
	}
}

function toForwardSlash(p: string): string {
	return sep === '\\' ? p.replace(/\\/g, '/') : p;
}
