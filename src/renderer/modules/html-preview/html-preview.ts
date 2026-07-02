window.HtmlPreview = (() => {
  let previewContainer: HTMLElement | null = null;
  let isVisible = false;

  function init(): void {
  }

  function show(content: string): void {
    hide();

    const editorArea = document.getElementById('editor-area');
    if (!editorArea) return;

    previewContainer = document.createElement('div');
    previewContainer.id = 'html-preview';

    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.background = '#fff';
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');

    previewContainer.appendChild(iframe);
    editorArea.appendChild(previewContainer);

    const doc = iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(content);
      doc.close();
    }

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

  return { init, show, hide, isOpen };
})();
