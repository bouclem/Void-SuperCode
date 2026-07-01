window.Welcome = (() => {
  let welcomeEl: HTMLElement | null = null;

  function init(): void {
    welcomeEl = document.getElementById('welcome-page')!;
    show();
  }

  function show(): void {
    if (welcomeEl) {
      welcomeEl.style.display = 'flex';
    }
  }

  function hide(): void {
    if (welcomeEl) {
      welcomeEl.style.display = 'none';
    }
  }

  return { init, show, hide };
})();
