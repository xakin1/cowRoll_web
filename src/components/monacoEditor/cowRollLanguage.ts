import type { monaco } from "../../utils/types/codeEditorType";

function defineCustomLanguage(monaco: monaco) {
  monaco.languages.register({ id: "cowRoll" });
  monaco.languages.setMonarchTokensProvider("cowRoll", {
    tokenizer: {
      root: [
        // Strings
        [/'(?:[^\\']|\\.)*'/, "string"],
        [/"(?:[^\\"]|\\.)*"/, "string"],

        // Whitespace
        [/\s+/, "white"],

        // Keywords
        [
          /\b(?:if|function|then|else|elseif|for|do|end|true|false)\b/,
          {
            cases: {
              "true|false": "atom",
              "@default": "keyword",
            },
          },
        ],

        // Operators
        [/\b(?:and|or|not)\b/, "operator"],

        // Brackets
        [/[(){}\[\]]/, "bracket"],

        // Identifiers
        [/[a-zA-Z_áéíóúÁÉÍÓÚüÜñÑ][a-zA-Z0-9_áéíóúÁÉÍÓÚüÜñÑ]*/, "identifier"],

        // Numbers
        [/[-]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/, "number"],

        // Comments
        [/%.*/, "comment"],
      ],
    },
  });
}
export default defineCustomLanguage;
