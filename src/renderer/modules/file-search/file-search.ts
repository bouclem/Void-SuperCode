interface SearchResult {
  name: string;
  path: string;
  relativePath: string;
}

window.FileSearch = (() => {
  let overlay: HTMLElement | null = null;
  let input: HTMLInputElement | null = null;
  let list: HTMLElement | null = null;
  let results: SearchResult[] = [];
  let selectedIdx = 0;

  function init(): void {
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p' && !e.shiftKey) {
        e.preventDefault();
        show();
      }
    });
  }

  async function show(): Promise<void> {
    if (overlay) {
      hide();
      return;
    }

    const folder = window.FileExplorer.getCurrentFolder();
    if (!folder) return;

    overlay = document.createElement('div');
    overlay.className = 'palette-overlay';

    const container = document.createElement('div');
    container.className = 'palette-container';

    input = document.createElement('input');
    input.type = 'text';
    input.className = 'palette-input';
    input.placeholder = 'Search files by name...';

    list = document.createElement('div');
    list.className = 'palette-list';

    container.appendChild(input);
    container.appendChild(list);
    overlay.appendChild(container);
    document.body.appendChild(overlay);

    input.focus();

    results = await window.api.searchFiles(folder, '');
    selectedIdx = 0;
    renderList();

    input.addEventListener('input', async function () {
      const query = input!.value.toLowerCase().trim();
      results = await window.api.searchFiles(folder, query);
      selectedIdx = 0;
      renderList();
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIdx = Math.min(selectedIdx + 1, results.length - 1);
        renderList();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIdx = Math.max(selectedIdx - 1, 0);
        renderList();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIdx]) {
          openFile(results[selectedIdx]!);
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

    const toShow = results.slice(0, 20);
    for (let i = 0; i < toShow.length; i++) {
      const item = document.createElement('div');
      item.className = 'palette-item' + (i === selectedIdx ? ' palette-item-active' : '');

      const nameSpan = document.createElement('span');
      nameSpan.textContent = toShow[i]!.name;

      const pathSpan = document.createElement('span');
      pathSpan.className = 'palette-file-path';
      pathSpan.textContent = toShow[i]!.relativePath;

      item.appendChild(nameSpan);
      item.appendChild(pathSpan);

      item.addEventListener('click', function () {
        openFile(toShow[i]!);
      });

      list.appendChild(item);
    }

    if (toShow.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'palette-empty';
      empty.textContent = 'No files found';
      list.appendChild(empty);
    }
  }

  async function openFile(result: SearchResult): Promise<void> {
    const content = await window.api.readFile(result.path);
    window.Editor.openFile(result.name, content, result.path);
    hide();
  }

  function hide(): void {
    if (overlay) {
      overlay.remove();
      overlay = null;
    }
    input = null;
    list = null;
  }

  return { init, show, hide };
})();
