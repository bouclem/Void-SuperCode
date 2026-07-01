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
    fileTree.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', hideContextMenu);
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
      window.Git.setFolder(folderPath);
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
    if (ext === 'ts') return 'lang/typescript/icons/ts-file.svg';
    if (ext === 'tsx') return 'lang/typescript/icons/tsx-file.svg';
    if (ext === 'jl') return 'lang/julia/icons/julia-file.svg';
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

  function refreshActiveTab(oldPath: string, newPath: string): void {
    const tab = window.Tabs.getTab(oldPath);
    if (tab) {
      window.Tabs.closeTab(oldPath);
      const fileName = newPath.split(/[\\/]/).pop() ?? newPath;
      openFileByPath(newPath, fileName);
    }
  }

  function handleContextMenu(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target as HTMLElement;
    const treeEl = target.closest('.tree-folder, .tree-file') as HTMLElement | null;
    const isOnItem = !!treeEl;
    const itemPath = treeEl?.dataset.path ?? '';
    const isDir = treeEl?.dataset.isDirectory === 'true';
    showContextMenu(e.clientX, e.clientY, isOnItem, itemPath, isDir);
  }

  function showContextMenu(x: number, y: number, isOnItem: boolean, itemPath: string, isDir: boolean): void {
    hideContextMenu();
    const menu = document.createElement('div');
    menu.className = 'context-menu';
    menu.id = 'file-context-menu';
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';

    const parentPath = isOnItem ? (isDir ? itemPath : itemPath.split(/[\\/]/).slice(0, -1).join('/')) : (currentFolderPath ?? '');

    const newFileItem = createMenuItem('New File', function () {
      showInlineInput(parentPath || currentFolderPath, 'file');
    });
    menu.appendChild(newFileItem);

    const newFolderItem = createMenuItem('New Folder', function () {
      showInlineInput(parentPath || currentFolderPath, 'folder');
    });
    menu.appendChild(newFolderItem);

    if (isOnItem) {
      menu.appendChild(createMenuDivider());

      menu.appendChild(createMenuItem('Rename', function () {
        startRename(itemPath, isDir);
      }));

      menu.appendChild(createMenuItem('Delete', function () {
        confirmDelete(itemPath, isDir);
      }));
    }

    document.body.appendChild(menu);
  }

  function createMenuItem(label: string, action: () => void): HTMLElement {
    const item = document.createElement('div');
    item.className = 'context-menu-item';
    item.textContent = label;
    item.addEventListener('click', function () {
      hideContextMenu();
      action();
    });
    return item;
  }

  function createMenuDivider(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'context-menu-divider';
    return div;
  }

  function hideContextMenu(): void {
    const existing = document.getElementById('file-context-menu');
    if (existing) existing.remove();
  }

  function startRename(itemPath: string, isDir: boolean): void {
    const treeEl = document.querySelector('[data-path="' + CSS.escape(itemPath) + '"]') as HTMLElement | null;
    if (!treeEl) return;
    const label = treeEl.querySelector('.tree-label') as HTMLElement | null;
    if (!label) return;

    const oldName = label.textContent ?? '';
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'inline-name-input';
    input.value = oldName;
    input.style.width = '100%';

    label.textContent = '';
    label.appendChild(input);
    input.focus();
    input.select();

    let committed = false;

    function commitRename(): void {
      if (committed) return;
      committed = true;
      const newName = input.value.trim();
      if (!newName || newName === oldName) {
        if (label) label.textContent = oldName;
        return;
      }
      const parentDir = itemPath.split(/[\\/]/).slice(0, -1).join('/');
      const newPath = parentDir ? parentDir + '/' + newName : newName;
      if (label) label.textContent = newName;
      doRename(itemPath, newPath);
    }

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        commitRename();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        committed = true;
        label.textContent = oldName;
      }
    });

    input.addEventListener('blur', commitRename);
  }

  async function doRename(oldPath: string, newPath: string): Promise<void> {
    const success = await window.api.renameFile(oldPath, newPath);
    if (success) {
      refreshActiveTab(oldPath, newPath);
      await refresh();
    } else {
      window.api.logMessage('ERROR', 'file-explorer', 'Failed to rename: ' + oldPath + ' -> ' + newPath);
      await refresh();
    }
  }

  function confirmDelete(itemPath: string, isDir: boolean): void {
    const name = itemPath.split(/[\\/]/).pop() ?? itemPath;
    const message = isDir
      ? 'Are you sure you want to delete folder "' + name + '" and all its contents?'
      : 'Are you sure you want to delete "' + name + '"?';

    const overlay = document.createElement('div');
    overlay.className = 'palette-overlay';

    const dialog = document.createElement('div');
    dialog.className = 'update-dialog';

    const title = document.createElement('div');
    title.className = 'update-title';
    title.textContent = 'Confirm Delete';

    const msg = document.createElement('div');
    msg.className = 'update-message';
    msg.textContent = message;

    const btns = document.createElement('div');
    btns.className = 'update-btns';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'update-btn-later';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', function () { overlay.remove(); });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'update-btn-download';
    deleteBtn.textContent = 'Delete';
    deleteBtn.style.background = '#c94040';
    deleteBtn.addEventListener('click', async function () {
      overlay.remove();
      await doDelete(itemPath);
    });

    btns.appendChild(cancelBtn);
    btns.appendChild(deleteBtn);
    dialog.appendChild(title);
    dialog.appendChild(msg);
    dialog.appendChild(btns);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) overlay.remove();
    });
  }

  async function doDelete(targetPath: string): Promise<void> {
    const success = await window.api.deleteFile(targetPath);
    if (success) {
      const tab = window.Tabs.getTab(targetPath);
      if (tab) window.Tabs.closeTab(targetPath);
      await refresh();
    } else {
      window.api.logMessage('ERROR', 'file-explorer', 'Failed to delete: ' + targetPath);
    }
  }

  return { init, refresh, openFile, getCurrentFolder, refreshActiveTab };
})();
