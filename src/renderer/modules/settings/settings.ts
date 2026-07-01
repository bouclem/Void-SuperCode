window.Settings = (() => {
  let toggleBtn: HTMLElement | null = null;

  function init(): void {
    toggleBtn = document.getElementById('activity-settings-btn')!;
    toggleBtn.addEventListener('click', toggle);
    window.api.onSettingsUpdated(function (updates) {
      if ('autosave' in updates) {
        if (updates.autosave) {
          window.Autosave.start();
        } else {
          window.Autosave.stop();
        }
      }
    });
  }

  function toggle(): void {
    window.api.openSettingsWindow();
  }

  function show(): void {
    window.api.openSettingsWindow();
  }

  function hide(): void {
    // Settings window closes itself
  }

  function initControls(): void {
    // Settings controls are in the separate settings window
  }

  return { init, show, hide, toggle, initControls };
})();
