import * as Blockly from "blockly";

Blockly.defineBlocksWithJsonArray([
  {
    type: "array",
    message0: "array %1",
    args0: [
      {
        type: "input_statement",
        name: "ELEMENTS",
      },
    ],
    output: "Array",
    colour: 260,
    tooltip: "Create an array with elements",
    helpUrl: "",
  },
  {
    type: "array_element",
    message0: "element %1",
    args0: [
      {
        type: "input_value",
        name: "VALUE",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 260,
    tooltip: "An element for an array",
    helpUrl: "",
  },
  {
    type: "map",
    message0: "map %1",
    args0: [
      {
        type: "input_statement",
        name: "FIELDS",
      },
    ],
    output: "Map",
    colour: 230,
    tooltip: "Create a map with key-value pairs",
    helpUrl: "",
  },
  {
    type: "map_field",
    message0: "key %1 value %2",
    args0: [
      {
        type: "field_input",
        name: "KEY",
        text: "key",
      },
      {
        type: "input_value",
        name: "VALUE",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: "A key-value pair for a map",
    helpUrl: "",
  },
]);
