import type { DirectoryProps, FileProps } from "./ApiTypes";

// types.ts
export interface Token {
  type: string;
  value: string;
}

export interface Pattern {
  regex: RegExp;
  type: string;
}

export interface FetchSave {
  message: string;
}

export type ModalAction = (inputValue: string) => void;

export type ModalConfig = {
  action: ModalAction;
  label: string;
  initialText?: string;
  showInput?: boolean;
};

export type ContextMenuProps = {
  x: number;
  y: number;
  visible?: boolean;
  item?: FileProps | DirectoryProps;
  onClose: () => void;
  onAddNode: () => void;
  handleOpenModal: (config: ModalConfig) => void;
};
