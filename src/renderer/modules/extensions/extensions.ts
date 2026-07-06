window.Extensions = (() => {
  function init(): void {
    //TODO: scan src/extensions/ folder for extension manifests
    //TODO: load and register extensions (commands, languages, themes)
    //TODO: provide extension API surface (window.api, editor, commands)
  }

  //TODO: async function scanExtensions(): Promise<string[]>
  //TODO: async function loadExtension(path: string): Promise<void>
  //TODO: function registerExtensionCommands(ext: unknown): void

  return { init };
})();
