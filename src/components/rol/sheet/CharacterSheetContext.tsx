import React, { createContext, useState, type ReactNode } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import i18n from "../../../i18n/i18n";
import { editFile } from "../../../services/codeApi";
import {
  findNodeById,
  type DirectorySystemProps,
  type EditSheetProps,
  type Id as IdField,
  type SheetProps,
} from "../../../utils/types/ApiTypes";
import { toastStyle } from "../../Route";
import type { Field, FieldWithoutId, Id } from "./types";

interface CharacterSheetContextProps {
  sheets: Field[][];
  currentSheetIndex: number;
  addField: (field: FieldWithoutId, style?: { [key: string]: any }) => Field;
  updateFieldStyle: (id: Id, style: { [key: string]: any }) => void;
  removeField: (id: Id) => void;
  saveFields: (props: EditSheetProps) => void;
  loadFields: (directorySystem: DirectorySystemProps, id: IdField) => void;
  addSheet: () => void;
  removeSheet: (index: number) => void;
  nextSheet: () => void;
  previousSheet: () => void;
  goToSheet: (page: number) => void;
}

export const CharacterSheetContext = createContext<
  CharacterSheetContextProps | undefined
>(undefined);

interface CharacterSheetProviderProps {
  children: ReactNode;
}

export const CharacterSheetProvider: React.FC<CharacterSheetProviderProps> = ({
  children,
}) => {
  const [sheets, setSheets] = useState<Field[][]>([[]]);
  const [currentSheetIndex, setCurrentSheetIndex] = useState(0);

  const addField = (
    field: FieldWithoutId,
    style: { [key: string]: any } = {}
  ) => {
    const newField = {
      ...field,
      id: uuidv4(),
      style: { ...field.style, ...style },
    };
    setSheets((prevSheets) => {
      const newSheets = [...prevSheets];
      newSheets[currentSheetIndex] = [
        ...newSheets[currentSheetIndex],
        newField,
      ];
      return newSheets;
    });
    return newField;
  };

  const updateFieldStyle = (id: Id, style: { [key: string]: string }) => {
    console.log(style);
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
    console.log(sheets);
  };

  const removeField = (id: Id) => {
    setSheets((prevSheets) => {
      const newSheets = [...prevSheets];
      newSheets[currentSheetIndex] = newSheets[currentSheetIndex].filter(
        (field) => field.id !== id
      );
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
      if (response && "message" in response) {
        toast.success(i18n.t("General.saveSuccess"), toastStyle);
      } else {
        toast.error(i18n.t("Errors." + response?.error), toastStyle);
      }
    }
  };

  const loadFields = (directorySystem: DirectorySystemProps, id: IdField) => {
    const sheet = findNodeById(directorySystem, id) as SheetProps;

    if (sheet && sheet.content) {
      setSheets(JSON.parse(sheet.content));
    }
  };

  const addSheet = () => {
    setSheets((prevSheets) => [...prevSheets, []]);
    setCurrentSheetIndex(sheets.length);
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
    <CharacterSheetContext.Provider
      value={{
        sheets,
        currentSheetIndex,
        addField,
        updateFieldStyle,
        removeField,
        saveFields,
        loadFields,
        addSheet,
        removeSheet,
        nextSheet,
        goToSheet,
        previousSheet,
      }}
    >
      {children}
    </CharacterSheetContext.Provider>
  );
};
