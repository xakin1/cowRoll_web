import { useAppDispatch, useAppSelector } from "../../../hooks/customHooks.js";
import { getI18N } from "../../../i18n/index.js";
import { getLang } from "../../../i18n/utils.js";
import { addOutput } from "../../../redux/slice/codeSlide.js";
import type { RootState } from "../../../redux/store.js";
import { executeCode } from "../../../services/codeApi.js";
import type { CodeError } from "../../../utils/types/ApiTypes.js";
import CodeEditor from "../monacoEditor/codeEditor.js";
import Sidebar from "../sideBar/SideBar.js";
import "./terminal.css";

function Terminal() {
  const file = useAppSelector(
    (state: RootState) => state.directorySystem.selectedFile
  );

  const dispatch = useAppDispatch();

  const formatJson = (data: Object) => {
    try {
      const formattedJson = JSON.stringify(data, null, 2); // Formatea el JSON
      return (
        <pre style={{ whiteSpace: "pre-wrap", color: "lightgray" }}>
          {formattedJson}
        </pre>
      );
    } catch (error) {
      return (
        <span style={{ color: "red" }}>Error: Could not display object.</span>
      );
    }
  };

  const formatError = (error: string) => {
    return <span style={{ color: "red" }}>{error}</span>;
  };

  const formatOutput = (data: any, error: CodeError) => {
    if (error.errorCode) {
      return formatError(error.errorCode);
    } else if (error.error && !error.errorCode) {
      return formatError(error.error);
    } else if (typeof data === "string") {
      return data.replace(/\\n/g, "\n");
    } else if (typeof data === "object" && data !== null) {
      return formatJson(data);
    } else if (typeof data === "number") {
      return data.toString();
    }
    return "Unsupported data type";
  };
  const output = useAppSelector((state) => state.code.output);

  const { error } = useAppSelector((state: RootState) => state.code);

  const handleExecuteClick = async () => {
    const response = await executeCode(file?.content || "");
    if (response) {
      dispatch(addOutput(response));
    }
  };

  const currentLocale = getLang();
  const i18n = getI18N({ currentLocale });

  return (
    <div className="container-page">
      <Sidebar></Sidebar>
      <main className="container">
        <section className="section editorSection">
          <header className="header">
            <h1>{i18n.Code.code}</h1>
            <button
              className="run-button"
              onClick={handleExecuteClick}
              aria-label="Ejecutar código en el editor"
            >
              {i18n.Code.run}
            </button>
          </header>
          {file ? (
            <CodeEditor {...file}></CodeEditor>
          ) : (
            <span> Seleccione un fichero</span>
          )}
        </section>
        <section className="section">
          <header className="header">
            <h1>{i18n.Code.output}</h1>
          </header>
          <div
            aria-label="Code Output"
            id="OutputDisplay"
            className="output-area"
          >
            {formatOutput(output, error)}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Terminal;
