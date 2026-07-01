interface GitFile {
  path: string;
  status: string;
  staged: boolean;
}

window.Git = (() => {
  let panel: HTMLElement | null = null;
  let toggleBtn: HTMLElement | null = null;
  let visible = false;
  let currentFolder: string | null = null;

  function init(): void {
    panel = document.getElementById('git-panel')!;
    toggleBtn = document.getElementById('activity-git-btn')!;
    toggleBtn.addEventListener('click', toggle);
  }

  function toggle(): void {
    if (visible) {
      hide();
    } else {
      show();
    }
  }

  function show(): void {
    if (panel) {
      panel.style.display = 'flex';
    }
    if (toggleBtn) {
      toggleBtn.classList.add('active');
    }
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.style.display = 'none';
    }
    const filesBtn = document.getElementById('activity-files-btn');
    if (filesBtn) {
      filesBtn.classList.remove('active');
    }
    const settingsBtn = document.getElementById('activity-settings-btn');
    if (settingsBtn) {
      settingsBtn.classList.remove('active');
    }
    visible = true;
    refresh();
  }

  function hide(): void {
    if (panel) {
      panel.style.display = 'none';
    }
    if (toggleBtn) {
      toggleBtn.classList.remove('active');
    }
    visible = false;
  }

  function setFolder(folder: string | null): void {
    currentFolder = folder;
    if (visible) {
      refresh();
    }
  }

  async function refresh(): Promise<void> {
    if (!panel || !currentFolder) return;

    const status = await window.api.gitStatus(currentFolder);

    const header = panel.querySelector('.git-branch') as HTMLElement | null;
    if (header) {
      header.textContent = status.isRepo ? 'Branch: ' + status.branch : 'Not a git repository';
    }

    const actionsBar = panel.querySelector('.git-actions') as HTMLElement | null;
    if (actionsBar) {
      actionsBar.style.display = status.isRepo ? 'flex' : 'none';
    }

    const changesList = panel.querySelector('.git-changes') as HTMLElement | null;
    if (!changesList) return;

    changesList.innerHTML = '';

    if (!status.isRepo) {
      const empty = document.createElement('div');
      empty.className = 'git-empty';
      empty.textContent = 'Open a git repository to see changes';
      changesList.appendChild(empty);
      return;
    }

    if (status.files.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'git-empty';
      empty.textContent = 'No changes detected';
      changesList.appendChild(empty);
      return;
    }

    const staged = status.files.filter(function (f) { return f.staged; });
    const unstaged = status.files.filter(function (f) { return !f.staged; });

    if (staged.length > 0) {
      const section = document.createElement('div');
      section.className = 'git-section';
      section.textContent = 'Staged Changes (' + staged.length + ')';
      changesList.appendChild(section);

      for (const file of staged) {
        changesList.appendChild(createFileRow(file, true));
      }
    }

    if (unstaged.length > 0) {
      const section = document.createElement('div');
      section.className = 'git-section';
      section.textContent = 'Changes (' + unstaged.length + ')';
      changesList.appendChild(section);

      for (const file of unstaged) {
        changesList.appendChild(createFileRow(file, false));
      }
    }

    const commitSection = panel.querySelector('.git-commit-section') as HTMLElement | null;
    if (commitSection) {
      commitSection.style.display = staged.length > 0 ? 'flex' : 'none';
    }
  }

  function createFileRow(file: GitFile, isStaged: boolean): HTMLElement {
    const row = document.createElement('div');
    row.className = 'git-file-row';

    const statusLetter = document.createElement('span');
    statusLetter.className = 'git-status-letter git-status-' + file.status;
    const letters: Record<string, string> = {
      modified: 'M',
      added: 'A',
      deleted: 'D',
      untracked: 'U',
      renamed: 'R',
    };
    statusLetter.textContent = letters[file.status] ?? '?';

    const fileName = document.createElement('span');
    fileName.className = 'git-file-name';
    fileName.textContent = file.path;

    const actionBtn = document.createElement('button');
    actionBtn.className = 'git-file-action';
    actionBtn.textContent = isStaged ? '-' : '+';
    actionBtn.title = isStaged ? 'Unstage' : 'Stage';
    actionBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (isStaged) {
        window.api.gitUnstage(currentFolder!, file.path);
      } else {
        window.api.gitStage(currentFolder!, file.path);
      }
      refresh();
    });

    row.appendChild(statusLetter);
    row.appendChild(fileName);
    row.appendChild(actionBtn);

    return row;
  }

  async function commit(): Promise<void> {
    const input = document.getElementById('git-commit-msg') as HTMLInputElement | null;
    if (!input || !input.value.trim() || !currentFolder) return;

    const success = await window.api.gitCommit(currentFolder, input.value.trim());
    if (success) {
      input.value = '';
      refresh();
    }
  }

  async function push(): Promise<void> {
    if (!currentFolder) return;
    await window.api.gitPush(currentFolder);
    refresh();
  }

  async function pull(): Promise<void> {
    if (!currentFolder) return;
    await window.api.gitPull(currentFolder);
    refresh();
  }

  async function fetch(): Promise<void> {
    if (!currentFolder) return;
    await window.api.gitFetch(currentFolder);
    refresh();
  }

  function showCloneDialog(): void {
    const overlay = document.createElement('div');
    overlay.className = 'git-clone-overlay';

    const dialog = document.createElement('div');
    dialog.className = 'git-clone-dialog';

    const title = document.createElement('div');
    title.className = 'git-clone-title';
    title.textContent = 'Clone Repository';

    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.className = 'git-clone-input';
    urlInput.placeholder = 'https://github.com/user/repo or https://gitlab.com/user/repo';

    const destInput = document.createElement('input');
    destInput.type = 'text';
    destInput.className = 'git-clone-input';
    destInput.placeholder = 'Destination folder (optional)';

    const btnRow = document.createElement('div');
    btnRow.className = 'git-clone-btns';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'git-clone-btn-cancel';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', function () {
      overlay.remove();
    });

    const cloneBtn = document.createElement('button');
    cloneBtn.className = 'git-clone-btn-go';
    cloneBtn.textContent = 'Clone';
    cloneBtn.addEventListener('click', async function () {
      const url = urlInput.value.trim();
      if (!url) return;
      const dest = destInput.value.trim() || '.';
      const success = await window.api.gitClone(url, dest);
      if (success) {
        overlay.remove();
        refresh();
      }
    });

    btnRow.appendChild(cancelBtn);
    btnRow.appendChild(cloneBtn);

    dialog.appendChild(title);
    dialog.appendChild(urlInput);
    dialog.appendChild(destInput);
    dialog.appendChild(btnRow);
    overlay.appendChild(dialog);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) overlay.remove();
    });
    document.body.appendChild(overlay);
    urlInput.focus();
  }

  return { init, show, hide, toggle, refresh, setFolder, commit, push, pull, fetch, showCloneDialog };
})();
