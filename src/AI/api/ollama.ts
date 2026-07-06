window.Ollama = (() => {
  const DEFAULT_URL = 'http://localhost:11434';
  let baseUrl = DEFAULT_URL;
  let model = 'llama3';

  function setUrl(url: string): void {
    baseUrl = url || DEFAULT_URL;
  }

  function setModel(name: string): void {
    model = name;
  }

  function getUrl(): string {
    return baseUrl;
  }

  function getModel(): string {
    return model;
  }

  async function chat(messages: { role: string; content: string }[]): Promise<string> {
    try {
      const response = await fetch(baseUrl + '/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: model, messages: messages, stream: false }),
      });
      if (!response.ok) return 'Error: Ollama request failed (' + response.status + ')';
      const data = await response.json() as { message?: { content?: string } };
      return data.message?.content ?? '';
    } catch (err) {
      return 'Error: Cannot connect to Ollama at ' + baseUrl + ' — ' + (err as Error).message;
    }
  }

  async function complete(prompt: string): Promise<string> {
    try {
      const response = await fetch(baseUrl + '/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: model, prompt: prompt, stream: false }),
      });
      if (!response.ok) return 'Error: Ollama request failed (' + response.status + ')';
      const data = await response.json() as { response?: string };
      return data.response ?? '';
    } catch (err) {
      return 'Error: Cannot connect to Ollama at ' + baseUrl + ' — ' + (err as Error).message;
    }
  }

  async function listModels(): Promise<string[]> {
    try {
      const response = await fetch(baseUrl + '/api/tags');
      if (!response.ok) return [];
      const data = await response.json() as { models?: { name: string }[] };
      return (data.models ?? []).map(function (m) { return m.name; });
    } catch {
      return [];
    }
  }

  return { setUrl, setModel, getUrl, getModel, chat, complete, listModels };
})();
