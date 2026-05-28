/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Voidware. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Void Context Engine — public service interface.
 *
 * Stage: skeleton. All methods throw `not implemented`.
 */

/** On-disk index location, relative to workspace root. */
export const VCE_INDEX_DIR = '.void/context';

export interface SymbolLocation {
	readonly uri: string;
	readonly line: number;
	readonly column: number;
}

export interface SymbolRef {
	readonly id: string;
	readonly name: string;
	readonly kind: string;
	readonly location: SymbolLocation;
}

export interface SearchResult {
	readonly symbol: SymbolRef;
	readonly score: number;
	readonly snippet?: string;
}

export interface ArchitectureNode {
	readonly id: string;
	readonly path: string;
	readonly layer?: string;
	readonly dependencies: readonly string[];
}

export interface ImpactReport {
	readonly target: SymbolRef;
	readonly affectedFiles: readonly string[];
	readonly affectedTests: readonly string[];
	readonly risk: 'low' | 'medium' | 'high';
}

export interface TraceLinks {
	readonly requirements: readonly string[];
	readonly tests: readonly string[];
	readonly issues: readonly string[];
}

export interface IContextEngine {
	readonly _serviceBrand: undefined;

	/** Build or rebuild the workspace index. */
	indexWorkspace(force?: boolean): Promise<void>;

	/** Semantic search across the index. */
	search(query: string, limit?: number): Promise<readonly SearchResult[]>;

	/** Find callers of a symbol. */
	callers(symbolId: string): Promise<readonly SymbolRef[]>;

	/** Find callees of a symbol. */
	callees(symbolId: string): Promise<readonly SymbolRef[]>;

	/** Module / dependency / layer overview. */
	architecture(): Promise<readonly ArchitectureNode[]>;

	/** Impact analysis for a symbol change. */
	impact(symbolId: string): Promise<ImpactReport>;

	/** Traceability links for a symbol. */
	trace(symbolId: string): Promise<TraceLinks>;
}

export class ContextEngineService implements IContextEngine {
	declare readonly _serviceBrand: undefined;

	async indexWorkspace(_force?: boolean): Promise<void> {
		throw new Error('vce: indexWorkspace not implemented');
	}

	async search(_query: string, _limit?: number): Promise<readonly SearchResult[]> {
		throw new Error('vce: search not implemented');
	}

	async callers(_symbolId: string): Promise<readonly SymbolRef[]> {
		throw new Error('vce: callers not implemented');
	}

	async callees(_symbolId: string): Promise<readonly SymbolRef[]> {
		throw new Error('vce: callees not implemented');
	}

	async architecture(): Promise<readonly ArchitectureNode[]> {
		throw new Error('vce: architecture not implemented');
	}

	async impact(_symbolId: string): Promise<ImpactReport> {
		throw new Error('vce: impact not implemented');
	}

	async trace(_symbolId: string): Promise<TraceLinks> {
		throw new Error('vce: trace not implemented');
	}
}
