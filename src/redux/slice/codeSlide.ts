import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getI18N } from "../../i18n";
import { getLang } from "../../i18n/utils";

export interface Code {
  code: string;
}

export type Error = {
  error?: string;
  errorCode?: string;
  line?: number;
  lastUpdated: Number;
};

export interface Output {
  output: string;
  error: Error;
}

const currentLocale = getLang();
const i18n = getI18N({ currentLocale });

export interface CodeEditor extends Code, Output {}
const initialState: CodeEditor = {
  code: i18n.Code.placeHolder,
  output: "",
  error: {
    error: "",
    errorCode: "",
    line: undefined,
    lastUpdated: Date.now(),
  },
};

// Creación del slice con tipificación adecuada
export const codeSlice = createSlice({
  name: "code",
  initialState,
  reducers: {
    addOutput: (state, action: PayloadAction<Output>) => {
      state.output = action.payload.output || "";

      state.error.error = action.payload.error?.error || "";
      state.error.errorCode = action.payload.error?.errorCode || "";
      state.error.line = action.payload.error?.line || undefined;
      state.error.lastUpdated = Date.now();
    },
    addCode: (state, action: PayloadAction<string | undefined>) => {
      state.code = action.payload || "";
    },

    addCompileErrors: (state, action: PayloadAction<Output>) => {
      state.error.error = action.payload.error?.error || "";
      state.error.errorCode = action.payload.error?.errorCode || "";
      state.error.line = action.payload.error?.line || undefined;
      state.error.lastUpdated = Date.now();
    },
  },
});

export const { addOutput, addCode, addCompileErrors } = codeSlice.actions;
export default codeSlice.reducer;
