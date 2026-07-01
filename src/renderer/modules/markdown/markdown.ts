window.MarkdownPreview = (() => {
  let previewContainer: HTMLElement | null = null;
  let isVisible = false;

  function init(): void {
  }

  function show(content: string): void {
    hide();

    const editorArea = document.getElementById('editor-area');
    if (!editorArea) return;

    previewContainer = document.createElement('div');
    previewContainer.id = 'markdown-preview';
    previewContainer.innerHTML = renderMarkdown(content);

    editorArea.appendChild(previewContainer);
    isVisible = true;
  }

  function hide(): void {
    if (previewContainer) {
      previewContainer.remove();
      previewContainer = null;
    }
    isVisible = false;
  }

  function isOpen(): boolean {
    return isVisible;
  }

  function renderMarkdown(md: string): string {
    let html = md;

    html = html.replace(/&/g, '&amp;');
    html = html.replace(/</g, '&lt;');
    html = html.replace(/>/g, '&gt;');

    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/`(.+?)`/g, '<code>$1</code>');

    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');

    html = html.replace(/^[-*] (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, function (m) { return '<ul>' + m + '</ul>'; });

    html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');

    html = html.replace(/```[\s\S]*?```/g, function (m) {
      const code = m.replace(/^```\w*\n?/, '').replace(/```$/, '');
      return '<pre><code>' + code + '</code></pre>';
    });

    html = html.replace(/^---$/gm, '<hr>');

    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';

    html = html.replace(/<p>(<h[1-3]>)/g, '$1');
    html = html.replace(/(<\/h[1-3]>)<\/p>/g, '$1');
    html = html.replace(/<p>(<ul>)/g, '$1');
    html = html.replace(/(<\/ul>)<\/p>/g, '$1');
    html = html.replace(/<p>(<pre>)/g, '$1');
    html = html.replace(/(<\/pre>)<\/p>/g, '$1');
    html = html.replace(/<p>(<blockquote>)/g, '$1');
    html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
    html = html.replace(/<p>(<hr>)<\/p>/g, '$1');
    html = html.replace(/<p>\s*<\/p>/g, '');

    return html;
  }

  return { init, show, hide, isOpen };
})();
