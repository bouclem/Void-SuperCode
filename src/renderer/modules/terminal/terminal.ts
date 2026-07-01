let _xtermCtor: any = (window as any).Terminal;
if (_xtermCtor && typeof _xtermCtor !== 'function' && _xtermCtor.Terminal) {
  _xtermCtor = _xtermCtor.Terminal;
}
let _xtermFitAddon: any = (window as any).FitAddon;
if (_xtermFitAddon && typeof _xtermFitAddon !== 'function' && _xtermFitAddon.FitAddon) {
  _xtermFitAddon = _xtermFitAddon.FitAddon;
}

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
      term = new _xtermCtor({
        theme: {
          background: '#1e1e1e',
          foreground: '#cccccc',
          cursor: '#cccccc',
        },
        fontSize: 13,
        fontFamily: 'Consolas, "Courier New", monospace',
        cursorBlink: true,
      });

      const fitAddon = new _xtermFitAddon.FitAddon();
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
