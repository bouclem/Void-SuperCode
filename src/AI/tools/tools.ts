window.AITools = (() => {
  async function fileWrite(filePath: string, content: string): Promise<boolean> {
    try {
      return await window.api.saveFile(filePath, content);
    } catch {
      return false;
    }
  }

  async function fileEdit(filePath: string, oldText: string, newText: string): Promise<boolean> {
    try {
      const content = await window.api.readFile(filePath);
      const idx = content.indexOf(oldText);
      if (idx === -1) return false;
      const modified = content.slice(0, idx) + newText + content.slice(idx + oldText.length);
      return await window.api.saveFile(filePath, modified);
    } catch {
      return false;
    }
  }

  async function fileMultiEdit(filePath: string, edits: { oldText: string; newText: string }[]): Promise<boolean> {
    try {
      let content = await window.api.readFile(filePath);
      for (const edit of edits) {
        const idx = content.indexOf(edit.oldText);
        if (idx === -1) return false;
        content = content.slice(0, idx) + edit.newText + content.slice(idx + edit.oldText.length);
      }
      return await window.api.saveFile(filePath, content);
    } catch {
      return false;
    }
  }

  async function fileDelete(filePath: string): Promise<boolean> {
    try {
      return await window.api.deleteFile(filePath);
    } catch {
      return false;
    }
  }

  async function fileRead(filePath: string): Promise<string> {
    try {
      return await window.api.readFile(filePath);
    } catch {
      return '';
    }
  }

  async function fileRename(oldPath: string, newPath: string): Promise<boolean> {
    try {
      return await window.api.renameFile(oldPath, newPath);
    } catch {
      return false;
    }
  }

  async function fileSearch(dir: string, pattern: string): Promise<{ name: string; path: string; relativePath: string }[]> {
    try {
      return await window.api.searchFiles(dir, pattern);
    } catch {
      return [];
    }
  }

  async function projectTree(dirPath: string): Promise<{ name: string; path: string; isDirectory: boolean; children?: unknown[] }[]> {
    try {
      const entries = await window.api.readDirectory(dirPath);
      const result: { name: string; path: string; isDirectory: boolean; children?: unknown[] }[] = [];
      for (const entry of entries) {
        if (entry.isDirectory) {
          const children = await projectTree(entry.path);
          result.push({ name: entry.name, path: entry.path, isDirectory: true, children });
        } else {
          result.push({ name: entry.name, path: entry.path, isDirectory: false });
        }
      }
      return result;
    } catch {
      return [];
    }
  }

  async function folderWrite(folderPath: string): Promise<boolean> {
    try {
      return await window.api.createFolder(folderPath);
    } catch {
      return false;
    }
  }

  return { fileWrite, fileEdit, fileMultiEdit, fileDelete, fileRead, fileRename, fileSearch, projectTree, folderWrite };
})();
