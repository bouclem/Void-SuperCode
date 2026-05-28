/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Voidware. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * SQLite-backed persistent index store.
 * Index file lives at `<workspace>/.void/context/index.db`.
 *
 * Stage: skeleton.
 */

import { VCE_INDEX_DIR } from '../contextEngine.js';

export const VCE_INDEX_DB = `${VCE_INDEX_DIR}/index.db`;

export interface ISqliteStore {
	open(workspaceRoot: string): Promise<void>;
	close(): Promise<void>;
	exec(sql: string): Promise<void>;
	query<T>(sql: string, params?: readonly unknown[]): Promise<readonly T[]>;
}

export class SqliteStore implements ISqliteStore {
	open(_workspaceRoot: string): Promise<void> {
		throw new Error('vce: SqliteStore.open not implemented');
	}

	close(): Promise<void> {
		throw new Error('vce: SqliteStore.close not implemented');
	}

	exec(_sql: string): Promise<void> {
		throw new Error('vce: SqliteStore.exec not implemented');
	}

	query<T>(_sql: string, _params?: readonly unknown[]): Promise<readonly T[]> {
		throw new Error('vce: SqliteStore.query not implemented');
	}
}
