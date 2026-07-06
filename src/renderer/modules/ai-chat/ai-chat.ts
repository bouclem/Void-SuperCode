window.AIChat = (() => {
  let panel: HTMLElement | null = null;
  let messagesContainer: HTMLElement | null = null;
  let inputArea: HTMLTextAreaElement | null = null;
  let sendBtn: HTMLButtonElement | null = null;
  let visible = true;
  let alwaysAccept = false;
  let messages: { role: string; content: string }[] = [];

  function init(): void {
    panel = document.getElementById('ai-chat-panel');
    messagesContainer = document.getElementById('ai-chat-messages');
    inputArea = document.getElementById('ai-chat-input') as HTMLTextAreaElement | null;
    sendBtn = document.getElementById('ai-chat-send') as HTMLButtonElement | null;

    if (sendBtn) {
      sendBtn.addEventListener('click', sendMessage);
    }
    if (inputArea) {
      inputArea.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      });
    }

    const closeBtn = document.getElementById('ai-chat-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', hide);
    }

    loadSettings();
  }

  async function loadSettings(): Promise<void> {
    try {
      const config = await window.api.getConfig();
      const cfg = config as Record<string, unknown>;
      alwaysAccept = cfg.aiAlwaysAccept === true;
    } catch {
      // Non-critical
    }
  }

  function setAlwaysAccept(value: boolean): void {
    alwaysAccept = value;
  }

  function show(): void {
    if (panel) panel.style.display = '';
    visible = true;
  }

  function hide(): void {
    if (panel) panel.style.display = 'none';
    visible = false;
  }

  function toggle(): void {
    if (visible) {
      hide();
    } else {
      show();
    }
  }

  function isOpen(): boolean {
    return visible;
  }

  function appendMessage(role: string, content: string): void {
    if (!messagesContainer) return;

    const msgEl = document.createElement('div');
    msgEl.className = 'ai-chat-message ai-chat-' + role;

    const roleEl = document.createElement('div');
    roleEl.className = 'ai-chat-role';
    roleEl.textContent = role === 'user' ? 'You' : 'AI';
    msgEl.appendChild(roleEl);

    const contentEl = document.createElement('div');
    contentEl.className = 'ai-chat-content';
    contentEl.textContent = content;
    msgEl.appendChild(contentEl);

    messagesContainer.appendChild(msgEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function appendDiff(oldText: string, newText: string, filePath: string): void {
    if (!messagesContainer) return;

    const diffEl = document.createElement('div');
    diffEl.className = 'ai-chat-diff';

    const header = document.createElement('div');
    header.className = 'ai-chat-diff-header';
    header.textContent = filePath;
    diffEl.appendChild(header);

    const oldPre = document.createElement('pre');
    oldPre.className = 'ai-chat-diff-removed';
    oldPre.textContent = oldText;
    diffEl.appendChild(oldPre);

    const newPre = document.createElement('pre');
    newPre.className = 'ai-chat-diff-added';
    newPre.textContent = newText;
    diffEl.appendChild(newPre);

    const actions = document.createElement('div');
    actions.className = 'ai-chat-diff-actions';

    const acceptBtn = document.createElement('button');
    acceptBtn.className = 'ai-chat-accept-btn';
    acceptBtn.textContent = 'Accept';
    acceptBtn.addEventListener('click', function () {
      applyEdit(filePath, oldText, newText);
      diffEl.classList.add('ai-chat-diff-accepted');
      acceptBtn.disabled = true;
      rejectBtn.disabled = true;
    });

    const rejectBtn = document.createElement('button');
    rejectBtn.className = 'ai-chat-reject-btn';
    rejectBtn.textContent = 'Reject';
    rejectBtn.addEventListener('click', function () {
      diffEl.classList.add('ai-chat-diff-rejected');
      acceptBtn.disabled = true;
      rejectBtn.disabled = true;
    });

    actions.appendChild(acceptBtn);
    actions.appendChild(rejectBtn);
    diffEl.appendChild(actions);

    messagesContainer.appendChild(diffEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    if (alwaysAccept) {
      acceptBtn.click();
    }
  }

  function appendCommandConfirmation(action: string, details: string, onConfirm: () => void): void {
    if (!messagesContainer) return;

    const confirmEl = document.createElement('div');
    confirmEl.className = 'ai-chat-confirm';

    const label = document.createElement('div');
    label.className = 'ai-chat-confirm-label';
    label.textContent = action + ': ' + details;
    confirmEl.appendChild(label);

    const actions = document.createElement('div');
    actions.className = 'ai-chat-diff-actions';

    const yesBtn = document.createElement('button');
    yesBtn.className = 'ai-chat-accept-btn';
    yesBtn.textContent = 'Confirm';
    yesBtn.addEventListener('click', function () {
      onConfirm();
      confirmEl.classList.add('ai-chat-diff-accepted');
      yesBtn.disabled = true;
      noBtn.disabled = true;
    });

    const noBtn = document.createElement('button');
    noBtn.className = 'ai-chat-reject-btn';
    noBtn.textContent = 'Cancel';
    noBtn.addEventListener('click', function () {
      confirmEl.classList.add('ai-chat-diff-rejected');
      yesBtn.disabled = true;
      noBtn.disabled = true;
    });

    actions.appendChild(yesBtn);
    actions.appendChild(noBtn);
    confirmEl.appendChild(actions);

    messagesContainer.appendChild(confirmEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  async function applyEdit(filePath: string, oldText: string, newText: string): Promise<void> {
    if (window.AITools) {
      await window.AITools.fileEdit(filePath, oldText, newText);
      if (window.FileExplorer) window.FileExplorer.refresh();
    }
  }

  async function sendMessage(): Promise<void> {
    if (!inputArea || !sendBtn) return;
    const text = inputArea.value.trim();
    if (!text) return;

    inputArea.value = '';
    sendBtn.disabled = true;

    appendMessage('user', text);
    messages.push({ role: 'user', content: text });

    const thinkingEl = document.createElement('div');
    thinkingEl.className = 'ai-chat-message ai-chat-assistant';
    const roleEl = document.createElement('div');
    roleEl.className = 'ai-chat-role';
    roleEl.textContent = 'AI';
    thinkingEl.appendChild(roleEl);
    const contentEl = document.createElement('div');
    contentEl.className = 'ai-chat-content';
    contentEl.textContent = 'Thinking...';
    thinkingEl.appendChild(contentEl);
    if (messagesContainer) {
      messagesContainer.appendChild(thinkingEl);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    try {
      const response = await window.AIApi.chat(messages);
      thinkingEl.remove();
      appendMessage('assistant', response);
      messages.push({ role: 'assistant', content: response });
    } catch (err) {
      contentEl.textContent = 'Error: ' + (err as Error).message;
    } finally {
      sendBtn.disabled = false;
      if (inputArea) inputArea.focus();
    }
  }

  function clear(): void {
    messages = [];
    if (messagesContainer) messagesContainer.innerHTML = '';
  }

  return { init, show, hide, toggle, isOpen, setAlwaysAccept, clear };
})();
