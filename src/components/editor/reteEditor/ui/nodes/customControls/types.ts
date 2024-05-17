export interface Options<T> {
  readonly?: boolean;
  initial?: T;
  inputName?: string;
  change?: (value: T) => void;
  type?: string;
}
