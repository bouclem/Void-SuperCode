window.Settings = (() => {
  let panel: HTMLElement | null = null;
  let toggleBtn: HTMLElement | null = null;
  let visible = false;

  function init(): void {
    panel = document.getElementById('settings-panel')!;
    toggleBtn = document.getElementById('activity-settings-btn')!;
    toggleBtn.addEventListener('click', toggle);
    loadSettings();
  }

  function toggle(): void {
    if (visible) {
      hide();
    } else {
      show();
    }
  }

  function show(): void {
    if (panel) {
      panel.style.display = 'flex';
    }
    if (toggleBtn) {
      toggleBtn.classList.add('active');
    }
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.style.display = 'none';
    }
    const filesBtn = document.getElementById('activity-files-btn');
    if (filesBtn) {
      filesBtn.classList.remove('active');
    }
    visible = true;
    loadSettings();
  }

  function hide(): void {
    if (panel) {
      panel.style.display = 'none';
    }
    if (toggleBtn) {
      toggleBtn.classList.remove('active');
    }
    visible = false;
  }

  async function loadSettings(): Promise<void> {
    try {
      const config = await window.api.getConfig();
      const autosaveEnabled = (config as any).autosave !== false;
      const logLevel = (config as any).logLevel || 'normal';

      const autosaveCheckbox = document.getElementById('setting-autosave') as HTMLInputElement | null;
      if (autosaveCheckbox) autosaveCheckbox.checked = autosaveEnabled;

      const logLevelSelect = document.getElementById('setting-loglevel') as HTMLSelectElement | null;
      if (logLevelSelect) logLevelSelect.value = logLevel;
    } catch {
      // Non-critical
    }
  }

  async function setAutosave(enabled: boolean): Promise<void> {
    await window.api.setConfig({ autosave: enabled });
    if (enabled) {
      window.Autosave.start();
    } else {
      window.Autosave.stop();
    }
    console.log('[settings] Autosave ' + (enabled ? 'enabled' : 'disabled'));
  }

  async function setLogLevel(level: string): Promise<void> {
    await window.api.setConfig({ logLevel: level });
    console.log('[settings] Log level set to: ' + level);
  }

  function initControls(): void {
    const autosaveCheckbox = document.getElementById('setting-autosave');
    if (autosaveCheckbox) {
      autosaveCheckbox.addEventListener('change', function () {
        setAutosave((autosaveCheckbox as HTMLInputElement).checked);
      });
    }

    const logLevelSelect = document.getElementById('setting-loglevel');
    if (logLevelSelect) {
      logLevelSelect.addEventListener('change', function () {
        setLogLevel((logLevelSelect as HTMLSelectElement).value);
      });
    }
  }

  return { init, show, hide, toggle, initControls };
})();
