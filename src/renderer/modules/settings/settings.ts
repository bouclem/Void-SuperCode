window.Settings = (() => {
  let toggleBtn: HTMLElement | null = null;

  function init(): void {
    toggleBtn = document.getElementById('activity-settings-btn')!;
    toggleBtn.addEventListener('click', toggle);
    window.SettingsScreen.init();

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
    window.SettingsScreen.toggle();
  }

  function show(): void {
    window.SettingsScreen.show();
  }

  function hide(): void {
    window.SettingsScreen.hide();
  }

  function initControls(): void {
  }

  return { init, show, hide, toggle, initControls };
})();
