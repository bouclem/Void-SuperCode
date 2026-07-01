window.Autosave = (() => {
  const INTERVAL_MS = 15000;
  let timerId: ReturnType<typeof setInterval> | null = null;

  async function init(): Promise<void> {
    try {
      const config = await window.api.getConfig();
      if ((config as any).autosave !== false) {
        start();
      }
    } catch {
      start();
    }
  }

  function start(): void {
    if (timerId !== null) return;
    timerId = setInterval(tick, INTERVAL_MS);
  }

  function stop(): void {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  async function tick(): Promise<void> {
    const tab = window.Tabs.getActiveTab();
    if (!tab || !tab.isDirty) return;
    const content = tab.model.getValue();
    const success = await window.api.saveFile(tab.path, content);
    if (success) {
      window.Tabs.markClean(tab.path);
      console.log('[autosave] Saved: ' + tab.name);
    }
  }

  return { init, start, stop };
})();
