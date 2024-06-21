import * as Blockly from "blockly";
import i18n from "../../../../i18n/i18n";

Blockly.defineBlocksWithJsonArray([
  {
    type: "array",
    message0: i18n.t("Blocky.Lists.Blocks.ARRAY"),
    args0: [
      {
        type: "input_statement",
        name: "ELEMENTS",
      },
    ],
    output: "Array",
    colour: 260,
    tooltip: i18n.t("Blocky.Lists.Blocks.ARRAY_TOOLTIP"),
    helpUrl: "",
  },
  {
    type: "array_set",
    message0: "set %1 index %2 to %3",
    args0: [
      {
        type: "field_variable",
        name: "ARRAY",
      },
      {
        type: "input_value",
        name: "INDEX",
        check: "Number",
      },
      {
        type: "input_value",
        name: "VALUE",
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: "Sets the value at a specified index of an array",
    helpUrl: "",
  },
  {
    type: "array_get",
    message0: "get %1 index %2",
    args0: [
      {
        type: "field_variable",
        name: "ARRAY",
      },
      {
        type: "input_value",
        name: "INDEX",
        check: "Number",
      },
    ],
    inputsInline: true,
    output: null,
    colour: 230,
    tooltip: "Gets the value at a specified index of an array",
    helpUrl: "",
  },
  {
    type: "array_element",
    message0: i18n.t("Blocky.Lists.Blocks.ARRAY_ELEMENT"),
    args0: [
      {
        type: "input_value",
        name: "VALUE",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 260,
    tooltip: i18n.t("Blocky.Lists.Blocks.ARRAY_ELEMENT_TOOLTIP"),
    helpUrl: "",
  },
  {
    type: "map",
    message0: i18n.t("Blocky.Lists.Blocks.MAP"),
    args0: [
      {
        type: "input_statement",
        name: "FIELDS",
      },
    ],
    output: "Map",
    colour: 230,
    tooltip: i18n.t("Blocky.Lists.Blocks.MAP_TOOLTIP"),
    helpUrl: "",
  },
  {
    type: "map_field",
    message0: i18n.t("Blocky.Lists.Blocks.MAP_ELEMENT"),
    args0: [
      {
        type: "field_input",
        name: "KEY",
        text: i18n.t("Blocky.Lists.Blocks.KEY"),
      },
      {
        type: "input_value",
        name: "VALUE",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 230,
    tooltip: i18n.t("Blocky.Lists.Blocks.MAP_ELEMENT_TOOLTIP"),
    helpUrl: "",
  },
]);
