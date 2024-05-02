import Editor, { type OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/customHooks";
import { addCode } from "../../redux/slice/codeSlide";
import type { RootState } from "../../redux/store";
import type { monaco } from "../../utils/types/codeEditorType";
import { setupEditorCommands } from "./languages/cowRoll/config/commands";
import { setupLanguageFeatures } from "./languages/cowRoll/config/configuration";
import { loadSuggestions } from "./languages/cowRoll/config/suggestions";
import defineCowRollLanguage from "./languages/cowRoll/language";
import defineDarkTheme from "./languages/cowRoll/themes/dark";
import defineLightTheme from "./languages/cowRoll/themes/light";

const CodeEditor = () => {
  const [theme, setTheme] = useState(
    window.localStorage.getItem("theme") || "dark"
  );
  const monacoRef = useRef<monaco | null>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const { code, error } = useAppSelector((state: RootState) => state.code);

  const dispatch = useAppDispatch();

  const applyTheme = (monaco: monaco) => {
    theme === "dark" ? defineDarkTheme(monaco) : defineLightTheme(monaco);
    monaco.editor.setTheme(theme === "dark" ? "cowRollDark" : "cowRollLight");
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    defineCowRollLanguage(monaco);
    applyTheme(monaco);
    monacoRef.current = monaco;
    editorRef.current = editor;
    loadSuggestions(monaco);
    setupEditorCommands(editor, monaco);
    setupLanguageFeatures(monaco);
  };

  //Función que se encarga de poner los fallos
  const updateEditorMarkers = () => {
    if (editorRef.current && monacoRef.current) {
      const model = editorRef.current.getModel();

      if (model) {
        // No depende exclusivamente de error.errorCode para proceder
        const markers = error.errorCode
          ? [
              {
                startLineNumber: error.line || 1,
                startColumn: 1,
                endLineNumber: error.line || 1,
                endColumn: model.getLineLength(error.line || 1) || 1,
                severity: monacoRef.current.MarkerSeverity.Error,
                message: error.errorCode,
              },
            ]
          : []; // Si no hay errores, envía una lista vacía para limpiar los marcadores

        monacoRef.current.editor.setModelMarkers(model, "owner", markers);
      }
    }
  };

  useEffect(() => {
    updateEditorMarkers();
  }, [error]);

  //Actualiza el tema del editor cuando se detecta un cambio en el tema
  useEffect(() => {
    if (monacoRef.current) {
      applyTheme(monacoRef.current);
    }
  }, [theme]);

  //Detecta cuando externamente se cambia el tema y setea theme
  useEffect(() => {
    const handleThemeChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ theme: string }>;
      const newTheme = customEvent.detail.theme;
      setTheme(newTheme);
    };

    document.addEventListener("themeChanged", handleThemeChange);

    return () => {
      document.removeEventListener("themeChanged", handleThemeChange);
    };
  }, []);

  return (
    <Editor
      defaultLanguage="cowRoll"
      onChange={(value, event) => {
        dispatch(addCode(value));
      }}
      defaultValue={code}
      onMount={handleEditorDidMount}
    />
  );
};

export default CodeEditor;
