window.SettingsScreen = (() => {
  let overlay: HTMLElement | null = null;
  let visible = false;

  function init(): void {
  }

  function show(): void {
    if (visible) {
      hide();
      return;
    }
    visible = true;

    overlay = document.createElement('div');
    overlay.className = 'settings-overlay';
    overlay.id = 'settings-overlay';

    const container = document.createElement('div');
    container.className = 'settings-container';

    const sidebar = document.createElement('div');
    sidebar.className = 'settings-sidebar';

    const sidebarHeader = document.createElement('div');
    sidebarHeader.className = 'settings-sidebar-header';
    sidebarHeader.textContent = 'Settings';

    const nav = document.createElement('div');
    nav.className = 'settings-nav';

    const generalItem = document.createElement('div');
    generalItem.className = 'settings-nav-item settings-nav-active';
    generalItem.textContent = 'General';
    generalItem.dataset.section = 'general';

    const shortcutsItem = document.createElement('div');
    shortcutsItem.className = 'settings-nav-item';
    shortcutsItem.textContent = 'Keyboard Shortcuts';
    shortcutsItem.dataset.section = 'shortcuts';

    const aiItem = document.createElement('div');
    aiItem.className = 'settings-nav-item';
    aiItem.textContent = 'AI';
    aiItem.dataset.section = 'ai';

    nav.appendChild(generalItem);
    nav.appendChild(shortcutsItem);
    nav.appendChild(aiItem);

    sidebar.appendChild(sidebarHeader);
    sidebar.appendChild(nav);

    const content = document.createElement('div');
    content.className = 'settings-content';

    const header = document.createElement('div');
    header.className = 'settings-content-header';

    const title = document.createElement('span');
    title.className = 'settings-content-title';
    title.textContent = 'General';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'settings-close-btn';
    closeBtn.textContent = '\u00D7';
    closeBtn.title = 'Close';
    closeBtn.addEventListener('click', hide);

    header.appendChild(title);
    header.appendChild(closeBtn);

    const body = document.createElement('div');
    body.className = 'settings-content-body';
    body.id = 'settings-body';

    content.appendChild(header);
    content.appendChild(body);

    container.appendChild(sidebar);
    container.appendChild(content);
    overlay.appendChild(container);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) hide();
    });

    generalItem.addEventListener('click', function () {
      selectSection('general', generalItem, shortcutsItem, aiItem, title, body);
    });
    shortcutsItem.addEventListener('click', function () {
      selectSection('shortcuts', generalItem, shortcutsItem, aiItem, title, body);
    });
    aiItem.addEventListener('click', function () {
      selectSection('ai', generalItem, shortcutsItem, aiItem, title, body);
    });

    renderGeneral(body);
  }

  function selectSection(section: string, generalItem: HTMLElement, shortcutsItem: HTMLElement, aiItem: HTMLElement, title: HTMLElement, body: HTMLElement): void {
    generalItem.classList.remove('settings-nav-active');
    shortcutsItem.classList.remove('settings-nav-active');
    aiItem.classList.remove('settings-nav-active');

    if (section === 'general') {
      generalItem.classList.add('settings-nav-active');
      title.textContent = 'General';
      renderGeneral(body);
    } else if (section === 'shortcuts') {
      shortcutsItem.classList.add('settings-nav-active');
      title.textContent = 'Keyboard Shortcuts';
      renderShortcuts(body);
    } else if (section === 'ai') {
      aiItem.classList.add('settings-nav-active');
      title.textContent = 'AI';
      renderAI(body);
    }
  }

  function renderGeneral(body: HTMLElement): void {
    body.innerHTML = '';

    const sectionGeneral = document.createElement('div');
    sectionGeneral.className = 'settings-section';

    const h3General = document.createElement('h3');
    h3General.textContent = 'General';
    sectionGeneral.appendChild(h3General);

    const autosaveRow = document.createElement('div');
    autosaveRow.className = 'settings-row';
    const autosaveLabel = document.createElement('label');
    autosaveLabel.textContent = 'Autosave (every 15s)';
    const autosaveCheckbox = document.createElement('input');
    autosaveCheckbox.type = 'checkbox';
    autosaveCheckbox.id = 'setting-autosave';
    autosaveRow.appendChild(autosaveLabel);
    autosaveRow.appendChild(autosaveCheckbox);
    sectionGeneral.appendChild(autosaveRow);

    const sectionLogging = document.createElement('div');
    sectionLogging.className = 'settings-section';
    const h3Logging = document.createElement('h3');
    h3Logging.textContent = 'Logging';
    sectionLogging.appendChild(h3Logging);

    const logRow = document.createElement('div');
    logRow.className = 'settings-row';
    const logLabel = document.createElement('label');
    logLabel.textContent = 'Log level';
    const logSelect = document.createElement('select');
    logSelect.id = 'setting-loglevel';
    const optFull = document.createElement('option');
    optFull.value = 'full';
    optFull.textContent = 'Full (INFO + WARN + ERROR)';
    const optNormal = document.createElement('option');
    optNormal.value = 'normal';
    optNormal.textContent = 'Normal (WARN + ERROR)';
    const optMinimal = document.createElement('option');
    optMinimal.value = 'minimal';
    optMinimal.textContent = 'Minimal (ERROR only)';
    logSelect.appendChild(optFull);
    logSelect.appendChild(optNormal);
    logSelect.appendChild(optMinimal);
    logRow.appendChild(logLabel);
    logRow.appendChild(logSelect);
    sectionLogging.appendChild(logRow);

    const sectionGit = document.createElement('div');
    sectionGit.className = 'settings-section';
    const h3Git = document.createElement('h3');
    h3Git.textContent = 'Git';
    sectionGit.appendChild(h3Git);

    const gitNameRow = document.createElement('div');
    gitNameRow.className = 'settings-row';
    const gitNameLabel = document.createElement('label');
    gitNameLabel.textContent = 'User name';
    const gitNameInput = document.createElement('input');
    gitNameInput.type = 'text';
    gitNameInput.id = 'git-user-name';
    gitNameInput.placeholder = 'Your name';
    gitNameRow.appendChild(gitNameLabel);
    gitNameRow.appendChild(gitNameInput);
    sectionGit.appendChild(gitNameRow);

    const gitEmailRow = document.createElement('div');
    gitEmailRow.className = 'settings-row';
    const gitEmailLabel = document.createElement('label');
    gitEmailLabel.textContent = 'User email';
    const gitEmailInput = document.createElement('input');
    gitEmailInput.type = 'text';
    gitEmailInput.id = 'git-user-email';
    gitEmailInput.placeholder = 'your@email.com';
    gitEmailRow.appendChild(gitEmailLabel);
    gitEmailRow.appendChild(gitEmailInput);
    sectionGit.appendChild(gitEmailRow);

    const sectionUpdates = document.createElement('div');
    sectionUpdates.className = 'settings-section';
    const h3Updates = document.createElement('h3');
    h3Updates.textContent = 'Updates';
    sectionUpdates.appendChild(h3Updates);

    const updateRow = document.createElement('div');
    updateRow.className = 'settings-row';
    const updateLabel = document.createElement('label');
    updateLabel.textContent = 'Check for updates automatically';
    const updateCheckbox = document.createElement('input');
    updateCheckbox.type = 'checkbox';
    updateCheckbox.id = 'setting-autoupdate';
    updateRow.appendChild(updateLabel);
    updateRow.appendChild(updateCheckbox);
    sectionUpdates.appendChild(updateRow);

    body.appendChild(sectionGeneral);
    body.appendChild(sectionLogging);
    body.appendChild(sectionGit);
    body.appendChild(sectionUpdates);

    loadGeneralSettings(autosaveCheckbox, logSelect, updateCheckbox, gitNameInput, gitEmailInput);

    autosaveCheckbox.addEventListener('change', function () {
      window.api.setConfig({ autosave: autosaveCheckbox.checked });
      if (autosaveCheckbox.checked) {
        window.Autosave.start();
      } else {
        window.Autosave.stop();
      }
    });

    logSelect.addEventListener('change', function () {
      window.api.setConfig({ logLevel: logSelect.value });
    });

    updateCheckbox.addEventListener('change', function () {
      window.api.setConfig({ autoUpdate: updateCheckbox.checked });
    });

    gitNameInput.addEventListener('change', function () {
      const folder = window.FileExplorer.getCurrentFolder();
      window.api.gitSetConfig(folder ?? '.', gitNameInput.value, gitEmailInput.value);
    });

    gitEmailInput.addEventListener('change', function () {
      const folder = window.FileExplorer.getCurrentFolder();
      window.api.gitSetConfig(folder ?? '.', gitNameInput.value, gitEmailInput.value);
    });
  }

  async function loadGeneralSettings(autosaveCheckbox: HTMLInputElement, logSelect: HTMLSelectElement, updateCheckbox: HTMLInputElement, gitNameInput: HTMLInputElement, gitEmailInput: HTMLInputElement): Promise<void> {
    try {
      const config = await window.api.getConfig();
      const cfg = config as Record<string, unknown>;
      autosaveCheckbox.checked = cfg.autosave !== false;
      logSelect.value = (cfg.logLevel as string) || 'normal';
      updateCheckbox.checked = cfg.autoUpdate !== false;

      const folder = (cfg.lastFolder as string) || window.FileExplorer.getCurrentFolder() || '.';
      const gitConfig = await window.api.gitGetConfig(folder);
      gitNameInput.value = gitConfig.name || '';
      gitEmailInput.value = gitConfig.email || '';
    } catch {
      // Non-critical
    }
  }

  function renderShortcuts(body: HTMLElement): void {
    body.innerHTML = '';

    const section = document.createElement('div');
    section.className = 'settings-section';

    const h3 = document.createElement('h3');
    h3.textContent = 'Keyboard Shortcuts';
    section.appendChild(h3);

    const desc = document.createElement('p');
    desc.className = 'settings-shortcuts-desc';
    desc.textContent = 'Click a shortcut to rebind. Press Escape to cancel.';
    section.appendChild(desc);

    const shortcuts = window.Shortcuts.getAll();

    for (const shortcut of shortcuts) {
      const row = document.createElement('div');
      row.className = 'settings-shortcut-row';

      const labelSpan = document.createElement('span');
      labelSpan.className = 'settings-shortcut-label';
      labelSpan.textContent = shortcut.label;

      const bindingBtn = document.createElement('button');
      bindingBtn.className = 'settings-shortcut-binding';
      bindingBtn.textContent = shortcut.binding;
      bindingBtn.dataset.shortcutId = shortcut.id;

      const resetBtn = document.createElement('button');
      resetBtn.className = 'settings-shortcut-reset';
      resetBtn.textContent = 'Reset';
      resetBtn.dataset.shortcutId = shortcut.id;
      if (shortcut.binding === shortcut.defaultBinding) {
        resetBtn.disabled = true;
      }

      bindingBtn.addEventListener('click', function () {
        startRebinding(bindingBtn, resetBtn, shortcut.id);
      });

      resetBtn.addEventListener('click', function () {
        window.Shortcuts.reset(shortcut.id);
        bindingBtn.textContent = shortcut.defaultBinding;
        resetBtn.disabled = true;
      });

      row.appendChild(labelSpan);
      row.appendChild(bindingBtn);
      row.appendChild(resetBtn);
      section.appendChild(row);
    }

    const resetAllBtn = document.createElement('button');
    resetAllBtn.className = 'settings-shortcut-resetall';
    resetAllBtn.textContent = 'Reset All Shortcuts';
    resetAllBtn.addEventListener('click', function () {
      window.Shortcuts.resetAll();
      renderShortcuts(body);
    });
    section.appendChild(resetAllBtn);

    body.appendChild(section);
  }

  function startRebinding(bindingBtn: HTMLButtonElement, resetBtn: HTMLButtonElement, shortcutId: string): void {
    const originalText = bindingBtn.textContent;
    bindingBtn.textContent = 'Press keys...';
    bindingBtn.classList.add('settings-shortcut-listening');

    let done = false;

    function finish(): void {
      done = true;
      bindingBtn.classList.remove('settings-shortcut-listening');
      document.removeEventListener('keydown', captureKey, true);
    }

    function captureKey(e: KeyboardEvent): void {
      e.preventDefault();
      e.stopPropagation();

      if (e.key === 'Escape') {
        finish();
        bindingBtn.textContent = originalText;
        return;
      }

      if (e.key === 'Control' || e.key === 'Shift' || e.key === 'Alt' || e.key === 'Meta') {
        return;
      }

      finish();

      const parts: string[] = [];
      if (e.ctrlKey || e.metaKey) parts.push('Ctrl');
      if (e.shiftKey) parts.push('Shift');
      if (e.altKey) parts.push('Alt');
      parts.push(e.key.toUpperCase());

      const newBinding = parts.join('+');
      bindingBtn.textContent = newBinding;
      resetBtn.disabled = false;
      window.Shortcuts.rebind(shortcutId, newBinding);
    }

    document.addEventListener('keydown', captureKey, true);

    setTimeout(function () {
      if (!done) finish();
    }, 5000);
  }

  function renderAI(body: HTMLElement): void {
    body.innerHTML = '';

    const section = document.createElement('div');
    section.className = 'settings-section';

    const h3 = document.createElement('h3');
    h3.textContent = 'AI';
    section.appendChild(h3);

    const desc = document.createElement('p');
    desc.className = 'settings-shortcuts-desc';
    desc.textContent = 'Configure AI-assisted features.';
    section.appendChild(desc);

    const autocompletionRow = document.createElement('div');
    autocompletionRow.className = 'settings-row';
    const autocompletionLabel = document.createElement('label');
    autocompletionLabel.textContent = 'Autocompletion';
    const autocompletionCheckbox = document.createElement('input');
    autocompletionCheckbox.type = 'checkbox';
    autocompletionCheckbox.id = 'setting-ai-autocompletion';
    autocompletionRow.appendChild(autocompletionLabel);
    autocompletionRow.appendChild(autocompletionCheckbox);
    section.appendChild(autocompletionRow);

    body.appendChild(section);

    loadAISettings(autocompletionCheckbox);

    autocompletionCheckbox.addEventListener('change', function () {
      window.api.setConfig({ aiAutocompletion: autocompletionCheckbox.checked });
      window.Autocompletion.setEnabled(autocompletionCheckbox.checked);
    });
  }

  async function loadAISettings(autocompletionCheckbox: HTMLInputElement): Promise<void> {
    try {
      const config = await window.api.getConfig();
      const cfg = config as Record<string, unknown>;
      autocompletionCheckbox.checked = cfg.aiAutocompletion !== false;
    } catch {
      // Non-critical
    }
  }

  function hide(): void {
    if (overlay) {
      overlay.remove();
      overlay = null;
    }
    visible = false;
  }

  function toggle(): void {
    if (visible) {
      hide();
    } else {
      show();
    }
  }

  return { init, show, hide, toggle };
})();
