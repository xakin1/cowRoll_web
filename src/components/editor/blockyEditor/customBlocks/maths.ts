import * as Blockly from "blockly";

Blockly.defineBlocksWithJsonArray([
  {
    type: "math_custom_arithmetic",
    message0: "%1 %2 %3",
    args0: [
      {
        type: "input_value",
        name: "A",
        check: "Number",
      },
      {
        type: "field_dropdown",
        name: "OP",
        options: [
          ["+", "ADD"],
          ["-", "MINUS"],
          ["\u00D7", "MULTIPLY"],
          ["\u00F7", "DIVIDE"],
          ["//", "ROUND_DIVIDE"],
          ["^", "POWER"],
          ["%", "MODULO"],
        ],
      },
      {
        type: "input_value",
        name: "B",
        check: "Number",
      },
    ],
    inputsInline: true,
    output: "Number",
    colour: 230,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "rand_with_range",
    message0: "random integer from %1 to %2",
    args0: [
      {
        type: "input_value",
        name: "A",
        check: "Number",
      },
      {
        type: "input_value",
        name: "B",
        check: "Number",
      },
    ],
    inputsInline: true,
    output: "Number",
    colour: 230,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "rand",
    message0: "random integer to %1",
    args0: [
      {
        type: "input_value",
        name: "A",
        check: "Number",
      },
    ],
    inputsInline: true,
    output: "Number",
    colour: 230,
    tooltip: "from 0 to the specify integer",
    helpUrl: "",
  },
]);
