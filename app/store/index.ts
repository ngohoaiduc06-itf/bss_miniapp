import {
  configureStore,
} from "@reduxjs/toolkit";

import rulesReducer from "./slices/rulesSlice";
import shopDataReducer from "./slices/shopDataSlice";

export const store =
  configureStore({
    reducer: {
      rules: rulesReducer,
      shopData: shopDataReducer,
    },
  });

export type RootState =
  ReturnType<typeof store.getState>;

export type AppDispatch =
  typeof store.dispatch;