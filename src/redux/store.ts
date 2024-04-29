import { configureStore } from "@reduxjs/toolkit";
import codeReducer from "../components/codeMirror/codeSlide";

const store = configureStore({
  reducer: {
    code: codeReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
