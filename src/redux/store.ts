import { configureStore } from "@reduxjs/toolkit";
import codeReducer from "./slice/codeSlide";
import directorySystemReducer from "./slice/fileSlide";

const store = configureStore({
  reducer: {
    code: codeReducer,
    directorySystem: directorySystemReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
