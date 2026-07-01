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
    initActivityBar();
    initBottomPanelTabs();
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

  return { init, showSidebar, hideSidebar };
})();

document.addEventListener('DOMContentLoaded', window.App.init);
