import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Id } from "../../utils/types/ApiTypes";

interface IdState {
  value: Id | null;
}

const initialState: IdState = {
  value: null,
};

const idSlice = createSlice({
  name: "id",
  initialState,
  reducers: {
    setId(state, action: PayloadAction<Id>) {
      state.value = action.payload;
    },
  },
});

export const { setId } = idSlice.actions;
export default idSlice.reducer;
