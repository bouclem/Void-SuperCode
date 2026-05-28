/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Voidware. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Lightweight extension → language id map.
 * Used by the workspace source to tag files before parsing.
 *
 * Returns `undefined` for unknown / binary / unsupported extensions so the
 * indexer can skip them.
 */

const EXTENSION_LANGUAGE: ReadonlyMap<string, string> = new Map<string, string>([
	['.ts', 'typescript'],
	['.tsx', 'typescriptreact'],
	['.mts', 'typescript'],
	['.cts', 'typescript'],
	['.js', 'javascript'],
	['.jsx', 'javascriptreact'],
	['.mjs', 'javascript'],
	['.cjs', 'javascript'],
	['.py', 'python'],
	['.pyi', 'python'],
	['.rs', 'rust'],
	['.go', 'go'],
	['.java', 'java'],
	['.kt', 'kotlin'],
	['.kts', 'kotlin'],
	['.swift', 'swift'],
	['.c', 'c'],
	['.h', 'c'],
	['.cpp', 'cpp'],
	['.cc', 'cpp'],
	['.cxx', 'cpp'],
	['.hpp', 'cpp'],
	['.hh', 'cpp'],
	['.cs', 'csharp'],
	['.rb', 'ruby'],
	['.php', 'php'],
	['.lua', 'lua'],
	['.jl', 'julia'],
	['.sh', 'shellscript'],
	['.bash', 'shellscript'],
	['.zsh', 'shellscript'],
	['.ps1', 'powershell'],
	['.psm1', 'powershell'],
	['.sql', 'sql'],
	['.html', 'html'],
	['.htm', 'html'],
	['.css', 'css'],
	['.scss', 'scss'],
	['.sass', 'sass'],
	['.less', 'less'],
	['.json', 'json'],
	['.jsonc', 'jsonc'],
	['.xml', 'xml'],
	['.yaml', 'yaml'],
	['.yml', 'yaml'],
	['.toml', 'toml'],
	['.md', 'markdown'],
	['.mdx', 'markdown'],
]);

/** Resolve a language id from a file extension (including the dot). */
export function languageFromExtension(ext: string): string | undefined {
	return EXTENSION_LANGUAGE.get(ext.toLowerCase());
}

/** Convenience: resolve language id from a full file path. */
export function languageFromPath(filePath: string): string | undefined {
	const dot = filePath.lastIndexOf('.');
	if (dot < 0 || dot === filePath.length - 1) {
		return undefined;
	}
	const slash = Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf('\\'));
	if (dot < slash) {
		return undefined;
	}
	return languageFromExtension(filePath.slice(dot));
}
