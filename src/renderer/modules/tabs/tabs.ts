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
  }

  function closeTab(filePath: string): void {
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
      }
    }
    renderTabs();
  }

  function switchTab(filePath: string): void {
    const tab = getTab(filePath);
    if (!tab) return;
    activePath = filePath;
    window.Editor.setModel(tab.model);
    renderTabs();
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

  return { init, openTab, closeTab, switchTab, markDirty, markClean, getActiveTab, getTab, hasUnsavedChanges };
})();
