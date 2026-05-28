/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Voidware. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Indexer orchestrator. Coordinates parsing, graph building, and storage.
 *
 * Stage: skeleton.
 */

import type { IWorkspaceSource } from '../workspaceSource.js';

export interface IIndexer {
	/** Full index build. */
	buildAll(): Promise<void>;

	/** Incremental update for a single file. */
	updateFile(path: string): Promise<void>;

	/** Remove a file from the index. */
	removeFile(path: string): Promise<void>;
}

export class Indexer implements IIndexer {
	constructor(private readonly _source: IWorkspaceSource) { }

	buildAll(): Promise<void> {
		void this._source;
		throw new Error('vce: Indexer.buildAll not implemented');
	}

	updateFile(_path: string): Promise<void> {
		throw new Error('vce: Indexer.updateFile not implemented');
	}

	removeFile(_path: string): Promise<void> {
		throw new Error('vce: Indexer.removeFile not implemented');
	}
}
