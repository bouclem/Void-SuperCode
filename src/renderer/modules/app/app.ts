window.App = (() => {
  function init(): void {
    window.Editor.init();
    window.Tabs.init();
    window.FileExplorer.init();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', window.App.init);
