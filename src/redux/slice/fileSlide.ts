import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  FileSystemENum,
  type CodeProps,
  type DirectoryProps,
} from "../../utils/types/ApiTypes";

interface DirectorySystem {
  directorySystem: DirectoryProps;
  selectedFile?: CodeProps;
}
const initialState: DirectorySystem = {
  directorySystem: {
    name: "Root",
    type: FileSystemENum.Directory,
    children: [
      {
        name: "Roles",
        type: FileSystemENum.Directory,
        children: [
          {
            name: "Sheets",
            type: FileSystemENum.Directory,
            children: [],
            id: "",
          },
          {
            name: "Codes",
            type: FileSystemENum.Directory,
            children: [],
            id: "",
          },
        ],
        id: "",
      },
    ],
    id: "",
  },
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

    selectFile: (state, action: PayloadAction<CodeProps>) => {
      if (action.payload) {
        state.selectedFile = action.payload;
      }
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
