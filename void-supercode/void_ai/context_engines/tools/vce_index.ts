/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Voidware. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * vce_index — trigger workspace indexing / rebuild.
 *
 * Stage: skeleton.
 */

import type { IContextEngine } from '../core/contextEngine.js';

export const VCE_INDEX_COMMAND_ID = 'vce.index';

export interface VceIndexInput {
	readonly force?: boolean;
}

export async function runVceIndex(
	engine: IContextEngine,
	input: VceIndexInput,
): Promise<void> {
	await engine.indexWorkspace(input.force);
}
