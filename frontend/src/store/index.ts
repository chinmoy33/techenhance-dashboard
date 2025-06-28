// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import warningReducer from "./warningSlice";

export const store = configureStore({
  reducer: {
    warning: warningReducer,
  },
});

// Infer types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
