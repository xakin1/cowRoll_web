import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Id } from "../../utils/types/ApiTypes";

interface IdState {
  value: Id | null;
  rolName: string | null;
}

const initialState: IdState = {
  value: null,
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
  },
});

export const { setRol } = routeSlice.actions;
export default routeSlice.reducer;
