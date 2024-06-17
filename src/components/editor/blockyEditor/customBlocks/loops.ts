import * as Blockly from "blockly";
import i18n from "../../../../i18n/i18n";

Blockly.defineBlocksWithJsonArray([
  {
    type: "for_with_range",
    message0: i18n.t("Blocky.Loops.Blocks.FOR_WITH_RANGE"),
    args0: [
      {
        type: "field_variable",
        name: "VAR",
      },
      {
        type: "input_value",
        name: "RANGE1",
        check: ["Number"],
      },
      {
        type: "input_value",
        name: "RANGE12",
        check: ["Number"],
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
    tooltip: i18n.t("Blocky.Loops.Blocks.FOR_TOOLTIP"),
    helpUrl: "",
  },
  {
    type: "for",
    message0: i18n.t("Blocky.Loops.Blocks.FOR"),
    args0: [
      {
        type: "field_variable",
        name: "VAR",
        variable: i18n.t("Blocky.Loops.Blocks.VAR_FOR"),
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
    tooltip: i18n.t("Blocky.Loops.Blocks.FOR_TOOLTIP"),
    helpUrl: "",
  },
  {
    type: "for_with_var",
    message0: i18n.t("Blocky.Loops.Blocks.FOR"),
    args0: [
      {
        type: "field_variable",
        name: "VAR",
        variable: i18n.t("Blocky.Loops.Blocks.VAR_FOR"),
      },
      {
        type: "field_variable",
        name: "ENUMERABLE_VAR",
        variable: i18n.t("Blocky.Loops.Blocks.ENUM_FOR"),
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
    tooltip: i18n.t("Blocky.Loops.Blocks.FOR_TOOLTIP"),
    helpUrl: "",
  },
]);
