window.App = (() => {
  let sidebarVisible = false;

  function init(): void {
    window.Editor.init();
    window.Tabs.init();
    window.Welcome.init();
    window.FileExplorer.init();
    initActivityBar();
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
  }

  function hideSidebar(): void {
    const filesBtn = document.getElementById('activity-files-btn')!;
    const sidebar = document.getElementById('sidebar')!;
    sidebar.style.display = 'none';
    filesBtn.classList.remove('active');
    sidebarVisible = false;
  }

  return { init, showSidebar, hideSidebar };
})();

document.addEventListener('DOMContentLoaded', window.App.init);
