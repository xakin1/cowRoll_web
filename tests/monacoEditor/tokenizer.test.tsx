// tests/tokenizer.test.js
import { describe, expect, it } from "vitest";
import { tokenize } from "../mocks/tokenizer";

describe("Tokenizer functionality", () => {
  it("should tokenize a simple function declaration correctly", () => {
    const code = `function generar_ficha(nombre) do`;
    const tokens = tokenize(code);

    // Enhanced logging for debugging
    console.log(JSON.stringify(tokens, null, 2));

    expect(tokens).toEqual([
      { type: "keyword", value: "function" },
      { type: "function_name", value: "generar_ficha" },
      { type: "bracket", value: "(" },
      { type: "parameter", value: "nombre" },
      { type: "bracket", value: ")" },
      { type: "keyword", value: "do" },
    ]);
  });
});
