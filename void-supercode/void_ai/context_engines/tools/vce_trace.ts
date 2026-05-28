/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Voidware. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * vce_trace — trace requirements to code and tests.
 *
 * Stage: skeleton.
 */

import type { IContextEngine, TraceLinks } from '../core/contextEngine.js';

export const VCE_TRACE_COMMAND_ID = 'vce.trace';

export interface VceTraceInput {
	readonly symbolId: string;
}

export async function runVceTrace(
	engine: IContextEngine,
	input: VceTraceInput,
): Promise<TraceLinks> {
	return engine.trace(input.symbolId);
}
