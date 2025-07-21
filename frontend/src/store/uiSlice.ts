// store/uiSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isMenuClicked: false,
  },
  reducers: {
    toggleMenu(state) {
      state.isMenuClicked = !state.isMenuClicked;
    },
    setMenu(state, action) {
      state.isMenuClicked = action.payload;
    }
  },
});

export const { toggleMenu, setMenu } = uiSlice.actions;
export default uiSlice.reducer;
