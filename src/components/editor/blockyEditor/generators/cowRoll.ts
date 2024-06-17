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
  ORDER_NONE: 0, // For 'or'
};

cowRollGenerator.scrub_ = function (block, code, thisOnly) {
  const comment = block.getCommentText();
  let commentCode = "";
  if (comment) {
    commentCode = "# " + comment + "\n";
  }

  const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  if (nextBlock && !thisOnly) {
    return commentCode + code + "\n" + cowRollGenerator.blockToCode(nextBlock);
  }
  return commentCode + code;
};

cowRollGenerator.forBlock = {};

cowRollGenerator.forBlock["text"] = function (block) {
  const textValue = block.getFieldValue("TEXT");
  const code = `"${textValue}"`;
  return [code, Order.ORDER_ATOMIC];
};

cowRollGenerator.forBlock["math_number"] = function (block) {
  const code = String(block.getFieldValue("NUM"));
  return [code, Order.ORDER_NONE];
};
cowRollGenerator.forBlock["rand_with_range"] = function (block) {
  const order = Order.ORDER_ATOMIC;
  const from = cowRollGenerator.valueToCode(block, "A", order) || 0;
  const to = cowRollGenerator.valueToCode(block, "B", order) || 0;
  const code = `rand(${from},${to})`;
  return [code, Order.ORDER_NONE];
};

cowRollGenerator.forBlock["rand"] = function (block) {
  const order = Order.ORDER_ATOMIC;
  const to = cowRollGenerator.valueToCode(block, "A", order) || 0;
  const code = `rand(${to})`;
  return [code, Order.ORDER_NONE];
};

cowRollGenerator.forBlock["math_custom_arithmetic"] = function (block) {
  const operator = block.getFieldValue("OP");
  let op;

  switch (operator) {
    case "ADD":
      op = "+";
      break;
    case "MINUS":
      op = "-";
      break;
    case "MULTIPLY":
      op = "*";
      break;
    case "DIVIDE":
      op = "/";
      break;
    case "ROUND_DIVIDE":
      op = "//";
      break;
    case "MODULO":
      op = "%";
      break;
    case "POWER":
      op = "^";
      break;
    default:
      throw new Error("Operador aritmético no soportado: " + operator);
  }

  const order = getOrderForOperator(op);
  const argument0 = cowRollGenerator.valueToCode(block, "A", order) || "0";
  const argument1 = cowRollGenerator.valueToCode(block, "B", order) || "0";
  const code = `${argument0} ${op} ${argument1}`;
  return [code, order];
};

cowRollGenerator.forBlock["for_with_var"] = function (block) {
  const variable = block.getField("VAR")?.getText() ?? "i";
  const enumerable = block.getField("ENUMERABLE_VAR")?.getText() || "enum";
  const statements = cowRollGenerator.statementToCode(block, "DO");

  const code = `for ${variable} <- ${enumerable} do\n${statements}\nend`;
  return code;
};

cowRollGenerator.forBlock["for"] = function (block) {
  const variable = block.getField("VAR")?.getText() ?? "i";
  const enumerable = cowRollGenerator.valueToCode(
    block,
    "ENUMERABLE",
    Order.ORDER_ATOMIC
  );
  const statements = cowRollGenerator.statementToCode(block, "DO");

  const code = `for ${variable} <- ${enumerable} do\n${statements}\nend`;
  return code;
};

cowRollGenerator.forBlock["for_with_range"] = function (block) {
  const variable = block.getField("VAR")?.getText() ?? "i";
  const range1 = cowRollGenerator.valueToCode(
    block,
    "RANGE1",
    Order.ORDER_ATOMIC
  );

  const range2 = cowRollGenerator.valueToCode(
    block,
    "RANGE1",
    Order.ORDER_ATOMIC
  );
  const statements = cowRollGenerator.statementToCode(block, "DO");

  const code = `for ${variable} <- ${range1}..${range2} do\n${statements}\nend`;
  return code;
};

cowRollGenerator.forBlock["array"] = function (block) {
  const elements = cowRollGenerator
    .statementToCode(block, "ELEMENTS")
    .replace(/[\n\s]/g, "");

  const code = `[${elements.trim()}]`;
  return [code, Order.ORDER_LIST];
};

cowRollGenerator.forBlock["array_element"] = function (block) {
  const value =
    cowRollGenerator.valueToCode(block, "VALUE", Order.ORDER_ATOMIC) || "null";
  const code = `${value}`;
  return code;
};

