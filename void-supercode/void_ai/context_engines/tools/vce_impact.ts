/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Voidware. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * vce_impact — analyze impact of changes to a symbol.
 *
 * Stage: skeleton.
 */

import type { IContextEngine, ImpactReport } from '../core/contextEngine.js';

export const VCE_IMPACT_COMMAND_ID = 'vce.impact';

export interface VceImpactInput {
	readonly symbolId: string;
}

export async function runVceImpact(
	engine: IContextEngine,
	input: VceImpactInput,
): Promise<ImpactReport> {
	return engine.impact(input.symbolId);
}
