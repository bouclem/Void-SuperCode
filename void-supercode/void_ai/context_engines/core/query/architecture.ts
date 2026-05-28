/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Voidware. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Architecture query — module structure, layering, circular dependencies.
 *
 * Stage: skeleton.
 */

import type { ArchitectureNode } from '../contextEngine.js';

export function architecture(): Promise<readonly ArchitectureNode[]> {
	throw new Error('vce: architecture not implemented');
}
