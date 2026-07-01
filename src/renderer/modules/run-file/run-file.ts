window.RunFile = (() => {
  function init(): void {
    const runBtn = document.getElementById('run-file-btn');
    if (runBtn) {
      runBtn.addEventListener('click', run);
    }
  }

  async function run(): Promise<void> {
    const tab = window.Tabs.getActiveTab();
    if (!tab) return;

    const ext = tab.name.split('.').pop()?.toLowerCase() ?? '';

    if (ext === 'md' || ext === 'markdown') {
      toggleMarkdownPreview(tab);
      return;
    }

    if (ext === 'js' || ext === 'mjs' || ext === 'ts') {
      const content = tab.model.getValue();
      const result = await window.api.runFile(tab.path, content);
      window.DebugConsole.show();
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

  return { init, run };
})();
