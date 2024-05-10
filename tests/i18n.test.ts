// Usando Vitest y React Testing Library
import { describe, expect, it } from "vitest";
import { getI18N } from "../src/i18n";
import { getLang } from "../src/i18n/utils";

describe("CodeEditor Localization", () => {
  it("renders the run button with language (gl)", () => {
    const i18n = getI18N({ currentLocale: "gl" });
    expect(i18n.t("ContextualMenu.newFile")).toBe("Crear arquivo...");
  });

  it("renders the run button with  language (es)", () => {
    const i18n = getI18N({ currentLocale: "es" });
    expect(i18n.t("ContextualMenu.newFile")).toBe("Crear archivo...");
  });

  it("renders the run button with default language (gl)", () => {
    const a = getLang();
    const i18n = getI18N({ currentLocale: getLang() });
    expect(i18n.t("ContextualMenu.newFile")).toBe("Crear arquivo...");
  });
});
