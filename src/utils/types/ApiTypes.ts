export interface FileProps {
  name?: string;
  directoryId?: Id;
  content?: string;
  id?: Id;
  type?: "File";
}

export type Id = number;
export interface DirectoryProps {
  name: string;
  parentId?: number;
  id?: Id;
  children?: Array<FileProps | DirectoryProps>;
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
