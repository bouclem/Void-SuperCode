/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Voidware. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Semantic search query.
 *
 * Stage: skeleton.
 */

import type { SearchResult } from '../contextEngine.js';

export function search(_query: string, _limit?: number): Promise<readonly SearchResult[]> {
	throw new Error('vce: search not implemented');
}
