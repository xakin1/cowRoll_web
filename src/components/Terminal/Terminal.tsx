import { useAppDispatch, useAppSelector } from "../../hooks/customHooks.js";
import { getI18N } from "../../i18n/index.js";
import { getLang } from "../../i18n/utils.js";
import { addOutput, type Error } from "../../redux/slice/codeSlide.js";
import type { RootState } from "../../redux/store.js";
import CodeEditor from "../monacoEditor/codeEditor.jsx";
import "./terminal.css";

function Terminal() {
  const formatOutput = (data: any, error: Error) => {
    if (error.errorCode) {
      return <span style={{ color: "red" }}>{error.errorCode}</span>;
    } else if (error.error && !error.errorCode) {
      return <span style={{ color: "red" }}>{error.error}</span>;
    } else if (typeof data === "string") {
      return data.replace(/\\n/g, "\n");
    } else if (typeof data === "object" && data !== null) {
      try {
        return JSON.stringify(data, null, 2);
      } catch (error) {
        return "Error: Could not display object.";
      }
    } else if (typeof data === "number") {
      return data.toString();
    }
    return "Unsupported data type";
  };
  const output = useAppSelector((state) => state.code.output);

  const { code, error } = useAppSelector((state: RootState) => state.code);
  const dispatch = useAppDispatch();

  const handleExecuteClick = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code }),
      });
      const data = await response.json();
      dispatch(addOutput(data));
    } catch (error) {
      console.error("Execution error:", error);
    }
  };

  const currentLocale = getLang();
  const i18n = getI18N({ currentLocale });

  return (
    <main
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
        width: "100%",
        boxSizing: "border-box",
        padding: "10px",
      }}
    >
      <section>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "center",
          }}
        >
          <h1>{i18n.Code.code}</h1>
          <button
            onClick={handleExecuteClick}
            aria-label="Ejecutar código en el editor"
          >
            {i18n.Code.run}
          </button>
        </div>
        <CodeEditor></CodeEditor>
      </section>
      <section
        style={{
          display: "grid",
          gridTemplateRows: "auto 1fr",
        }}
      >
        <h1>{i18n.Code.output}</h1>
        <div
          aria-label="Code Output"
          id="OutputDisplay"
          className="output-area"
        >
          {formatOutput(output, error)}
        </div>
      </section>
    </main>
  );
}

export default Terminal;
