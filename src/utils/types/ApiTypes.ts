import type { Items } from "./types";

export enum FileSystemEnum {
  Code = "Code",
  Sheet = "Sheet",
  Rol = "Rol",
  Directory = "Directory",
}

export type FileCodeType = FileSystemEnum.Code;
export type FileSheetType = FileSystemEnum.Sheet;
export type DirectoryRolType = FileSystemEnum.Rol;
export type DirectoryType = FileSystemEnum.Directory;

export type FileTypes = FileCodeType | FileSheetType;
export type DirectoryTypes = DirectoryRolType | DirectoryType;

export type DirectorySystemTypes = FileTypes | DirectoryTypes;

export type DirectorySystemProps = FileProps | DirectoryProps;
export type DirectorySystem = Array<FileProps | DirectoryProps>;
export interface FileProps {
  id: Id;
  name: string;
  directoryId: Id;
  content?: string;
  type: FileTypes;
}

export interface CodeProps extends FileProps {
  contentSchema: string;
  backpackSchema: string[];
  type: FileCodeType;
}

export interface SheetProps extends FileProps {
  codes?: CodeProps[];
  pdf?: string;
  player?: boolean;
  type: FileSheetType;
}

export interface EditFileProps {
  id: Id;
  name?: string;
  directoryId?: Id;
  content?: string;
  type?: FileTypes;
}

export interface EditCodeProps extends EditFileProps {
  contentSchema?: string;
  backpackSchema?: string[];
  type: FileCodeType;
}

export interface EditSheetProps extends EditFileProps {}

export interface CreateFileProps {
  name: string;
  directoryId?: Id;
  content?: string;
  type: FileTypes;
}

export interface CreateCodeProps extends CreateFileProps {
  contentSchema?: string;
  backpackSchema?: string[];
  type: FileCodeType;
}

export interface CreateSheetProps extends CreateFileProps {
  type: FileSheetType;
  pdf?: string;
  player?: boolean;
}

export interface insertContentProps {
  content: string;
  id: Id;
}

export interface CreateDirectoryProps {
  name: string;
  parentId?: Id;
  type: DirectoryTypes;
}

export interface editDirectoryProps {
  name?: string;
  parentId: Id;
  children?: DirectorySystem;
  type?: DirectoryTypes;
  id: Id;
}

export type EditDirectorySystemProps = editDirectoryProps | EditFileProps;

export type Id = string;
export interface DirectoryProps {
  name: string;
  parentId: Id;
  id: Id;
  children: DirectorySystem;
  type: DirectoryTypes;
}

export interface RolProps extends DirectoryProps {
  description: string;
  image: string;
  type: DirectoryRolType;
}

export interface CreateRolProps extends CreateDirectoryProps {
  description?: string;
  image?: string;
  type: DirectoryRolType;
}

export interface EditRolProps extends editDirectoryProps {
  description?: string;
  image?: string;
  type: DirectoryRolType;
}

export type FetchCodeError = {
  error: CodeError;
};

export type CodeError = {
  error?: string;
  errorCode?: string;
  line?: number;
};

export interface Code {
  code: string;
}

export interface FetchSuccess<T> {
  message: T;
}

export interface FetchError {
  error: string;
}

export type FetchInsertContent<T> =
  | FetchSuccess<T>
  | FetchError
  | FetchCodeError
  | undefined;

export type FetchRun<T> = FetchSuccess<T> | FetchCodeError | undefined;

export type NodeTree = DirectorySystemProps;

export function isFetchCodeError(error: any): error is FetchCodeError {
  return error && typeof error.error === "object" && "errorCode" in error.error;
}

export function isFile(item: any): item is FileProps {
  if (item.type)
    return (
      item.type === FileSystemEnum.Code || item.type === FileSystemEnum.Sheet
    );
  else return false;
}

export function isCodeFile(item: Items): item is CodeProps {
  return item.type === FileSystemEnum.Code;
}

export const isSheetsProps = (item: any): item is SheetProps => {
  return item.type === FileSystemEnum.Sheet;
};

export function isDirectory(item: Items): item is DirectoryProps {
  return (
    item.type === FileSystemEnum.Directory || item.type === FileSystemEnum.Rol
  );
}

export const findNodeById = (
  node: DirectorySystemProps,
  id: Id
): DirectorySystemProps | null => {
  if (node.id === id) {
    return node;
  }
  if (!isDirectory(node)) return null;
  for (const child of node.children) {
    const found = findNodeById(child, id);
    if (found) {
      return found;
    }
  }
  return null;
};

export const findParentById = (
  node: DirectorySystemProps,
  id: Id
): DirectoryProps | null => {
  const findParent = (
    currentNode: DirectorySystemProps,
    targetId: Id
  ): DirectoryProps | null => {
    if (!isDirectory(currentNode)) return null;

    for (const child of currentNode.children) {
      if (child.id === targetId) {
        return currentNode;
      }
      const parent = findParent(child, targetId);
      if (parent) {
        return parent;
      }
    }
    return null;
  };

  return findParent(node, id);
};

export const getSheetsOfRol = (
  node: DirectorySystemProps,
  rolId: Id
): DirectoryProps | null => {
  const rol = findNodeById(node, rolId);

  if (rol && isDirectory(rol)) {
    const directory = rol.children.find(
      (child) => child.name === "Sheets" && isDirectory(child)
    );

    if (directory && isDirectory(directory)) {
      return directory;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

export const getCodesOfRol = (
  node: DirectorySystemProps,
  rolId: Id
): DirectoryProps | null => {
  const rol = findNodeById(node, rolId);

  if (rol && isDirectory(rol)) {
    const directory = rol.children.find(
      (child) => child.name === "Codes" && isDirectory(child)
    );

    if (directory && isDirectory(directory)) {
      return directory;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

export const fetchFiles = async () => {
  // Lógica para obtener los archivos, por ejemplo, llamada a una API
  const response = await fetch("/api/files");
  if (!response.ok) {
    throw new Error("Error fetching files");
  }
  return await response.json();
};

export function getPlayerSheets(directory: DirectoryProps): SheetProps[] {
  const playerSheets: SheetProps[] = [];

  const processDirectory = (dir: DirectoryProps) => {
    dir.children.forEach((child) => {
      if (isDirectory(child)) {
        processDirectory(child);
      } else if (isSheetsProps(child) && child.player) {
        playerSheets.push(child);
      }
    });
  };

  processDirectory(directory);
  return playerSheets;
}
