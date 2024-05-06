import {
  combineReducers,
  configureStore,
  type PayloadAction,
} from "@reduxjs/toolkit";
import codeReducer from "../src/redux/slice/codeSlide";
import type store from "../src/redux/store";
import type { Code } from "../src/utils/types/ApiTypes";

// beforeAll(() => server.listen());
// afterEach(() => server.resetHandlers());
// afterAll(() => server.close());

const rootReducer = combineReducers({
  code: codeReducer,
});

export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}
export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppAction =
  | PayloadAction<Code> // For addOutput
  | PayloadAction<string>; // For addCode
