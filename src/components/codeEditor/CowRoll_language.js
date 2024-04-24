import CodeMirror from 'codemirror';
import 'codemirror/addon/mode/simple.js'; // Importa el addon necesario para defineSimpleMode


CodeMirror.defineSimpleMode("cowRoll", {
  start: [
    // String literals with both single and double quotes, supporting escaped characters
    { regex: /'(?:[^\n\\]|\\.)*'/, token: "string" },
    { regex: /"(?:[^\n\\]|\\.)*"/, token: "string" },

    // Handling whitespace and newlines
    { regex: /[\s]+/, token: "whitespace" },
    { regex: /\n/, token: "jump" },

    // Keywords and atoms (true/false)
    { regex: /\b(if|function|then|else|elseif|for|do|end|true|false)\b/, token: (match) => match[1] === 'true' || match[1] === 'false' ? 'atom' : 'keyword' },

    // Logical operators
    { regex: /\b(and|or|not)\b/, token: "operator" },

    // Brackets and parentheses
    { regex: /[\(\)\[\]\{\}]/, token: "bracket" },

    // Identifiers including special characters specific to language locale
    { regex: /[a-zA-Z_áéíóúÁÉÍÓÚüÜñÑ]+[a-zA-Z0-9_áéíóúÁÉÍÓÚüÜñÑ]*/, token: "variable" },

    // Numbers, including ranges and potentially negative numbers
    { regex: /-?\s*[0-9]+(?:\.\.[0-9]+)?/, token: "number" },
    
    // Single-line comments starting with '%'
    { regex: /%.*/, token: "comment" },
  ],
});
