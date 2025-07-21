// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import warningReducer from "./warningSlice";
import refetchDataReducer from "./refetchDataSlice";
import leadReducer from "./leadSlice";
import uiReducer from "./uiSlice";

export const store = configureStore({
  reducer: {
    warning: warningReducer,
    reloading: refetchDataReducer,
    lead: leadReducer,
    ui: uiReducer,
  },
});

// Infer types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
