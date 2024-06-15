import * as Blockly from "blockly";
import "blockly/blocks";
import "blockly/dart";
import "blockly/javascript";
import "blockly/lua";
import "blockly/msg/en";
import "blockly/php";
import "blockly/python";
import { useEffect, useRef } from "react";
import "./customBlocks/index";
import { cowRollGenerator } from "./generators/cowRoll";

const BlocklyEditor = () => {
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
        <block type="math_arithmetic"></block>
        <block type="math_round"></block>
        <block type="math_modulo"></block>
        <block type="math_random_int"></block>
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
      <category name="Variables" custom="VARIABLE" colour="#A65C81"></category>
      <category name="Functions"  colour="#9A5CA6">
        <block type="function_definition"></block>
          <block type="procedures_defnoreturn"></block>
          <block type="procedures_callreturn"></block>
      </category>
      <category name="General"  colour="#FFFFFF">
        <block type="return"></block>
      </category>
    </xml>
  `;

  useEffect(() => {
    const workspace = Blockly.inject(blocklyDiv.current, {
      toolbox: toolboxXml,
    });
    return () => workspace.dispose();
  }, []);

  const generateCode = () => {
    const workspace = Blockly.getMainWorkspace();
    const code = cowRollGenerator.workspaceToCode(workspace);
    console.log(code);
    // dispatch(addOutput({ message: code }));
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
