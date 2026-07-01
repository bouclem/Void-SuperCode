window.App = (() => {
  let sidebarVisible = false;

  function init(): void {
    window.Editor.init();
    window.Tabs.init();
    window.Welcome.init();
    window.FileExplorer.init();
    window.DebugConsole.init();
    window.Autosave.init();
    window.Settings.init();
    window.Settings.initControls();
    window.Terminal.init();
    window.Git.init();
    window.CommandPalette.init();
    window.FileSearch.init();
    window.MarkdownPreview.init();
    window.RunFile.init();
    window.AutoUpdate.init();
    window.Shortcuts.init();
    registerShortcuts();
    registerCommands();
    initActivityBar();
    initBottomPanelTabs();
    initResizeHandle();
    initGitCommit();
  }

  function registerCommands(): void {
    window.CommandPalette.registerCommands([
      { id: 'files.open-folder', label: 'Open Folder', action: function () { document.getElementById('open-folder-btn')!.click(); } },
      { id: 'files.open-file', label: 'Open File', action: function () { document.getElementById('open-file-btn')!.click(); } },
      { id: 'files.new-file', label: 'New File', action: function () { document.getElementById('new-file-btn')!.click(); } },
      { id: 'files.new-folder', label: 'New Folder', action: function () { document.getElementById('new-folder-btn')!.click(); } },
      { id: 'files.search', label: 'Go to File', shortcut: 'Ctrl+P', action: function () { window.FileSearch.show(); } },
      { id: 'file.run', label: 'Run File', action: function () { window.RunFile.run(); } },
      { id: 'file.save', label: 'Save File', shortcut: 'Ctrl+S', action: function () { window.Editor.saveCurrentFile(); } },
      { id: 'editor.find', label: 'Find', shortcut: 'Ctrl+F', action: function () { const ed = window.editor; if (ed) { const a = ed.getAction('actions.find'); if (a) a.run(); } } },
      { id: 'editor.replace', label: 'Replace', shortcut: 'Ctrl+H', action: function () { const ed = window.editor; if (ed) { const a = ed.getAction('editor.action.startFindReplaceAction'); if (a) a.run(); } } },
      { id: 'git.commit', label: 'Git: Commit', action: function () { window.Git.commit(); } },
      { id: 'git.push', label: 'Git: Push', action: function () { window.Git.push(); } },
      { id: 'git.pull', label: 'Git: Pull', action: function () { window.Git.pull(); } },
      { id: 'git.fetch', label: 'Git: Fetch', action: function () { window.Git.fetch(); } },
      { id: 'git.clone', label: 'Git: Clone', action: function () { window.Git.showCloneDialog(); } },
      { id: 'git.publish', label: 'Git: Publish Branch', action: function () { window.Git.publish(); } },
      { id: 'git.history', label: 'Git: Show Commit History', action: function () { window.Git.showHistory(); } },
      { id: 'view.toggle-sidebar', label: 'Toggle Sidebar', action: function () { document.getElementById('activity-files-btn')!.click(); } },
      { id: 'view.toggle-debug', label: 'Toggle Debug Console', action: function () { window.DebugConsole.toggle(); } },
      { id: 'view.toggle-git', label: 'Toggle Source Control', action: function () { window.Git.toggle(); } },
      { id: 'settings.open', label: 'Open Settings', action: function () { window.Settings.toggle(); } },
      { id: 'app.check-updates', label: 'Check for Updates', action: function () { window.AutoUpdate.checkForUpdates(true); } },
    ]);
  }

  function initActivityBar(): void {
    const filesBtn = document.getElementById('activity-files-btn')!;
    const sidebar = document.getElementById('sidebar')!;

    sidebar.style.display = 'none';

    filesBtn.addEventListener('click', function () {
      if (sidebarVisible) {
        hideSidebar();
      } else {
        showSidebar();
      }
    });
  }

  function showSidebar(): void {
    const filesBtn = document.getElementById('activity-files-btn')!;
    const sidebar = document.getElementById('sidebar')!;
    sidebar.style.display = '';
    filesBtn.classList.add('active');
    sidebarVisible = true;
    window.Settings.hide();
    window.Git.hide();
  }

  function hideSidebar(): void {
    const filesBtn = document.getElementById('activity-files-btn')!;
    const sidebar = document.getElementById('sidebar')!;
    sidebar.style.display = 'none';
    filesBtn.classList.remove('active');
    sidebarVisible = false;
  }

  function initBottomPanelTabs(): void {
    const tabs = document.querySelectorAll('.panel-tab');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        const target = (tab as HTMLElement).dataset.panel;
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        document.querySelectorAll('.panel-content').forEach(function (c) {
          c.classList.remove('active');
        });
        if (target === 'debug') {
          document.getElementById('debug-console-output')!.classList.add('active');
        } else if (target === 'terminal') {
          document.getElementById('terminal-container')!.classList.add('active');
          const config = window.FileExplorer.getCurrentFolder();
          if (config) {
            window.Terminal.open(config);
          }
        }
      });
    });
  }

  function initGitCommit(): void {
    const commitBtn = document.getElementById('git-commit-btn')!;
    const commitInput = document.getElementById('git-commit-msg')!;
    commitBtn.addEventListener('click', function () {
      window.Git.commit();
    });
    commitInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        window.Git.commit();
      }
    });

    const pushBtn = document.getElementById('git-push-btn');
    if (pushBtn) pushBtn.addEventListener('click', function () { window.Git.push(); });

    const pullBtn = document.getElementById('git-pull-btn');
    if (pullBtn) pullBtn.addEventListener('click', function () { window.Git.pull(); });

    const fetchBtn = document.getElementById('git-fetch-btn');
    if (fetchBtn) fetchBtn.addEventListener('click', function () { window.Git.fetch(); });

    const cloneBtn = document.getElementById('git-clone-btn');
    if (cloneBtn) cloneBtn.addEventListener('click', function () { window.Git.showCloneDialog(); });

    const publishBtn = document.getElementById('git-publish-btn');
    if (publishBtn) publishBtn.addEventListener('click', function () { window.Git.publish(); });

    const historyBtn = document.getElementById('git-history-btn');
    if (historyBtn) historyBtn.addEventListener('click', function () { window.Git.showHistory(); });
  }

  function initResizeHandle(): void {
    const handle = document.getElementById('panel-resize-handle')!;
    const bottomPanel = document.getElementById('bottom-panel')!;
    let isResizing = false;
    let startY = 0;
    let startHeight = 0;

    handle.addEventListener('mousedown', function (e) {
      isResizing = true;
      startY = e.clientY;
      startHeight = bottomPanel.offsetHeight;
      document.body.style.cursor = 'ns-resize';
      e.preventDefault();
    });

    document.addEventListener('mousemove', function (e) {
      if (!isResizing) return;
      const delta = startY - e.clientY;
      let newHeight = startHeight + delta;
      const maxH = window.innerHeight * 0.6;
      if (newHeight < 100) newHeight = 100;
      if (newHeight > maxH) newHeight = maxH;
      bottomPanel.style.height = newHeight + 'px';
      bottomPanel.style.flex = 'none';
    });

    document.addEventListener('mouseup', function () {
      if (isResizing) {
        isResizing = false;
        document.body.style.cursor = '';
      }
    });
  }

  function registerShortcuts(): void {
    window.Shortcuts.register({
      id: 'file.save', label: 'Save File', defaultBinding: 'Ctrl+S', monaco: true,
      action: function () { window.Editor.saveCurrentFile(); }
    });
    window.Shortcuts.register({
      id: 'editor.find', label: 'Find', defaultBinding: 'Ctrl+F', monaco: true,
      action: function () { const ed = window.editor; if (ed) { const a = ed.getAction('actions.find'); if (a) a.run(); } }
    });
    window.Shortcuts.register({
      id: 'editor.replace', label: 'Replace', defaultBinding: 'Ctrl+H', monaco: true,
      action: function () { const ed = window.editor; if (ed) { const a = ed.getAction('editor.action.startFindReplaceAction'); if (a) a.run(); } }
    });
    window.Shortcuts.register({
      id: 'files.search', label: 'Go to File', defaultBinding: 'Ctrl+P', monaco: false,
      action: function () { window.FileSearch.show(); }
    });
    window.Shortcuts.register({
      id: 'commandPalette.open', label: 'Command Palette', defaultBinding: 'Ctrl+Shift+P', monaco: false,
      action: function () { window.CommandPalette.show(); }
    });
  }

  return { init, showSidebar, hideSidebar };
})();

document.addEventListener('DOMContentLoaded', window.App.init);
