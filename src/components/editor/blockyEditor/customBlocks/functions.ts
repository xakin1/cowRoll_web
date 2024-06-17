import * as Blockly from "blockly";
import i18n from "../../../../i18n/i18n";

Blockly.defineBlocksWithJsonArray([
  {
    type: "custom_procedures_callnoreturn",
    message0: i18n.t("Blocky.Functions.Blocks.CALL"),
    args0: [
      {
        type: "field_dropdown",
        name: "FUNCTION_NAME",
        options: [["", ""]],
      },
    ],
    output: null,
    colour: Blockly.Msg.PROCEDURES_HUE,
    tooltip: i18n.t("Blocky.Functions.Blocks.CALL_TOOLTIP"),
    helpUrl: "",
  },
]);

Blockly.Blocks["custom_procedures_callnoreturn"].updateFunctions = function () {
  const workspace = Blockly.getMainWorkspace();
  const blocks = workspace.getAllBlocks();
  const functionList = [];

  blocks.forEach((block) => {
    if (block.type === "procedures_defnoreturn") {
      const name = block.getFieldValue("NAME");
      functionList.push([name, name]);
    }
  });

  return functionList.length ? functionList : [["", ""]];
};

Blockly.Blocks["custom_procedures_callnoreturn"].updateShape_ = function (
  block
) {
  const functionName = block.getFieldValue("FUNCTION_NAME");
  const workspace = block.workspace;
  const functionBlock = workspace
    .getAllBlocks()
    .find(
      (blk) =>
        blk.type === "procedures_defnoreturn" &&
        blk.getFieldValue("NAME") === functionName
    );

  // Store current input connections
  const connections = {};
  block.inputList.forEach((input) => {
    if (input.connection && input.connection.targetConnection) {
      connections[input.name] = input.connection.targetConnection;
    }
  });

  // Remove existing input fields
  while (block.inputList.length > 1) {
    block.removeInput(block.inputList[block.inputList.length - 1].name);
  }

  if (functionBlock) {
    const paramNames = functionBlock.arguments_;
    for (let i = 0; i < paramNames.length; i++) {
      const input = block
        .appendValueInput(paramNames[i])
        .setCheck(null)
        .appendField(paramNames[i]);

      // Reconnect previous connections if available
      if (connections[paramNames[i]]) {
        input.connection.connect(connections[paramNames[i]]);
      }
    }
  }
};

Blockly.Blocks["custom_procedures_callnoreturn"].onchange = function (event) {
  if (
    event.type === Blockly.Events.BLOCK_CREATE ||
    event.type === Blockly.Events.BLOCK_DELETE ||
    event.type === Blockly.Events.BLOCK_CHANGE ||
    event.type === Blockly.Events.UI
  ) {
    const options = this.updateFunctions();
    const dropdown = this.getField("FUNCTION_NAME");
    dropdown.menuGenerator_ = options;
    if (
      !dropdown.getValue() ||
      options.every((option) => option[1] !== dropdown.getValue())
    ) {
      dropdown.setValue(options[0][1]);
    }
    this.updateShape_(this);
  }
};
