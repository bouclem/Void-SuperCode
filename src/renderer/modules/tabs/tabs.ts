window.Tabs = (() => {
  const tabs: Tab[] = [];
  let activePath: string | null = null;
  let tabBar: HTMLElement | null = null;

  function init(): void {
    tabBar = document.getElementById('tab-bar')!;
  }

  function getTab(filePath: string): Tab | null {
    return tabs.find(function (t) { return t.path === filePath; }) ?? null;
  }

  function getActiveTab(): Tab | null {
    if (!activePath) return null;
    return getTab(activePath);
  }

  function openTab(filePath: string, fileName: string, content: string): void {
    const existing = getTab(filePath);
    if (existing) {
      switchTab(filePath);
      return;
    }

    const model = window.Editor.createModel(filePath, content);
    const tab: Tab = {
      path: filePath,
      name: fileName,
      model: model,
      isDirty: false,
    };
    tabs.push(tab);
    renderTabs();
    switchTab(filePath);
    window.Welcome.hide();
    updateRunButton();
  }

  function closeTab(filePath: string): void {
    const tab = getTab(filePath);
    if (tab && tab.isDirty) {
      showCloseConfirm(tab.name, function (action: 'save' | 'discard' | 'cancel') {
        if (action === 'cancel') return;
        if (action === 'save') {
          doSaveAndClose(filePath);
        } else {
          doCloseTab(filePath);
        }
      });
    } else {
      doCloseTab(filePath);
    }
  }

  async function doSaveAndClose(filePath: string): Promise<void> {
    const tab = getTab(filePath);
    if (tab) {
      const content = tab.model.getValue();
      await window.api.saveFile(tab.path, content);
      markClean(filePath);
    }
    doCloseTab(filePath);
  }

  function showCloseConfirm(fileName: string, callback: (action: 'save' | 'discard' | 'cancel') => void): void {
    const overlay = document.createElement('div');
    overlay.id = 'modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'modal';

    const title = document.createElement('div');
    title.className = 'modal-title';
    title.textContent = 'Do you want to save the changes to ' + fileName + '?';

    const message = document.createElement('div');
    message.className = 'modal-message';
    message.textContent = 'Your changes will be lost if you don\'t save them.';

    const btnContainer = document.createElement('div');
    btnContainer.className = 'modal-buttons';

    const saveBtn = document.createElement('button');
    saveBtn.className = 'modal-btn modal-btn-primary';
    saveBtn.textContent = 'Save';

    const discardBtn = document.createElement('button');
    discardBtn.className = 'modal-btn';
    discardBtn.textContent = 'Don\'t Save';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'modal-btn';
    cancelBtn.textContent = 'Cancel';

    btnContainer.appendChild(saveBtn);
    btnContainer.appendChild(discardBtn);
    btnContainer.appendChild(cancelBtn);

    modal.appendChild(title);
    modal.appendChild(message);
    modal.appendChild(btnContainer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    function cleanup(): void {
      overlay.remove();
    }

    saveBtn.addEventListener('click', function () {
      cleanup();
      callback('save');
    });

    discardBtn.addEventListener('click', function () {
      cleanup();
      callback('discard');
    });

    cancelBtn.addEventListener('click', function () {
      cleanup();
      callback('cancel');
    });

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        cleanup();
        callback('cancel');
      }
    });
  }

  function doCloseTab(filePath: string): void {
    const idx = tabs.findIndex(function (t) { return t.path === filePath; });
    if (idx === -1) return;

    const tab = tabs[idx]!;
    tab.model.dispose();
    tabs.splice(idx, 1);

    if (activePath === filePath) {
      if (tabs.length > 0) {
        const nextIdx = Math.min(idx, tabs.length - 1);
        const nextTab = tabs[nextIdx]!;
        switchTab(nextTab.path);
      } else {
        activePath = null;
        window.Editor.setModel(null);
        window.Welcome.show();
      }
    }
    renderTabs();
    updateRunButton();
  }

  function switchTab(filePath: string): void {
    const tab = getTab(filePath);
    if (!tab) return;
    activePath = filePath;
    window.Editor.setModel(tab.model);
    renderTabs();
    updateRunButton();
  }

  function markDirty(filePath: string): void {
    const tab = getTab(filePath);
    if (tab && !tab.isDirty) {
      tab.isDirty = true;
      renderTabs();
    }
  }

  function markClean(filePath: string): void {
    const tab = getTab(filePath);
    if (tab && tab.isDirty) {
      tab.isDirty = false;
      renderTabs();
    }
  }

  function hasUnsavedChanges(): boolean {
    return tabs.some(function (t) { return t.isDirty; });
  }

  function renderTabs(): void {
    if (!tabBar) return;
    tabBar.innerHTML = '';

    for (const tab of tabs) {
      const el = document.createElement('div');
      el.className = 'tab' + (tab.path === activePath ? ' tab-active' : '');

      const label = document.createElement('span');
      label.className = 'tab-label';
      label.textContent = (tab.isDirty ? '\u25CF ' : '') + tab.name;
      label.addEventListener('click', function () {
        switchTab(tab.path);
      });

      const closeBtn = document.createElement('span');
      closeBtn.className = 'tab-close';
      closeBtn.textContent = '\u00D7';
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closeTab(tab.path);
      });

      el.appendChild(label);
      el.appendChild(closeBtn);
      tabBar.appendChild(el);
    }
  }

  function updateRunButton(): void {
    const runBtn = document.getElementById('run-file-btn');
    if (runBtn) {
      runBtn.style.display = tabs.length > 0 ? '' : 'none';
    }
  }

  return { init, openTab, closeTab, switchTab, markDirty, markClean, getActiveTab, getTab, hasUnsavedChanges };
})();
