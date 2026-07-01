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
    refresh(): Promise<void>;
    openFile(filename: string, content: string, filePath: string): void;
    getCurrentFolder(): string | null;
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
  DebugConsole: {
    init(): void;
    show(): void;
    hide(): void;
    toggle(): void;
    appendLine(level: string, source: string, message: string): void;
  };
  Autosave: {
    init(): void;
    start(): void;
    stop(): void;
  };
  Settings: {
    init(): void;
    show(): void;
    hide(): void;
    toggle(): void;
    initControls(): void;
  };
  Terminal: {
    init(): void;
    open(cwd: string): void;
    close(): void;
  };
  Git: {
    init(): void;
    show(): void;
    hide(): void;
    toggle(): void;
    refresh(): Promise<void>;
    setFolder(folder: string | null): void;
    commit(): Promise<void>;
    push(): Promise<void>;
    pull(): Promise<void>;
    fetch(): Promise<void>;
    showCloneDialog(): void;
  };
  api: {
    openFolderDialog(): Promise<string | null>;
    openFileDialog(): Promise<string | null>;
    readDirectory(dirPath: string): Promise<{ name: string; path: string; isDirectory: boolean }[]>;
    readFile(filePath: string): Promise<string>;
    createFile(filePath: string): Promise<boolean>;
    saveFile(filePath: string, content: string): Promise<boolean>;
    createFolder(folderPath: string): Promise<boolean>;
    getConfig(): Promise<Record<string, unknown>>;
    setConfig(updates: Record<string, unknown>): Promise<boolean>;
    logMessage(level: string, source: string, message: string): Promise<boolean>;
    terminalCreate(cwd: string): Promise<boolean>;
    terminalInput(data: string): Promise<boolean>;
    terminalResize(cols: number, rows: number): Promise<boolean>;
    terminalKill(): Promise<boolean>;
    terminalOutput(callback: (_event: unknown, data: string) => void): void;
    terminalExit(callback: () => void): void;
    gitStatus(cwd: string): Promise<{ branch: string | null; files: { path: string; status: string; staged: boolean }[]; isRepo: boolean }>;
    gitStage(cwd: string, filePath: string): Promise<boolean>;
    gitUnstage(cwd: string, filePath: string): Promise<boolean>;
    gitCommit(cwd: string, message: string): Promise<boolean>;
    gitPush(cwd: string): Promise<boolean>;
    gitPull(cwd: string): Promise<boolean>;
    gitFetch(cwd: string): Promise<boolean>;
    gitClone(url: string, destDir: string): Promise<boolean>;
    gitGetConfig(cwd: string): Promise<{ name: string; email: string }>;
    gitSetConfig(cwd: string, name: string, email: string): Promise<boolean>;
    openSettingsWindow(): void;
    onSettingsUpdated(callback: (updates: Record<string, unknown>) => void): void;
  };
  MonacoEnvironment: {
    getWorkerUrl(): string;
  };
}

declare const require: any;
