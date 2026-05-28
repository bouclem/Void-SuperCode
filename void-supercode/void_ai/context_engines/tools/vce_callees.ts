/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Voidware. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * vce_callees — find all callees of a function or method.
 *
 * Stage: skeleton.
 */

import type { IContextEngine, SymbolRef } from '../core/contextEngine.js';

export const VCE_CALLEES_COMMAND_ID = 'vce.callees';

export interface VceCalleesInput {
	readonly symbolId: string;
}

export async function runVceCallees(
	engine: IContextEngine,
	input: VceCalleesInput,
): Promise<readonly SymbolRef[]> {
	return engine.callees(input.symbolId);
}
