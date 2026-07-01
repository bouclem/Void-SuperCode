interface FileItem {
  name: string;
  path: string;
  isDirectory: boolean;
}

window.FileExplorer = (() => {
  let currentFolderPath: string | null = null;
  const fileTree = document.getElementById('file-tree')!;
  const openFolderBtn = document.getElementById('open-folder-btn')!;
  const openFileBtn = document.getElementById('open-file-btn')!;
  const newFileBtn = document.getElementById('new-file-btn')!;
  const newFolderBtn = document.getElementById('new-folder-btn')!;

  function init(): void {
    openFolderBtn.addEventListener('click', openFolder);
    openFileBtn.addEventListener('click', openFile);
    newFileBtn.addEventListener('click', createNewFile);
    newFolderBtn.addEventListener('click', createNewFolder);
    fileTree.addEventListener('dblclick', handleDblClick);
    loadLastFolder();
  }

  async function loadLastFolder(): Promise<void> {
    try {
      const config = await window.api.getConfig();
      const lastFolder = config.lastFolder as string | null;
      if (lastFolder) {
        currentFolderPath = lastFolder;
        await refresh();
        window.App.showSidebar();
      }
    } catch {
      // Non-critical
    }
  }

  async function openFile(): Promise<void> {
    const filePath = await window.api.openFileDialog();
    if (!filePath) return;
    const fileName = filePath.split(/[\\/]/).pop() ?? filePath;
    const content = await window.api.readFile(filePath);
    window.Editor.openFile(fileName, content, filePath);
  }

  async function openFolder(): Promise<void> {
    const folderPath = await window.api.openFolderDialog();
    if (folderPath) {
      currentFolderPath = folderPath;
      await refresh();
      await window.api.setConfig({ lastFolder: folderPath });
      window.App.showSidebar();
    }
  }

  async function refresh(): Promise<void> {
    if (!currentFolderPath) return;
    const folderName = currentFolderPath.split(/[\\/]/).pop() ?? 'Folder';
    fileTree.innerHTML = '<div class="tree-root">' + folderName + '</div>';
    const treeContainer = document.createElement('div');
    treeContainer.id = 'tree-container';
    fileTree.appendChild(treeContainer);
    await loadDirectory(currentFolderPath, treeContainer, 0);
  }

  async function loadDirectory(dirPath: string, container: HTMLElement, depth: number): Promise<void> {
    const items = await window.api.readDirectory(dirPath);
    container.innerHTML = '';
    for (const item of items) {
      const el = document.createElement('div');
      el.className = item.isDirectory ? 'tree-folder' : 'tree-file';
      el.style.paddingLeft = (depth * 16 + 8) + 'px';
      el.dataset.path = item.path;
      el.dataset.isDirectory = String(item.isDirectory);

      const iconImg = document.createElement('img');
      iconImg.className = 'tree-icon';
      iconImg.src = getFileIcon(item.name, item.isDirectory);
      iconImg.alt = '';

      const label = document.createElement('span');
      label.className = 'tree-label';
      label.textContent = item.name;

      el.appendChild(iconImg);
      el.appendChild(label);

      if (item.isDirectory) {
        let expanded = false;
        const childContainer = document.createElement('div');
        label.addEventListener('click', async function () {
          if (!expanded) {
            expanded = true;
            await loadDirectory(item.path, childContainer, depth + 1);
            el.parentElement!.insertBefore(childContainer, el.nextSibling);
          } else {
            expanded = false;
            childContainer.remove();
          }
        });
      } else {
        label.addEventListener('click', async function () {
          const content = await window.api.readFile(item.path);
          window.Editor.openFile(item.name, content, item.path);
        });
      }
      container.appendChild(el);
    }
  }

  function getFileIcon(name: string, isDirectory: boolean): string {
    if (isDirectory) return 'icons/folder.svg';
    const ext = name.split('.').pop()?.toLowerCase() ?? '';
    if (ext === 'js') return 'lang/javascript/icons/js-file.svg';
    if (ext === 'jsx') return 'lang/javascript/icons/jsx-file.svg';
    if (ext === 'mjs') return 'lang/javascript/icons/mjs-file.svg';
    return 'icons/file.svg';
  }

  function handleDblClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    const treeEl = target.closest('.tree-folder, .tree-file') as HTMLElement | null;
    if (!treeEl) return;
    const isDir = treeEl.dataset.isDirectory === 'true';
    const filePath = treeEl.dataset.path;
    if (isDir) {
      const label = treeEl.querySelector('.tree-label') as HTMLElement | null;
      if (label) label.click();
    } else if (filePath) {
      openFileByPath(filePath, treeEl.querySelector('.tree-label')?.textContent ?? filePath);
    }
  }

  async function openFileByPath(filePath: string, fileName: string): Promise<void> {
    try {
      const content = await window.api.readFile(filePath);
      window.Editor.openFile(fileName, content, filePath);
    } catch {
      // Non-critical
    }
  }

  function getParentPath(el: HTMLElement): string {
    const treeEl = el.closest('.tree-folder, .tree-file') as HTMLElement | null;
    if (treeEl && treeEl.dataset.path) {
      return treeEl.dataset.path;
    }
    return currentFolderPath ?? '';
  }

  function createNewFile(): void {
    console.log('[file-explorer] createNewFile called, currentFolderPath:', currentFolderPath);
    if (!currentFolderPath) {
      showInlineInput(null, 'file');
      return;
    }
    showInlineInput(currentFolderPath, 'file');
  }

  function createNewFolder(): void {
    if (!currentFolderPath) {
      showInlineInput(null, 'folder');
      return;
    }
    showInlineInput(currentFolderPath, 'folder');
  }

  function showInlineInput(dirPath: string | null, type: 'file' | 'folder'): void {
    console.log('[file-explorer] showInlineInput called, dirPath:', dirPath, 'type:', type);
    removeInlineInput();

    let committed = false;

    const wrapper = document.createElement('div');
    wrapper.className = 'tree-inline-input';
    wrapper.id = 'inline-input-wrapper';

    const iconImg = document.createElement('img');
    iconImg.className = 'tree-icon';
    iconImg.src = type === 'folder' ? 'icons/folder.svg' : 'icons/file.svg';
    iconImg.alt = '';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'inline-name-input';
    input.placeholder = type === 'folder' ? 'folder name' : 'filename.ext';

    wrapper.appendChild(iconImg);
    wrapper.appendChild(input);

    const treeContainer = document.getElementById('tree-container');
    if (treeContainer) {
      treeContainer.insertBefore(wrapper, treeContainer.firstChild);
    } else {
      fileTree.appendChild(wrapper);
    }

    input.focus();

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const name = input.value.trim();
        console.log('[file-explorer] Enter pressed, name:', name);
        if (!name) {
          committed = true;
          removeInlineInput();
          return;
        }
        const basePath = dirPath ?? currentFolderPath ?? '';
        console.log('[file-explorer] basePath:', basePath, 'dirPath:', dirPath, 'currentFolderPath:', currentFolderPath);
        if (!basePath) {
          committed = true;
          removeInlineInput();
          return;
        }
        const fullPath = basePath + '/' + name;
        console.log('[file-explorer] fullPath:', fullPath);
        committed = true;
        removeInlineInput();
        if (type === 'folder') {
          doCreateFolder(fullPath);
        } else {
          doCreateFile(fullPath);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        committed = true;
        removeInlineInput();
      }
    });

    input.addEventListener('blur', function () {
      if (!committed) {
        removeInlineInput();
      }
    });
  }

  function removeInlineInput(): void {
    const existing = document.getElementById('inline-input-wrapper');
    if (existing) {
      existing.remove();
    }
  }

  async function doCreateFile(filePath: string): Promise<void> {
    console.log('[file-explorer] doCreateFile called, filePath:', filePath);
    const success = await window.api.createFile(filePath);
    console.log('[file-explorer] createFile result:', success);
    if (success) {
      await refresh();
    } else {
      window.api.logMessage('ERROR', 'file-explorer', 'Failed to create file: ' + filePath);
    }
  }

  async function doCreateFolder(folderPath: string): Promise<void> {
    const success = await window.api.createFolder(folderPath);
    if (success) {
      await refresh();
    } else {
      window.api.logMessage('ERROR', 'file-explorer', 'Failed to create folder: ' + folderPath);
    }
  }

  function getCurrentFolder(): string | null {
    return currentFolderPath;
  }

  return { init, refresh, openFile, getCurrentFolder };
})();
