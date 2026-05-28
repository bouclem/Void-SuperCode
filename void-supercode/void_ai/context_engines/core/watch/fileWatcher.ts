/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Voidware. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * File watcher — incremental index refresh via @parcel/watcher.
 *
 * Stage: skeleton.
 */

export type FileChangeKind = 'create' | 'update' | 'delete';

export interface FileChange {
	readonly kind: FileChangeKind;
	readonly path: string;
}

export interface IFileWatcher {
	start(rootPath: string, onChange: (change: FileChange) => void): Promise<void>;
	stop(): Promise<void>;
}

export class FileWatcher implements IFileWatcher {
	start(_rootPath: string, _onChange: (change: FileChange) => void): Promise<void> {
		throw new Error('vce: FileWatcher.start not implemented');
	}

	stop(): Promise<void> {
		throw new Error('vce: FileWatcher.stop not implemented');
	}
}
