import type { ReactNode } from "react";
import type { typeField } from "./RenderFields";

export type Id = string;

export interface Position {
  x: number;
  y: number;
}

export interface RenderFieldProps extends Field {
  isSelected?: boolean;
  onSelect?: (selectedId: Id | null) => void;
  onChange?: (...args: any[]) => void;
  onClick?: (...args: any[]) => void;
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

export type FieldWithoutId = Omit<Field, "id" | "name">;

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
  name: string;
  tags?: string[];
  value?: any;
  label: string;
  style: { [key: string]: any };
  options?: string;
  allowAdditions?: boolean;
  onChange?: (...args: any[]) => void;
}

export interface DraggableFieldProps extends Field {
  setSelectedElement: (element: Field | null) => void;
  onContextMenu: (
    event: React.MouseEvent<Element, MouseEvent>,
    field: Field
  ) => void;
  onChange?: (...args: any[]) => void;
  onClick?: (...args: any[]) => void;
}

export interface MenuField {
  id: string;
  type: string;
  label: string;
}

export type ClipBoard = Field | null;
