/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Voidware. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Workspace source — reads files directly from the local filesystem.
 * No git required. Optional `.gitignore` parsing for exclusion.
 *
 * Stage: skeleton.
 */

export interface WorkspaceFile {
	readonly path: string;
	readonly language: string;
	readonly size: number;
}

export interface IWorkspaceSource {
	readonly rootPath: string;

	/** Enumerate files in the workspace, respecting ignore rules. */
	listFiles(): AsyncIterable<WorkspaceFile>;

	/** Read a file's contents as UTF-8. */
	readFile(relativePath: string): Promise<string>;
}

export class LocalWorkspaceSource implements IWorkspaceSource {
	constructor(public readonly rootPath: string) { }

	listFiles(): AsyncIterable<WorkspaceFile> {
		throw new Error('vce: listFiles not implemented');
	}

	readFile(_relativePath: string): Promise<string> {
		throw new Error('vce: readFile not implemented');
	}
}
