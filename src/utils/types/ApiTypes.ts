export interface FileProps {
  name: string;
  directoryId: Id;
  content?: string;
  contentSchema?: string;
  backpackSchema?: string[];
  id: Id;
  type: "File";
}

export interface editFileProps {
  name?: string;
  directoryId?: Id;
  content?: string;
  id?: Id;
  type?: "File";
}

export interface insertFileProps {
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
  children?: Array<FileProps | DirectoryProps>;
  type?: "Directory";
  id: Id;
}

export type Id = number;
export interface DirectoryProps {
  name: string;
  parentId?: Id;
  id: Id;
  children: Array<FileProps | DirectoryProps>;
  type: "Directory";
}

export type Items = { id: Id; name: string; type: "File" | "Directory" };

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

export type NodeTree = DirectoryProps | FileProps;

export function isFetchCodeError(error: any): error is FetchCodeError {
  return error && typeof error.error === "object" && "errorCode" in error.error;
}
