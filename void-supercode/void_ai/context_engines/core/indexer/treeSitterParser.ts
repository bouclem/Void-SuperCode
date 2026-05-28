/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Voidware. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Tree-sitter based AST parser. Wraps `@vscode/tree-sitter-wasm` to extract
 * symbols, references, imports, and calls per file.
 *
 * Stage: skeleton.
 */

export interface ParsedSymbol {
	readonly name: string;
	readonly kind: string;
	readonly line: number;
	readonly column: number;
}

export interface ParsedReference {
	readonly name: string;
	readonly line: number;
	readonly column: number;
}

export interface ParseResult {
	readonly language: string;
	readonly symbols: readonly ParsedSymbol[];
	readonly references: readonly ParsedReference[];
	readonly imports: readonly string[];
}

export interface ITreeSitterParser {
	parse(language: string, source: string): Promise<ParseResult>;
}

export class TreeSitterParser implements ITreeSitterParser {
	parse(_language: string, _source: string): Promise<ParseResult> {
		throw new Error('vce: TreeSitterParser.parse not implemented');
	}
}
