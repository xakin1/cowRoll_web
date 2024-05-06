import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getI18N } from "../../i18n";
import { getLang } from "../../i18n/utils";
import type { Code, FetchError, FetchRun } from "../../utils/types/ApiTypes";

const currentLocale = getLang();
const i18n = getI18N({ currentLocale });

export interface CodeEditor extends Code, FetchRun {}
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
    addOutput: (state, action: PayloadAction<FetchRun>) => {
      state.message = action.payload.message || "";

      state.error.error = action.payload.error?.error || "";
      state.error.errorCode = action.payload.error?.errorCode || "";
      state.error.line = action.payload.error?.line || undefined;
    },
    addCode: (state, action: PayloadAction<string | undefined>) => {
      state.code = action.payload || "";
    },

    addCompileErrors: (state, action: PayloadAction<FetchError>) => {
      state.error.error = action.payload.error?.error || "";
      state.error.errorCode = action.payload.error?.errorCode || "";
      state.error.line = action.payload.error?.line || undefined;
    },
  },
});

export const { addOutput, addCode, addCompileErrors } = codeSlice.actions;
export default codeSlice.reducer;
