window.AITools = (() => {
  async function fileWrite(filePath: string, content: string): Promise<boolean> {
    try {
      return await window.api.saveFile(filePath, content);
    } catch {
      return false;
    }
  }

  async function fileModify(filePath: string, oldText: string, newText: string): Promise<boolean> {
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

  async function folderWrite(folderPath: string): Promise<boolean> {
    try {
      return await window.api.createFolder(folderPath);
    } catch {
      return false;
    }
  }

  //TODO: fileDelete(filePath: string): Promise<boolean>
  //TODO: fileSearch(dir: string, pattern: string): Promise<string[]>
  //TODO: fileAppend(filePath: string, content: string): Promise<boolean>
  //TODO: fileInsert(filePath: string, line: number, content: string): Promise<boolean>

  return { fileWrite, fileModify, folderWrite };
})();
