import React from "react";
import { useAppDispatch, useAppSelector } from "../../../shared/stores/hooks";
import {
  selectSearchQuery,
  selectSortBy,
  selectFilterExpired,
  setSearchQuery,
  setSortBy,
  toggleFilterExpired,
  resetFilters,
  type UiState,
} from "../../../shared/stores/slices/uiSlice";

const ProductFilters: React.FC = () => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(selectSearchQuery);
  const sortBy = useAppSelector(selectSortBy);
  const filterExpired = useAppSelector(selectFilterExpired);

  return (
    <div className="bg-card rounded-2xl shadow-md p-4 mb-4">
      <div className="relative mb-3">
        <i className="fas fa-search absolute right-3 top-3 text-secondary text-sm"></i>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          placeholder="جستجو در نام یا بارکد..."
          className="w-full pr-9 p-2 border border-default bg-card text-primary rounded-xl text-sm focus:border-primary focus:outline-none"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        <select
          value={sortBy}
          onChange={(e) =>
            dispatch(setSortBy(e.target.value as UiState["sortBy"]))
          }
          className="border border-default bg-card text-primary rounded-xl p-2 text-sm flex-1 focus:border-primary focus:outline-none"
        >
          <option value="name">📝 مرتب‌سازی: نام</option>
          <option value="price_asc">💰 قیمت: کم به زیاد</option>
          <option value="price_desc">💰 قیمت: زیاد به کم</option>
          <option value="quantity">📦 موجودی</option>
          <option value="expiry">📅 نزدیک به انقضا</option>
          <option value="newest">🆕 جدیدترین</option>
        </select>

        <button
          onClick={() => dispatch(toggleFilterExpired())}
          className={`border rounded-xl px-3 py-2 text-sm transition ${
            filterExpired
              ? "bg-danger text-white border-danger"
              : "bg-card text-secondary border-default hover:bg-hover"
          }`}
        >
          <i className="fas fa-calendar-times ml-1"></i> منقضی شده
        </button>

        <button
          onClick={() => dispatch(resetFilters())}
          className="border border-default bg-card text-primary rounded-xl px-3 py-2 text-sm hover:bg-hover transition"
        >
          <i className="fas fa-undo-alt ml-1"></i> ریست
        </button>
      </div>
    </div>
  );
};

export default ProductFilters;
