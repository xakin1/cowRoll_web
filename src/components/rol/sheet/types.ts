import type { ReactNode } from "react";

export type Id = number;

export interface Position {
  x: number;
  y: number;
}
export interface Size {
  height: number;
  width: number;
}

export interface RenderFieldProps {
  id: Id;
  type: string;
  label: string;
  isSelected?: boolean;
  onSelect?: (selectedId: number) => void;
  style?: any;
}
export interface MenuItemProps {
  field: MenuField;
}

export interface Position {
  x: number;
  y: number;
}

export type FieldWithoutId = Omit<Field, "id">;

export interface CharacterSheetProviderProps {
  children: ReactNode;
}

export interface CharacterSheetContextProps {
  fields: Field[];
  addField: (field: FieldWithoutId, position: Position) => void;
  updateFieldPosition: (id: Id, position: Position) => void;
  removeField: (id: Id) => void;
}

export interface Field {
  id: Id;
  type: string;
  label: string;
  position: Position;
  size: Size;
}

export interface MenuField {
  id: string;
  type: string;
  label: string;
}
