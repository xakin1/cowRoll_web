// Usando Vitest y React Testing Library
import { describe, expect, it } from "vitest";
import { getI18N } from "../src/i18n";
import { getLang } from "../src/i18n/utils";

describe("CodeEditor Localization", () => {
  it("renders the run button with default language (gl)", () => {
    const i18n = getI18N({ currentLocale: "en" });
    expect(i18n.Code.code).toBe("Code");
  });

  it("renders the run button with default language (es)", () => {
    const i18n = getI18N({ currentLocale: "fr" });
    expect(i18n.Code.code).toBe("Código");
  });

  it("renders the run button with default language (es)", () => {
    const i18n = getI18N({ currentLocale: getLang() });
    expect(i18n.Code.code).toBe("Código");
  });
});
