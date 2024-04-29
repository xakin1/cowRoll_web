import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it } from "vitest";
import Terminal from "../src/components/Terminal";
import CodeEditor from "../src/components/codeMirror/CodeEditor";
import { setupStore, type AppStore } from "./setup";

describe("CodeEditor Component", () => {
  let store: AppStore;

  beforeEach(() => {
    store = setupStore({
      code: {
        code: '"hello world"',
        output: "",
        error: {
          error: "",
          errorCode: "",
          line: undefined,
        },
      },
    });
  });

  it("renders CodeMirror and executes code on button click", async () => {
    render(
      <Provider store={store}>
        <CodeEditor />
      </Provider>
    );

    const button = screen.getByRole("button", {
      name: "Ejecutar código en el editor",
    });
    fireEvent.click(button);
    await waitFor(() => {
      expect(store.getState().code.output).toBe("hello world");
    });
  });

  it("renders CodeMirror and executes code on button click, should display the result in the textarea", async () => {
    render(
      <Provider store={store}>
        <Terminal></Terminal>
      </Provider>
    );

    const button = screen.getByRole("button", {
      name: "Ejecutar código en el editor",
    });
    fireEvent.click(button);
    await waitFor(() => {
      const outputArea: HTMLTextAreaElement =
        screen.getByLabelText("Code Output");
      expect(outputArea?.value).toBe("hello world");
    });
  });

  it("should save the code", async () => {
    render(
      <Provider store={store}>
        <Terminal></Terminal>
      </Provider>
    );

    // Esto realmente  tengo pensaod que sea un ctrl s pero mientras no sé como se prueba
    const button = screen.getByRole("button", {
      name: "Save the code",
    });

    await waitFor(() => {
      const outputArea: HTMLTextAreaElement =
        screen.getByLabelText("Code Output");
      expect(outputArea?.value).toBe("hello world");
    });
  });
});
