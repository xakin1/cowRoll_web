import * as Blockly from "blockly";

Blockly.Blocks["procedures_callnoreturn_as_return"] = {
  init: function () {
    this.appendDummyInput().appendField(
      new Blockly.FieldLabelSerializable("call"),
      "NAME"
    );
    this.arguments_ = [];
    this.setOutput(true, null);
    this.setColour(290);
    this.setTooltip("");
    this.setHelpUrl("");
    this.procName_ = "";
  },
  getProcedureCall: function (): string {
    return this.procName_;
  },
  renameProcedure: function (oldName: string, newName: string): void {
    if (Blockly.Names.equals(oldName, this.procName_)) {
      this.procName_ = newName;
      this.setFieldValue(newName, "NAME");
    }
  },
  setProcedureParameters_: function (
    paramNames: string[],
    _paramIds: any
  ): void {
    // Remove all inputs.
    for (let i = 0; this.getInput("ARG" + i); i++) {
      this.removeInput("ARG" + i);
    }
    // Rebuild the inputs.
    for (let i = 0; i < paramNames.length; i++) {
      this.appendValueInput("ARG" + i)
        .setAlign("RIGHT")
        .appendField(paramNames[i]);
    }
    this.arguments_ = [...paramNames];
  },

  mutationToDom: function (): Element {
    const container = document.createElement("mutation");
    container.setAttribute("name", this.procName_);
    for (let i = 0; i < this.arguments_.length; i++) {
      const parameter = document.createElement("arg");
      parameter.setAttribute("name", this.arguments_[i]);
      container.appendChild(parameter);
    }
    return container;
  },
  domToMutation: function (xmlElement: Element): void {
    const name = xmlElement.getAttribute("name") || "";
    this.procName_ = name;
    this.setFieldValue(name, "NAME");
    const args: string[] = [];
    for (
      let i = 0, childNode;
      (childNode = xmlElement.childNodes[i] as Element);
      i++
    ) {
      if (childNode.nodeName === "arg") {
        args.push(childNode.getAttribute("name") || "");
      }
    }
    this.setProcedureParameters_(args, null);
  },
  getVars: function (): string[] {
    return this.arguments_;
  },
  customContextMenu: function (options: any[]): void {
    const option: any = { enabled: true };
    const name = this.getProcedureCall();
    option.text = "Set as return value: " + name;
    const xmlMutation = Blockly.utils.xml.createElement("mutation");
    xmlMutation.setAttribute("name", name);
    const block = Blockly.utils.xml.createElement("block");
    block.setAttribute("type", this.type);
    block.appendChild(xmlMutation);
    option.callback = function () {
      Blockly.ContextMenu.callbackFactory(this, xmlMutation)();
    };
    options.push(option);
  },
};
