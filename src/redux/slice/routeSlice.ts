import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PathProps } from "../../components/PathProvider";
import type { Id } from "../../utils/types/ApiTypes";

interface IdState {
  value: Id | null;
  currentPath: PathProps[];
}

const initialState: IdState = {
  value: null,
  currentPath: [],
};

const routeSlice = createSlice({
  name: "id",
  initialState,
  reducers: {
    setId(state, action: PayloadAction<Id>) {
      state.value = action.payload;
    },
    setCurrentPath: (state, action: PayloadAction<PathProps[]>) => {
      console.log(action.payload);
      state.currentPath = action.payload;
    },
  },
});

export const { setId, setCurrentPath } = routeSlice.actions;
export default routeSlice.reducer;
