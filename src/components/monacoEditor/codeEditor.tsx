import Editor, { type OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/customHooks";
import { addCode } from "../../redux/slice/codeSlide";
import type { RootState } from "../../redux/store";
import type { monaco } from "../../utils/types/codeEditorType";
import { loadSuggestions } from "./config/suggestions/cowRollSuggestions";
import defineDarkTheme from "./config/themes/cowRollDarkTheme";
import defineLightTheme from "./config/themes/cowRollLightTheme";
import defineCustomLanguage from "./cowRollLanguage";

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
    defineCustomLanguage(monaco);
    applyTheme(monaco);
    monacoRef.current = monaco;
    editorRef.current = editor;
    loadSuggestions(monaco);
  };

  //Función que se encarga de poner los fallos
  const updateEditorMarkers = () => {
    if (editorRef.current && monacoRef.current && error.errorCode) {
      const model = editorRef.current.getModel();

      if (model) {
        const markers = [
          {
            startLineNumber: error.line || 1,
            startColumn: 1,
            endLineNumber: error.line || 1,
            endColumn: model.getLineLength(error.line || 1) || 1,
            severity: monacoRef.current.MarkerSeverity.Error,
            message: error.errorCode,
          },
        ];

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
      width="100%"
      height="80vh"
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
