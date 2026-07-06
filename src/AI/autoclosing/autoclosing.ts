window.Autoclosing = (() => {
  function init(): void {
    if (typeof monaco === 'undefined') return;

    var commonPairs = [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
      { open: '`', close: '`' },
    ];

    monaco.languages.setLanguageConfiguration('jsonl', {
      comments: { lineComment: '//' },
      brackets: [['{', '}'], ['[', ']'], ['(', ')']],
      autoClosingPairs: commonPairs,
      surroundingPairs: commonPairs,
    });

    monaco.languages.setLanguageConfiguration('json', {
      comments: { lineComment: '//' },
      brackets: [['{', '}'], ['[', ']'], ['(', ')']],
      autoClosingPairs: commonPairs,
      surroundingPairs: commonPairs,
    });

    monaco.languages.setLanguageConfiguration('javascript', {
      comments: { lineComment: '//', blockComment: ['/*', '*/'] },
      brackets: [['{', '}'], ['[', ']'], ['(', ')']],
      autoClosingPairs: commonPairs,
      surroundingPairs: commonPairs,
    });

    monaco.languages.setLanguageConfiguration('typescript', {
      comments: { lineComment: '//', blockComment: ['/*', '*/'] },
      brackets: [['{', '}'], ['[', ']'], ['(', ')']],
      autoClosingPairs: commonPairs,
      surroundingPairs: commonPairs,
    });

    monaco.languages.setLanguageConfiguration('html', {
      comments: { blockComment: ['<!--', '-->'] },
      brackets: [['<', '>'], ['{', '}'], ['[', ']'], ['(', ')']],
      autoClosingPairs: [
        { open: '<', close: '>' },
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
        { open: '`', close: '`' },
      ],
      surroundingPairs: [
        { open: '<', close: '>' },
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
        { open: '`', close: '`' },
      ],
    });

    monaco.languages.setLanguageConfiguration('css', {
      comments: { blockComment: ['/*', '*/'] },
      brackets: [['{', '}'], ['[', ']'], ['(', ')']],
      autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
      ],
      surroundingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
      ],
    });

    //TODO: add language-specific autoclosing rules for XML, YAML, Python, etc.
  }

  return { init };
})();
