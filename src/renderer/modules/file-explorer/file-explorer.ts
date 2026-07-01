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

  function init(): void {
    openFolderBtn.addEventListener('click', openFolder);
    openFileBtn.addEventListener('click', openFile);
    newFileBtn.addEventListener('click', createNewFile);
    fileTree.addEventListener('dblclick', handleDblClick);
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
      iconImg.src = item.isDirectory ? 'icons/folder.svg' : 'icons/file.svg';
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

  function handleDblClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    const treeEl = target.closest('.tree-folder, .tree-file') as HTMLElement | null;
    if (!treeEl) return;
    const isDir = treeEl.dataset.isDirectory === 'true';
    const parentPath = getParentPath(treeEl);
    if (isDir) {
      promptCreateFile(parentPath);
    } else {
      const parent = treeEl.parentElement;
      if (parent && parent.id !== 'tree-container') {
        const parentDir = getParentPath(parent);
        promptCreateFile(parentDir);
      } else if (currentFolderPath) {
        promptCreateFile(currentFolderPath);
      }
    }
  }

  function getParentPath(el: HTMLElement): string {
    const treeEl = el.closest('.tree-folder, .tree-file') as HTMLElement | null;
    if (treeEl && treeEl.dataset.path) {
      return treeEl.dataset.path;
    }
    return currentFolderPath ?? '';
  }

  async function createNewFile(): Promise<void> {
    if (!currentFolderPath) {
      alert('Open a folder first');
      return;
    }
    promptCreateFile(currentFolderPath);
  }

  function promptCreateFile(dirPath: string): void {
    const fileName = prompt('Enter file name:');
    if (!fileName) return;
    const filePath = dirPath + '/' + fileName;
    doCreateFile(filePath);
  }

  async function doCreateFile(filePath: string): Promise<void> {
    const success = await window.api.createFile(filePath);
    if (success) {
      await refresh();
    } else {
      alert('Failed to create file');
    }
  }

  return { init, refresh, openFile };
})();
