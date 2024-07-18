import React, { createContext, useState, type ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { saveFile } from "../../../services/codeApi";
import type {
  EditSheetProps,
  FetchInsertContent,
} from "../../../utils/types/ApiTypes";
import type { Field, FieldWithoutId } from "./types";
interface CharacterSheetContextProps {
  fields: Field[];
  addField: (field: FieldWithoutId, style?: { [key: string]: any }) => void;
  updateFieldStyle: (id: number, style: any) => void;
  removeField: (id: number) => void;
  saveFile: (sheet: EditSheetProps) => Promise<FetchInsertContent<string>>;
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
  };

  const updateFieldStyle = (id: number, style: { [key: string]: string }) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id
          ? { ...field, style: { ...field.style, ...style } }
          : field
      )
    );
  };

  const removeField = (id: number) => {
    setFields((prevFields) => prevFields.filter((field) => field.id !== id));
  };

  return (
    <CharacterSheetContext.Provider
      value={{
        fields,
        addField,
        updateFieldStyle,
        removeField,
        saveFile,
      }}
    >
      {children}
    </CharacterSheetContext.Provider>
  );
};
