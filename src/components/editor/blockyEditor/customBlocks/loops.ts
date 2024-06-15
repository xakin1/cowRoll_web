import * as Blockly from "blockly";

Blockly.defineBlocksWithJsonArray([
  {
    type: "for_with_range",
    message0: "for %1 <- %2..%3 do %4 end",
    args0: [
      {
        type: "field_variable",
        name: "VALUE",
      },
      {
        type: "input_value",
        name: "VALUE",
        check: ["Number"],
      },
      {
        type: "input_value",
        name: "VALUE",
        check: ["Number"],
      },
      {
        type: "input_statement",
        name: "VALUE",
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: "%{BKY_LOOPS_HUE}",
    tooltip: "for statement",
    helpUrl: "",
  },
  {
    type: "for",
    message0: "for %1 <- %2 do %3 end",
    args0: [
      {
        type: "field_variable",
        name: "VAR",
      },
      {
        type: "input_value",
        name: "ENUMERABLE",
      },
      {
        type: "input_statement",
        name: "DO",
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: "%{BKY_LOOPS_HUE}",
    tooltip: "for statement",
    helpUrl: "",
  },
  {
    type: "for_with_var",
    message0: "for %1 <- %2 do %3 end",
    args0: [
      {
        type: "field_variable",
        name: "VAR",
      },
      {
        type: "field_variable",
        name: "enum",
      },
      {
        type: "input_statement",
        name: "DO",
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: "%{BKY_LOOPS_HUE}",
    tooltip: "for statement",
    helpUrl: "",
  },
]);
