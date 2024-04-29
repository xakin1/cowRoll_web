import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

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

export interface CodeEditor extends Code, Output {}
const initialState: CodeEditor = {
  code: "",
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
      console.log(action.payload.output);
      state.output = action.payload.output;
      const { error, errorCode, line } = action.payload?.error || {
        error: null,
        errorCode: null,
        line: null,
      };
      state.error.error = error;
      state.error.errorCode = errorCode;
      state.error.line = line;
    },
    addCode: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
    },
  },
});

export const { addOutput, addCode } = codeSlice.actions;
export default codeSlice.reducer;
