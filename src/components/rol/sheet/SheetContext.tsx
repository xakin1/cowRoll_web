import * as pdfjsLib from "pdfjs-dist";
import React, {
  createContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { useAppSelector } from "../../../hooks/customHooks";
import i18n from "../../../i18n/i18n";
import type { RootState } from "../../../redux/store";
import { editFile } from "../../../services/codeApi";
import {
  type EditSheetProps,
  type SheetProps,
} from "../../../utils/types/ApiTypes";
import { toastStyle } from "../../Route";
import type { BlocklyRefProps } from "../editor/blockyEditor/BlocklyEditor";
import { typeField } from "./RenderFields";
import type { Field, FieldWithoutId, Id } from "./types";
// Define SheetContextProps interface
interface SheetContextProps {
  sheets: Field[][];
  sheet: SheetProps | undefined;
  isContextMenuVisible: boolean;
  currentSheetIndex: number;
  mode: boolean;
  addField: (field: FieldWithoutId) => Field;
  updateField: (updatedField: Field) => void;
  updateFieldStyle: (id: Id, style: { [key: string]: any }) => void;
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

  const file = useAppSelector(
    (state: RootState) => state.directorySystem.selectedFile
  );
  useEffect(() => {
    updateBlocklyVariables(sheets[currentSheetIndex]);
  }, [file]);

  const output = useAppSelector((state) => state.code.output);

  useEffect(() => {
    setSheets((prevSheets) => {
      const newSheets = [...prevSheets];
      newSheets[currentSheetIndex] = newSheets[currentSheetIndex].map(
        (field) => {
          if (output.hasOwnProperty(field.name)) {
            return {
              ...field,
              value: output[field.name as string],
            };
          }
          return field;
        }
      );
      return newSheets;
    });
  }, [output]);

  const setBlocklyRef = (ref: RefObject<BlocklyRefProps>) => {
    blocklyRef.current = ref.current;
  };

  const updateBlocklyVariables = (fields: Field[]) => {
    if (blocklyRef.current) {
      blocklyRef.current.updateVariables(
        fields.filter((field) => {
          return (
            field.type == typeField.input || field.type == typeField.checkbox
          );
        })
      );
    }
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

        newSheets[currentSheetIndex][fieldIndex] = updatedField;

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
    // Filtra los campos que no son de tipo PDF
    const filteredSheets = sheets.map((sheet) =>
      sheet.filter((field) => field.type !== typeField.pdf)
    );

    // Convierte los campos filtrados a JSON
    const sheetsJSON = JSON.stringify(filteredSheets);

    if (sheetsJSON && sheetsJSON !== "{}" && sheetsJSON !== "[]") {
      const fileProps = {
        ...props,
        content: sheetsJSON,
      };

      try {
        // Llamada a la función para editar el archivo
        const response = await editFile(fileProps);

        // Guarda el contenido de blockly si está disponible
        if (blocklyRef.current) {
          blocklyRef.current.saveContent();
        }

        // Manejo de la respuesta
        if (response && "message" in response) {
          toast.success(i18n.t("General.saveSuccess"), toastStyle);
        } else {
          toast.error(i18n.t("Errors." + response?.error), toastStyle);
        }
      } catch (error) {
        // Manejo de errores de la llamada asincrónica
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
      // Si estás usando datos base64, asegúrate de que estén decodificados en ArrayBuffer
      const pdfDataBuffer = base64ToArrayBuffer(pdfData);

      // Cargar el documento
      const loadingTask = pdfjsLib.getDocument({ data: pdfDataBuffer });
      const pdf = await loadingTask.promise;
      const pages: Field[][] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const originalViewport = page.getViewport({ scale: 1.0 });

        // Calcula la escala basada en las dimensiones deseadas
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

        // Asegurar que el canvas tenga un fondo blanco
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        // Renderizar la página
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
              width: `${viewport.width}px`, // Ajuste de ancho
              height: `${viewport.height}px`, // Ajuste de altura
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

    if (sheet && sheet.name.endsWith(".pdf") && sheet.pdf) {
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
        setIsContextMenuVisible,
        setSheet,
        changeMode,
        addField,
        updateField,
        updateFieldStyle,
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
