window.AutoUpdate = (() => {
  let initialized = false;

  function init(): void {
    if (initialized) return;
    initialized = true;

    setTimeout(function () {
      checkForUpdates(false);
    }, 5000);
  }

  async function checkForUpdates(showNotification: boolean): Promise<void> {
    try {
      const config = await window.api.getConfig();
      const autoUpdateEnabled = (config as any).autoUpdate !== false;
      if (!autoUpdateEnabled && !showNotification) return;

      const result = await window.api.checkForUpdates();

      if (result.updateAvailable) {
        showUpdateDialog(result.latestVersion, result.currentVersion);
      } else if (showNotification) {
        showNoUpdateNotification();
      }
    } catch {
      // Non-critical
    }
  }

  function showUpdateDialog(latestVersion: string, currentVersion: string): void {
    const overlay = document.createElement('div');
    overlay.className = 'palette-overlay';

    const container = document.createElement('div');
    container.className = 'update-dialog';

    const title = document.createElement('div');
    title.className = 'update-title';
    title.textContent = 'Update Available';

    const msg = document.createElement('div');
    msg.className = 'update-message';
    msg.textContent = 'Version ' + latestVersion + ' is available (you have ' + currentVersion + '). Install now?';

    const btnRow = document.createElement('div');
    btnRow.className = 'update-btns';

    const laterBtn = document.createElement('button');
    laterBtn.className = 'update-btn-later';
    laterBtn.textContent = 'Later';
    laterBtn.addEventListener('click', function () { overlay.remove(); });

    const installBtn = document.createElement('button');
    installBtn.className = 'update-btn-download';
    installBtn.textContent = 'Install Now';

    btnRow.appendChild(laterBtn);
    btnRow.appendChild(installBtn);

    container.appendChild(title);
    container.appendChild(msg);
    container.appendChild(btnRow);
    overlay.appendChild(container);
    document.body.appendChild(overlay);

    installBtn.addEventListener('click', function () {
      btnRow.remove();
      msg.remove();
      startInstall(container, overlay, latestVersion);
    });
  }

  function startInstall(container: HTMLElement, overlay: HTMLElement, latestTag: string): void {
    const statusMsg = document.createElement('div');
    statusMsg.className = 'update-message';
    statusMsg.textContent = 'Starting download...';

    const progressBar = document.createElement('div');
    progressBar.className = 'update-progress-bar';

    const progressFill = document.createElement('div');
    progressFill.className = 'update-progress-fill';
    progressBar.appendChild(progressFill);

    const statusLabel = document.createElement('div');
    statusLabel.className = 'update-status';
    statusLabel.textContent = '';

    container.appendChild(statusMsg);
    container.appendChild(progressBar);
    container.appendChild(statusLabel);

    window.api.onInstallProgress(function (progress) {
      statusMsg.textContent = progress.message;
      statusLabel.textContent = progress.stage;

      if (progress.percent !== undefined) {
        progressFill.style.width = progress.percent + '%';
      } else if (progress.stage === 'extracting') {
        progressFill.style.width = '100%';
        progressFill.style.background = '#f59e0b';
      } else if (progress.stage === 'installing') {
        progressFill.style.width = '100%';
        progressFill.style.background = '#a855f7';
      } else if (progress.stage === 'done') {
        progressFill.style.width = '100%';
        progressFill.style.background = '#73c991';
        statusMsg.textContent = 'Update installed! Restarting...';
      } else if (progress.stage === 'error') {
        progressFill.style.width = '100%';
        progressFill.style.background = '#f48771';
        statusMsg.textContent = progress.message;

        const closeBtn = document.createElement('button');
        closeBtn.className = 'update-btn-download';
        closeBtn.textContent = 'Close';
        closeBtn.style.marginTop = '12px';
        closeBtn.addEventListener('click', function () { overlay.remove(); });
        container.appendChild(closeBtn);
      }
    });

    window.api.installUpdate(latestTag);
  }

  function showNoUpdateNotification(): void {
    const overlay = document.createElement('div');
    overlay.className = 'palette-overlay';

    const container = document.createElement('div');
    container.className = 'update-dialog';

    const title = document.createElement('div');
    title.className = 'update-title';
    title.textContent = 'Up to Date';

    const msg = document.createElement('div');
    msg.className = 'update-message';
    msg.textContent = 'You are running the latest version.';

    const btnRow = document.createElement('div');
    btnRow.className = 'update-btns';

    const okBtn = document.createElement('button');
    okBtn.className = 'update-btn-download';
    okBtn.textContent = 'OK';
    okBtn.addEventListener('click', function () { overlay.remove(); });

    btnRow.appendChild(okBtn);

    container.appendChild(title);
    container.appendChild(msg);
    container.appendChild(btnRow);
    overlay.appendChild(container);
    document.body.appendChild(overlay);
  }

  return { init, checkForUpdates };
})();
