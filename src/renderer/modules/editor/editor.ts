window.Editor = (() => {
  let editor: any = null;

  function init(): void {
    self.MonacoEnvironment = {
      getWorkerUrl: function (): string {
        const workerUrl = new URL('vs/base/worker/workerMain.js', location.href).href;
        return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
          self.MonacoEnvironment = { baseUrl: '${new URL('vs', location.href).href}' };
          importScripts('${workerUrl}');
        `)}`;
      }
    };

    require.config({ paths: { vs: 'vs' } });
    require(['vs/editor/editor.main'], function () {
      editor = monaco.editor.create(document.getElementById('editor')!, {
        value: '',
        language: 'plaintext',
        theme: 'vs-dark',
        automaticLayout: true,
        fontSize: 14,
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        tabSize: 2,
        folding: true,
        foldingStrategy: 'indentation',
        showFoldingControls: 'always',
        foldingImportsByDefault: true,
        autoClosingBrackets: 'always',
        autoClosingQuotes: 'always',
      });
      window.Autoclosing.init();
      window.Autocompletion.init();
      window.editor = editor;
      if (window.Shortcuts) {
        window.Shortcuts.applyAllMonacoShortcuts();
      }
    });
  }

  function getLanguageFromExtension(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase() ?? '';
    const map: Record<string, string> = {
      js: 'javascript', ts: 'typescript', tsx: 'typescript',
      jsx: 'javascript', mjs: 'javascript',
      html: 'html', css: 'css', json: 'json', jsonl: 'jsonl',
      md: 'markdown', py: 'python', java: 'java',
      c: 'c', cpp: 'cpp', rs: 'rust', go: 'go',
      xml: 'xml', yaml: 'yaml', yml: 'yaml',
      sh: 'shell', sql: 'sql', txt: 'plaintext',
      jl: 'julia', markdown: 'markdown',
    };
    return map[ext] ?? 'plaintext';
  }

  function createModel(filePath: string, content: string): any {
    const fileName = filePath.split(/[\\/]/).pop() ?? filePath;
    const lang = getLanguageFromExtension(fileName);
    const model = monaco.editor.createModel(content, lang);

    model.onDidChangeContent(function () {
      window.Tabs.markDirty(filePath);
    });

    return model;
  }

  function setModel(model: any): void {
    if (!editor) return;
    editor.setModel(model);
  }

  function openFile(filename: string, content: string, filePath: string): void {
    window.Tabs.openTab(filePath, filename, content);
  }

  function setContent(content: string): void {
    if (!editor) return;
    editor.setValue(content);
  }

  async function saveCurrentFile(): Promise<void> {
    const tab = window.Tabs.getActiveTab();
    if (!tab) return;
    const content = tab.model.getValue();
    const success = await window.api.saveFile(tab.path, content);
    if (success) {
      window.Tabs.markClean(tab.path);
    }
  }

  return { init, openFile, setContent, setModel, createModel, saveCurrentFile };
})();
