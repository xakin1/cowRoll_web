// Usando Vitest y React Testing Library
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CodeEditor from "../src/components/codeEditor/CodeEditor";
import * as i18nUtils from "../src/i18n/utils"; // Import the module to mock specific functions
import { setupStore, type AppStore } from "./setup";

describe("CodeEditor Localization", () => {
  let store: AppStore;
  beforeEach(() => {
    store = setupStore({
      code: { code: '"hello world"', output: "", error: "" },
    });
  });

  it("renders the run button with default language (gl)", () => {
    render(
      <Provider store={store}>
        <CodeEditor />
      </Provider>
    );
    const runButton = screen.getByRole("button", {
      name: "Ejecutar código en el editor",
    });
    expect(runButton.textContent).toBe("Executar");
  });

  it("renders the run button with default language (en)", () => {
    const getLangMock = vi.spyOn(i18nUtils, "getLang").mockReturnValue("en");

    render(
      <Provider store={store}>
        <CodeEditor />
      </Provider>
    );
    const runButton = screen.getByRole("button", {
      name: "Ejecutar código en el editor",
    });
    expect(runButton.textContent).toBe("Run");
    getLangMock.mockRestore();
  });
});
