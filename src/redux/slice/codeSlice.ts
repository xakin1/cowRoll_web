import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FetchCodeError, FetchRun } from "../../utils/types/ApiTypes";

export interface CodeEditor {
  output: { [key: string]: any };
  error: {
    error?: string;
    errorCode?: string;
    line?: number;
  };
}
const initialState: CodeEditor = {
  output: {},
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
    addOutput: (state, action: PayloadAction<FetchRun<any>>) => {
      if (action.payload) {
        if ("message" in action.payload) {
          state.output = action.payload.message;
          state.error.error = "";
          state.error.errorCode = "";
          state.error.line = undefined;
        } else {
          state.output = {};
          state.error.error = action.payload.error?.error || "";
          state.error.errorCode = action.payload.error?.errorCode || "";
          state.error.line = action.payload.error?.line || undefined;
        }
      }
    },
    addCompileErrors: (state, action: PayloadAction<FetchCodeError>) => {
      state.error.error = action.payload.error?.error || "";
      state.error.errorCode = action.payload.error?.errorCode || "";
      state.error.line = action.payload.error?.line || undefined;
    },
    clearErrors: (state) => {
      state.error.error = "";
      state.error.errorCode = "";
      state.error.line = undefined;
    },
  },
});

export const { addOutput, addCompileErrors, clearErrors } = codeSlice.actions;
export default codeSlice.reducer;
