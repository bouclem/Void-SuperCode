window.RunFile = (() => {
  function init(): void {
    const runBtn = document.getElementById('run-file-btn');
    if (runBtn) {
      runBtn.addEventListener('click', run);
    }
  }

  function switchToDebugTab(): void {
    const tabs = document.querySelectorAll('.panel-tab');
    tabs.forEach(function (t) { t.classList.remove('active'); });
    const debugTab = document.querySelector('.panel-tab[data-panel="debug"]');
    if (debugTab) debugTab.classList.add('active');

    document.querySelectorAll('.panel-content').forEach(function (c) {
      c.classList.remove('active');
    });
    const debugOutput = document.getElementById('debug-console-output');
    if (debugOutput) debugOutput.classList.add('active');
  }

  async function run(): Promise<void> {
    const tab = window.Tabs.getActiveTab();
    if (!tab) return;

    const ext = tab.name.split('.').pop()?.toLowerCase() ?? '';

    if (ext === 'md' || ext === 'markdown') {
      toggleMarkdownPreview(tab);
      return;
    }

    if (ext === 'js' || ext === 'mjs' || ext === 'ts' || ext === 'tsx' || ext === 'jsx') {
      const content = tab.model.getValue();
      switchToDebugTab();
      window.DebugConsole.show();
      window.DebugConsole.appendLine('INFO', 'run', 'Running ' + tab.name + '...');
      const result = await window.api.runFile(tab.path, content);
      if (result.success) {
        window.DebugConsole.appendLine('INFO', 'run', 'File executed successfully');
        if (result.stdout) {
          window.DebugConsole.appendLine('INFO', 'stdout', result.stdout);
        }
        if (result.stderr) {
          window.DebugConsole.appendLine('WARN', 'stderr', result.stderr);
        }
      } else {
        window.DebugConsole.appendLine('ERROR', 'run', result.stderr || result.error || 'Execution failed');
      }
      return;
    }

    switchToDebugTab();
    window.DebugConsole.show();
    window.DebugConsole.appendLine('WARN', 'run', 'Cannot run file type: .' + ext);
  }

  function toggleMarkdownPreview(tab: Tab): void {
    if (window.MarkdownPreview.isOpen()) {
      window.MarkdownPreview.hide();
      const editor = document.getElementById('editor');
      if (editor) editor.style.display = '';
    } else {
      const content = tab.model.getValue();
      const editor = document.getElementById('editor');
      if (editor) editor.style.display = 'none';
      window.MarkdownPreview.show(content);
    }
  }

  function updateVisibility(): void {
    const runBtn = document.getElementById('run-file-btn');
    if (!runBtn) return;
    const tab = window.Tabs.getActiveTab();
    runBtn.style.display = tab ? '' : 'none';
  }

  return { init, run, updateVisibility };
})();
