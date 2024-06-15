import * as Blockly from "blockly";

export const cowRollGenerator = new Blockly.Generator("COW_ROLL");

const Order = {
  ORDER_ATOMIC: 13, // Highest precedence
  ORDER_UNARY: 12, // For 'index'
  ORDER_VAR: 11, // For 'VAR'
  ORDER_CALL: 10, // For 'name(arguments)'
  ORDER_LIST: 10, // For 'list' and 'map'
  ORDER_UNARY_MINUS: 8, // For 'uminus'
  ORDER_UNARY_NOT: 8, // For 'uninot'
  ORDER_EXPONENTIATION: 7, // For '^'
  ORDER_MULTIPLICATION: 6, // For '*', '/', '//', '%'
  ORDER_ADDITION: 5, // For '+', '-'
  ORDER_INCREMENT: 4, // For '++', '--'
  ORDER_RELATIONAL: 3, // For '<', '>', '<:', '>:'
  ORDER_EQUALITY: 2, // For '==', '!='
  ORDER_LOGICAL_AND: 1, // For 'and'
  ORDER_LOGICAL_OR: 1, // For 'or'
};

cowRollGenerator.scrub_ = function (block, code, thisOnly) {
  const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  if (nextBlock && !thisOnly) {
    return code + ",\n" + cowRollGenerator.blockToCode(nextBlock);
  }
  return code;
};

cowRollGenerator.forBlock = {};

cowRollGenerator.forBlock["text"] = function (block) {
  const textValue = block.getFieldValue("TEXT");
  const code = `"${textValue}"`;
  return [code, Order.ORDER_ATOMIC];
};

cowRollGenerator.forBlock["math_number"] = function (block) {
  const code = String(block.getFieldValue("NUM"));
  return [code, Order.ORDER_ATOMIC];
};

cowRollGenerator.forBlock["logic_boolean"] = function (block) {
  const code = block.getFieldValue("BOOL") === "TRUE" ? "true" : "false";
  return [code, Order.ORDER_ATOMIC];
};

cowRollGenerator.forBlock["logic_operation"] = function (block) {
  const operator = block.getFieldValue("OP") === "AND" ? "and" : "or";
  const order = cowRollGenerator.getOrderForOperator(operator);
  const argument0 = cowRollGenerator.valueToCode(block, "A", order) || "false";
  const argument1 = cowRollGenerator.valueToCode(block, "B", order) || "false";
  const code = `${argument0} ${operator} ${argument1}`;
  return [code, order];
};

cowRollGenerator.forBlock["logic_compare"] = function (block) {
  const OPERATORS = {
    EQ: "==",
    NEQ: "!=",
    LT: "<",
    GT: ">",
    LTE: "<=",
    GTE: ">=",
  };
  const operator = OPERATORS[block.getFieldValue("OP")];
  const order = cowRollGenerator.getOrderForOperator(operator);
  const argument0 = cowRollGenerator.valueToCode(block, "A", order) || "false";
  const argument1 = cowRollGenerator.valueToCode(block, "B", order) || "false";
  const code = `${argument0} ${operator} ${argument1}`;
  return [code, order];
};

cowRollGenerator.forBlock["logic_negate"] = function (block) {
  const order = Order.ORDER_UNARY_NOT;
  const argument0 =
    cowRollGenerator.valueToCode(block, "BOOL", order) || "false";
  const code = `not ${argument0}`;
  return [code, order];
};

cowRollGenerator.forBlock["return"] = function (block) {
  const order = Order.ORDER_ATOMIC;
  const argument0 = cowRollGenerator.valueToCode(block, "VALUE", order) || "";
  const code = `${argument0}\n`;
  return code;
};

cowRollGenerator.forBlock["custom_if"] = function (block) {
  let n = 0;
  let code = "";
  let branchCode, conditionCode;
  const order = Order.ORDER_ATOMIC;

  do {
    conditionCode =
      cowRollGenerator.valueToCode(block, "IF" + n, order) || "false";
    branchCode = cowRollGenerator.statementToCode(block, "DO" + n);
    code +=
      (n === 0 ? "if " : "elseif ") + conditionCode + " then\n" + branchCode;
    n++;
  } while (block.getInput("IF" + n));

  if (block.getInput("ELSE")) {
    branchCode = cowRollGenerator.statementToCode(block, "ELSE");
    code += "else\n" + branchCode;
  }

  code += "end";
  return code + "\n";
};

cowRollGenerator.getOrderForOperator = function (operator) {
  switch (operator) {
    case "+":
    case "-":
      return Order.ORDER_ADDITION;
    case "*":
    case "/":
    case "%":
      return Order.ORDER_MULTIPLICATION;
    case "^":
      return Order.ORDER_EXPONENTIATION;
    case "==":
    case "!=":
      return Order.ORDER_EQUALITY;
    case "<":
    case ">":
    case "<=":
    case ">=":
      return Order.ORDER_RELATIONAL;
    case "and":
      return Order.ORDER_LOGICAL_AND;
    case "or":
      return Order.ORDER_LOGICAL_OR;
    default:
      return Order.ORDER_ATOMIC;
  }
};
