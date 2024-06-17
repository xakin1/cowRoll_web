import * as Blockly from "blockly";
import i18n from "../../../../i18n/i18n";

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
    message0: i18n.t("Blocky.Math.Blocks.RAND_INTERVAL"),
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
    tooltip: i18n.t("Blocky.Math.Blocks.RAND_INTERVAL_TOOLTIP"),
    helpUrl: "",
  },
  {
    type: "rand",
    message0: i18n.t("Blocky.Math.Blocks.RAND"),
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
    tooltip: i18n.t("Blocky.Math.Blocks.RAND_TOOLTIP"),
    helpUrl: "",
  },
]);
