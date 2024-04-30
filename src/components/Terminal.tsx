import { useAppDispatch, useAppSelector } from "../hooks/customHooks.js";
import { getI18N } from "../i18n/index.js";
import { getLang } from "../i18n/utils.js";
import { addOutput } from "../redux/slice/codeSlide.js";
import type { RootState } from "../redux/store.js";
import CodeEditor from "./monacoEditor/codeEditor.js";

function Terminal() {
  const formatOutput = (data: any) => {
    if (typeof data === "string") {
      // Directly replace escaped new line characters with actual new line characters
      return data.replace(/\\n/g, "\n");
    } else if (typeof data === "object" && data !== null) {
      // Convert object to JSON string and make it readable
      try {
        return JSON.stringify(data, null, 2); // pretty-print JSON with 2 spaces indentation
      } catch (error) {
        return "Error: Could not display object.";
      }
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
        <textarea
          aria-label="Code Output"
          id="OutputDisplay"
          value={formatOutput(output)}
          readOnly
        />
      </section>
    </main>
  );
}

export default Terminal;
