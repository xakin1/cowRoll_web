import { typeField } from "./RenderFields";
import type { Field } from "./types";

export const handleExecuteSheetCode = (
  script: string,
  fields: Field[]
): string => {
  const parameterValues: { [key: string]: any } = {};

  // Recopilar nombres y valores de los campos
  fields.forEach((field) => {
    if (field.type === typeField.selectable) {
      parameterValues[field.name] = field.options;
    } else {
      parameterValues[field.name] = field.value;
    }
  });

  // Extraer los nombres de los parámetros de la función main
  const codeVariables = extractMainParameters(script);

  // Verificar si hay variables faltantes
  const missingVariables = codeVariables.filter(
    (varName) => !(varName in parameterValues)
  );
  if (missingVariables.length > 0) {
    // Mostrar modal para pedir valores de variables faltantes
    const missingValues = prompt(
      `Please enter values for missing variables (${missingVariables.join(", ")}), separated by commas:`
    );

    if (missingValues) {
      const valuesArray = missingValues.split(",").map((value) => value.trim());
      missingVariables.forEach((varName, index) => {
        parameterValues[varName] = valuesArray[index];
      });
    } else {
      return ""; // Si el usuario no ingresa los valores, salir de la función
    }
  }

  // Generar los parámetros en orden y descartar los innecesarios
  const generateOrderedValues = (
    codeVariables: string[],
    parameterValues: { [key: string]: any }
  ) => {
    return codeVariables
      .map((name) => {
        const value = parameterValues[name];

        if (value === undefined || value === "") {
          return '""';
        } else if (Array.isArray(value)) {
          return JSON.stringify(value);
        } else {
          return value;
        }
      })
      .join(",");
  };
  const orderedValues = generateOrderedValues(codeVariables, parameterValues);

  // Generar la llamada a main con los parámetros
  const mainCall = `\nmain(${orderedValues})`;

  // Concatenar la llamada a main al contenido del archivo
  return `${script}\n\n${mainCall}`;
};

export const extractMainParameters = (code: string): string[] => {
  const mainFunctionRegex = /function\s+main\s*\(([^)]*)\)/;
  const match = mainFunctionRegex.exec(code);
  if (match) {
    const params = match[1].trim(); // Elimina cualquier espacio en blanco
    return params ? params.split(",").map((param) => param.trim()) : []; // Verifica si params no está vacío
  }
  return [];
};
