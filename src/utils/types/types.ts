// types.ts
export interface Token {
  type: string;
  value: string;
}

export interface Pattern {
  regex: RegExp;
  type: string;
}
