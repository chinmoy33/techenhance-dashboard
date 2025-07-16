// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import warningReducer from "./warningSlice";
import refetchDataReducer from "./refetchDataSlice";
import leadReducer from "./leadSlice"

export const store = configureStore({
  reducer: {
    warning: warningReducer,
    reloading: refetchDataReducer,
    lead: leadReducer
  },
});

// Infer types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
