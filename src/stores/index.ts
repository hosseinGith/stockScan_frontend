import { configureStore } from "@reduxjs/toolkit";
import uiSlice from "./ui";
import dataSlice from "./data";
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
  reducer: {
    ui: uiSlice,
    data: dataSlice,

    // ریدوسرهای دیگر را اینجا اضافه کنید
  },
});
