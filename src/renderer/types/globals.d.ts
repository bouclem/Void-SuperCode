declare const monaco: any;

interface Tab {
  path: string;
  name: string;
  model: any;
  isDirty: boolean;
}

interface Window {
  editor: any;
  Editor: {
    init(): void;
    openFile(filename: string, content: string, filePath: string): void;
    setContent(content: string): void;
    setModel(model: any): void;
    createModel(filePath: string, content: string): any;
    saveCurrentFile(): Promise<void>;
  };
  FileExplorer: {
    init(): void;
    refresh(): void;
    openFile(): Promise<void>;
  };
  Welcome: {
    init(): void;
    show(): void;
    hide(): void;
  };
  Tabs: {
    init(): void;
    openTab(filePath: string, fileName: string, content: string): void;
    closeTab(filePath: string): void;
    switchTab(filePath: string): void;
    markDirty(filePath: string): void;
    markClean(filePath: string): void;
    getActiveTab(): Tab | null;
    getTab(filePath: string): Tab | null;
    hasUnsavedChanges(): boolean;
  };
  App: {
    init(): void;
    showSidebar(): void;
    hideSidebar(): void;
  };
  api: {
    openFolderDialog(): Promise<string | null>;
    openFileDialog(): Promise<string | null>;
    readDirectory(dirPath: string): Promise<{ name: string; path: string; isDirectory: boolean }[]>;
    readFile(filePath: string): Promise<string>;
    createFile(filePath: string): Promise<boolean>;
    saveFile(filePath: string, content: string): Promise<boolean>;
    createFolder(folderPath: string): Promise<boolean>;
    getConfig(): Promise<{ lastFolder: string | null }>;
    setConfig(updates: Record<string, unknown>): Promise<boolean>;
    logMessage(level: string, source: string, message: string): Promise<boolean>;
  };
  MonacoEnvironment: {
    getWorkerUrl(): string;
  };
}

declare const require: any;
