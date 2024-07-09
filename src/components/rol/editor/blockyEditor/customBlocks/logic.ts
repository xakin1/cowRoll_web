import * as Blockly from "blockly";
import i18n from "../../../../../i18n/i18n";

Blockly.defineBlocksWithJsonArray([
  {
    type: "custom_if",
    message0: i18n.t("Blocky.Logic.Blocks.CUSTOM_IF"),
    args0: [
      {
        type: "input_value",
        name: "IF0",
        check: "Boolean",
      },
      {
        type: "input_statement",
        name: "DO0",
      },
    ],
    mutator: "custom_if_mutator",
    previousStatement: null,
    nextStatement: null,
    colour: 210,
    tooltip: i18n.t("Blocky.Logic.Blocks.CUSTOM_IF_TOOLTIP"),
    helpUrl: "",
  },
  {
    type: "custom_elseif_mutator",
    message0: i18n.t("Blocky.Logic.Blocks.ELSEIF"),
    nextStatement: null,
    previousStatement: null,
    colour: 210,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "custom_if_mutator",
    message0: i18n.t("Blocky.Logic.Blocks.IF"),
    nextStatement: null,
    previousStatement: null,
    colour: 210,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "custom_else_mutator",
    message0: i18n.t("Blocky.Logic.Blocks.ELSE"),
    nextStatement: null,
    previousStatement: null,
    colour: 210,
    tooltip: "",
    helpUrl: "",
  },
]);

Blockly.Extensions.registerMutator(
  "custom_if_mutator",
  {
    mutationToDom: function () {
      const container = document.createElement("mutation");
      container.setAttribute("elseif", String(this.elseifCount_));
      container.setAttribute("else", String(this.elseCount_));
      return container;
    },
    domToMutation: function (xmlElement: Element) {
      this.elseifCount_ = parseInt(
        xmlElement.getAttribute("elseif") || "0",
        10
      );
      this.elseCount_ = parseInt(xmlElement.getAttribute("else") || "0", 10);
      this.updateShape_();
    },
    decompose: function (workspace: Blockly.Workspace) {
      const containerBlock = workspace.newBlock("custom_if_mutator");
      //Realmente existe pero por alguna razón pone que no
      containerBlock.initSvg();
      let connection = containerBlock.nextConnection;
      for (let i = 1; i <= this.elseifCount_; i++) {
        const elseifBlock = workspace.newBlock("custom_elseif_mutator");
        if (elseifBlock.previousConnection)
          connection?.connect(elseifBlock.previousConnection);
        connection = elseifBlock.nextConnection;
      }
      if (this.elseCount_) {
        const elseBlock = workspace.newBlock("custom_else_mutator");
        if (elseBlock.previousConnection)
          connection?.connect(elseBlock.previousConnection);
      }
      return containerBlock;
    },
    compose: function (containerBlock: Blockly.Block) {
      let clauseBlock = containerBlock.nextConnection?.targetBlock() || null;
      this.elseifCount_ = 0;
      this.elseCount_ = 0;
      const valueConnections: (Blockly.Connection | null)[] = [null];
      const statementConnections: (Blockly.Connection | null)[] = [null];
      let elseStatementConnection: Blockly.Connection | null = null;
      let i = 1;
      while (clauseBlock) {
        switch (clauseBlock.type) {
          case "custom_elseif_mutator":
            this.elseifCount_++;
            valueConnections[i] = (clauseBlock as any).valueConnection_;
            statementConnections[i] = (clauseBlock as any).statementConnection_;
            i++;
            break;
          case "custom_else_mutator":
            this.elseCount_++;
            elseStatementConnection = (clauseBlock as any).statementConnection_;
            break;
          default:
            throw new Error("Unknown block type.");
        }
        clauseBlock =
          clauseBlock.nextConnection &&
          clauseBlock.nextConnection.targetBlock();
      }
      this.updateShape_();
    },
    updateShape_: function () {
      if (this.getInput("ELSE")) {
        this.removeInput("ELSE");
      }
      for (let i = 1; this.getInput("IF" + i); i++) {
        this.removeInput("IF" + i);
        this.removeInput("DO" + i);
      }
      for (let i = 1; i <= this.elseifCount_; i++) {
        this.appendValueInput("IF" + i)
          .setCheck("Boolean")
          .appendField(i18n.t("Blocky.Logic.Blocks.ELSEIF"));
        this.appendStatementInput("DO" + i).appendField(
          i18n.t("Blocky.Logic.Blocks.THEN")
        );
      }
      if (this.elseCount_) {
        this.appendStatementInput("ELSE").appendField(
          i18n.t("Blocky.Logic.Blocks.ELSE")
        );
      }
    },
  },
  undefined,
  ["custom_elseif_mutator", "custom_else_mutator"]
);
