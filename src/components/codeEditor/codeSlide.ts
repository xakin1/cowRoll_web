import { createSlice, type PayloadAction } from '@reduxjs/toolkit';


export interface Code {
    code: string;
}

export interface CodeEditor extends Code {
    output: string;
    error: string
}
const initialState: CodeEditor = {
    code: "Escribe aquí tu código",
    error: "",
    output: ""
}

// Creación del slice con tipificación adecuada
export const codeSlice = createSlice({
    name: "code",
    initialState,
    reducers: {
        addOutput: (state, action: PayloadAction<Code>) => {
            state.output = action.payload.code;
        },
        addCode: (state, action: PayloadAction<string>) => {
            state.code = action.payload;
        }
    }
});

export const { addOutput, addCode } = codeSlice.actions;
export default codeSlice.reducer;