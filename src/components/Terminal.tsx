import CodeEditor from "./codeMirror/CodeEditor.js";

import { useAppDispatch, useAppSelector } from "../hooks/customHooks.js";
import { getI18N } from "../i18n/index.js";
import { getLang } from "../i18n/utils.js";
import type { RootState } from "../redux/store.js";
import { addOutput } from "./codeMirror/codeSlide.js";

function Terminal() {
  const formatOutput = (text: string) => {
    if (typeof text == "string") {
      return text.replace(/\\n/g, "\n");
    }
  };
  const output = String(useAppSelector((state) => state.code.output));

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
