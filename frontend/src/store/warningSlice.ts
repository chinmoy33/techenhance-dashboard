// src/store/warningSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WarningState {
  hasDeleted: boolean;
  hasUploaded: boolean;
  hasUpdated: boolean;
}

const initialState: WarningState = {
  hasDeleted: false,
  hasUploaded: false,
  hasUpdated:false,
};

const warningSlice = createSlice({
  name: "warning",
  initialState,
  reducers: {
    setHasDeleted: (state, action: PayloadAction<boolean>) => {
      state.hasDeleted = action.payload;
    },
    setHasUploaded: (state, action: PayloadAction<boolean>) => {
      state.hasUploaded = action.payload;
    },
    setHasUpdated: (state, action: PayloadAction<boolean>) => {
      state.hasUpdated = action.payload;
    },
  },
});

export const { setHasDeleted ,setHasUploaded ,setHasUpdated } = warningSlice.actions;
export default warningSlice.reducer;
