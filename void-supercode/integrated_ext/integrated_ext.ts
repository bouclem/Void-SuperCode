/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Voidware. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Integrated Extensions Registry
 *
 * These extensions are core parts of Void Supercode. They ship with the IDE,
 * cannot be disabled by the user, and are loaded as first-class modules.
 *
 * Unlike marketplace extensions, integrated extensions:
 * - Are always active
 * - Have no activation events (loaded at startup or on-demand by the IDE)
 * - Are not listed in the extensions marketplace view
 * - Cannot be uninstalled
 */

export interface IIntegratedExtension {
	readonly id: string;
	readonly name: string;
	readonly category: IntegratedExtensionCategory;
	readonly description: string;
}

export const enum IntegratedExtensionCategory {
	Language = 'language',
	LanguageFeatures = 'language-features',
	Git = 'git',
	GitProvider = 'git-provider',
}

export const INTEGRATED_EXTENSIONS: readonly IIntegratedExtension[] = [
	// --- Languages: Grammar + Syntax ---
	{ id: 'void-supercode.cpp', name: 'C/C++', category: IntegratedExtensionCategory.Language, description: 'C/C++ language grammar and snippets' },
	{ id: 'void-supercode.csharp', name: 'C#', category: IntegratedExtensionCategory.Language, description: 'C# language grammar and snippets' },
	{ id: 'void-supercode.css', name: 'CSS', category: IntegratedExtensionCategory.Language, description: 'CSS language grammar and snippets' },
	{ id: 'void-supercode.diff', name: 'Diff', category: IntegratedExtensionCategory.Language, description: 'Diff syntax highlighting' },
	{ id: 'void-supercode.go', name: 'Go', category: IntegratedExtensionCategory.Language, description: 'Go language grammar and snippets' },
	{ id: 'void-supercode.html', name: 'HTML', category: IntegratedExtensionCategory.Language, description: 'HTML language grammar and snippets' },
	{ id: 'void-supercode.java', name: 'Java', category: IntegratedExtensionCategory.Language, description: 'Java language grammar and snippets' },
	{ id: 'void-supercode.javascript', name: 'JavaScript', category: IntegratedExtensionCategory.Language, description: 'JavaScript language grammar and snippets' },
	{ id: 'void-supercode.json', name: 'JSON', category: IntegratedExtensionCategory.Language, description: 'JSON language grammar' },
	{ id: 'void-supercode.julia', name: 'Julia', category: IntegratedExtensionCategory.Language, description: 'Julia language grammar and snippets' },
	{ id: 'void-supercode.lua', name: 'Lua', category: IntegratedExtensionCategory.Language, description: 'Lua language grammar and snippets' },
	{ id: 'void-supercode.markdown', name: 'Markdown', category: IntegratedExtensionCategory.Language, description: 'Markdown language grammar' },
	{ id: 'void-supercode.powershell', name: 'PowerShell', category: IntegratedExtensionCategory.Language, description: 'PowerShell language grammar and snippets' },
	{ id: 'void-supercode.python', name: 'Python', category: IntegratedExtensionCategory.Language, description: 'Python language grammar and snippets' },
	{ id: 'void-supercode.rust', name: 'Rust', category: IntegratedExtensionCategory.Language, description: 'Rust language grammar and snippets' },
	{ id: 'void-supercode.shellscript', name: 'Shell Script', category: IntegratedExtensionCategory.Language, description: 'Shell script language grammar' },
	{ id: 'void-supercode.sql', name: 'SQL', category: IntegratedExtensionCategory.Language, description: 'SQL language grammar' },
	{ id: 'void-supercode.swift', name: 'Swift', category: IntegratedExtensionCategory.Language, description: 'Swift language grammar and snippets' },
	{ id: 'void-supercode.typescript', name: 'TypeScript', category: IntegratedExtensionCategory.Language, description: 'TypeScript language grammar and snippets' },
	{ id: 'void-supercode.xml', name: 'XML', category: IntegratedExtensionCategory.Language, description: 'XML language grammar' },
	{ id: 'void-supercode.yaml', name: 'YAML', category: IntegratedExtensionCategory.Language, description: 'YAML language grammar' },

	// --- Languages: Rich Features (IntelliSense, Go to Definition, etc.) ---
	{ id: 'void-supercode.css-language-features', name: 'CSS Language Features', category: IntegratedExtensionCategory.LanguageFeatures, description: 'CSS/LESS/SCSS IntelliSense and validation' },
	{ id: 'void-supercode.html-language-features', name: 'HTML Language Features', category: IntegratedExtensionCategory.LanguageFeatures, description: 'HTML IntelliSense and validation' },
	{ id: 'void-supercode.json-language-features', name: 'JSON Language Features', category: IntegratedExtensionCategory.LanguageFeatures, description: 'JSON IntelliSense and validation' },
	{ id: 'void-supercode.markdown-language-features', name: 'Markdown Language Features', category: IntegratedExtensionCategory.LanguageFeatures, description: 'Markdown preview and language features' },
	{ id: 'void-supercode.markdown-math', name: 'Markdown Math', category: IntegratedExtensionCategory.LanguageFeatures, description: 'Math rendering in Markdown' },
	{ id: 'void-supercode.typescript-language-features', name: 'TypeScript Language Features', category: IntegratedExtensionCategory.LanguageFeatures, description: 'TypeScript/JavaScript IntelliSense, refactoring, and diagnostics' },

	// --- Git ---
	{ id: 'void-supercode.git', name: 'Git', category: IntegratedExtensionCategory.Git, description: 'Git source control integration' },
	{ id: 'void-supercode.git-base', name: 'Git Base', category: IntegratedExtensionCategory.Git, description: 'Git base functionality' },

	// --- Git Providers ---
	{ id: 'void-supercode.github', name: 'GitHub', category: IntegratedExtensionCategory.GitProvider, description: 'GitHub integration (publish, PRs, remote links)' },
	{ id: 'void-supercode.github-authentication', name: 'GitHub Authentication', category: IntegratedExtensionCategory.GitProvider, description: 'GitHub OAuth authentication' },
	{ id: 'void-supercode.gitlab', name: 'GitLab', category: IntegratedExtensionCategory.GitProvider, description: 'GitLab integration (publish, MRs, remote links)' },
];

/**
 * Path to the integrated extensions folder relative to the project root.
 */
export const INTEGRATED_EXT_FOLDER = 'integrated_ext';

/**
 * Returns the list of integrated extension folder names (matching directory names in integrated_ext/).
 */
export function getIntegratedExtensionFolders(): string[] {
	return [
		'cpp',
		'csharp',
		'css',
		'css-language-features',
		'diff',
		'git',
		'git-base',
		'github',
		'github-authentication',
		'gitlab',
		'go',
		'html',
		'html-language-features',
		'java',
		'javascript',
		'json',
		'json-language-features',
		'julia',
		'lua',
		'markdown-basics',
		'markdown-language-features',
		'markdown-math',
		'powershell',
		'python',
		'rust',
		'shellscript',
		'sql',
		'swift',
		'typescript-basics',
		'typescript-language-features',
		'xml',
		'yaml',
	];
}
