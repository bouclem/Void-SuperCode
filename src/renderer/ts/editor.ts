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
        value: [
          '// Welcome to Void SuperCode',
          '// Open a folder or create a new file to start coding',
          '',
          'function hello() {',
          "  console.log('Hello, World!');",
          '}',
          '',
          'hello();',
          ''
        ].join('\n'),
        language: 'javascript',
        theme: 'vs-dark',
        automaticLayout: true,
        fontSize: 14,
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        tabSize: 2,
      });
      window.editor = editor;
    });
  }

  function getLanguageFromExtension(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase() ?? '';
    const map: Record<string, string> = {
      js: 'javascript', ts: 'typescript', tsx: 'typescript',
      html: 'html', css: 'css', json: 'json',
      md: 'markdown', py: 'python', java: 'java',
      c: 'c', cpp: 'cpp', rs: 'rust', go: 'go',
      xml: 'xml', yaml: 'yaml', yml: 'yaml',
      sh: 'shell', sql: 'sql', txt: 'plaintext',
    };
    return map[ext] ?? 'plaintext';
  }

  function openFile(filename: string, content: string): void {
    if (!editor) return;
    const lang = getLanguageFromExtension(filename);
    const model = monaco.editor.createModel(content, lang);
    editor.setModel(model);
  }

  function setContent(content: string): void {
    if (!editor) return;
    editor.setValue(content);
  }

  return { init, openFile, setContent };
})();
