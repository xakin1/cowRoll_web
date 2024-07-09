export type FileTypes = "Code" | "Rol" | "Sheet";
export type DirectorySystem = Array<FileProps | DirectoryProps>;
export interface FileProps {
  name: string;
  directoryId: Id;
  content?: string;
  id: Id;
  type: FileTypes;
}

export interface CodeProps extends FileProps {
  contentSchema: string;
  backpackSchema: string[];
  type: "Code";
}

export interface RolProps extends FileProps {
  description: string;
  image: string;
  type: "Rol";
}

export interface SheetProps extends FileProps {
  type: "Sheet";
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
  type: "Code";
}

export interface CreateRolProps extends CreateFileProps {
  description?: string;
  image?: string;
  type: "Rol";
}

export interface CreateSheetProps extends CreateFileProps {
  type: "Sheet";
}

export interface insertCodeProps {
  name: string;
  directoryId?: Id;
  content?: string;
}

export interface insertContentProps {
  content: string;
  id: Id;
}

export interface insertDirectoryProps {
  name: string;
  parentId?: number;
}

export interface editDirectoryProps {
  name?: string;
  parentId?: Id;
  children?: DirectorySystem;
  type?: "Directory";
  id: Id;
}

export type Id = string;
export interface DirectoryProps {
  name: string;
  parentId?: Id;
  id: Id;
  children: DirectorySystem;
  type: "Directory";
}

export type Items = { id: Id; name: string; type: FileTypes | "Directory" };

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

export type NodeTree = DirectorySystem;

export function isFetchCodeError(error: any): error is FetchCodeError {
  return error && typeof error.error === "object" && "errorCode" in error.error;
}
