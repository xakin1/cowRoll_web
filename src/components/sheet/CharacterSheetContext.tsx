import React, { createContext, useState, type ReactNode } from "react";
import { saveSheet } from "../../services/codeApi";
import type { Field, FieldWithoutId, Position, Size } from "./types";

interface CharacterSheetContextProps {
  fields: Field[];
  addField: (field: FieldWithoutId, position: Position, size: Size) => void;
  updateFieldPosition: (id: number, position: Position) => void;
  updateFieldSize: (id: number, size: Size) => void;
  removeField: (id: number) => void;
  saveSheet: (fields: Field[]) => Promise<void>;
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

  const addField = (field: FieldWithoutId, position: Position, size: Size) => {
    setFields([...fields, { ...field, id: Date.now(), position, size }]);
  };

  const updateFieldPosition = (id: number, position: Position) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id ? { ...field, position } : field
      )
    );
  };

  const updateFieldSize = (id: number, size: Size) => {
    setFields((prevFields) =>
      prevFields.map((field) => (field.id === id ? { ...field, size } : field))
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
        updateFieldPosition,
        updateFieldSize,
        removeField,
        saveSheet,
      }}
    >
      {children}
    </CharacterSheetContext.Provider>
  );
};
