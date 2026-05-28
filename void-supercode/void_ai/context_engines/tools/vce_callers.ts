/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Voidware. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * vce_callers — find all callers of a function or method.
 *
 * Stage: skeleton.
 */

import type { IContextEngine, SymbolRef } from '../core/contextEngine.js';

export const VCE_CALLERS_COMMAND_ID = 'vce.callers';

export interface VceCallersInput {
	readonly symbolId: string;
}

export async function runVceCallers(
	engine: IContextEngine,
	input: VceCallersInput,
): Promise<readonly SymbolRef[]> {
	return engine.callers(input.symbolId);
}
