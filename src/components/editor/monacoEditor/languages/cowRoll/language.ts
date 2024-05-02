import type { monaco } from "../../../../../utils/types/codeEditorType";

function defineCowRollLanguage(monaco: monaco) {
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

        // Parameters
        [
          /([a-zA-Z_áéíóúÁÉÍÓÚüÜñÑ][a-zA-Z0-9_áéíóúÁÉÍÓÚüÜñÑ]*)(\s*,\s*|\s*\))/,
          "parameter",
        ],

        // General identifiers
        [/[a-zA-Z_áéíóúÁÉÍÓÚüÜñÑ][a-zA-Z0-9_áéíóúÁÉÍÓÚüÜñÑ]*/, "identifier"],

        // Numbers
        [/[-]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/, "number"],

        // Comments
        [/#.*/, "comment"],
        [/\/\*/, "comment", "@comment"], // Empieza un comentario de bloque
      ],
      comment: [
        [/[^\/*]+/, "comment"], // Cualquier texto dentro del comentario
        [/\*\//, "comment", "@pop"], // Termina el comentario de bloque
        [/[\/*]/, "comment"], // Captura todos los otros casos dentro de los comentarios
      ],
    },
  });
}
export default defineCowRollLanguage;
