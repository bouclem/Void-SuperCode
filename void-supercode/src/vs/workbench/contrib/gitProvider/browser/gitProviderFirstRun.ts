/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Voidware. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { localize } from '../../../../nls.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { INotificationService, Severity } from '../../../../platform/notification/common/notification.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { Extensions as ConfigurationExtensions, IConfigurationRegistry } from '../../../../platform/configuration/common/configurationRegistry.js';
import { Registry } from '../../../../platform/registry/common/platform.js';

const GIT_PROVIDER_STORAGE_KEY = 'void-supercode.gitProvider.chosen';
const GIT_PROVIDER_SETTING = 'voidSupercode.gitProvider';

export const enum GitProvider {
	GitHub = 'github',
	GitLab = 'gitlab',
}

// Register the setting
Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration).registerConfiguration({
	id: 'voidSupercode',
	title: localize('voidSupercode', "Void Supercode"),
	type: 'object',
	properties: {
		[GIT_PROVIDER_SETTING]: {
			type: 'string',
			enum: [GitProvider.GitHub, GitProvider.GitLab],
			enumDescriptions: [
				localize('gitProvider.github', "Use GitHub as the default git hosting provider."),
				localize('gitProvider.gitlab', "Use GitLab as the default git hosting provider."),
			],
			default: GitProvider.GitHub,
			description: localize('gitProvider.description', "The default git hosting provider for repository operations (publish, open remote, etc.)."),
		}
	}
});

export class GitProviderFirstRunContribution extends Disposable implements IWorkbenchContribution {

	constructor(
		@IStorageService private readonly storageService: IStorageService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@INotificationService private readonly notificationService: INotificationService,
	) {
		super();
		this.showFirstRunPrompt();
	}

	private showFirstRunPrompt(): void {
		const alreadyChosen = this.storageService.getBoolean(GIT_PROVIDER_STORAGE_KEY, StorageScope.APPLICATION, false);
		if (alreadyChosen) {
			return;
		}

		const githubLabel = localize('gitProvider.chooseGitHub', "GitHub");
		const gitlabLabel = localize('gitProvider.chooseGitLab', "GitLab");

		this.notificationService.prompt(
			Severity.Info,
			localize('gitProvider.firstRun', "Welcome to Void Supercode! Which git hosting provider do you use?"),
			[
				{
					label: githubLabel,
					run: () => this.selectProvider(GitProvider.GitHub),
				},
				{
					label: gitlabLabel,
					run: () => this.selectProvider(GitProvider.GitLab),
				},
			],
			{
				sticky: true,
				priority: 100,
			}
		);
	}

	private selectProvider(provider: GitProvider): void {
		this.configurationService.updateValue(GIT_PROVIDER_SETTING, provider);
		this.storageService.store(GIT_PROVIDER_STORAGE_KEY, true, StorageScope.APPLICATION, StorageTarget.USER);

		const name = provider === GitProvider.GitHub ? 'GitHub' : 'GitLab';
		this.notificationService.info(
			localize('gitProvider.selected', "{0} selected as your default git provider. You can change this anytime in Settings.", name)
		);
	}
}
