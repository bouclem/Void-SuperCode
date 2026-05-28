/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Voidware. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Impact analysis query — change propagation, test coverage, risk.
 *
 * Stage: skeleton.
 */

import type { ImpactReport } from '../contextEngine.js';

export function impact(_symbolId: string): Promise<ImpactReport> {
	throw new Error('vce: impact not implemented');
}
