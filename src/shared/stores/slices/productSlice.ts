import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { generateId, isExpired, isExpiringSoon } from "../../utils/helpers";
import type { RootState } from "..";
import type { Product } from "../../types/product";

// تایپ وضعیت محصولات
interface ProductsState {
  items: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  lastUpdated: string | null;
}

// وضعیت اولیه
const initialState: ProductsState = {
  items: [],
  status: "idle",
  error: null,
  lastUpdated: null,
};

// ذخیره در localStorage
const saveToLocalStorage = (products: Product[]) => {
  localStorage.setItem("anbarak_products", JSON.stringify(products));
};

// بارگذاری از localStorage (async thunk)
export const loadProductsFromStorage = createAsyncThunk(
  "products/loadFromStorage",
  async () => {
    const stored = localStorage.getItem("anbarak_products");
    if (stored) {
      return JSON.parse(stored) as Product[];
    }
    return [];
  },
);

// اسلایس محصولات
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // اضافه کردن کالا
    addProduct: (
      state,
      action: PayloadAction<Omit<Product, "id" | "createdAt">>,
    ) => {
      const newProduct: Product = {
        ...action.payload,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      state.items.push(newProduct);
      state.lastUpdated = new Date().toISOString();
      saveToLocalStorage(state.items);
    },

    // ویرایش کالا
    updateProduct: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Product> }>,
    ) => {
      const { id, updates } = action.payload;
      const index = state.items.findIndex((p) => p.id === id);
      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        state.lastUpdated = new Date().toISOString();
        saveToLocalStorage(state.items);
      }
    },

    // حذف کالا
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
      state.lastUpdated = new Date().toISOString();
      saveToLocalStorage(state.items);
    },

    // بروزرسانی موجودی
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>,
    ) => {
      const { id, quantity } = action.payload;
      const product = state.items.find((p) => p.id === id);
      if (product) {
        product.quantity = quantity;
        product.updatedAt = new Date().toISOString();
        state.lastUpdated = new Date().toISOString();
        saveToLocalStorage(state.items);
      }
    },

    // حذف همه کالاها
    clearAllProducts: (state) => {
      state.items = [];
      state.lastUpdated = new Date().toISOString();
      saveToLocalStorage(state.items);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProductsFromStorage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadProductsFromStorage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(loadProductsFromStorage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "خطا در بارگذاری اطلاعات";
      });
  },
});

// اکشن‌ها
export const {
  addProduct,
  updateProduct,
  deleteProduct,
  updateQuantity,
  clearAllProducts,
} = productSlice.actions;

// سلکتورها (Selectors)
export const selectAllProducts = (state: RootState) => state.products.items;
export const selectProductsStatus = (state: RootState) => state.products.status;
export const selectProductsCount = (state: RootState) =>
  state.products.items.length;
export const selectTotalValue = (state: RootState) =>
  state.products.items.reduce((sum, p) => sum + p.price * p.quantity, 0);
export const selectExpiringProducts = (state: RootState) => {
  return state.products.items.filter((p) =>
    !p.expiryDate ? false : isExpiringSoon(p.expiryDate),
  );
};
export const selectExpiredProducts = (state: RootState) => {
  return state.products.items.filter((p) =>
    p.expiryDate ? isExpired(p.expiryDate) : false,
  );
};
export const selectProductById = (state: RootState, id: string) =>
  state.products.items.find((p) => p.id === id);

export default productSlice.reducer;
