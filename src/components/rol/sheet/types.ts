import type { ReactNode } from "react";
import type { typeField } from "./RenderFields";

export type Id = string;

export interface Position {
  x: number;
  y: number;
}

export interface RenderFieldProps {
  id: Id;
  type: string;
  label: string;
  isSelected?: boolean;
  onSelect?: (selectedId: Id) => void;
  onChange?: (...args: any[]) => void;

  style?: any;
}

export interface MenuFieldProps {
  type: string;
}

export interface MenuItemProps {
  field: MenuField;
}

export interface Position {
  x: number;
  y: number;
}

export type FieldWithoutId = Omit<Field, "id">;

export interface SheetProviderProps {
  children: ReactNode;
}

export interface SheetContextProps {
  fields: Field[];
  addField: (field: FieldWithoutId, position: Position) => void;
  updateFieldPosition: (id: Id, position: Position) => void;
  removeField: (id: Id) => void;
}

export interface Field {
  id: Id;
  type: typeField;
  label: string;
  style: { [key: string]: any };
  onChange?: (...args: any[]) => void;
}

export interface DraggableFieldProps extends Field {
  setSelectedElement: (element: Field | null) => void;
  onContextMenu: (
    event: React.MouseEvent<Element, MouseEvent>,
    field: Field
  ) => void;
  onChange?: (...args: any[]) => void;
}

export interface MenuField {
  id: string;
  type: string;
  label: string;
}

export type ClipBoard = Field | null;
