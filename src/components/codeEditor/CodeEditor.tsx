import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import { Resizable } from "re-resizable";
import { Controlled as CodeMirror } from "react-codemirror2";
import { useAppDispatch, useAppSelector } from "../../hooks/customHooks";
import { getI18N } from "../../i18n";
import { getLang } from "../../i18n/utils";
import "./CowRoll_language";
import "./Theme_cowRoll.css";
import { addCode, addOutput } from "./codeSlide";
// Importa la configuración de i18next

const CodeEditor = () => {
  const currentLocale = getLang();
  const i18n = getI18N({ currentLocale });
  //el state.code el code es el nombre que le pusimos en name en el slide
  const code = useAppSelector((state) => state.code.code);
  const dispatch = useAppDispatch();
  const handleExecuteClick = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: code }),
      });

      const data = await response.json();
      dispatch(addOutput(data));
    } catch (error) {
      //TODO
    }
  };

  return (
    <>
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
      <Resizable
        defaultSize={{
          width: "100%",
          height: "80vh",
        }}
        enable={{ top: false, right: false, bottom: false, left: false }}
      >
        <CodeMirror
          value={code}
          options={{
            mode: "cowRoll",
            theme: "cowRoll",
            lineNumbers: true,
          }}
          onBeforeChange={(editor, data, newValue) => {
            dispatch(addCode(newValue)); // Update the state on every change
          }}
        />
      </Resizable>
    </>
  );
};
export default CodeEditor;