cowRollGenerator.forBlock["map"] = function (block) {
  const fields = cowRollGenerator
    .statementToCode(block, "FIELDS")
    .replace(/[\n\s]/g, "");
  const code = `{${fields}}`;
  return [code, Order.ORDER_LIST];
};

cowRollGenerator.forBlock["map_field"] = function (block) {
  const key = block.getFieldValue("KEY");
  const value =
    cowRollGenerator.valueToCode(block, "VALUE", Order.ORDER_ATOMIC) || "null";
  const code = `${key}: ${value}`;
  return code;
};

cowRollGenerator.forBlock["variables_get"] = function (block) {
  // Obtiene el nombre de la variable
  const variableName = block.getField("VAR")?.getText() ?? "x";
  const code = variableName;
  return [code, Order.ORDER_NONE];
};

cowRollGenerator.forBlock["variables_set"] = function (block) {
  // Obtiene el nombre de la variable
  const variableName = block.getField("VAR")?.getText() ?? "x";
  // Obtiene el valor que se va a asignar
  const value = cowRollGenerator.valueToCode(
    block,
    "VALUE",
    Order.ORDER_ATOMIC
  );
  const code = `${variableName} = ${value}`;
  return code;
};

cowRollGenerator.forBlock["procedures_defnoreturn"] = function (block) {
  const functionName = block.getField("NAME")?.getText() ?? "unnamed";
  const args = block.getVars(); // Obtiene los nombres de los parámetros
  console.log(args);
  const branch = cowRollGenerator.statementToCode(block, "STACK");

  // Construcción de la lista de parámetros
  const params = args.join(", ");

  const code = `function ${functionName} (${params}) do\n${branch}\nend`;
  return code;
};

cowRollGenerator.forBlock["custom_procedures_callnoreturn"] = function (block) {
  const functionName = block.getFieldValue("FUNCTION_NAME");
  const workspace = block.workspace;
  const functionBlock = workspace
    .getAllBlocks()
    .find(
      (block) =>
        block.type === "procedures_defnoreturn" &&
        block.getFieldValue("NAME") === functionName
    );

  const paramValues = [];
  if (functionBlock) {
    // Use the getVars() method to get the parameter names
    const paramNames = functionBlock.getVars();
    for (let i = 0; i < paramNames.length; i++) {
      const paramValue = cowRollGenerator.valueToCode(
        block,
        paramNames[i],
        Order.ORDER_ATOMIC
      );
      paramValues.push(paramValue || "null");
    }
  }

  const code = `${functionName}(${paramValues.join(", ")});\n`;
  return [code, Order.ORDER_NONE];
};

cowRollGenerator.forBlock["logic_boolean"] = function (block) {
  const code = block.getFieldValue("BOOL") === "TRUE" ? "true" : "false";
  return [code, Order.ORDER_NONE];
};

cowRollGenerator.forBlock["logic_operation"] = function (block) {
  const operator = block.getFieldValue("OP") === "AND" ? "and" : "or";
  const order = getOrderForOperator(operator);
  const argument0 = cowRollGenerator.valueToCode(block, "A", order) || "false";
  const argument1 = cowRollGenerator.valueToCode(block, "B", order) || "false";
  const code = `${argument0} ${operator} ${argument1}`;
  return [code, order];
};

cowRollGenerator.forBlock["logic_compare"] = function (block) {
  const OPERATORS: { [key: string]: string } = {
    EQ: "==",
    NEQ: "!=",
    LT: "<",
    GT: ">",
    LTE: "<=",
    GTE: ">=",
  };
  const operator = OPERATORS[block.getFieldValue("OP")];
  const order = getOrderForOperator(operator);
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
  const argument0 =
    cowRollGenerator.valueToCode(block, "VALUE", Order.ORDER_ATOMIC) || "";
  return argument0;
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
      (n === 0 ? "if " : "elseif ") +
      conditionCode +
      " then\n" +
      branchCode +
      "\n";
    n++;
  } while (block.getInput("IF" + n));

  if (block.getInput("ELSE")) {
    branchCode = cowRollGenerator.statementToCode(block, "ELSE");
    code += "else\n" + branchCode;
  }

  code += "end";
  return code + "\n";
};

function getOrderForOperator(operator: string) {
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
}
