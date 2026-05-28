/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Voidware. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Symbol graph — maps symbol IDs to definitions and references.
 *
 * Stage: skeleton.
 */

import type { SymbolRef } from '../contextEngine.js';

export interface ISymbolGraph {
	addDefinition(symbol: SymbolRef): void;
	addReference(symbolId: string, location: SymbolRef): void;
	getDefinition(symbolId: string): SymbolRef | undefined;
	getReferences(symbolId: string): readonly SymbolRef[];
	clear(): void;
}

export class SymbolGraph implements ISymbolGraph {
	addDefinition(_symbol: SymbolRef): void {
		throw new Error('vce: SymbolGraph.addDefinition not implemented');
	}

	addReference(_symbolId: string, _location: SymbolRef): void {
		throw new Error('vce: SymbolGraph.addReference not implemented');
	}

	getDefinition(_symbolId: string): SymbolRef | undefined {
		throw new Error('vce: SymbolGraph.getDefinition not implemented');
	}

	getReferences(_symbolId: string): readonly SymbolRef[] {
		throw new Error('vce: SymbolGraph.getReferences not implemented');
	}

	clear(): void {
		throw new Error('vce: SymbolGraph.clear not implemented');
	}
}
