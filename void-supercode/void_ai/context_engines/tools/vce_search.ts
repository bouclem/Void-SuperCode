/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Voidware. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * vce_search — semantic code search across the workspace index.
 *
 * Stage: skeleton. Service handler + command wrapper, both unimplemented.
 */

import type { IContextEngine, SearchResult } from '../core/contextEngine.js';

export const VCE_SEARCH_COMMAND_ID = 'vce.search';

export interface VceSearchInput {
	readonly query: string;
	readonly limit?: number;
}

export async function runVceSearch(
	engine: IContextEngine,
	input: VceSearchInput,
): Promise<readonly SearchResult[]> {
	return engine.search(input.query, input.limit);
}
