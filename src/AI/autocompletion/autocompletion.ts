window.Autocompletion = (() => {
  let enabled = true;

  function init(): void {
    if (typeof monaco === 'undefined') return;
    loadConfig();
    registerHtmlCompletion();
    registerCssCompletion();
    //TODO: add JavaScript/TypeScript completion providers (snippets, keyword suggestions)
    //TODO: add JSON/JSONL completion providers (schema-based suggestions)
    //TODO: add AI-powered completion (context-aware suggestions from codebase analysis)
  }

  async function loadConfig(): Promise<void> {
    try {
      const config = await window.api.getConfig();
      const cfg = config as Record<string, unknown>;
      enabled = cfg.aiAutocompletion !== false;
    } catch {
      // Non-critical — default to enabled
    }
  }

  function setEnabled(value: boolean): void {
    enabled = value;
  }

  function registerHtmlCompletion(): void {
    const htmlTags = [
      { tag: 'a', desc: 'Anchor link' },
      { tag: 'abbr', desc: 'Abbreviation' },
      { tag: 'address', desc: 'Contact information' },
      { tag: 'article', desc: 'Self-contained content' },
      { tag: 'aside', desc: 'Sidebar content' },
      { tag: 'audio', desc: 'Audio player' },
      { tag: 'b', desc: 'Bold text' },
      { tag: 'blockquote', desc: 'Block quotation' },
      { tag: 'body', desc: 'Document body' },
      { tag: 'br', desc: 'Line break' },
      { tag: 'button', desc: 'Clickable button' },
      { tag: 'canvas', desc: 'Canvas for drawing' },
      { tag: 'caption', desc: 'Table caption' },
      { tag: 'code', desc: 'Inline code' },
      { tag: 'col', desc: 'Table column' },
      { tag: 'colgroup', desc: 'Table column group' },
      { tag: 'data', desc: 'Machine-readable data' },
      { tag: 'datalist', desc: 'Predefined options for input' },
      { tag: 'dd', desc: 'Description detail' },
      { tag: 'del', desc: 'Deleted text' },
      { tag: 'details', desc: 'Disclosure widget' },
      { tag: 'dfn', desc: 'Definition term' },
      { tag: 'dialog', desc: 'Dialog box' },
      { tag: 'div', desc: 'Generic container' },
      { tag: 'dl', desc: 'Description list' },
      { tag: 'dt', desc: 'Description term' },
      { tag: 'em', desc: 'Emphasized text' },
      { tag: 'embed', desc: 'External content' },
      { tag: 'fieldset', desc: 'Form field grouping' },
      { tag: 'figcaption', desc: 'Figure caption' },
      { tag: 'figure', desc: 'Figure with caption' },
      { tag: 'footer', desc: 'Footer section' },
      { tag: 'form', desc: 'Form container' },
      { tag: 'h1', desc: 'Heading level 1' },
      { tag: 'h2', desc: 'Heading level 2' },
      { tag: 'h3', desc: 'Heading level 3' },
      { tag: 'h4', desc: 'Heading level 4' },
      { tag: 'h5', desc: 'Heading level 5' },
      { tag: 'h6', desc: 'Heading level 6' },
      { tag: 'head', desc: 'Document head' },
      { tag: 'header', desc: 'Header section' },
      { tag: 'hr', desc: 'Horizontal rule' },
      { tag: 'html', desc: 'Root element' },
      { tag: 'i', desc: 'Italic text' },
      { tag: 'iframe', desc: 'Inline frame' },
      { tag: 'img', desc: 'Image' },
      { tag: 'input', desc: 'Input field' },
      { tag: 'ins', desc: 'Inserted text' },
      { tag: 'kbd', desc: 'Keyboard input' },
      { tag: 'label', desc: 'Input label' },
      { tag: 'legend', desc: 'Fieldset legend' },
      { tag: 'li', desc: 'List item' },
      { tag: 'link', desc: 'External resource link' },
      { tag: 'main', desc: 'Main content' },
      { tag: 'map', desc: 'Image map' },
      { tag: 'mark', desc: 'Highlighted text' },
      { tag: 'meta', desc: 'Metadata' },
      { tag: 'nav', desc: 'Navigation section' },
      { tag: 'noscript', desc: 'No-script fallback' },
      { tag: 'object', desc: 'Embedded object' },
      { tag: 'ol', desc: 'Ordered list' },
      { tag: 'optgroup', desc: 'Option group' },
      { tag: 'option', desc: 'Select option' },
      { tag: 'output', desc: 'Calculation output' },
      { tag: 'p', desc: 'Paragraph' },
      { tag: 'param', desc: 'Object parameter' },
      { tag: 'picture', desc: 'Responsive image container' },
      { tag: 'pre', desc: 'Preformatted text' },
      { tag: 'progress', desc: 'Progress bar' },
      { tag: 'q', desc: 'Inline quotation' },
      { tag: 'samp', desc: 'Sample output' },
      { tag: 'script', desc: 'Script element' },
      { tag: 'section', desc: 'Section container' },
      { tag: 'select', desc: 'Dropdown selector' },
      { tag: 'small', desc: 'Small text' },
      { tag: 'source', desc: 'Media source' },
      { tag: 'span', desc: 'Inline container' },
      { tag: 'strong', desc: 'Strong text' },
      { tag: 'style', desc: 'Style element' },
      { tag: 'sub', desc: 'Subscript' },
      { tag: 'summary', desc: 'Details summary' },
      { tag: 'sup', desc: 'Superscript' },
      { tag: 'table', desc: 'Table container' },
      { tag: 'tbody', desc: 'Table body' },
      { tag: 'td', desc: 'Table cell' },
      { tag: 'template', desc: 'Template element' },
      { tag: 'textarea', desc: 'Text area input' },
      { tag: 'tfoot', desc: 'Table footer' },
      { tag: 'th', desc: 'Table header cell' },
      { tag: 'thead', desc: 'Table header' },
      { tag: 'time', desc: 'Time element' },
      { tag: 'title', desc: 'Document title' },
      { tag: 'tr', desc: 'Table row' },
      { tag: 'track', desc: 'Text track' },
      { tag: 'u', desc: 'Underlined text' },
      { tag: 'ul', desc: 'Unordered list' },
      { tag: 'var', desc: 'Variable text' },
      { tag: 'video', desc: 'Video player' },
      { tag: 'wbr', desc: 'Word break opportunity' },
    ];

    monaco.languages.registerCompletionItemProvider('html', {
      provideCompletionItems: function (model: any, position: any) {
        if (!enabled) return { suggestions: [] };

        const textUntilPosition = model.getValueInRange({
          startLineNumber: position.lineNumber,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });

        const lastChar = textUntilPosition.slice(-1);
        if (lastChar !== '<') return { suggestions: [] };

        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const suggestions = htmlTags.map(function (item) {
          return {
            label: item.tag,
            kind: monaco.languages.CompletionItemKind.Snippet,
            detail: 'HTML tag',
            documentation: item.desc,
            insertText: item.tag + '>$1</' + item.tag + '>',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range,
          };
        });

        return { suggestions: suggestions };
      },
    });
  }

  function registerCssCompletion(): void {
    const cssProperties = [
      { prop: 'align-content', desc: 'Alignment of flex lines' },
      { prop: 'align-items', desc: 'Alignment of flex items' },
      { prop: 'align-self', desc: 'Self alignment for flex items' },
      { prop: 'all', desc: 'Reset all properties' },
      { prop: 'animation', desc: 'Shorthand for animation properties' },
      { prop: 'animation-delay', desc: 'Delay before animation starts' },
      { prop: 'animation-direction', desc: 'Animation direction' },
      { prop: 'animation-duration', desc: 'Animation duration' },
      { prop: 'animation-fill-mode', desc: 'Animation fill mode' },
      { prop: 'animation-iteration-count', desc: 'Animation repeat count' },
      { prop: 'animation-name', desc: 'Animation name' },
      { prop: 'animation-play-state', desc: 'Animation play state' },
      { prop: 'animation-timing-function', desc: 'Animation timing function' },
      { prop: 'backface-visibility', desc: 'Back face visibility in 3D' },
      { prop: 'background', desc: 'Shorthand for background properties' },
      { prop: 'background-attachment', desc: 'Background attachment behavior' },
      { prop: 'background-blend-mode', desc: 'Background blend mode' },
      { prop: 'background-clip', desc: 'Background painting area' },
      { prop: 'background-color', desc: 'Background color' },
      { prop: 'background-image', desc: 'Background image' },
      { prop: 'background-origin', desc: 'Background positioning area' },
      { prop: 'background-position', desc: 'Background position' },
      { prop: 'background-repeat', desc: 'Background repeat behavior' },
      { prop: 'background-size', desc: 'Background size' },
      { prop: 'border', desc: 'Shorthand for border properties' },
      { prop: 'border-bottom', desc: 'Bottom border' },
      { prop: 'border-bottom-color', desc: 'Bottom border color' },
      { prop: 'border-bottom-left-radius', desc: 'Bottom-left border radius' },
      { prop: 'border-bottom-right-radius', desc: 'Bottom-right border radius' },
      { prop: 'border-bottom-style', desc: 'Bottom border style' },
      { prop: 'border-bottom-width', desc: 'Bottom border width' },
      { prop: 'border-collapse', desc: 'Table border collapse' },
      { prop: 'border-color', desc: 'Border color' },
      { prop: 'border-image', desc: 'Border image' },
      { prop: 'border-left', desc: 'Left border' },
      { prop: 'border-left-color', desc: 'Left border color' },
      { prop: 'border-left-style', desc: 'Left border style' },
      { prop: 'border-left-width', desc: 'Left border width' },
      { prop: 'border-radius', desc: 'Border radius' },
      { prop: 'border-right', desc: 'Right border' },
      { prop: 'border-right-color', desc: 'Right border color' },
      { prop: 'border-right-style', desc: 'Right border style' },
      { prop: 'border-right-width', desc: 'Right border width' },
      { prop: 'border-spacing', desc: 'Table border spacing' },
      { prop: 'border-style', desc: 'Border style' },
      { prop: 'border-top', desc: 'Top border' },
      { prop: 'border-top-color', desc: 'Top border color' },
      { prop: 'border-top-left-radius', desc: 'Top-left border radius' },
      { prop: 'border-top-right-radius', desc: 'Top-right border radius' },
      { prop: 'border-top-style', desc: 'Top border style' },
      { prop: 'border-top-width', desc: 'Top border width' },
      { prop: 'border-width', desc: 'Border width' },
      { prop: 'bottom', desc: 'Bottom position' },
      { prop: 'box-shadow', desc: 'Box shadow' },
      { prop: 'box-sizing', desc: 'Box sizing model' },
      { prop: 'clear', desc: 'Clear floating elements' },
      { prop: 'clip', desc: 'Clip region' },
      { prop: 'color', desc: 'Text color' },
      { prop: 'column-count', desc: 'Number of columns' },
      { prop: 'column-fill', desc: 'Column fill behavior' },
      { prop: 'column-gap', desc: 'Gap between columns' },
      { prop: 'column-rule', desc: 'Column rule' },
      { prop: 'column-rule-color', desc: 'Column rule color' },
      { prop: 'column-rule-style', desc: 'Column rule style' },
      { prop: 'column-rule-width', desc: 'Column rule width' },
      { prop: 'column-span', desc: 'Column span' },
      { prop: 'column-width', desc: 'Column width' },
      { prop: 'columns', desc: 'Shorthand for columns' },
      { prop: 'content', desc: 'Generated content' },
      { prop: 'counter-increment', desc: 'Counter increment' },
      { prop: 'counter-reset', desc: 'Counter reset' },
      { prop: 'cursor', desc: 'Mouse cursor type' },
      { prop: 'direction', desc: 'Text direction' },
      { prop: 'display', desc: 'Display type' },
      { prop: 'empty-cells', desc: 'Empty cell display' },
      { prop: 'filter', desc: 'Image filter effects' },
      { prop: 'flex', desc: 'Shorthand for flex properties' },
      { prop: 'flex-basis', desc: 'Flex basis size' },
      { prop: 'flex-direction', desc: 'Flex direction' },
      { prop: 'flex-flow', desc: 'Shorthand for flex flow' },
      { prop: 'flex-grow', desc: 'Flex grow factor' },
      { prop: 'flex-shrink', desc: 'Flex shrink factor' },
      { prop: 'flex-wrap', desc: 'Flex wrap behavior' },
      { prop: 'float', desc: 'Float positioning' },
      { prop: 'font', desc: 'Shorthand for font properties' },
      { prop: 'font-family', desc: 'Font family' },
      { prop: 'font-size', desc: 'Font size' },
      { prop: 'font-size-adjust', desc: 'Font size adjustment' },
      { prop: 'font-stretch', desc: 'Font stretch' },
      { prop: 'font-style', desc: 'Font style' },
      { prop: 'font-variant', desc: 'Font variant' },
      { prop: 'font-weight', desc: 'Font weight' },
      { prop: 'gap', desc: 'Gap between grid/flex items' },
      { prop: 'grid', desc: 'Shorthand for grid properties' },
      { prop: 'grid-area', desc: 'Grid area' },
      { prop: 'grid-auto-columns', desc: 'Grid auto columns' },
      { prop: 'grid-auto-flow', desc: 'Grid auto flow' },
      { prop: 'grid-auto-rows', desc: 'Grid auto rows' },
      { prop: 'grid-column', desc: 'Grid column' },
      { prop: 'grid-column-end', desc: 'Grid column end' },
      { prop: 'grid-column-start', desc: 'Grid column start' },
      { prop: 'grid-row', desc: 'Grid row' },
      { prop: 'grid-row-end', desc: 'Grid row end' },
      { prop: 'grid-row-start', desc: 'Grid row start' },
      { prop: 'grid-template', desc: 'Grid template' },
      { prop: 'grid-template-areas', desc: 'Grid template areas' },
      { prop: 'grid-template-columns', desc: 'Grid template columns' },
      { prop: 'grid-template-rows', desc: 'Grid template rows' },
      { prop: 'height', desc: 'Element height' },
      { prop: 'justify-content', desc: 'Justification of flex/grid items' },
      { prop: 'justify-items', desc: 'Justification of grid items' },
      { prop: 'justify-self', desc: 'Self justification in grid' },
      { prop: 'left', desc: 'Left position' },
      { prop: 'letter-spacing', desc: 'Letter spacing' },
      { prop: 'line-height', desc: 'Line height' },
      { prop: 'list-style', desc: 'Shorthand for list style' },
      { prop: 'list-style-image', desc: 'List style image' },
      { prop: 'list-style-position', desc: 'List style position' },
      { prop: 'list-style-type', desc: 'List style type' },
      { prop: 'margin', desc: 'Margin' },
      { prop: 'margin-bottom', desc: 'Bottom margin' },
      { prop: 'margin-left', desc: 'Left margin' },
      { prop: 'margin-right', desc: 'Right margin' },
      { prop: 'margin-top', desc: 'Top margin' },
      { prop: 'max-height', desc: 'Maximum height' },
      { prop: 'max-width', desc: 'Maximum width' },
      { prop: 'min-height', desc: 'Minimum height' },
      { prop: 'min-width', desc: 'Minimum width' },
      { prop: 'opacity', desc: 'Opacity level' },
      { prop: 'order', desc: 'Flex item order' },
      { prop: 'outline', desc: 'Outline shorthand' },
      { prop: 'outline-color', desc: 'Outline color' },
      { prop: 'outline-offset', desc: 'Outline offset' },
      { prop: 'outline-style', desc: 'Outline style' },
      { prop: 'outline-width', desc: 'Outline width' },
      { prop: 'overflow', desc: 'Overflow behavior' },
      { prop: 'overflow-x', desc: 'Horizontal overflow' },
      { prop: 'overflow-y', desc: 'Vertical overflow' },
      { prop: 'padding', desc: 'Padding' },
      { prop: 'padding-bottom', desc: 'Bottom padding' },
      { prop: 'padding-left', desc: 'Left padding' },
      { prop: 'padding-right', desc: 'Right padding' },
      { prop: 'padding-top', desc: 'Top padding' },
      { prop: 'place-content', desc: 'Shorthand for align/justify content' },
      { prop: 'place-items', desc: 'Shorthand for align/justify items' },
      { prop: 'place-self', desc: 'Shorthand for align/justify self' },
      { prop: 'position', desc: 'Position type' },
      { prop: 'resize', desc: 'Resize behavior' },
      { prop: 'right', desc: 'Right position' },
      { prop: 'row-gap', desc: 'Row gap' },
      { prop: 'tab-size', desc: 'Tab character size' },
      { prop: 'table-layout', desc: 'Table layout algorithm' },
      { prop: 'text-align', desc: 'Text alignment' },
      { prop: 'text-align-last', desc: 'Last line alignment' },
      { prop: 'text-decoration', desc: 'Text decoration' },
      { prop: 'text-decoration-color', desc: 'Text decoration color' },
      { prop: 'text-decoration-line', desc: 'Text decoration line' },
      { prop: 'text-decoration-style', desc: 'Text decoration style' },
      { prop: 'text-indent', desc: 'Text indentation' },
      { prop: 'text-justify', desc: 'Text justification method' },
      { prop: 'text-overflow', desc: 'Text overflow behavior' },
      { prop: 'text-shadow', desc: 'Text shadow' },
      { prop: 'text-transform', desc: 'Text transformation' },
      { prop: 'top', desc: 'Top position' },
      { prop: 'transform', desc: '2D/3D transformation' },
      { prop: 'transform-origin', desc: 'Transform origin point' },
      { prop: 'transform-style', desc: 'Transform style' },
      { prop: 'transition', desc: 'Shorthand for transition' },
      { prop: 'transition-delay', desc: 'Transition delay' },
      { prop: 'transition-duration', desc: 'Transition duration' },
      { prop: 'transition-property', desc: 'Transition property' },
      { prop: 'transition-timing-function', desc: 'Transition timing function' },
      { prop: 'unicode-bidi', desc: 'Unicode bidirectional behavior' },
      { prop: 'vertical-align', desc: 'Vertical alignment' },
      { prop: 'visibility', desc: 'Element visibility' },
      { prop: 'white-space', desc: 'White space handling' },
      { prop: 'width', desc: 'Element width' },
      { prop: 'word-break', desc: 'Word breaking behavior' },
      { prop: 'word-spacing', desc: 'Word spacing' },
      { prop: 'word-wrap', desc: 'Word wrap behavior' },
      { prop: 'writing-mode', desc: 'Writing mode direction' },
      { prop: 'z-index', desc: 'Stacking order' },
    ];

    monaco.languages.registerCompletionItemProvider('css', {
      provideCompletionItems: function (model: any, position: any) {
        if (!enabled) return { suggestions: [] };

        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const suggestions = cssProperties.map(function (item) {
          return {
            label: item.prop,
            kind: monaco.languages.CompletionItemKind.Property,
            detail: 'CSS property',
            documentation: item.desc,
            insertText: item.prop + ': $1;',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range,
          };
        });

        return { suggestions: suggestions };
      },
    });
  }

  return { init, setEnabled };
})();
