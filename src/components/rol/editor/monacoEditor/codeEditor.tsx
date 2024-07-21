import Editor, { type OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/customHooks";
import { selectFile } from "../../../../redux/slice/DirectorySystemSlice";
import {
  addCompileErrors,
  clearErrors,
} from "../../../../redux/slice/codeSlice";
import type { RootState } from "../../../../redux/store";
import { saveFile } from "../../../../services/codeApi";
import {
  isFetchCodeError,
  type CodeProps,
} from "../../../../utils/types/ApiTypes";
import type { monaco } from "../../../../utils/types/codeEditorType";
import { setupEditorCommands } from "./languages/cowRoll/config/commands";
import { setupLanguageFeatures } from "./languages/cowRoll/config/configuration";
import { loadSuggestions } from "./languages/cowRoll/config/suggestions";
import defineCowRollLanguage from "./languages/cowRoll/language";
import defineDarkTheme from "./languages/cowRoll/themes/dark";
import defineLightTheme from "./languages/cowRoll/themes/light";

const CodeEditor = (file: CodeProps) => {
  const [theme, setTheme] = useState(
    window.localStorage.getItem("theme") || "dark"
  );

  const monacoRef = useRef<monaco | null>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const { error } = useAppSelector((state: RootState) => state.code);

  const dispatch = useAppDispatch();

  const saveDocumentRef = useRef<(file: CodeProps) => void>();

  // Define the saveDocument function
  saveDocumentRef.current = async (file: CodeProps) => {
    const response = await saveFile(file);
    if (isFetchCodeError(response)) dispatch(addCompileErrors(response));
    else dispatch(clearErrors());
  };

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
    setupLanguageFeatures(monaco);
    setupEditorCommands(editor, monaco);
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

  useEffect(() => {
    if (editorRef.current) {
      if (monacoRef.current) {
        editorRef.current.addCommand(
          monacoRef.current.KeyMod.CtrlCmd | monacoRef.current.KeyCode.KeyS,
          () => {
            if (saveDocumentRef.current && file) {
              saveDocumentRef.current(file);
            }
          }
        );

        if (file.content !== editorRef.current.getValue()) {
          editorRef.current.setValue(file.content || "");
        }
      }
    }
  }, [file]);

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
        dispatch(
          selectFile({
            ...file,
            content: value || "",
          })
        );
      }}
      defaultValue={file.content}
      onMount={handleEditorDidMount}
    />
  );
};

export default CodeEditor;
