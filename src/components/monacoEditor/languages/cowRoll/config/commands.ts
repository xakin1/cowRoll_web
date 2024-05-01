// editorCommands.ts
import type { editor as EditorType } from "monaco-editor";
import store from "../../../../../redux/store";
import type { monaco } from "../../../../../utils/types/codeEditorType";

export const setupEditorCommands = (
  editor: EditorType.IStandaloneCodeEditor,
  monaco: typeof import("monaco-editor")
) => {
  // Comando para guardar el documento
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, function () {
    saveDocument(editor, monaco);
  });

  // Comando para mover líneas hacia arriba
  editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.UpArrow, function () {
    editor.trigger("keyboard", "editor.action.moveLinesUpAction", {});
  });

  // Comando para mover líneas hacia abajo
  editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.DownArrow, function () {
    editor.trigger("keyboard", "editor.action.moveLinesDownAction", {});
  });
  // Comando para comentar líneas
  editor.addCommand(
    monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Digit7,
    function () {
      const selection = editor.getSelection();
      const model = editor.getModel();

      if (selection && model) {
        const startLine = selection.startLineNumber;
        const endLine = selection.endLineNumber;

        // Si solo hay una línea seleccionada, usar '#' para comentar
        if (startLine === endLine) {
          const startColumn = model.getLineFirstNonWhitespaceColumn(startLine);
          const textInsert = model
            .getLineContent(startLine)
            .trim()
            .startsWith("#")
            ? ""
            : "# ";
          model.pushEditOperations(
            [],
            [
              {
                range: new monaco.Range(startLine, 1, startLine, 1),
                text: textInsert,
                forceMoveMarkers: true,
              },
            ],
            () => null
          );
        } else {
          // Si hay varias líneas seleccionadas, usar '/* */' para comentar el bloque
          const startColumn = model.getLineFirstNonWhitespaceColumn(startLine);
          const endColumn =
            model.getLineLastNonWhitespaceColumn(endLine) ||
            model.getLineMaxColumn(endLine);

          const operations = [];

          // Insertar '/*' al inicio del bloque seleccionado
          operations.push({
            range: new monaco.Range(
              startLine,
              startColumn,
              startLine,
              startColumn
            ),
            text: "/* ",
            forceMoveMarkers: true,
          });

          // Insertar '*/' al final del bloque seleccionado
          operations.push({
            range: new monaco.Range(endLine, endColumn, endLine, endColumn),
            text: " */",
            forceMoveMarkers: true,
          });

          model.pushEditOperations([], operations, () => null);
        }
      }
    }
  );
};

const saveDocument = async (
  editor: EditorType.IStandaloneCodeEditor,
  monaco: monaco
) => {
  let code = editor.getValue(); // Obtiene el contenido actual del editor

  // Realiza la autoindentación
  try {
    const response = await fetch("http://localhost:4000/api/saveCode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });
    if (response.ok) {
      const data = await response.json();
      store.dispatch(addCompileErrors(data));
    } else {
      console.error("Failed to save the document.");
    }
  } catch (error) {
    console.error("Error saving document:", error);
  }
};
function addCompileErrors(data: any): any {
  throw new Error("Function not implemented.");
}
