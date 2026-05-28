/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Voidware. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Traceability query — req↔code↔test↔issue links.
 *
 * Stage: skeleton.
 */

import type { TraceLinks } from '../contextEngine.js';

export function trace(_symbolId: string): Promise<TraceLinks> {
	throw new Error('vce: trace not implemented');
}
