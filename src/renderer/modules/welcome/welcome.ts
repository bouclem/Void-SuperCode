window.Welcome = (() => {
  let welcomeEl: HTMLElement | null = null;
  let editorEl: HTMLElement | null = null;

  function init(): void {
    welcomeEl = document.getElementById('welcome-page')!;
    editorEl = document.getElementById('editor')!;
    show();
  }

  function show(): void {
    if (welcomeEl) {
      welcomeEl.style.display = 'flex';
    }
    if (editorEl) {
      editorEl.style.display = 'none';
    }
  }

  function hide(): void {
    if (welcomeEl) {
      welcomeEl.style.display = 'none';
    }
    if (editorEl) {
      editorEl.style.display = 'block';
    }
  }

  return { init, show, hide };
})();
