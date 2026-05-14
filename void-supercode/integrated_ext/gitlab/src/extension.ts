/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Voidware. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext): void {
	context.subscriptions.push(
		vscode.commands.registerCommand('gitlab.publish', () => publishToGitLab()),
		vscode.commands.registerCommand('gitlab.openOnGitLab', () => openOnGitLab()),
		vscode.commands.registerCommand('gitlab.createMergeRequest', () => createMergeRequest()),
	);
}

async function publishToGitLab(): Promise<void> {
	const instanceUrl = vscode.workspace.getConfiguration('gitlab').get<string>('instanceUrl', 'https://gitlab.com');
	vscode.window.showInformationMessage(`Publishing to GitLab (${instanceUrl})... (not yet implemented)`);
}

async function openOnGitLab(): Promise<void> {
	vscode.window.showInformationMessage('Open on GitLab... (not yet implemented)');
}

async function createMergeRequest(): Promise<void> {
	vscode.window.showInformationMessage('Create Merge Request... (not yet implemented)');
}

export function deactivate(): void {
	// cleanup
}
