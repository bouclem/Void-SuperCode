window.AIApi = (() => {
  let provider = 'ollama';

  function init(): void {
    loadConfig();
  }

  async function loadConfig(): Promise<void> {
    try {
      const config = await window.api.getConfig();
      const cfg = config as Record<string, unknown>;
      if (cfg.aiProvider) provider = cfg.aiProvider as string;
      if (cfg.aiOllamaUrl && window.Ollama) window.Ollama.setUrl(cfg.aiOllamaUrl as string);
      if (cfg.aiOllamaModel && window.Ollama) window.Ollama.setModel(cfg.aiOllamaModel as string);
    } catch {
      // Non-critical
    }
  }

  function setProvider(name: string): void {
    provider = name;
  }

  function getProvider(): string {
    return provider;
  }

  async function chat(messages: { role: string; content: string }[]): Promise<string> {
    if (provider === 'ollama' && window.Ollama) {
      return await window.Ollama.chat(messages);
    }
    return 'Error: No AI provider configured';
  }

  async function complete(prompt: string): Promise<string> {
    if (provider === 'ollama' && window.Ollama) {
      return await window.Ollama.complete(prompt);
    }
    return 'Error: No AI provider configured';
  }

  return { init, setProvider, getProvider, chat, complete };
})();
