// src/store/warningSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WarningState {
  hasClicked: boolean;
}

const initialState: WarningState = {
  hasClicked: false
};

const leadSlice = createSlice({
  name: "lead",
  initialState,
  reducers: {
    setHasClicked: (state, action: PayloadAction<boolean>) => {
      state.hasClicked = action.payload;
    },
  },
});

export const { setHasClicked} = leadSlice.actions;
export default leadSlice.reducer;
