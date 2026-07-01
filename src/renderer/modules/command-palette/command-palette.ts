interface Command {
  id: string;
  label: string;
  shortcut?: string;
  action: () => void;
}

window.CommandPalette = (() => {
  let overlay: HTMLElement | null = null;
  let input: HTMLInputElement | null = null;
  let list: HTMLElement | null = null;
  let commands: Command[] = [];
  let filtered: Command[] = [];
  let selectedIdx = 0;

  function init(): void {
  }

  function registerCommands(cmds: Command[]): void {
    commands = cmds;
  }

  function show(): void {
    if (overlay) {
      hide();
      return;
    }

    overlay = document.createElement('div');
    overlay.className = 'palette-overlay';

    const container = document.createElement('div');
    container.className = 'palette-container';

    input = document.createElement('input');
    input.type = 'text';
    input.className = 'palette-input';
    input.placeholder = 'Type a command...';

    list = document.createElement('div');
    list.className = 'palette-list';

    container.appendChild(input);
    container.appendChild(list);
    overlay.appendChild(container);
    document.body.appendChild(overlay);

    filtered = commands;
    selectedIdx = 0;
    renderList();

    input.focus();

    input.addEventListener('input', function () {
      const query = input!.value.toLowerCase().replace(/^>/, '').trim();
      filtered = commands.filter(function (c) {
        return c.label.toLowerCase().indexOf(query) !== -1;
      });
      selectedIdx = 0;
      renderList();
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIdx = Math.min(selectedIdx + 1, filtered.length - 1);
        renderList();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIdx = Math.max(selectedIdx - 1, 0);
        renderList();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = filtered[selectedIdx];
        if (cmd) {
          cmd.action();
          hide();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        hide();
      }
    });

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) hide();
    });
  }

  function renderList(): void {
    if (!list) return;
    list.innerHTML = '';

    const toShow = filtered.slice(0, 12);
    for (let i = 0; i < toShow.length; i++) {
      const item = document.createElement('div');
      item.className = 'palette-item' + (i === selectedIdx ? ' palette-item-active' : '');
      item.textContent = toShow[i]!.label;

      if (toShow[i]!.shortcut) {
        const sc = document.createElement('span');
        sc.className = 'palette-shortcut';
        sc.textContent = toShow[i]!.shortcut!;
        item.appendChild(sc);
      }

      item.addEventListener('click', function () {
        toShow[i]!.action();
        hide();
      });

      list.appendChild(item);
    }

    if (toShow.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'palette-empty';
      empty.textContent = 'No commands found';
      list.appendChild(empty);
    }
  }

  function hide(): void {
    if (overlay) {
      overlay.remove();
      overlay = null;
    }
    input = null;
    list = null;
  }

  return { init, registerCommands, show, hide };
})();
