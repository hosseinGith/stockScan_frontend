import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  prevPage: "",
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setPrevPage: (state, action) => {
      state.prevPage = action.payload;
    },
  },
});

// اکشن‌ها
export const { setIsLoading, setPrevPage } = uiSlice.actions;

// ریدوسر
export default uiSlice.reducer;
