import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import codeReducer from "./slice/codeSlide";
import directorySystemReducer from "./slice/fileSlide";
import idReducer from "./slice/idSlice";

const rootReducer = combineReducers({
  code: codeReducer,
  directorySystem: directorySystemReducer,
  id: idReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
