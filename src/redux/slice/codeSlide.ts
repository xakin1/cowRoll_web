import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getI18N } from "../../i18n";
import { getLang } from "../../i18n/utils";

export interface Code {
  code: string;
}

export interface Output {
  output: string;
  error: {
    error?: string;
    errorCode?: string;
    line?: number;
  };
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
  },
};

// Creación del slice con tipificación adecuada
export const codeSlice = createSlice({
  name: "code",
  initialState,
  reducers: {
    addOutput: (state, action: PayloadAction<Output>) => {
      state.output = action.payload.output || "";
      const { error, errorCode, line } = action.payload?.error || {
        error: "",
        errorCode: null,
        line: null,
      };
      state.error.error = error || "";
      state.error.errorCode = errorCode;
      state.error.line = line;
    },
    addCode: (state, action: PayloadAction<string | undefined>) => {
      state.code = action.payload || "";
    },
  },
});

export const { addOutput, addCode } = codeSlice.actions;
export default codeSlice.reducer;
