window.DebugConsole = (() => {
  let panel: HTMLElement | null = null;
  let output: HTMLElement | null = null;
  let toggleBtn: HTMLElement | null = null;
  let visible = false;
  let maxLines = 500;

  function init(): void {
    panel = document.getElementById('bottom-panel')!;
    output = document.getElementById('debug-console-output')!;
    toggleBtn = document.getElementById('activity-debug-btn')!;

    toggleBtn.addEventListener('click', toggle);

    const closeBtn = document.getElementById('bottom-panel-close')!;
    closeBtn.addEventListener('click', hide);

    interceptConsole();
    loadLogs();
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
    visible = true;
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

  function appendLine(level: string, source: string, message: string): void {
    if (!output) return;

    const line = document.createElement('div');
    line.className = 'debug-line debug-' + level.toLowerCase();

    const time = new Date().toLocaleTimeString();
    const timeSpan = document.createElement('span');
    timeSpan.className = 'debug-time';
    timeSpan.textContent = time;

    const levelSpan = document.createElement('span');
    levelSpan.className = 'debug-level';
    levelSpan.textContent = level;

    const sourceSpan = document.createElement('span');
    sourceSpan.className = 'debug-source';
    sourceSpan.textContent = source;

    const msgSpan = document.createElement('span');
    msgSpan.className = 'debug-message';
    msgSpan.textContent = message;

    line.appendChild(timeSpan);
    line.appendChild(levelSpan);
    line.appendChild(sourceSpan);
    line.appendChild(msgSpan);

    output.appendChild(line);

    while (output.childElementCount > maxLines) {
      output.removeChild(output.firstChild!);
    }

    output.scrollTop = output.scrollHeight;
  }

  function interceptConsole(): void {
    const origLog = console.log;
    const origError = console.error;
    const origWarn = console.warn;

    console.log = function (...args: any[]): void {
      origLog.apply(console, args);
      appendLine('INFO', 'console', args.map(formatArg).join(' '));
    };

    console.error = function (...args: any[]): void {
      origError.apply(console, args);
      appendLine('ERROR', 'console', args.map(formatArg).join(' '));
    };

    console.warn = function (...args: any[]): void {
      origWarn.apply(console, args);
      appendLine('WARN', 'console', args.map(formatArg).join(' '));
    };

    window.addEventListener('error', function (e: ErrorEvent) {
      appendLine('ERROR', 'runtime', e.message + ' (' + e.filename + ':' + e.lineno + ')');
    });

    window.addEventListener('unhandledrejection', function (e: PromiseRejectionEvent) {
      appendLine('ERROR', 'promise', String(e.reason));
    });
  }

  async function loadLogs(): Promise<void> {
    try {
      const config = await window.api.getConfig();
      appendLine('INFO', 'system', 'Void SuperCode started');
    } catch {
      // Non-critical
    }
  }

  function formatArg(arg: any): string {
    if (typeof arg === 'string') return arg;
    try {
      return JSON.stringify(arg);
    } catch {
      return String(arg);
    }
  }

  return { init, show, hide, toggle, appendLine };
})();
