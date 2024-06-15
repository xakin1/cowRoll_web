import * as Blockly from "blockly";

Blockly.defineBlocksWithJsonArray([
  {
    type: "return",
    message0: "return %1",
    args0: [
      {
        type: "input_value",
        name: "statementToCode",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230, // Adjust color as needed
    tooltip: "Return a value",
    helpUrl: "",
  },
]);
