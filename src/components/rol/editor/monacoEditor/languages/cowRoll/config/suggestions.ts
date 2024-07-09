export const loadSuggestions = (monaco: typeof import("monaco-editor")) => {
  monaco.languages.registerCompletionItemProvider("cowRoll", {
    provideCompletionItems: (model, position) => {
      // Obtiene la palabra en la posición del cursor
      const word = model.getWordUntilPosition(position);
      const defaultRange = {
        startLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endLineNumber: position.lineNumber,
        endColumn: word.endColumn,
      };

      const suggestions = [
        {
          label: "function",
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: "function ${1:name}() do\n\t$0\nend",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: defaultRange,
          documentation: "Define a new function",
        },
        {
          label: "if",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "if (${1:condition}) then\n\t$0\nend",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: defaultRange,
          documentation: "If statement",
        },
        {
          label: "for",
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: "for ${1:variable} <- ${2:range} do\n\t$0\nend",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: defaultRange,
          documentation: "For loop",
        },
      ];

      return { suggestions };
    },
  });
};
