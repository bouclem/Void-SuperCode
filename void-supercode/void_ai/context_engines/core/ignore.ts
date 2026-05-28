/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Voidware. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Minimal gitignore-style path matcher.
 *
 * Supports the subset we actually need:
 *   - blank lines and `#` comments are ignored
 *   - leading `!` negates a pattern
 *   - leading `/` anchors the pattern to the workspace root
 *   - trailing `/` matches directories only
 *   - `*`  matches any run of chars except `/`
 *   - `**` matches any run of chars including `/`
 *   - `?`  matches a single char except `/`
 *
 * Not supported (intentionally out of scope):
 *   - character classes `[abc]`
 *   - exotic precedence rules, nested .gitignore inheritance
 *
 * The goal is "good enough" coverage for workspace traversal — not
 * byte-perfect git semantics.
 */

interface CompiledRule {
	readonly negate: boolean;
	readonly dirOnly: boolean;
	readonly regex: RegExp;
}

/** Built-in directories the engine always skips, regardless of .gitignore. */
export const BUILTIN_IGNORE_DIRS: readonly string[] = [
	'.git',
	'.hg',
	'.svn',
	'node_modules',
	'.void',
	'out',
	'dist',
	'build',
	'.cache',
	'.next',
	'.nuxt',
	'.parcel-cache',
	'.turbo',
	'coverage',
];

const BUILTIN_DIR_SET: ReadonlySet<string> = new Set(BUILTIN_IGNORE_DIRS);

export class IgnoreMatcher {

	private readonly _rules: CompiledRule[] = [];

	/** Add raw .gitignore content. Multiple calls accumulate rules. */
	add(content: string): void {
		for (const rawLine of content.split(/\r?\n/)) {
			const line = rawLine.trim();
			if (line.length === 0 || line.startsWith('#')) {
				continue;
			}
			const compiled = compileRule(line);
			if (compiled) {
				this._rules.push(compiled);
			}
		}
	}

	/**
	 * Test whether a path (forward-slash, relative to root) is ignored.
	 * `isDir` indicates whether the path refers to a directory.
	 */
	isIgnored(relativePath: string, isDir: boolean): boolean {
		// Built-in directory skip — fast path.
		if (isDir) {
			const lastSegment = lastPathSegment(relativePath);
			if (BUILTIN_DIR_SET.has(lastSegment)) {
				return true;
			}
		}

		// Last matching rule wins (gitignore semantics).
		let ignored = false;
		for (const rule of this._rules) {
			if (rule.dirOnly && !isDir) {
				continue;
			}
			if (rule.regex.test(relativePath)) {
				ignored = !rule.negate;
			}
		}
		return ignored;
	}
}

function lastPathSegment(p: string): string {
	const slash = p.lastIndexOf('/');
	return slash < 0 ? p : p.slice(slash + 1);
}

function compileRule(line: string): CompiledRule | undefined {
	let pattern = line;
	let negate = false;
	let anchored = false;
	let dirOnly = false;

	if (pattern.startsWith('!')) {
		negate = true;
		pattern = pattern.slice(1);
	}
	if (pattern.startsWith('/')) {
		anchored = true;
		pattern = pattern.slice(1);
	}
	if (pattern.endsWith('/')) {
		dirOnly = true;
		pattern = pattern.slice(0, -1);
	}
	if (pattern.length === 0) {
		return undefined;
	}

	const regexBody = globToRegex(pattern);
	const prefix = anchored ? '^' : '(^|.*/)';
	const suffix = '($|/.*)';
	const regex = new RegExp(prefix + regexBody + suffix);

	return { negate, dirOnly, regex };
}

function globToRegex(pattern: string): string {
	let out = '';
	let i = 0;
	while (i < pattern.length) {
		const c = pattern[i];
		if (c === '*') {
			if (pattern[i + 1] === '*') {
				out += '.*';
				i += 2;
				if (pattern[i] === '/') {
					i++;
				}
			} else {
				out += '[^/]*';
				i++;
			}
		} else if (c === '?') {
			out += '[^/]';
			i++;
		} else if ('.+^$()|{}[]\\'.includes(c)) {
			out += '\\' + c;
			i++;
		} else {
			out += c;
			i++;
		}
	}
	return out;
}
