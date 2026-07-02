window.CodeFolding = (() => {
  function init(): void {
    // Folding is enabled via editor options in editor.ts
    // This module registers command palette entries for folding actions
  }

  function collapseAll(): void {
    const ed = window.editor;
    if (!ed) return;
    const action = ed.getAction('editor.foldAll');
    if (action) action.run();
  }

  function expandAll(): void {
    const ed = window.editor;
    if (!ed) return;
    const action = ed.getAction('editor.unfoldAll');
    if (action) action.run();
  }

  function toggleCurrent(): void {
    const ed = window.editor;
    if (!ed) return;
    const action = ed.getAction('editor.toggleFold');
    if (action) action.run();
  }

  function collapseLevel1(): void {
    const ed = window.editor;
    if (!ed) return;
    ed.trigger('code-folding', 'editor.foldLevel1', null);
  }

  function collapseLevel2(): void {
    const ed = window.editor;
    if (!ed) return;
    ed.trigger('code-folding', 'editor.foldLevel2', null);
  }

  return { init, collapseAll, expandAll, toggleCurrent, collapseLevel1, collapseLevel2 };
})();
