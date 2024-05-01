// Usando Vitest y React Testing Library
import { describe, expect, it } from "vitest";

describe("CodeEditor Localization", () => {
  it("getUrlCorrectly", () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    expect(apiUrl).toBe("http://localhost:4000/");
  });
});
