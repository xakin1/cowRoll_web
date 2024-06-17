import * as Blockly from "blockly";
import i18n from "../../../../i18n/i18n";

Blockly.defineBlocksWithJsonArray([
  {
    type: "return",
    message0: i18n.t("Blocky.General.Blocks.RETURN"),
    args0: [
      {
        type: "input_value",
        name: "VALUE",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 800,
    tooltip: i18n.t("Blocky.General.Blocks.RETURN_TOOLTIP"),
    helpUrl: "",
  },
]);
