interface ShortcutDef {
  id: string;
  label: string;
  defaultBinding: string;
  action: () => void;
  monaco: boolean;
}

interface ShortcutInfo {
  id: string;
  label: string;
  binding: string;
  defaultBinding: string;
}

window.Shortcuts = (() => {
  const registry: ShortcutDef[] = [];
  const customBindings: Record<string, string> = {};
  const monacoDisposables: Record<string, { dispose: () => void }> = {};
  let initialized = false;
  let bindingsLoaded = false;

  function init(): void {
    if (initialized) return;
    initialized = true;
    loadCustomBindings();
    document.addEventListener('keydown', handleKeydown);
  }

  async function loadCustomBindings(): Promise<void> {
    try {
      const config = await window.api.getConfig();
      const stored = (config as Record<string, unknown>).shortcuts as Record<string, string> | undefined;
      if (stored && typeof stored === 'object') {
        Object.assign(customBindings, stored);
      }
      bindingsLoaded = true;
      applyAllMonacoShortcuts();
    } catch {
      bindingsLoaded = true;
      applyAllMonacoShortcuts();
    }
  }

  function register(def: ShortcutDef): void {
    const existing = registry.find(function (s) { return s.id === def.id; });
    if (existing) return;
    registry.push(def);
    if (def.monaco && bindingsLoaded) {
      applyMonacoShortcut(def);
    }
  }

  function getBinding(id: string): string {
    return customBindings[id] || (registry.find(function (s) { return s.id === id; })?.defaultBinding ?? '');
  }

  function getAll(): ShortcutInfo[] {
    return registry.map(function (s) {
      return {
        id: s.id,
        label: s.label,
        binding: getBinding(s.id),
        defaultBinding: s.defaultBinding,
      };
    });
  }

  function rebind(id: string, binding: string): void {
    customBindings[id] = binding;
    saveCustomBindings();
    const def = registry.find(function (s) { return s.id === id; });
    if (!def) return;
    if (def.monaco) {
      if (monacoDisposables[id]) {
        monacoDisposables[id].dispose();
        delete monacoDisposables[id];
      }
      applyMonacoShortcut(def, binding);
    }
  }

  function reset(id: string): void {
    delete customBindings[id];
    saveCustomBindings();
    const def = registry.find(function (s) { return s.id === id; });
    if (!def) return;
    if (def.monaco && monacoDisposables[id]) {
      monacoDisposables[id].dispose();
      delete monacoDisposables[id];
      applyMonacoShortcut(def);
    }
  }

  function resetAll(): void {
    const ids = Object.keys(customBindings);
    for (const id of ids) {
      reset(id);
    }
  }

  async function saveCustomBindings(): Promise<void> {
    try {
      await window.api.setConfig({ shortcuts: customBindings });
    } catch {
      // Non-critical
    }
  }

  interface ParsedBinding {
    ctrl: boolean;
    shift: boolean;
    alt: boolean;
    key: string;
  }

  function parseBinding(binding: string): ParsedBinding {
    const lower = binding.toLowerCase();
    const parts = lower.split('+');
    const key = parts[parts.length - 1] ?? '';
    return {
      ctrl: lower.includes('ctrl') || lower.includes('cmd'),
      shift: lower.includes('shift'),
      alt: lower.includes('alt'),
      key: key,
    };
  }

  function handleKeydown(e: KeyboardEvent): void {
    for (const def of registry) {
      if (def.monaco) continue;
      const binding = getBinding(def.id);
      if (!binding) continue;
      const parsed = parseBinding(binding);
      const ctrlMatch = (e.ctrlKey || e.metaKey) === parsed.ctrl;
      const shiftMatch = e.shiftKey === parsed.shift;
      const altMatch = e.altKey === parsed.alt;
      const keyMatch = e.key.toLowerCase() === parsed.key;
      if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
        e.preventDefault();
        def.action();
        return;
      }
    }
  }

  function parseToMonaco(binding: string): number | null {
    const lower = binding.toLowerCase();
    const parts = lower.split('+');
    const key = parts[parts.length - 1] ?? '';

    let keyMod = 0;
    if (lower.includes('ctrl') || lower.includes('cmd')) {
      keyMod |= monaco.KeyMod.CtrlCmd;
    }
    if (lower.includes('shift')) {
      keyMod |= monaco.KeyMod.Shift;
    }
    if (lower.includes('alt')) {
      keyMod |= monaco.KeyMod.Alt;
    }

    const keyMap: Record<string, number> = {
      'a': monaco.KeyCode.KeyA, 'b': monaco.KeyCode.KeyB, 'c': monaco.KeyCode.KeyC,
      'd': monaco.KeyCode.KeyD, 'e': monaco.KeyCode.KeyE, 'f': monaco.KeyCode.KeyF,
      'g': monaco.KeyCode.KeyG, 'h': monaco.KeyCode.KeyH, 'i': monaco.KeyCode.KeyI,
      'j': monaco.KeyCode.KeyJ, 'k': monaco.KeyCode.KeyK, 'l': monaco.KeyCode.KeyL,
      'm': monaco.KeyCode.KeyM, 'n': monaco.KeyCode.KeyN, 'o': monaco.KeyCode.KeyO,
      'p': monaco.KeyCode.KeyP, 'q': monaco.KeyCode.KeyQ, 'r': monaco.KeyCode.KeyR,
      's': monaco.KeyCode.KeyS, 't': monaco.KeyCode.KeyT, 'u': monaco.KeyCode.KeyU,
      'v': monaco.KeyCode.KeyV, 'w': monaco.KeyCode.KeyW, 'x': monaco.KeyCode.KeyX,
      'y': monaco.KeyCode.KeyY, 'z': monaco.KeyCode.KeyZ,
    };

    const keyCode = keyMap[key];
    if (keyCode === undefined) return null;
    return keyMod | keyCode;
  }

  function applyMonacoShortcut(def: ShortcutDef, binding?: string): void {
    if (!window.editor) return;
    const actualBinding = binding ?? getBinding(def.id);
    if (!actualBinding) return;

    const monacoBinding = parseToMonaco(actualBinding);
    if (monacoBinding === null) return;

    const disposable = window.editor.addAction({
      id: 'void-shortcut-' + def.id,
      label: def.label,
      keybindings: [monacoBinding],
      run: function () {
        def.action();
      },
    });

    if (disposable) {
      monacoDisposables[def.id] = disposable;
    }
  }

  function applyAllMonacoShortcuts(): void {
    for (const def of registry) {
      if (def.monaco) {
        if (monacoDisposables[def.id]) {
          monacoDisposables[def.id]!.dispose();
          delete monacoDisposables[def.id];
        }
        applyMonacoShortcut(def);
      }
    }
  }

  return { init, register, getBinding, getAll, rebind, reset, resetAll, applyAllMonacoShortcuts };
})();
