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
