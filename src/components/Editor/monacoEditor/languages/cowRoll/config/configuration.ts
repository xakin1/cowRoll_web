import type { monaco } from "../../../../../utils/types/codeEditorType";

export const setupLanguageFeatures = (monaco: monaco) => {
  monaco.languages.setLanguageConfiguration("cowRoll", {
    comments: {
      lineComment: "#",
      blockComment: ["/*", "*/"],
    },
    brackets: [
      ["{", "}"],
      ["[", "]"],
      ["(", ")"],
    ],
    autoClosingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: "do", close: "end" },
      { open: "then", close: "end" },
      { open: "'", close: "'", notIn: ["string", "comment"] },
      { open: '"', close: '"', notIn: ["string"] },
      { open: "`", close: "`", notIn: ["string", "comment"] },
      { open: "/**", close: " */", notIn: ["string"] },
    ],
    autoCloseBefore: ";:.,=}])>` \n\t",
    surroundingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: "'", close: "'" },
      { open: '"', close: '"' },
      { open: "`", close: "`" },
    ],
    folding: {
      markers: {
        start: new RegExp("^\\s*//\\s*#?region\\b"),
        end: new RegExp("^\\s*//\\s*#?endregion\\b"),
      },
    },
    wordPattern: /(-?\d*\.\d\w*)|([^\`~!@#%^&*()-=+\[\{\]\}\\|;:'",.<>\/?\s]+)/,
    indentationRules: {
      increaseIndentPattern:
        /^((?!\/\/).)*(?:\{[^}\"'`]*|\([^)\"'`]*|\[[^\]\"'`]*)$/,
      decreaseIndentPattern: /^((?!.*?\/\*).*\*\/)?\s*[\)\}\]].*$/,
    },
  });
};
