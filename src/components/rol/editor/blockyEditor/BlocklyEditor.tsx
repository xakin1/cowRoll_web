import { CrossTabCopyPaste } from "@blockly/plugin-cross-tab-copy-paste";
import { Backpack } from "@blockly/workspace-backpack";
import * as Blockly from "blockly";
import "blockly/blocks";
import "blockly/dart";
import "blockly/javascript";
import "blockly/lua";
import "blockly/msg/en";
import "blockly/php";
import "blockly/python";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../hooks/customHooks";
import i18n from "../../../../i18n/i18n";
import {
  updateSelectedFile,
  updateSelectedFileContent,
} from "../../../../redux/slice/DirectorySystemSlice";
import type { RootState } from "../../../../redux/store";
import { editFile } from "../../../../services/codeApi";
import "./BlocklyEditor.css";
import { cowRollGenerator } from "./generators/cowRoll";
import "./index";
import { darkTheme } from "./themes/darkTheme";

const BlocklyEditor = () => {
  const dispatch = useDispatch();
  const file = useAppSelector(
    (state: RootState) => state.directorySystem.selectedFile
  );
  const blocklyDiv = useRef(null);
  const backpackContentRef = useRef<string[]>([]); // useRef to store backpack contents

  const proceduresFlyoutCallback = function (workspace: Blockly.Workspace) {
    const xmlList = [];

    // Agregar bloque de definición de procedimiento sin retorno
    const blockDef = Blockly.utils.xml.createElement("block");
    blockDef.setAttribute("type", "procedures_defnoreturn");
    xmlList.push(blockDef);

    // Obtener todos los procedimientos sin retorno
    const procedures = Blockly.Procedures.allProcedures(workspace)[0];
    for (const procedure of procedures) {
      const blockCall = Blockly.utils.xml.createElement("block");
      blockCall.setAttribute("type", "procedures_callnoreturn_as_return");
      const mutation = Blockly.utils.xml.createElement("mutation");
      mutation.setAttribute("name", procedure[0]);
      const argNames = procedure[1];
      for (let i = 0; i < argNames.length; i++) {
        const arg = Blockly.utils.xml.createElement("arg");
        arg.setAttribute("name", argNames[i]);
        mutation.appendChild(arg);
      }
      blockCall.appendChild(mutation);
      xmlList.push(blockCall);
    }

    return xmlList;
  };

  const getInitialTheme = () => {
    const userPreferredTheme = localStorage.getItem("theme");
    const systemPreference = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    const themeToApply = userPreferredTheme || systemPreference;
    return themeToApply === "dark" ? darkTheme : Blockly.Themes.Classic;
  };
  const [blocklyTheme, setBlocklyTheme] = useState(getInitialTheme); // Default theme

  const toolboxXml = `
    <xml id="toolbox" style="display: none">
      <category name="${i18n.t("Blocky.Logic.MODULE_NAME")}" colour="#5C81A6">
        <block type="controls_if"></block>
        <block type="logic_compare"></block>
        <block type="logic_operation"></block>
        <block type="logic_negate"></block>
        <block type="logic_boolean"></block>
      </category>
      <category name="${i18n.t("Blocky.Loops.MODULE_NAME")}" colour="#5CA65C">
        <block type="for"></block>
        <block type="for_with_range"></block>
        <block type="for_with_var"></block>
      </category>
      <category name="${i18n.t("Blocky.Math.MODULE_NAME")}" colour="#5C68A6">
        <block type="math_number"></block>
        <block type="math_custom_arithmetic"></block>
        <block type="rand_with_range"></block>
        <block type="rand"></block>
      </category>
      <category name="${i18n.t("Blocky.Text.MODULE_NAME")}" colour="#5CA68D">
        <block type="text"></block>
      </category>
      <category name="${i18n.t("Blocky.Lists.MODULE_NAME")}" colour="#745CA6">
        <block type="array"></block>
        <block type="array_element"></block>
        <block type="array_set"></block>
        <block type="array_get"></block>
        <block type="map"></block>
        <block type="map_field"></block>
      </category>
      <category name="${i18n.t("Blocky.Variables.MODULE_NAME")}" colour="#A65C81" custom="VARIABLE_CUSTOM">
        <button text="Create Variable" callbackKey="CREATE_VARIABLE"></button>
      </category>
      <category name="${i18n.t("Blocky.Functions.MODULE_NAME")}" colour="#9A5CA6" custom="PROCEDURE_CUSTOM"></category>
      <category name="${i18n.t("Blocky.General.MODULE_NAME")}" colour="#800">
        <block type="return"></block>
      </category>
    </xml>
  `;

  useEffect(() => {
    if (!blocklyDiv.current) return;

    const workspace = Blockly.inject(blocklyDiv.current, {
      toolbox: toolboxXml,
      theme: blocklyTheme,
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        minScale: 0.3,
        pinch: true,
      },
      trashcan: true,
      toolboxPosition: "start",
      horizontalLayout: false,
      sounds: true,
    });
    const options = {
      contextMenu: true,
      shortcut: true,
    };

    if (!Blockly.ContextMenuRegistry.registry.getItem("blockCopyToStorage")) {
      const plugin = new CrossTabCopyPaste();
      plugin.init(options);
    }

    const backpack = new Backpack(workspace);
    backpack.init();
    workspace.registerButtonCallback("CREATE_VARIABLE", function (button) {
      Blockly.Variables.createVariableButtonHandler(
        button.getTargetWorkspace()
      );
    });

    workspace.registerToolboxCategoryCallback(
      "PROCEDURE_CUSTOM",
      proceduresFlyoutCallback
    );

    workspace.registerToolboxCategoryCallback(
      "VARIABLE_CUSTOM",
      function (workspace) {
        const xmlList = [];
        const button = document.createElement("button");
        button.setAttribute("text", i18n.t("Blocky.Variables.CREATE_VAR"));
        button.setAttribute("callbackKey", "CREATE_VARIABLE");
        xmlList.push(button);

        const variableList = workspace.getAllVariables();
        if (variableList.length > 0) {
          for (let i = 0; i < variableList.length; i++) {
            const variable = variableList[i];
            const getBlockText = `<block type="variables_get"><field name="VAR">${variable.name}</field></block>`;
            const getBlock = Blockly.utils.xml.textToDom(getBlockText);
            xmlList.push(getBlock);
          }

          // Add a single variables_set block
          const setBlockText = `<block type="variables_set"><field name="VAR">${variableList[0].name}</field></block>`;
          const setBlock = Blockly.utils.xml.textToDom(setBlockText);
          xmlList.push(setBlock);
        }
        return xmlList;
      }
    );

    const handleThemeChange = (event: Event) => {
      backpackContentRef.current = backpack.getContents(); // Store backpack contents in ref
      Blockly.svgResize(workspace);

      const customEvent = event as CustomEvent<{ theme: string }>;
      const newTheme = customEvent.detail.theme;
      setBlocklyTheme(newTheme === "dark" ? darkTheme : Blockly.Themes.Classic);
      workspace.setTheme(
        newTheme === "dark" ? darkTheme : Blockly.Themes.Classic
      );
    };
    backpack.setContents(backpackContentRef.current); // Restore backpack contents

    document.addEventListener("themeChanged", handleThemeChange);

    const handleResize = () => {
      Blockly.svgResize(workspace);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    if (blocklyDiv.current) {
      resizeObserver.observe(blocklyDiv.current);
    }
    if (file && file.contentSchema) {
      const xml = Blockly.utils.xml.textToDom(file.contentSchema);
      Blockly.Xml.domToWorkspace(xml, workspace);
    }

    if (file && file.backpackSchema) {
      backpack.setContents(file.backpackSchema);
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      const workspace = Blockly.getMainWorkspace();
      if (event.ctrlKey && event.key === "s") {
        backpackContentRef.current = backpack.getContents();
        event.preventDefault();
        generateCode();
      } else if (event.ctrlKey && event.key === "c") {
        event.preventDefault();
        Blockly.clipboard.copy(workspace);
      } else if (event.ctrlKey && event.key === "v") {
        event.preventDefault();
        Blockly.clipboard.paste(workspace);
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      workspace.dispose();
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("themeChanged", handleThemeChange);
    };
  }, [blocklyTheme, toolboxXml, file]);

  const generateCode = () => {
    const workspace = Blockly.getMainWorkspace();
    const code = cowRollGenerator.workspaceToCode(workspace);
    dispatch(updateSelectedFileContent(code));

    if (file) {
      const dom = Blockly.Xml.workspaceToDom(workspace);
      const xmlText = Blockly.Xml.domToText(dom);
      const updatedFile = {
        ...file,
        content: code,
        contentSchema: xmlText,
        backpackSchema: backpackContentRef.current,
      };
      dispatch(updateSelectedFile(updatedFile));
      editFile(updatedFile);
    }
  };

  return (
    <>
      <div className="parent-container">
        <div ref={blocklyDiv} className="blocklyDiv"></div>
        <button className="generator-button" onClick={generateCode}>
          {i18n.t("Blocky.GENERATE_CODE")}
        </button>
      </div>
    </>
  );
};

export default BlocklyEditor;
