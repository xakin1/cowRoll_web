import * as Blockly from "blockly";

import "./general";
import "./list";
import "./logic";
import "./loops";

class CustomLangGenerator extends Blockly.Generator {
  static ORDER_ATOMIC = 13; // Highest precedence
  static ORDER_UNARY = 12; // For 'index'
  static ORDER_VAR = 11; // For 'VAR'
  static ORDER_CALL = 10; // For 'name(arguments)'
  static ORDER_LIST = 10; // For 'list' and 'map'
  static ORDER_UNARY_MINUS = 8; // For 'uminus'
  static ORDER_UNARY_NOT = 8; // For 'uninot'
  static ORDER_EXPONENTIATION = 7; // For '^'
  static ORDER_MULTIPLICATION = 6; // For '*', '/', '//', '%'
  static ORDER_ADDITION = 5; // For '+', '-'
  static ORDER_INCREMENT = 4; // For '++', '--'
  static ORDER_RELATIONAL = 3; // For '<', '>', '<=', '>='
  static ORDER_EQUALITY = 2; // For '==', '!='
  static ORDER_LOGICAL_AND = 1; // For 'and'
  static ORDER_LOGICAL_OR = 1; // For 'or'

  constructor(name: string) {
    super(name);
  }

  public math_number(block: Blockly.Block): [string, number] {
    const code = block.getFieldValue("NUM") || "0";
    return [code, CustomLangGenerator.ORDER_ATOMIC];
  }

  public math_arithmetic(block: Blockly.Block): [string, number] {
    const OPERATORS: { [key: string]: string } = {
      ADD: "+",
      MINUS: "-",
      MULTIPLY: "*",
      DIVIDE: "/",
      POWER: "^",
      MODULO: "%",
    };
    const operator = OPERATORS[block.getFieldValue("OP")];
    const order = this.getOrderForOperator(operator);
    const argument0 = this.valueToCode(block, "A", order) || "0";
    const argument1 = this.valueToCode(block, "B", order) || "0";
    const code = `${argument0} ${operator} ${argument1}`;
    return [code, order];
  }

  public logic_compare(block: Blockly.Block): [string, number] {
    const OPERATORS: { [key: string]: string } = {
      EQ: "==",
      NEQ: "!=",
      LT: "<",
      GT: ">",
      LTE: "<=",
      GTE: ">=",
    };
    const operator = OPERATORS[block.getFieldValue("OP")];
    const order = this.getOrderForOperator(operator);
    const argument0 = this.valueToCode(block, "A", order) || "false";
    const argument1 = this.valueToCode(block, "B", order) || "false";
    const code = `${argument0} ${operator} ${argument1}`;
    return [code, order];
  }

  public logic_operation(block: Blockly.Block): [string, number] {
    const operator = block.getFieldValue("OP") === "AND" ? "and" : "or";
    const order = this.getOrderForOperator(operator);
    const argument0 = this.valueToCode(block, "A", order) || "false";
    const argument1 = this.valueToCode(block, "B", order) || "false";
    const code = `${argument0} ${operator} ${argument1}`;
    return [code, order];
  }

  public array(block: Blockly.Block): string {
    const elements = this.statementToCode(block, "ELEMENTS");
    const code = `[${elements}]`;
    return code;
  }

  public array_element(block: Blockly.Block): string {
    const value =
      this.valueToCode(block, "VALUE", CustomLangGenerator.ORDER_ATOMIC) ||
      "null";
    const code = `${value}, `;
    return code;
  }

  public map(block: Blockly.Block): string {
    const fields = this.statementToCode(block, "FIELDS");
    const code = `{${fields}}`;
    return code;
  }

  public map_field(block: Blockly.Block): string {
    const key = block.getFieldValue("KEY");
    const value =
      this.valueToCode(block, "VALUE", CustomLangGenerator.ORDER_ATOMIC) ||
      "null";
    const code = `"${key}": ${value}, `;
    return code;
  }

  public for_with_range(block: Blockly.Block): string {
    if (!this.nameDB_) {
      throw new Error("nameDB_ is not initialized.");
    }
    const variableField = block.getFieldValue("VALUE");
    const variable = this.nameDB_.getName(
      variableField ? variableField : "default",
      Blockly.Names.NameType.VARIABLE
    );
    const fromValue =
      this.valueToCode(block, "FROM", CustomLangGenerator.ORDER_ATOMIC) || "0";
    const toValue =
      this.valueToCode(block, "TO", CustomLangGenerator.ORDER_ATOMIC) || "0";
    const doCode = this.statementToCode(block, "DO");
    const code = `for ${variable} in range(${fromValue}, ${toValue}):\n${doCode}`;
    return code;
  }

  public for(block: Blockly.Block): string {
    if (!this.nameDB_) {
      throw new Error("nameDB_ is not initialized.");
    }
    const variableField = block.getFieldValue("VAR");
    const variable = this.nameDB_.getName(
      variableField ? variableField : "default",
      Blockly.Names.NameType.VARIABLE
    );
    const enumerable =
      this.valueToCode(block, "ENUMERABLE", CustomLangGenerator.ORDER_ATOMIC) ||
      "[]";
    const doCode = this.statementToCode(block, "DO");
    const code = `for ${variable} in ${enumerable}:\n${doCode}`;
    return code;
  }

