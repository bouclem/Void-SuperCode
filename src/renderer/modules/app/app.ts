window.App = (() => {
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
    let sidebarVisible = true;

    filesBtn.addEventListener('click', function () {
      sidebarVisible = !sidebarVisible;
      if (sidebarVisible) {
        sidebar.style.display = '';
        filesBtn.classList.add('active');
      } else {
        sidebar.style.display = 'none';
        filesBtn.classList.remove('active');
      }
    });
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', window.App.init);
