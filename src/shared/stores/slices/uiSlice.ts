import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "..";

interface Toast {
  message: string;
  type: "success" | "error" | "info" | "warning";
  visible: boolean;
}

export interface UiState {
  theme: "light" | "dark";
  isLoading: boolean;
  toast: Toast | null;
  searchQuery: string;
  sortBy:
    | "name"
    | "price_asc"
    | "price_desc"
    | "quantity"
    | "expiry"
    | "newest";
  filterExpired: boolean;
}

// بارگذاری تم از localStorage
const loadTheme = (): "light" | "dark" => {
  const stored = localStorage.getItem("anbarak_theme");
  if (stored === "dark" || stored === "light") {
    return stored;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const initialState: UiState = {
  theme: loadTheme(),
  isLoading: false,
  toast: null,
  searchQuery: "",
  sortBy: "name",
  filterExpired: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("anbarak_theme", state.theme);
      // اعمال به body
      if (state.theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
      localStorage.setItem("anbarak_theme", action.payload);
      if (action.payload === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    showToast: (
      state,
      action: PayloadAction<{ message: string; type: Toast["type"] }>,
    ) => {
      state.toast = { ...action.payload, visible: true };
    },
    hideToast: (state) => {
      state.toast = null;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (state, action: PayloadAction<UiState["sortBy"]>) => {
      state.sortBy = action.payload;
    },
    toggleFilterExpired: (state) => {
      state.filterExpired = !state.filterExpired;
    },
    setFilterExpired: (state, action: PayloadAction<boolean>) => {
      state.filterExpired = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = "";
      state.sortBy = "name";
      state.filterExpired = false;
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  setLoading,
  showToast,
  hideToast,
  setSearchQuery,
  setSortBy,
  toggleFilterExpired,
  setFilterExpired,
  resetFilters,
} = uiSlice.actions;

// سلکتورها
export const selectTheme = (state: RootState) => state.ui.theme;
export const selectIsLoading = (state: RootState) => state.ui.isLoading;
export const selectToast = (state: RootState) => state.ui.toast;
export const selectSearchQuery = (state: RootState) => state.ui.searchQuery;
export const selectSortBy = (state: RootState) => state.ui.sortBy;
export const selectFilterExpired = (state: RootState) => state.ui.filterExpired;

export default uiSlice.reducer;
