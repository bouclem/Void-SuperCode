declare const monaco: any;

interface Window {
  editor: any;
  Editor: {
    init(): void;
    openFile(filename: string, content: string): void;
    setContent(content: string): void;
  };
  FileExplorer: {
    init(): void;
    refresh(): void;
  };
  App: {
    init(): void;
  };
  api: {
    openFolderDialog(): Promise<string | null>;
    readDirectory(dirPath: string): Promise<{ name: string; path: string; isDirectory: boolean }[]>;
    readFile(filePath: string): Promise<string>;
    createFile(filePath: string): Promise<boolean>;
  };
  MonacoEnvironment: {
    getWorkerUrl(): string;
  };
}

declare const require: any;
