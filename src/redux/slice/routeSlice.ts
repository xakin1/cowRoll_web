import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PathProps } from "../../components/PathProvider";
import type { Id } from "../../utils/types/ApiTypes";

interface IdState {
  value: Id | null;
  currentPath: PathProps[];
  rolName: string | null;
}

const initialState: IdState = {
  value: null,
  currentPath: [],
  rolName: null,
};

const routeSlice = createSlice({
  name: "id",
  initialState,
  reducers: {
    setRol(state, action: PayloadAction<{ id: Id; rolName: string }>) {
      state.value = action.payload.id;
      state.rolName = action.payload.rolName;
    },
    setCurrentPath: (state, action: PayloadAction<PathProps[]>) => {
      state.currentPath = action.payload;
    },
  },
});

export const { setRol, setCurrentPath } = routeSlice.actions;
export default routeSlice.reducer;
