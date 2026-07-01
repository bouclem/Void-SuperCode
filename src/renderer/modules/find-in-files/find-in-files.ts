interface ContentSearchMatch {
  line: number;
  text: string;
  column: number;
}

interface ContentSearchResult {
  filePath: string;
  relativePath: string;
  matches: ContentSearchMatch[];
}

window.FindInFiles = (() => {
  let overlay: HTMLElement | null = null;
  let input: HTMLInputElement | null = null;
  let list: HTMLElement | null = null;
  let results: ContentSearchResult[] = [];
  let selectedIdx = 0;
  let searchTimer: ReturnType<typeof setTimeout> | null = null;

  function init(): void {
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
    container.className = 'palette-container find-in-files-container';

    input = document.createElement('input');
    input.type = 'text';
    input.className = 'palette-input';
    input.placeholder = 'Search in files...';

    list = document.createElement('div');
    list.className = 'palette-list find-in-files-list';

    container.appendChild(input);
    container.appendChild(list);
    overlay.appendChild(container);
    document.body.appendChild(overlay);

    input.focus();

    input.addEventListener('input', function () {
      const query = input!.value.trim();
      if (searchTimer) clearTimeout(searchTimer);
      if (!query) {
        results = [];
        selectedIdx = 0;
        renderList();
        return;
      }
      searchTimer = setTimeout(async function () {
        results = await window.api.searchInFiles(folder, query);
        selectedIdx = 0;
        renderList();
      }, 300);
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIdx = Math.min(selectedIdx + 1, getTotalMatches() - 1);
        renderList();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIdx = Math.max(selectedIdx - 1, 0);
        renderList();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        openMatch(selectedIdx);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        hide();
      }
    });

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) hide();
    });
  }

  function getTotalMatches(): number {
    let total = 0;
    for (const r of results) {
      total += r.matches.length;
    }
    return total;
  }

  function getFlatMatch(idx: number): { result: ContentSearchResult; match: ContentSearchMatch } | null {
    let count = 0;
    for (const r of results) {
      for (const m of r.matches) {
        if (count === idx) return { result: r, match: m };
        count++;
      }
    }
    return null;
  }

  function renderList(): void {
    if (!list) return;
    list.innerHTML = '';

    if (results.length === 0) {
      if (input && input.value.trim()) {
        const empty = document.createElement('div');
        empty.className = 'palette-empty';
        empty.textContent = 'No results found';
        list.appendChild(empty);
      } else {
        const hint = document.createElement('div');
        hint.className = 'palette-empty';
        hint.textContent = 'Type to search across all files in the project';
        list.appendChild(hint);
      }
      return;
    }

    let flatIdx = 0;
    for (const r of results) {
      const fileHeader = document.createElement('div');
      fileHeader.className = 'find-file-header';

      const fileName = r.relativePath.split(/[\\/]/).pop() ?? r.relativePath;
      const fileLabel = document.createElement('span');
      fileLabel.className = 'find-file-name';
      fileLabel.textContent = fileName;

      const filePathLabel = document.createElement('span');
      filePathLabel.className = 'find-file-path';
      filePathLabel.textContent = r.relativePath;

      const countLabel = document.createElement('span');
      countLabel.className = 'find-match-count';
      countLabel.textContent = String(r.matches.length);

      fileHeader.appendChild(fileLabel);
      fileHeader.appendChild(filePathLabel);
      fileHeader.appendChild(countLabel);
      list.appendChild(fileHeader);

      for (const m of r.matches) {
        const item = document.createElement('div');
        item.className = 'find-match-item' + (flatIdx === selectedIdx ? ' find-match-active' : '');

        const lineNum = document.createElement('span');
        lineNum.className = 'find-line-num';
        lineNum.textContent = String(m.line);

        const lineText = document.createElement('span');
        lineText.className = 'find-line-text';
        lineText.textContent = m.text.trim();

        item.appendChild(lineNum);
        item.appendChild(lineText);

        const currentIdx = flatIdx;
        item.addEventListener('click', function () {
          openMatch(currentIdx);
        });

        list.appendChild(item);
        flatIdx++;
      }
    }
  }

  async function openMatch(idx: number): Promise<void> {
    const flat = getFlatMatch(idx);
    if (!flat) return;
    const fileName = flat.result.relativePath.split(/[\\/]/).pop() ?? flat.result.relativePath;
    const content = await window.api.readFile(flat.result.filePath);
    window.Editor.openFile(fileName, content, flat.result.filePath);

    setTimeout(function () {
      const ed = window.editor;
      if (ed) {
        ed.revealLineInCenter(flat.match.line);
        ed.setPosition({ lineNumber: flat.match.line, column: flat.match.column + 1 });
        ed.focus();
      }
    }, 100);

    hide();
  }

  function hide(): void {
    if (overlay) {
      overlay.remove();
      overlay = null;
    }
    if (searchTimer) {
      clearTimeout(searchTimer);
      searchTimer = null;
    }
    input = null;
    list = null;
    results = [];
    selectedIdx = 0;
  }

  return { init, show, hide };
})();
