import { createSlice } from "@reduxjs/toolkit";

type DarkModeState = {
  enabled: boolean;
};

const initialState: DarkModeState = {
  enabled: false,
};

const darkModeSlice = createSlice({
  name: "darkMode",
  initialState,
  reducers: {
    toggleDarkMode(state) {
      state.enabled = !state.enabled;
    },
  },
});

export const { toggleDarkMode } = darkModeSlice.actions;
export default darkModeSlice.reducer;
