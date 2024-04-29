import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import { Resizable } from "re-resizable";
import React from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import { useAppDispatch, useAppSelector } from "../../hooks/customHooks";
import type { RootState } from "../../redux/store";
import "./CowRoll_language";
import "./Theme_cowRoll.css";
import { addCode } from "./codeSlide";

const CodeEditor = () => {
  const { code, error } = useAppSelector((state: RootState) => state.code);
  const dispatch = useAppDispatch();
  let editorRef = React.useRef(null);

  return (
    <>
      <Resizable
        defaultSize={{ width: "100%", height: "80vh" }}
        enable={{ top: false, right: false, bottom: false, left: false }}
      >
        <CodeMirror
          value={code}
          options={{ mode: "cowRoll", theme: "cowRoll", lineNumbers: true }}
          onBeforeChange={(editor, data, newValue) => {
            dispatch(addCode(newValue)); // Update the state on every change
          }}
          editorDidMount={(editor) => {
            editorRef = editor; // Store the editor instance
          }}
        />
      </Resizable>
    </>
  );
};

export default CodeEditor;
