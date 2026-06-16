import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Category } from "../../types/index";
import type { RootState } from "..";

interface CategoriesState {
  items: Category[];
}

const defaultCategories: Category[] = [
  { id: "1", name: "خوراکی" },
  { id: "2", name: "بهداشتی" },
  { id: "3", name: "الکترونیک" },
  { id: "4", name: "پوشاک" },
];

// بارگذاری از localStorage
const loadCategories = (): Category[] => {
  const stored = localStorage.getItem("anbarak_categories");
  if (stored) {
    return JSON.parse(stored);
  }
  return defaultCategories;
};

const initialState: CategoriesState = {
  items: loadCategories(),
};

const saveToLocalStorage = (categories: Category[]) => {
  localStorage.setItem("anbarak_categories", JSON.stringify(categories));
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<Omit<Category, "id">>) => {
      const newCategory: Category = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.items.push(newCategory);
      saveToLocalStorage(state.items);
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.items.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        saveToLocalStorage(state.items);
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((c) => c.id !== action.payload);
      saveToLocalStorage(state.items);
    },
  },
});

export const { addCategory, updateCategory, deleteCategory } =
  categorySlice.actions;
export const selectAllCategories = (state: RootState) => state.categories.items;

export default categorySlice.reducer;
