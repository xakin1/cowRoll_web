import * as Blockly from "blockly";
import "blockly/blocks";
import "blockly/dart";
import "blockly/javascript";
import "blockly/lua";
import "blockly/msg/en";
import "blockly/php";
import "blockly/python";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { addOutput } from "../../../redux/slice/codeSlide";
import "./customBlocks/index";
import { cowRollGenerator } from "./generators/cowRoll";

const BlocklyEditor = () => {
  const dispatch = useDispatch();
  const blocklyDiv = useRef(null);
  const toolboxXml = `
    <xml id="toolbox" style="display: none">
      <category name="Logic" colour="#5C81A6">
        <block type="custom_if"></block>
        <block type="logic_compare"></block>
        <block type="logic_operation"></block>
        <block type="logic_negate"></block>
        <block type="logic_boolean"></block>
      </category>
      <category name="Loops" colour="#5CA65C">
        <block type="for"></block>
        <block type="for_with_range"></block>
        <block type="for_with_var"></block>
      </category>
      <category name="Math" colour="#5C68A6">
        <block type="math_number"></block>
        <block type="math_custom_arithmetic"></block>
        <block type="rand_with_range"></block>
        <block type="rand"></block>
      </category>
      <category name="Text" colour="#5CA68D">
        <block type="text"></block>
      </category>
      <category name="Lists" colour="#745CA6">
        <block type="array"></block>
        <block type="array_element"></block>
        <block type="map"></block>
        <block type="map_field"></block>
      </category>
     <category name="Variables" colour="#A65C81" custom="VARIABLE_CUSTOM">
        <button text="Create Variable" callbackKey="CREATE_VARIABLE"></button>
      </category>
      <category name="Functions"  colour="#9A5CA6">
          <block type="procedures_defnoreturn"></block>
          <block type="custom_procedures_callnoreturn"></block>
      </category>
      <category name="General"  colour="#800">
        <block type="return"></block>
      </category>
    </xml>
  `;

  useEffect(() => {
    const workspace = Blockly.inject(blocklyDiv.current, {
      toolbox: toolboxXml,
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

    workspace.registerButtonCallback("CREATE_VARIABLE", function (button) {
      Blockly.Variables.createVariableButtonHandler(
        button.getTargetWorkspace()
      );
    });

    // Define a custom flyoutCallback for the variables category
    workspace.registerToolboxCategoryCallback(
      "VARIABLE_CUSTOM",
      function (workspace) {
        const xmlList = [];
        const button = document.createElement("button");
        button.setAttribute("text", Blockly.Msg["NEW_VARIABLE"]);
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
    return () => workspace.dispose();
  }, []);

  const generateCode = () => {
    const workspace = Blockly.getMainWorkspace();
    const code = cowRollGenerator.workspaceToCode(workspace);
    console.log(code);
    dispatch(addOutput({ message: code }));
  };

  return (
    <>
      <div
        ref={blocklyDiv}
        style={{ height: "480px", width: "100%", backgroundColor: "#f5f5f5" }}
      ></div>
      <div>
        <button onClick={generateCode}>Generate code</button>
      </div>
    </>
  );
};

export default BlocklyEditor;
