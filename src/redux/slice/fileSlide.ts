import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DirectoryProps, FileProps } from "../../utils/types/ApiTypes";

interface DirectorySystem {
  directorySystem: DirectoryProps;
  selectedFile?: FileProps;
}
const initialState: DirectorySystem = {
  directorySystem: {
    name: "Root",
    type: "Directory",
    children: [],
    id: -1,
  },
  selectedFile: undefined,
};

export const directorySystemSlice = createSlice({
  name: "directorySystem",
  initialState,
  reducers: {
    addFile: (state, action: PayloadAction<DirectoryProps>) => {
      if (action.payload) {
        state.directorySystem = action.payload;
      }
    },

    selectFile: (state, action: PayloadAction<FileProps>) => {
      if (action.payload) {
        state.selectedFile = action.payload;
      }
    },
    // Nueva acción para actualizar el contenido del archivo seleccionado
    updateSelectedFileContent: (state, action: PayloadAction<string>) => {
      if (state.selectedFile) {
        state.selectedFile.content = action.payload;
      }
    },
  },
});

export const { addFile, selectFile, updateSelectedFileContent } =
  directorySystemSlice.actions;
export default directorySystemSlice.reducer;
