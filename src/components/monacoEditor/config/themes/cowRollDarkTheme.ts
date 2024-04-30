function defineDarkTheme(monaco: typeof import("monaco-editor")) {
  monaco.editor.defineTheme("cowRollDark", {
    base: "vs-dark", // base oscura
    inherit: true,
    rules: [
      { token: "comment", foreground: "5c6370", fontStyle: "italic" },
      { token: "keyword", foreground: "c678dd", fontStyle: "bold" },
      { token: "number", foreground: "d19a66" },
      { token: "string", foreground: "98c379" },
      { token: "operator", foreground: "56b6c2" },
      { token: "identifier", foreground: "e06c75" },
    ],
    colors: {
      "editor.foreground": "#ABB2BF",
      "editor.background": "#282C34",
      "editorCursor.foreground": "#528BFF",
      "editor.lineHighlightBackground": "#2C313A",
      "editorLineNumber.foreground": "#636D83",
      "editor.selectionBackground": "#3E4451",
      "editor.inactiveSelectionBackground": "#3A3F4B",
    },
  });
}

export default defineDarkTheme;
