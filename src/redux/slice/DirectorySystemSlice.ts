import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  type CodeProps,
  type DirectoryProps,
} from "../../utils/types/ApiTypes";

export interface DirectorySystemState {
  directorySystem?: DirectoryProps;
  selectedFile?: CodeProps;
}
const initialState: DirectorySystemState = {
  directorySystem: undefined,
  selectedFile: undefined,
};

export const directorySystemSlice = createSlice({
  name: "directorySystem",
  initialState,
  reducers: {
    setDirectorySystem: (state, action: PayloadAction<DirectoryProps>) => {
      if (action.payload) {
        state.directorySystem = action.payload;
      }
    },

    selectFile: (state, action: PayloadAction<CodeProps | undefined>) => {
      state.selectedFile = action.payload;
    },

    updateSelectedFileContent: (state, action: PayloadAction<string>) => {
      if (state.selectedFile) {
        state.selectedFile.content = action.payload;
      }
    },
    updateSelectedFile: (state, action: PayloadAction<CodeProps>) => {
      if (state.selectedFile) {
        state.selectedFile = action.payload;
      }
    },
  },
});

export const {
  selectFile,
  updateSelectedFileContent,
  updateSelectedFile,
  setDirectorySystem,
} = directorySystemSlice.actions;
export default directorySystemSlice.reducer;
