import * as pdfjsLib from "pdfjs-dist";
import React, {
  createContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { useAppSelector } from "../../../hooks/customHooks";
import i18n from "../../../i18n/i18n";
import { addOutput } from "../../../redux/slice/codeSlice";
import type { RootState } from "../../../redux/store";
import { editFile, executeCode } from "../../../services/codeApi";
import {
  type EditSheetProps,
  type SheetProps,
} from "../../../utils/types/ApiTypes";
import { toastStyle } from "../../Route";
import {
  sufixSelectable,
  type BlocklyRefProps,
} from "../editor/blockyEditor/BlocklyEditor";
import { typeField } from "./RenderFields";
import type { Field, FieldWithoutId, Id } from "./types";

interface SheetContextProps {
  sheets: Field[][];
  sheet: SheetProps | undefined;
  isContextMenuVisible: boolean;
  currentSheetIndex: number;
  mode: boolean;
  addField: (field: FieldWithoutId) => Field;
  updateField: (updatedField: Field) => void;
  updateFieldStyle: (id: Id, style: { [key: string]: any }) => void;
  updatePartialField: (id: Id, changes: Partial<Field>) => void;
  setSheet: (sheet: SheetProps) => void;
  setIsContextMenuVisible: (visible: boolean) => void;
  removeField: (id: Id) => void;
  saveFields: (props: EditSheetProps) => void;
  loadFields: () => void;
  changeMode: (editing: boolean) => void;
  addSheet: () => void;
  removeSheet: (index: number) => void;
  nextSheet: () => void;
  previousSheet: () => void;
  handleExecuteCode: () => void;
  goToSheet: (page: number) => void;
  setBlocklyRef: (ref: RefObject<BlocklyRefProps>) => void;
}

export const SheetContext = createContext<SheetContextProps | undefined>(
  undefined
);

interface SheetProviderProps {
  children: ReactNode;
}

export const SheetProvider: React.FC<SheetProviderProps> = ({ children }) => {
  const [sheets, setSheets] = useState<Field[][]>([[]]);
  const [sheet, setSheet] = useState<SheetProps>();
  const [mode, setMode] = useState<boolean>(false);
  const [isContextMenuVisible, setIsContextMenuVisible] =
    useState<boolean>(false);
  const [currentSheetIndex, setCurrentSheetIndex] = useState(0);
  const blocklyRef = useRef<BlocklyRefProps | null>(null);
  const dispatch = useDispatch();

  const file = useAppSelector(
    (state: RootState) => state.directorySystem.selectedFile
  );

  useEffect(() => {
    updateBlocklyVariables(sheets[currentSheetIndex]);
  }, [file]);

  const updateBlocklyVariables = (fields: Field[]) => {
    if (blocklyRef.current) {
      blocklyRef.current.updateVariables(
        fields.filter((field) => {
          return (
            field.type != typeField.rectangle &&
            field.type != typeField.circle &&
            field.type != typeField.pdf &&
            field.type != typeField.photo
          );
        })
      );
    }
  };

  const handleExecuteCode = () => {
    if (!file || !file.content) return;

    const fields = sheets[currentSheetIndex];
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
    const codeVariables = extractMainParameters(file.content);

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
        const valuesArray = missingValues
          .split(",")
          .map((value) => value.trim());
        missingVariables.forEach((varName, index) => {
          parameterValues[varName] = valuesArray[index];
        });
      } else {
        return; // Si el usuario no ingresa los valores, salir de la función
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
    const finalCode = `${file.content}\n\n${mainCall}`;

    // Ejecutar el código (puedes modificar esta parte según tus necesidades)
    executeAndHandleCode(finalCode);
  };

  const extractMainParameters = (code: string): string[] => {
    const mainFunctionRegex = /function\s+main\s*\(([^)]*)\)/;
    const match = mainFunctionRegex.exec(code);
    if (match) {
      const params = match[1].trim(); // Elimina cualquier espacio en blanco
      return params ? params.split(",").map((param) => param.trim()) : []; // Verifica si params no está vacío
    }
    return [];
  };

  const executeAndHandleCode = async (code: string) => {
    try {
      const response = await executeCode(code);
      if (response) {
        dispatch(addOutput(response));
      } else {
        dispatch(addOutput({ message: "" }));
      }
    } catch (error) {
      console.error("Error executing code:", error);
    }
  };

  const output = useAppSelector((state) => state.code.output);
  useEffect(() => {
    setSheets((prevSheets) => {
      const newSheets = [...prevSheets];

      newSheets[currentSheetIndex] = newSheets[currentSheetIndex].map(
        (field) => {
          if (output.hasOwnProperty(field.name)) {
            if (field.type === typeField.selectable) {
              const optionsKey = field.name;
              const valueKey = field.name + sufixSelectable;
              const indexValue = output[valueKey];
              return {
                ...field,
                options: output[optionsKey] || "",
                value: output[optionsKey][indexValue] || "",
              };
            } else {
              return {
                ...field,
                value: output[field.name as string],
              };
            }
          }
          return field;
        }
      );
      return newSheets;
    });
  }, [output, currentSheetIndex, setSheets]);

  const setBlocklyRef = (ref: RefObject<BlocklyRefProps>) => {
    blocklyRef.current = ref.current;
  };

  const addField = (field: FieldWithoutId): Field => {
    const newSheets = [...sheets];
    const currentFields = newSheets[currentSheetIndex];

    const doesNameExist = (name: string): boolean => {
      return newSheets.some((sheet) =>
        sheet.some((existingField) => existingField.name === name)
      );
    };

    let baseName: string = field.type;
    let newName = baseName;
    let counter = 1;

    // Append a counter to the name until a unique one is found
    while (doesNameExist(newName)) {
      newName = `${baseName}${counter}`;
      counter++;
    }

    // Create the new field with a unique name
    const createdField: Field = {
      ...field,
      id: uuidv4(),
      name: newName,
    };

    // Update the state with the new field
    setSheets((prevSheets) => {
      const newSheets = [...prevSheets];
      newSheets[currentSheetIndex] = [...currentFields, createdField];
      updateBlocklyVariables(newSheets[currentSheetIndex]);

      return newSheets;
    });

    return createdField;
  };

  // Function to update field style
  const updateFieldStyle = (id: Id, style: { [key: string]: string }) => {
    setSheets((prevSheets) => {
      const newSheets = [...prevSheets];
      newSheets[currentSheetIndex] = newSheets[currentSheetIndex].map(
        (field) =>
          field.id === id
            ? { ...field, style: { ...field.style, ...style } }
            : field
      );
      return newSheets;
    });
  };

  const updatePartialField = (fieldId: string, changes: Partial<Field>) => {
    const newSheets = sheets.map((sheetFields, index) =>
      index === currentSheetIndex
        ? sheetFields.map((field) => {
            if (field.id === fieldId) {
              const updatedField = { ...field };

              for (const key in changes) {
                if (
                  changes.hasOwnProperty(key) &&
                  typeof changes[key as keyof Field] === "object" &&
                  changes[key as keyof Field] !== null
                ) {
                  updatedField[key as keyof Field] = {
                    ...field[key as keyof Field],
                    ...(changes[key as keyof Field] as object),
                  };
                } else {
                  updatedField[key as keyof Field] =
                    changes[key as keyof Field];
                }
              }

              return updatedField;
            }
            return field;
          })
        : sheetFields
    );

    setSheets(newSheets);
  };

  // Function to remove a field
  const removeField = (id: Id) => {
    setSheets((prevSheets) => {
      const newSheets = [...prevSheets];
      newSheets[currentSheetIndex] = newSheets[currentSheetIndex].filter(
        (field) => field.id !== id
      );
      updateBlocklyVariables(newSheets[currentSheetIndex]);

      return newSheets;
    });
  };

  const updateField = (updatedField: Field) => {
    setSheets((prevSheets) => {
      const newSheets = [...prevSheets];

      const fieldIndex = newSheets[currentSheetIndex].findIndex(
        (field) => field.id === updatedField.id
      );

      if (fieldIndex !== -1) {
        const existingField = newSheets[currentSheetIndex][fieldIndex];

        const nameExists = newSheets[currentSheetIndex].some(
          (field) =>
            field.name === updatedField.name && field.id !== updatedField.id
        );

        if (nameExists) {
          toast.error(
            i18n.t("Rol.Sheet.Style.nameNotAvailable", updatedField.name),
            toastStyle
          );
          return prevSheets;
        }

        for (const key in updatedField) {
          if (updatedField.hasOwnProperty(key) && !["style"].includes(key)) {
            newSheets[currentSheetIndex][fieldIndex][key as keyof Field] =
              updatedField[key as keyof Field]!;
          }
        }

        if (blocklyRef.current && existingField.name !== updatedField.name) {
          blocklyRef.current.renameVariable(
            existingField.name,
            updatedField.name
          );
        }

        updateBlocklyVariables(newSheets[currentSheetIndex]);
      }

      return newSheets;
    });
  };

  const saveFields = async (props: EditSheetProps) => {
    const sheetsJSON = JSON.stringify(sheets);

    if (sheetsJSON && sheetsJSON !== "{}" && sheetsJSON !== "[]") {
      const fileProps = {
        ...props,
        content: sheetsJSON,
      };

      try {
        const response = await editFile(fileProps);

        if (blocklyRef.current) {
          blocklyRef.current.saveContent();
        }

        if (response && "message" in response) {
          toast.success(i18n.t("General.saveSuccess"), toastStyle);
        } else {
          toast.error(i18n.t("Errors." + response?.error), toastStyle);
        }
      } catch (error) {
        console.error("Error saving fields:", error);
        toast.error(i18n.t("Errors.generalError"), toastStyle);
      }
    }
  };

  const loadFields = () => {
    if (sheet && sheet.content) {
      setSheets(JSON.parse(sheet.content));
      updateBlocklyVariables(JSON.parse(sheet.content)[currentSheetIndex]);
    }
  };

  const addSheet = () => {
    setSheets((prevSheets) => [...prevSheets, []]);
    setCurrentSheetIndex(sheets.length);
  };

  const changeMode = (editing: boolean) => {
    setMode(editing);
  };

  const removeSheet = (index: number) => {
    let sheetsCopy = [...sheets];

    sheetsCopy.splice(index, 1);

    setSheets(sheetsCopy);

    setCurrentSheetIndex(
      index >= sheetsCopy.length ? sheetsCopy.length - 1 : index
    );
  };

  const nextSheet = () => {
    setCurrentSheetIndex((prevIndex) =>
      prevIndex < sheets.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const previousSheet = () => {
    setCurrentSheetIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };

  const goToSheet = (page: number) => {
    setCurrentSheetIndex(page);
  };

  function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  const renderPDFPages = async (pdfData: string): Promise<Field[][]> => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

    try {
      const pdfDataBuffer = base64ToArrayBuffer(pdfData);

      const loadingTask = pdfjsLib.getDocument({ data: pdfDataBuffer });
      const pdf = await loadingTask.promise;
      const pages: Field[][] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const originalViewport = page.getViewport({ scale: 1.0 });

        const scaleX = 816 / originalViewport.width;
        const scaleY = 1056 / originalViewport.height;
        const scale = Math.min(scaleX, scaleY);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          console.error("Failed to get 2D context");
          continue;
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;

        const imgData = canvas.toDataURL("image/png");

        pages.push([
          {
            id: uuidv4(),
            name: `Page ${i}`,
            type: typeField.pdf,
            style: {
              backgroundImage: `url(${imgData})`,
              backgroundSize: "cover",
              width: `${viewport.width}px`,
              height: `${viewport.height}px`,
            },
            label: `Page ${i}`,
            value: "",
          },
        ]);
      }

      return pages;
    } catch (error) {
      console.error("Failed to render PDF pages", error);
      return [];
    }
  };

  useEffect(() => {
    loadFields();
    if (
      sheet &&
      sheet.name.endsWith(".pdf") &&
      sheet.pdf &&
      (sheet.content || "").length === 0
    ) {
      renderPDFPages(sheet.pdf)
        .then((pdfSheets) => {
          // Combine the pdfSheets with existing sheets
          setSheets((prevSheets) => {
            const newSheets = pdfSheets.map((pdfPage, index) => {
              // If there's already a sheet at this index, combine it with the PDF page
              if (prevSheets[index]) {
                return [
                  ...prevSheets[index],
                  ...pdfPage, // Add the PDF page background
                ];
              }
              return pdfPage; // Otherwise, just use the PDF page
            });

            // If there are more sheets than PDF pages, keep the remaining ones
            if (prevSheets.length > pdfSheets.length) {
              return newSheets.concat(prevSheets.slice(pdfSheets.length));
            }

            return newSheets;
          });
        })
        .catch((error) => {
          console.error("Error rendering PDF:", error);
        });
    }
  }, [sheet]);

  return (
    <SheetContext.Provider
      value={{
        sheets,
        isContextMenuVisible,
        sheet,
        currentSheetIndex,
        mode,
        handleExecuteCode,
        setIsContextMenuVisible,
        setSheet,
        changeMode,
        addField,
        updateField,
        updateFieldStyle,
        updatePartialField,
        removeField,
        saveFields,
        loadFields,
        addSheet,
        removeSheet,
        nextSheet,
        goToSheet,
        previousSheet,
        setBlocklyRef,
      }}
    >
      {children}
    </SheetContext.Provider>
  );
};
