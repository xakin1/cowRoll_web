import type { Items } from "./types";

export enum FileSystemENum {
  Code = "Code",
  Sheet = "Sheet",
  Rol = "Rol",
  Directory = "Directory",
}

export type FileCodeType = FileSystemENum.Code;
export type FileSheetType = FileSystemENum.Sheet;
export type FileRolType = FileSystemENum.Rol;
export type DirectoryType = FileSystemENum.Directory;

export type FileTypes = FileCodeType | FileSheetType | FileRolType;

export type DirectorySystemTypes = FileTypes | DirectoryType;

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

export interface RolProps extends FileProps {
  description: string;
  image: string;
  type: FileRolType;
}

export interface SheetProps extends FileProps {
  type: FileSheetType;
}

export interface EditFileProps {
  id: Id;
  name?: string;
  directoryId?: Id;
  content?: string;
  type: FileTypes;
}

export interface EditCodeProps extends EditFileProps {
  contentSchema?: string;
  backpackSchema?: string[];
  type: FileCodeType;
}

export interface EditRolProps extends EditFileProps {
  description?: string;
  image?: string;
  type: FileRolType;
}

export interface EditSheetProps extends EditFileProps {
  type: FileSheetType;
}

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

export interface CreateRolProps extends CreateFileProps {
  description?: string;
  image?: string;
  type: FileRolType;
}

export interface CreateSheetProps extends CreateFileProps {
  type: FileSheetType;
}

export interface insertContentProps {
  content: string;
  id: Id;
}

export interface insertDirectoryProps {
  name: string;
  parentId?: Id;
  type: DirectoryType;
}

export interface editDirectoryProps {
  name?: string;
  parentId?: Id;
  children?: DirectorySystem;
  type?: DirectoryType;
  id: Id;
}

export type Id = string;
export interface DirectoryProps {
  name: string;
  parentId?: Id;
  id: Id;
  children: DirectorySystem;
  type: DirectoryType;
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

export function isFile(item: any): boolean {
  if (item.type)
    return (
      item.type === FileSystemENum.Code ||
      item.type === FileSystemENum.Sheet ||
      item.type === FileSystemENum.Rol
    );
  else return false;
}

export function isCodeFile(item: Items): item is CodeProps {
  return item.type === FileSystemENum.Code;
}

export function isDirectory(item: Items): item is DirectoryProps {
  return item.type === FileSystemENum.Directory;
}
