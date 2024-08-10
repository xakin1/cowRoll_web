import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { forwardRef, useImperativeHandle, useRef } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../hooks/customHooks.js";
import i18n from "../../../../i18n/i18n.js";
import { addOutput } from "../../../../redux/slice/codeSlice.js";
import type { RootState } from "../../../../redux/store.js";
import { executeCode } from "../../../../services/codeApi.js";
import type { CodeError, Id } from "../../../../utils/types/ApiTypes.js";
import type { Field } from "../../sheet/types.js";
import BlocklyEditor, {
  type BlocklyRefProps,
} from "../blockyEditor/BlocklyEditor.js";
import CodeEditor from "../monacoEditor/codeEditor.js";
import Sidebar from "../sideBar/SideBar.js";
import "./WorkSpace.css";

interface WorkSpaceProps {
  style?: React.CSSProperties;
  className?: string;
  directoryId?: Id;
  blocklyRef?: any;
  handleExecuteCode?: (...args: any[]) => void;
}
const WorkSpace = forwardRef<BlocklyRefProps, WorkSpaceProps>(
  ({ style, className, directoryId, handleExecuteCode }, ref) => {
    const file = useAppSelector(
      (state: RootState) => state.directorySystem.selectedFile
    );

    const blocklyEditorRef = useRef<BlocklyRefProps>(null);

    useImperativeHandle(ref, () => ({
      updateVariables: (fields: Field[]) => {
        if (blocklyEditorRef.current) {
          blocklyEditorRef.current.updateVariables(fields);
        }
      },
      renameVariable: (oldName: string, newName: string) => {
        if (blocklyEditorRef.current) {
          blocklyEditorRef.current.renameVariable(oldName, newName);
        }
      },
      saveContent() {
        if (blocklyEditorRef.current) {
          blocklyEditorRef.current.saveContent();
        }
      },
    }));

    const dispatch = useAppDispatch();

    const formatJson = (data: Object) => {
      try {
        const formattedJson = JSON.stringify(data, null, 2); // Formatea el JSON
        return (
          <pre
            style={{
              whiteSpace: "pre-wrap",
              color: "var(--text-color)",
              marginBottom: "10px",
            }}
          >
            {formattedJson}
          </pre>
        );
      } catch (error) {
        return (
          <span style={{ color: "red" }}>
            {i18n.t("Code.Error.CANT_DISPLAY")}
          </span>
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
      if (handleExecuteCode) {
        handleExecuteCode();
      } else {
        if (file?.content) {
          const response = await executeCode(file.content);
          if (response) {
            dispatch(addOutput(response));
          } else {
            dispatch(addOutput({ message: "" }));
          }
        }
      }
    };

    return (
      <>
        <div style={style} className={`${className} container-page`}>
          <Sidebar directoryId={directoryId}></Sidebar>
          <main className="container-page_container_workSpace">
            {file ? (
              <>
                <div className="top-section">
                  <section className="section editorSection">
                    <header className="header-workSpace">
                      <h1>{i18n.t("Code.code")}</h1>
                      <button
                        className="run-button__editorSection"
                        onClick={handleExecuteClick}
                        aria-label="Ejecutar código en el editor"
                      >
                        {i18n.t("Code.run")}
                        <PlayArrowIcon></PlayArrowIcon>
                      </button>
                    </header>
                    <CodeEditor {...file}></CodeEditor>
                  </section>
                  <section className="section outputSection">
                    <header className="header-workSpace">
                      <h1>{i18n.t("Code.output")}</h1>
                    </header>
                    <div
                      aria-label="Code Output"
                      id="OutputDisplay"
                      className="outputSection__output-area"
                    >
                      {formatOutput(output, error)}
                    </div>
                  </section>
                </div>
                <section className="blocklySection">
                  <BlocklyEditor ref={blocklyEditorRef}></BlocklyEditor>
                </section>
              </>
            ) : (
              <div className="no-file-selected">
                <span>{i18n.t("General.selectFile")}</span>
              </div>
            )}
          </main>
          <div id="portal-root"></div>
        </div>
      </>
    );
  }
);

export default WorkSpace;
