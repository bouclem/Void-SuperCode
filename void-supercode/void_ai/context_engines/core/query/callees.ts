/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Voidware. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Callees query.
 *
 * Stage: skeleton.
 */

import type { SymbolRef } from '../contextEngine.js';

export function callees(_symbolId: string): Promise<readonly SymbolRef[]> {
	throw new Error('vce: callees not implemented');
}
