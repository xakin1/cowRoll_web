export interface FileProps {
  name: string;
  directoryId?: number;
  content: string;
  id?: number;
  type?: "File";
}

export type DirectoryId = number;
export interface DirectoryProps {
  name: string;
  parentId?: number;
  id?: DirectoryId;
  children?: FileProps[] | DirectoryProps[];
  type?: "Directory";
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

export interface FetchSaveInsertWithoutErrors<T> {
  message: T;
  error: CodeError;
}

export interface FetchError {
  error: string;
}

export type FetchInsertContent<T> =
  | FetchSuccess<T>
  | FetchSaveInsertWithoutErrors<T>
  | FetchError
  | undefined;

export type FetchRun<T> = FetchSuccess<T> | FetchCodeError | undefined;
