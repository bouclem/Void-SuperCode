/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Voidware. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Call graph — directed edges (caller → callee) between symbols.
 *
 * Stage: skeleton.
 */

export interface CallEdge {
	readonly callerId: string;
	readonly calleeId: string;
}

export interface ICallGraph {
	addEdge(edge: CallEdge): void;
	callersOf(symbolId: string): readonly string[];
	calleesOf(symbolId: string): readonly string[];
	clear(): void;
}

export class CallGraph implements ICallGraph {
	addEdge(_edge: CallEdge): void {
		throw new Error('vce: CallGraph.addEdge not implemented');
	}

	callersOf(_symbolId: string): readonly string[] {
		throw new Error('vce: CallGraph.callersOf not implemented');
	}

	calleesOf(_symbolId: string): readonly string[] {
		throw new Error('vce: CallGraph.calleesOf not implemented');
	}

	clear(): void {
		throw new Error('vce: CallGraph.clear not implemented');
	}
}
