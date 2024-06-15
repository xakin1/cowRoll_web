import * as Blockly from "blockly";

Blockly.Blocks["function_definition"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("function")
      .appendField(new Blockly.FieldTextInput("name"), "NAME")
      .appendField("(");

    this.paramCount = 0;
    this.parameters = [];
    this.addParameterInput();

    this.appendDummyInput("ADD_PARAM")
      .appendField(new Blockly.FieldLabel("Add parameter"))
      .appendField(
        new Blockly.FieldImage(
          "https://www.gstatic.com/codesite/ph/images/star_on.gif",
          15,
          15,
          { alt: "Add", flipRtl: "FALSE" },
          () => {
            this.addParameterInput();
          }
        )
      )
      .appendField(") do");

    this.appendStatementInput("STACK").setCheck(null);
    this.appendDummyInput().appendField("end");

    this.setColour(290);
    this.setTooltip("Define a function with optional parameters");
    this.setHelpUrl("");
  },

  addParameterInput: function () {
    const input = this.appendDummyInput("PARAM" + this.paramCount).appendField(
      new Blockly.FieldVariable("param" + (this.paramCount + 1)),
      "PARAM" + this.paramCount
    );

    if (this.paramCount > 0) {
      input.insertFieldAt(
        0,
        new Blockly.FieldLabel(", "),
        "COMMA" + this.paramCount
      );
    }

    this.parameters.push("PARAM" + this.paramCount);
    this.paramCount++;
  },
};
