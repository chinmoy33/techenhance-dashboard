// store/uiSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isMenuClicked: false,
    showContactForm:false
  },
  reducers: {
    toggleMenu(state) {
      state.isMenuClicked = !state.isMenuClicked;
    },
    setMenu(state, action) {
      state.isMenuClicked = action.payload;
    },
    toggleContactForm(state) {
      state.showContactForm = !state.showContactForm;
    }
  },
});

export const { toggleMenu, setMenu,toggleContactForm } = uiSlice.actions;
export default uiSlice.reducer;
