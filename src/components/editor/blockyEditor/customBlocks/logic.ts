import * as Blockly from "blockly";

Blockly.defineBlocksWithJsonArray([
  {
    type: "custom_if",
    message0: "if %1 then %2 end",
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
    tooltip: "If-ElseIf-Else block",
    helpUrl: "",
  },
  {
    type: "custom_elseif_mutator",
    message0: "elseif",
    nextStatement: null,
    previousStatement: null,
    colour: 210,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "custom_if_mutator",
    message0: "if",
    nextStatement: null,
    previousStatement: null,
    colour: 210,
    tooltip: "",
    helpUrl: "",
  },
  {
    type: "custom_else_mutator",
    message0: "else",
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
      var container = document.createElement("mutation");
      container.setAttribute("elseif", this.elseifCount_);
      container.setAttribute("else", this.elseCount_);
      return container;
    },
    domToMutation: function (xmlElement) {
      this.elseifCount_ = parseInt(xmlElement.getAttribute("elseif"), 10);
      this.elseCount_ = parseInt(xmlElement.getAttribute("else"), 10);
      this.updateShape_();
    },
    decompose: function (workspace) {
      var containerBlock = workspace.newBlock("custom_if_mutator");
      containerBlock.initSvg();
      var connection = containerBlock.nextConnection;
      for (var i = 1; i <= this.elseifCount_; i++) {
        var elseifBlock = workspace.newBlock("custom_elseif_mutator");
        elseifBlock.initSvg();
        connection.connect(elseifBlock.previousConnection);
        connection = elseifBlock.nextConnection;
      }
      if (this.elseCount_) {
        var elseBlock = workspace.newBlock("custom_else_mutator");
        elseBlock.initSvg();
        connection.connect(elseBlock.previousConnection);
      }
      return containerBlock;
    },
    compose: function (containerBlock) {
      var clauseBlock = containerBlock.nextConnection.targetBlock();
      this.elseifCount_ = 0;
      this.elseCount_ = 0;
      var valueConnections = [null];
      var statementConnections = [null];
      var elseStatementConnection = null;
      var i = 1;
      while (clauseBlock) {
        switch (clauseBlock.type) {
          case "custom_elseif_mutator":
            this.elseifCount_++;
            valueConnections[i] = clauseBlock.valueConnection_;
            statementConnections[i] = clauseBlock.statementConnection_;
            i++;
            break;
          case "custom_else_mutator":
            this.elseCount_++;
            elseStatementConnection = clauseBlock.statementConnection_;
            break;
          default:
            throw "Unknown block type.";
        }
        clauseBlock =
          clauseBlock.nextConnection &&
          clauseBlock.nextConnection.targetBlock();
      }
      this.updateShape_();
      this.reconnectChildBlocks_(
        valueConnections,
        statementConnections,
        elseStatementConnection
      );
    },
    updateShape_: function () {
      if (this.getInput("ELSE")) {
        this.removeInput("ELSE");
      }
      for (var i = 1; this.getInput("IF" + i); i++) {
        this.removeInput("IF" + i);
        this.removeInput("DO" + i);
      }
      for (var i = 1; i <= this.elseifCount_; i++) {
        this.appendValueInput("IF" + i)
          .setCheck("Boolean")
          .appendField("elseif");
        this.appendStatementInput("DO" + i).appendField("then");
      }
      if (this.elseCount_) {
        this.appendStatementInput("ELSE").appendField("else");
      }
    },
    reconnectChildBlocks_: function (
      valueConnections,
      statementConnections,
      elseStatementConnection
    ) {
      for (var i = 1; i <= this.elseifCount_; i++) {
        Blockly.Mutator.reconnect(valueConnections[i], this, "IF" + i);
        Blockly.Mutator.reconnect(statementConnections[i], this, "DO" + i);
      }
      Blockly.Mutator.reconnect(elseStatementConnection, this, "ELSE");
    },
  },
  null,
  ["custom_elseif_mutator", "custom_else_mutator"]
);
