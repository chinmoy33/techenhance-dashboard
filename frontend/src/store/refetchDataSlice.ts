// src/store/warningSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {Dataset} from "../types"

interface WarningState {
  hasUpdatedData: boolean;
  globalDataset: Dataset[] | null;
}

const initialState: WarningState = {
  hasUpdatedData:false,
  globalDataset: null,
};

const refetchDataSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setHasUpdatedData: (state, action: PayloadAction<boolean>) => {
      state.hasUpdatedData = action.payload;
    },
    setGlobalDataset: (state, action: PayloadAction<Dataset[] | null>) => {
      state.globalDataset = action.payload;
    },
  },
});

export const {setHasUpdatedData ,setGlobalDataset } = refetchDataSlice.actions;
export default refetchDataSlice.reducer;
