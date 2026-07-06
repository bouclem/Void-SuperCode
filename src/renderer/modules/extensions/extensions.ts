window.Extensions = (() => {
  function init(): void {
    //TODO: load and register extensions (commands, languages, themes)
    //TODO: provide extension API surface (window.api, editor, commands)
  }

  async function scanExtensions(): Promise<string[]> {
    try {
      return await window.api.scanExtensions();
    } catch {
      return [];
    }
  }

  //TODO: async function loadExtension(path: string): Promise<void>
  //TODO: function registerExtensionCommands(ext: unknown): void

  return { init, scanExtensions };
})();