  public for_with_var(block: Blockly.Block): string {
    if (!this.nameDB_) {
      throw new Error("nameDB_ is not initialized.");
    }
    const variableField = block.getFieldValue("VAR");
    const enumerableField = block.getFieldValue("enum");
    const variable = this.nameDB_.getName(
      variableField ? variableField : "default",
      Blockly.Names.NameType.VARIABLE
    );
    const enumerable = this.nameDB_.getName(
      enumerableField ? enumerableField : "default",
      Blockly.Names.NameType.VARIABLE
    );
    const doCode = this.statementToCode(block, "DO");
    const code = `for ${variable} in ${enumerable}:\n${doCode}`;
    return code;
  }

  public custom_if(block: Blockly.Block): string {
    let n = 0;
    let code = "";
    do {
      const conditionCode =
        this.valueToCode(block, "IF" + n, CustomLangGenerator.ORDER_ATOMIC) ||
        "false";
      const branchCode = this.statementToCode(block, "DO" + n);
      code +=
        (n === 0 ? "if " : "else if ") + conditionCode + " then\n" + branchCode;
      ++n;
    } while (block.getInput("IF" + n));

    if (block.getInput("ELSE")) {
      const branchCode = this.statementToCode(block, "ELSE");
      code += "else\n" + branchCode;
    }

    return code + "end\n";
  }

  public procedures_defnoreturn(block: Blockly.Block): string {
    if (!this.nameDB_) {
      throw new Error("nameDB_ is not initialized.");
    }

    const funcName = this.nameDB_.getName(
      block.getFieldValue("NAME"),
      Blockly.Names.NameType.VARIABLE
    );
    const branch = this.statementToCode(block, "STACK");
    const code = `function ${funcName} do\n${branch}\nend\n`;
    return code;
  }

  public procedures_callreturn(block: Blockly.Block): string {
    if (!this.nameDB_) {
      throw new Error("nameDB_ is not initialized.");
    }
    const funcName = this.nameDB_.getName(
      block.getFieldValue("NAME"),
      Blockly.Names.NameType.VARIABLE
    );
    const args = [];
    for (let i = 0; i < block.inputList.length; i++) {
      const input = block.inputList[i];
      if (input.name.startsWith("ARG")) {
        const argCode =
          this.valueToCode(
            block,
            input.name,
            CustomLangGenerator.ORDER_ATOMIC
          ) || "null";
        args.push(argCode);
      }
    }
    const code = `${funcName}(${args.join(", ")})`;
    return code;
  }

  private getOrderForOperator(operator: string): number {
    switch (operator) {
      case "+":
      case "-":
        return CustomLangGenerator.ORDER_ADDITION;
      case "*":
      case "/":
      case "%":
        return CustomLangGenerator.ORDER_MULTIPLICATION;
      case "^":
        return CustomLangGenerator.ORDER_EXPONENTIATION;
      case "==":
      case "!=":
        return CustomLangGenerator.ORDER_EQUALITY;
      case "<":
      case ">":
      case "<=":
      case ">=":
        return CustomLangGenerator.ORDER_RELATIONAL;
      case "and":
        return CustomLangGenerator.ORDER_LOGICAL_AND;
      case "or":
        return CustomLangGenerator.ORDER_LOGICAL_OR;
      default:
        return CustomLangGenerator.ORDER_ATOMIC;
    }
  }

  public init(workspace: Blockly.Workspace): void {
    // Básicamente aquí estamos guardando el mapeo de las variables
    this.nameDB_ = new Blockly.Names(Blockly.Names.NameType.VARIABLE);
  }

  public finish(code: string): string {
    // Finalize the code, if needed
    return code;
  }

  public scrub_(block: Blockly.Block, code: string): string {
    // Scrub function to handle comments, etc., if needed
    return code;
  }
}

// Create an instance of the custom language generator
const CowRoll_language = new CustomLangGenerator("CowRoll_language");

// Assign the generator functions
CowRoll_language["math_number"] = function (block) {
  return CowRoll_language.math_number(block);
};
CowRoll_language["math_arithmetic"] = function (block) {
  return CowRoll_language.math_arithmetic(block);
};
CowRoll_language["logic_compare"] = function (block) {
  return CowRoll_language.logic_compare(block);
};
CowRoll_language["logic_operation"] = function (block) {
  return CowRoll_language.logic_operation(block);
};
CowRoll_language["array"] = function (block) {
  return CowRoll_language.array(block);
};
CowRoll_language["array_element"] = function (block) {
  return CowRoll_language.array_element(block);
};
CowRoll_language["map"] = function (block) {
  return CowRoll_language.map(block);
};
CowRoll_language["map_field"] = function (block) {
  return CowRoll_language.map_field(block);
};
CowRoll_language["for_with_range"] = function (block) {
  return CowRoll_language.for_with_range(block);
};
CowRoll_language["for"] = function (block) {
  return CowRoll_language.for(block);
};
CowRoll_language["for_with_var"] = function (block) {
  return CowRoll_language.for_with_var(block);
};
CowRoll_language["custom_if"] = function (block) {
  return CowRoll_language.custom_if(block);
};
CowRoll_language["procedures_defnoreturn"] = function (block) {
  return CowRoll_language.procedures_defnoreturn(block);
};
CowRoll_language["procedures_callreturn"] = function (block) {
  return CowRoll_language.procedures_callreturn(block);
};

// Export the generator
export default CowRoll_language;
