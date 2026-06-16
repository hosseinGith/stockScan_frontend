import { configureStore } from "@reduxjs/toolkit";
import uiSlice from "./slices/uiSlice";
import productReducer from "./slices/productSlice";
import categoryReducer from "./slices/categorySlice";
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
  reducer: {
    ui: uiSlice,

    products: productReducer,
    categories: categoryReducer,

    // ریدوسرهای دیگر را اینجا اضافه کنید
  },
});
