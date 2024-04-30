function defineLightTheme(monaco: typeof import("monaco-editor")) {
  monaco.editor.defineTheme("cowRollLight", {
    base: "vs", // base clara
    inherit: true,
    rules: [
      { token: "comment", foreground: "6a737d", fontStyle: "italic" },
      { token: "keyword", foreground: "005cc5", fontStyle: "bold" },
      { token: "number", foreground: "005cc5" },
      { token: "string", foreground: "032f62" },
      { token: "operator", foreground: "d73a49" },
      { token: "identifier", foreground: "e36209" },
    ],
    colors: {
      "editor.foreground": "#24292e",
      "editor.background": "#ffffff",
      "editorCursor.foreground": "#044289",
      "editor.lineHighlightBackground": "#f6f8fa",
      "editorLineNumber.foreground": "#959da5",
      "editor.selectionBackground": "#c8e1ff",
      "editor.inactiveSelectionBackground": "#e8eaed",
    },
  });
}

export default defineLightTheme;
