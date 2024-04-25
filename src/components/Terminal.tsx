import CodeEditor from "./codeEditor/CodeEditor.js";

import { useAppSelector } from "../hooks/customHooks.js";
import { getI18N } from "../i18n/index.js";
import { getLang } from "../i18n/utils.js";

function Terminal() {
  const formatOutput = (text: string) => {
    if (typeof text == "string") {
      return text.replace(/\\n/g, "\n");
    }
  };
  const output = String(useAppSelector((state) => state.code.output));

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
