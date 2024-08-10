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
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../../hooks/customHooks";
import i18n from "../../../../i18n/i18n";
import {
  updateSelectedFile,
  updateSelectedFileContent,
} from "../../../../redux/slice/DirectorySystemSlice";
import type { RootState } from "../../../../redux/store";
import { editFile } from "../../../../services/codeApi";
import { typeField } from "../../sheet/RenderFields";
import type { Field } from "../../sheet/types";
import "./BlocklyEditor.css";
import { cowRollGenerator } from "./generators/cowRoll";
import "./index";
import { darkTheme } from "./themes/darkTheme";

interface BlocklyEditorProps {
  style?: React.CSSProperties;
}

//Parece ser que la función render sí existe aunque ts diga lo contrario
// así que hacemos esto para que no marque error
declare module "blockly/core" {
  interface Block {
    arguments_: any[];
    render: () => void;
  }
}

//aquí lo mismo
declare module "blockly/core/clipboard" {
  export function copy(workspace: Blockly.Workspace): void;
  export function paste(workspace: Blockly.Workspace): void;
}

export interface BlocklyRefProps {
  updateVariables: (fields: Field[]) => void;
  renameVariable: (oldName: string, newName: string) => void;
  saveContent: () => void;
}

function sanitizeVariableName(name: string) {
  return name
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
export const sufixSelectable = "_selected_value";

const BlocklyEditor = forwardRef<BlocklyRefProps, BlocklyEditorProps>(
  ({ style }, ref) => {
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

    useImperativeHandle(ref, () => ({
      updateVariables(fields: Field[]) {
        const workspace = Blockly.getMainWorkspace();
        if (!workspace) {
          return;
        }

        const currentVariables = workspace.getAllVariables();
        const currentVariableNames = currentVariables.map(
          (variable) => variable.name
        );

        const allTags = extractAllTags(fields);
        const allVariableNames = extractAllVariableNames(
          fields,
          sufixSelectable,
          allTags
        );

        const existingMapBlocks = getExistingBlocks(workspace, "map");
        const existingProcedures = getExistingBlocks(
          workspace,
          "procedures_defnoreturn"
        );

        let lastSetBlock: Blockly.Block | null = null;

        // allVariableNames.forEach((variableName) => {
        //   const field = fields.find((field) => field.name === variableName);

        //   if (field) {
        //     const initialValue = determineInitialValue(field);
        //     createVariableIfNeeded(
        //       workspace,
        //       currentVariableNames,
        //       variableName,
        //       sufixSelectable,
        //       field
        //     );

        //     if (!existingSetBlocks.has(variableName)) {
        //       lastSetBlock = createSetBlockForVariable(
        //         workspace,
        //         field,
        //         variableName,
        //         initialValue,
        //         lastSetBlock,
        //         sufixSelectable
        //       );
        //     }
        //   }
        // });
        lastSetBlock = createMainFunction(
          allVariableNames,
          workspace,
          existingProcedures
        );

        deleteUnusedVariables(
          workspace,
          currentVariables,
          fields,
          allTags,
          sufixSelectable
        );
        createMapBlockIfNotExists(
          workspace,
          existingMapBlocks,
          fields,
          lastSetBlock,
          sufixSelectable
        );
      },
      renameVariable(oldName: string, newName: string) {
        const workspace = Blockly.getMainWorkspace();
        const variable = workspace.getVariable(oldName);

        if (variable) {
          workspace.renameVariableById(variable.getId(), newName);
        }
      },
      saveContent,
    }));

    const saveContent = () => {
      const workspace = Blockly.getMainWorkspace() as Blockly.WorkspaceSvg;
      const backpack = new Backpack(workspace);
      backpackContentRef.current = backpack.getContents();
      generateCode();
    };

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
              const sanitizedVariableName = sanitizeVariableName(variable.name);
              const getBlockText = `<block type="variables_get"><field name="VAR">${sanitizedVariableName}</field></block>`;
              const getBlock = Blockly.utils.xml.textToDom(getBlockText);
              xmlList.push(getBlock);
            }

            const setBlockText = `<block type="variables_set"><field name="VAR">${sanitizeVariableName(variableList[0].name)}</field></block>`;
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
        setBlocklyTheme(
          newTheme === "dark" ? darkTheme : Blockly.Themes.Classic
        );
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

    function extractAllTags(fields: Field[]): Set<string> {
      const allTags = new Set<string>();
      fields.forEach((field) => {
        field.tags?.forEach((tag) => {
          allTags.add(tag);
        });
      });
      return allTags;
    }

    function extractAllVariableNames(
      fields: Field[],
      sufixSelectable: string,
      allTags: Set<string>
    ): Set<string> {
      const allVariableNames = new Set<string>();
      fields.forEach((field) => {
        if (field.type == typeField.selectable) {
          allVariableNames.add(field.name + sufixSelectable);
          allVariableNames.add(field.name);
        } else {
          allVariableNames.add(field.name);
        }
      });

      allTags.forEach((tag) => {
        allVariableNames.add(tag);
      });

      return allVariableNames;
    }

    function getExistingBlocks(workspace: any, blockType: string): Set<string> {
      const existingBlocks = new Set<string>();
      workspace.getAllBlocks(false).forEach((block: Blockly.Block) => {
        if (block.type === blockType) {
          const varName = block.getFieldValue("VAR");
          existingBlocks.add(varName);
        }
      });
      return existingBlocks;
    }

    function createMainFunction(
      allVariableNames: Set<string>,
      workspace: Blockly.Workspace,
      existingProcedures: Set<string>
    ) {
      if (existingProcedures.size === 0) {
        // Convertir el Set a un array
        const parameterNames = Array.from(allVariableNames);

        const procedureBlock = workspace.newBlock("procedures_defnoreturn");
        procedureBlock.setFieldValue("main", "NAME");

        const mutationContainer = Blockly.utils.xml.textToDom(
          "<mutation></mutation>"
        );

        parameterNames.forEach((name) => {
          const sanitizedName = sanitizeVariableName(name);
          const argNode = document.createElement("arg");
          argNode.setAttribute("name", sanitizedName);
          mutationContainer.appendChild(argNode);
          workspace.createVariable(sanitizedName, null, sanitizedName);
        });

        procedureBlock.domToMutation &&
          procedureBlock.domToMutation(mutationContainer);

        procedureBlock.initSvg();
        procedureBlock.render();
        procedureBlock.moveBy(10, 10);
        return procedureBlock;
      }
      return null;
    }

    function deleteUnusedVariables(
      workspace: any,
      currentVariables: any[],
      fields: Field[],
      allTags: Set<string>,
      sufixSelectable: string
    ) {
      const code = cowRollGenerator.workspaceToCode(workspace);
      dispatch(updateSelectedFileContent(code));
      const usedVariables = new Set<string>();

      // Extraer variables usadas en el código
      const variableRegex = /\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g;
      let match;
      while ((match = variableRegex.exec(code)) !== null) {
        usedVariables.add(match[1]);
      }

      // Extraer variables utilizadas en las definiciones de funciones
      const functions: Blockly.Block[] = workspace
        .getAllBlocks()
        .filter(
          (block: Blockly.Block) =>
            block.type === "procedures_defnoreturn" ||
            block.type === "procedures_defreturn"
        );
      const functionVariables = new Set<string>();

      functions.forEach((funcBlock) => {
        const funcVariables = funcBlock.getVars();
        funcVariables.forEach((variable) => functionVariables.add(variable));
      });

      currentVariables.forEach((variable) => {
        const variableName = variable.name;

        const isFieldVariable = fields.some((field) => {
          return (
            field.name === variableName ||
            (field.type === typeField.selectable &&
              field.name + sufixSelectable === variableName)
          );
        });

        const isTagVariable = allTags.has(variableName);

        const isUsedInCode = usedVariables.has(variableName);

        const isFunctionVariable = functionVariables.has(variableName);

        if (
          !isFieldVariable &&
          !isTagVariable &&
          !isUsedInCode &&
          !isFunctionVariable
        ) {
          workspace.deleteVariableById(variable.getId());
        }
      });
    }

    function createMapBlockIfNotExists(
      workspace: any,
      existingMapBlocks: Set<string>,
      fields: Field[],
      lastSetBlock: Blockly.Block | null,
      sufixSelectable: string
    ) {
      if (existingMapBlocks.size === 0) {
        const mapBlock = workspace.newBlock("map");
        if (mapBlock) {
          mapBlock.initSvg();
          mapBlock.render();
          mapBlock.setDeletable(false);
          mapBlock.setEditable(false);

          fields.forEach((field) => {
            addFieldToMapBlock(workspace, mapBlock, field.name);

            if (field.type === typeField.selectable) {
              addFieldToMapBlock(
                workspace,
                mapBlock,
                field.name + sufixSelectable
              );
            }
          });

          const returnBlock = workspace.newBlock("return");
          returnBlock.initSvg();
          returnBlock.render();
          returnBlock
            .getInput("VALUE")
            .connection.connect(mapBlock.outputConnection);

          lastSetBlock &&
            lastSetBlock
              ?.getInput("STACK")
              ?.connection?.connect(returnBlock.previousConnection);

          if (!mapBlock.getParent()) {
            mapBlock.moveBy(
              20,
              (workspace.getTopBlocks(false).length + 1) * 50
            );
          }
        }
      }
    }

    function addFieldToMapBlock(
      workspace: any,
      mapBlock: Blockly.Block,
      fieldName: string
    ) {
      const mapFieldBlock = workspace.newBlock("map_field");
      if (mapFieldBlock) {
        mapFieldBlock.initSvg();
        mapFieldBlock.render();
        mapFieldBlock.getField("KEY")?.setValue(fieldName);

        const valueBlock = workspace.newBlock("variables_get");
        if (valueBlock) {
          valueBlock.initSvg();
          valueBlock.render();
          valueBlock.getField("VAR").setValue(fieldName);

          const connection = mapFieldBlock.getInput("VALUE")?.connection;
          if (connection) {
            connection.connect(valueBlock.outputConnection);
          }

          const mapConnection = mapBlock.getInput("FIELDS")?.connection;
          if (mapConnection) {
            mapConnection.connect(mapFieldBlock.previousConnection);
          }
        }
      }
    }

    return (
      <>
        <div style={style} className="parent-container">
          <div ref={blocklyDiv} className="blocklyDiv"></div>
          <button className="generator-button" onClick={generateCode}>
            {i18n.t("Blocky.GENERATE_CODE")}
          </button>
        </div>
      </>
    );
  }
);

export default BlocklyEditor;
