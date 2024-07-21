import React, { createContext, useState, type ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { editFile } from "../../../services/codeApi";
import {
  findNodeById,
  type DirectorySystemProps,
  type EditSheetProps,
  type Id as IdField,
  type SheetProps,
} from "../../../utils/types/ApiTypes";
import type { Field, FieldWithoutId, Id } from "./types";

interface CharacterSheetContextProps {
  fields: Field[];
  addField: (field: FieldWithoutId, style?: { [key: string]: any }) => Field;
  updateFieldStyle: (id: Id, style: { [key: string]: any }) => void;
  removeField: (id: Id) => void;
  saveFields: (props: EditSheetProps) => void;
  loadFields: (directorySystem: DirectorySystemProps, id: IdField) => void;
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
  const [fields, setFields] = useState<Field[]>([]);

  const addField = (
    field: FieldWithoutId,
    style: { [key: string]: any } = {}
  ) => {
    const newField = {
      ...field,
      id: uuidv4(),
      style: { ...field.style, ...style },
    };
    setFields([...fields, newField]);
    return newField;
  };

  const updateFieldStyle = (id: Id, style: { [key: string]: string }) => {
    console.log(id, style);
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id
          ? { ...field, style: { ...field.style, ...style } }
          : field
      )
    );
    console.log(fields);
  };

  const removeField = (id: Id) => {
    setFields((prevFields) => prevFields.filter((field) => field.id !== id));
  };

  const saveFields = (props: EditSheetProps) => {
    const fieldsJSON = JSON.stringify(fields);
    if (fieldsJSON && fieldsJSON !== "{}" && fieldsJSON !== "[]") {
      const fileProps = {
        ...props,
        content: fieldsJSON,
      };
      editFile(fileProps);
    }
  };

  const loadFields = (directorySystem: DirectorySystemProps, id: IdField) => {
    const sheet = findNodeById(directorySystem, id) as SheetProps;

    if (sheet && sheet.content) {
      console.log(sheet.content);
      setFields(JSON.parse(sheet.content));
    }
  };

  return (
    <CharacterSheetContext.Provider
      value={{
        fields,
        addField,
        updateFieldStyle,
        removeField,
        saveFields,
        loadFields,
      }}
    >
      {children}
    </CharacterSheetContext.Provider>
  );
};
