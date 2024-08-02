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
import type { Field } from "../../sheet/types";
import "./BlocklyEditor.css";
import { cowRollGenerator } from "./generators/cowRoll";
import "./index";
import { darkTheme } from "./themes/darkTheme";

interface BlocklyEditorProps {
  style?: React.CSSProperties;
}

export interface BlocklyRefProps {
  updateVariables: (fields: Field[]) => void;
  renameVariable: (oldName: string, newName: string) => void;
  saveContent: () => void;
}

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
          console.error("No workspace found.");
          return;
        }

        // Get all variables as objects to access both names and IDs
        const currentVariables = workspace.getAllVariables();

        // Extract the names for comparison
        const currentVariableNames = currentVariables.map(
          (variable) => variable.name
        );

        // Object to store the mapping of variable names to values
        const variableValueMap: { [key: string]: any } = {};

        // Extract all unique tags from fields
        const allTags = new Set<string>();
        fields.forEach((field) => {
          field.tags?.forEach((tag) => {
            allTags.add(tag);
          });
        });

        // Create a set for unique variable names
        const allVariableNames = new Set<string>();
        fields.forEach((field) => {
          allVariableNames.add(field.name);
        });

        // Add tags to variable names set
        allTags.forEach((tag) => {
          allVariableNames.add(tag);
        });

        // Check for existing set blocks and map blocks
        const existingSetBlocks = new Set<string>();
        const existingMapBlocks = new Set<string>();

        workspace.getAllBlocks(false).forEach((block) => {
          if (block.type === "variables_set") {
            const varName = block.getFieldValue("VAR");
            existingSetBlocks.add(varName);
          }
          if (block.type === "map") {
            existingMapBlocks.add(block.id);
          }
        });

        // Track the last set block to connect them sequentially
        let lastSetBlock: Blockly.Block | null = null;

        // Create set blocks for variables if they don't exist
        allVariableNames.forEach((variableName) => {
          // Find the field associated with the variable
          const field = fields.find((field) => field.name === variableName);

          // Determine the initial value for the variable
          const initialValue = field?.value ?? 0;

          // Create a new variable if it does not exist
          if (!currentVariableNames.includes(variableName)) {
            // Create the variable with the name
            workspace.createVariable(variableName, null, variableName);
          }

          // Create a set block only if it doesn't already exist
          if (!existingSetBlocks.has(variableName)) {
            // Retrieve the variable object from the workspace
            const variable = workspace.getVariable(variableName);
            if (!variable) {
              console.error(`Variable ${variableName} not found.`);
              return;
            }

            // Create a new block to set the variable's value
            const setBlock = workspace.newBlock("variables_set");
            if (setBlock) {
              setBlock.initSvg(); // Initialize the block's SVG
              // Set the block as read-only
              setBlock.setDeletable(false);
              setBlock.setEditable(false);

              // Assign the variable to the block
              setBlock.getField("VAR")?.setValue(variableName);

              // Determine the type of block to create for the initial value
              let valueBlock: Blockly.Block | null = null;
              console.log(typeof initialValue);
              if (typeof initialValue === "number") {
                valueBlock = workspace.newBlock("math_number");
                if (valueBlock) {
                  valueBlock.initSvg();
                  valueBlock.setFieldValue(String(initialValue), "NUM");
                }
              } else if (typeof initialValue === "string") {
                valueBlock = workspace.newBlock("text");
                if (valueBlock) {
                  valueBlock.initSvg();
                  valueBlock.setFieldValue(initialValue, "TEXT");
                }
              }

              // Connect the value block to the set block
              if (valueBlock) {
                const connection = setBlock.getInput("VALUE")?.connection;
                if (connection) {
                  connection.connect(valueBlock.outputConnection);
                }

                // Render blocks only after all connections are set
                setBlock.render();
                valueBlock.render();
              }

              // Connect this set block to the previous one
              if (lastSetBlock) {
                const previousConnection = lastSetBlock.nextConnection;
                if (previousConnection) {
                  previousConnection.connect(setBlock.previousConnection);
                }
              }

              // Update lastSetBlock to current setBlock
              lastSetBlock = setBlock;

              // Position blocks vertically for the first block
              if (!existingSetBlocks.has(variableName)) {
                const topBlocks = workspace.getTopBlocks(true);
                const topBlockCount = topBlocks.length;
                setBlock.moveBy(20, topBlockCount * 50);
              }
            }
          }
        });

        // Now create a map block at the end of all variable blocks if not exists
        if (existingMapBlocks.size === 0) {
          const mapBlock = workspace.newBlock("map");
          if (mapBlock) {
            mapBlock.initSvg();
            mapBlock.render();

            // Set the block as read-only
            mapBlock.setDeletable(false);
            mapBlock.setEditable(false);

            // Populate map with fields
            fields.forEach((field) => {
              const mapFieldBlock = workspace.newBlock("map_field");
              if (mapFieldBlock) {
                mapFieldBlock.initSvg();
                mapFieldBlock.render();

                // Set key-value pairs
                mapFieldBlock.getField("KEY")?.setValue(field.name);
                const valueBlock = workspace.newBlock(
                  typeof field.value === "number" ? "math_number" : "text"
                );
                if (valueBlock) {
                  valueBlock.initSvg();
                  valueBlock.render();

                  const defaultValue = field.value ?? 0;
                  if (typeof defaultValue === "number") {
                    valueBlock.setFieldValue(String(defaultValue), "NUM");
                  } else {
                    valueBlock.setFieldValue(String(defaultValue), "TEXT");
                  }

                  const connection =
                    mapFieldBlock.getInput("VALUE")?.connection;
                  if (connection) {
                    connection.connect(valueBlock.outputConnection);
                  }
                }

                // Connect map field to the map block
                const mapConnection = mapBlock.getInput("FIELDS")?.connection;
                if (mapConnection) {
                  mapConnection.connect(mapFieldBlock.previousConnection);
                }
              }

              // Add to the variable map
              variableValueMap[field.name] = field.value;
            });

            // Connect the last set block to the map block if exists
            if (lastSetBlock) {
              const connection = lastSetBlock.nextConnection;
              if (connection) {
                connection.connect(mapBlock.previousConnection);
              }
            }

            // Position the map block
            mapBlock.moveBy(
              20,
              (workspace.getTopBlocks(false).length + 1) * 50
            );
          }
        }

        // Delete variables that are no longer in use (neither field.name nor tag)
        currentVariables.forEach((variable) => {
          const variableName = variable.name;
          const isFieldVariable = fields.some(
            (field) => field.name === variableName
          );
          const isTagVariable = allTags.has(variableName);

          if (!isFieldVariable && !isTagVariable) {
            workspace.deleteVariableById(variable.getId()); // Now using the ID properly
          }
        });

        // Log the variable-value map at the end
        console.log("Variable Value Map:", variableValueMap);
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
      const workspace = Blockly.getMainWorkspace() as Blockly.WorkspaceSvg; // Explicitly cast to WorkspaceSvg
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
