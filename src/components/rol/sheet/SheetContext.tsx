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
  currentSheetIndex: number;
  mode: boolean;
  addField: (field: FieldWithoutId) => Field;
  updateField: (updatedField: Field) => void;
  updateFieldStyle: (id: Id, style: { [key: string]: any }) => void;
  removeField: (id: Id) => void;
  saveFields: (props: EditSheetProps) => void;
  loadFields: (sheet: SheetProps) => void;
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
  const [mode, setMode] = useState<boolean>(false);
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
    const sheetsJSON = JSON.stringify(sheets);
    if (sheetsJSON && sheetsJSON !== "{}" && sheetsJSON !== "[]") {
      const fileProps = {
        ...props,
        content: sheetsJSON,
      };
      const response = await editFile(fileProps);
      if (blocklyRef.current) {
        blocklyRef.current.saveContent();
      }
      if (response && "message" in response) {
        toast.success(i18n.t("General.saveSuccess"), toastStyle);
      } else {
        toast.error(i18n.t("Errors." + response?.error), toastStyle);
      }
    }
  };

  const loadFields = (sheet: SheetProps) => {
    if (sheet.content) {
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

  return (
    <SheetContext.Provider
      value={{
        sheets,
        currentSheetIndex,
        mode,
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
