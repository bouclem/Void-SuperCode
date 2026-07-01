declare const Terminal: any;
declare const FitAddon: any;

window.Terminal = (() => {
  let panel: HTMLElement | null = null;
  let term: any = null;
  let initialized = false;

  function init(): void {
    panel = document.getElementById('terminal-container')!;
  }

  function open(cwd: string): void {
    if (!panel) return;

    if (!initialized) {
      term = new Terminal({
        theme: {
          background: '#1e1e1e',
          foreground: '#cccccc',
          cursor: '#cccccc',
        },
        fontSize: 13,
        fontFamily: 'Consolas, "Courier New", monospace',
        cursorBlink: true,
      });

      const fitAddon = new FitAddon.FitAddon();
      term.loadAddon(fitAddon);
      term.open(panel);
      fitAddon.fit();

      term.onData(function (data: string) {
        window.api.terminalInput(data);
      });

      window.api.terminalOutput(function (_event: unknown, data: string) {
        term.write(data);
      });

      window.api.terminalExit(function () {
        term.write('\r\n[Process exited]\r\n');
      });

      term.onResize(function (size: { cols: number; rows: number }) {
        window.api.terminalResize(size.cols, size.rows);
      });

      initialized = true;
    }

    term.writeln('Starting terminal in: ' + cwd);
    window.api.terminalCreate(cwd);
  }

  function close(): void {
    window.api.terminalKill();
    if (term) {
      term.clear();
    }
  }

  return { init, open, close };
})();
