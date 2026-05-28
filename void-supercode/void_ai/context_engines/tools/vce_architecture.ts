/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Voidware. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * vce_architecture — module structure and dependency context.
 *
 * Stage: skeleton.
 */

import type { ArchitectureNode, IContextEngine } from '../core/contextEngine.js';

export const VCE_ARCHITECTURE_COMMAND_ID = 'vce.architecture';

export async function runVceArchitecture(
	engine: IContextEngine,
): Promise<readonly ArchitectureNode[]> {
	return engine.architecture();
}
