import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppSelector } from "../../shared/stores/hooks";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "../../shared/types/product";
import { useProductSearch } from "../../shared/hooks/queries/useProductsSearch";
import { useDebounce } from "use-debounce";
import { useCategories } from "../../shared/hooks/queries/useCategories";

const ProductSearch: React.FC = () => {

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-md">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-exclamation-triangle text-yellow-500 text-2xl"></i>
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            خطایی رخ داد
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            دریافت اطلاعات با خطا مواجه شد. لطفاً دوباره تلاش کنید.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4">
      <div className="max-w-4xl mx-auto">
        {/* هدر */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <i className="fas fa-arrow-right text-lg"></i>
            </button>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              <i className="fas fa-search text-blue-500 ml-2"></i>
              جستجوی کالا
            </h1>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                isFilterOpen || hasActiveFilters
                  ? "bg-(--color-primary) text-white shadow-lg shadow-blue-500/25"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-md hover:shadow-lg"
              }`}
            >
              <i className="fas fa-sliders-h"></i>
              فیلترها
              {hasActiveFilters && (
                <span className="bg-white text-blue-500 text-xs rounded-full w-5 h-5 inline-flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-300 transition"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>

        {/* ========================================== */}
        {/* پنل فیلترها */}
        {/* ========================================== */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* جستجو */}
                  <div className="col-span-full">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      <i className="fas fa-search ml-1 text-gray-400"></i>
                      جستجو
                    </label>
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) =>
                        setFilters({ ...filters, search: e.target.value })
                      }
                      placeholder="نام کالا یا بارکد..."
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white transition"
                    />
                  </div>

                  {/* دسته‌بندی */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      دسته‌بندی
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) =>
                        setFilters({ ...filters, category: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white transition"
                    >
                      <option value="">همه دسته‌ها</option>
                      {categories?.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* وضعیت */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      وضعیت
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          status: e.target.value as FilterState["status"],
                        })
                      }
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white transition"
                    >
                      <option value="all">همه</option>
                      <option value="available">موجود</option>
                      <option value="expiring_soon">در حال انقضا</option>
                      <option value="expired">منقضی شده</option>
                    </select>
                  </div>

                  {/* مرتب‌سازی */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      مرتب‌سازی
                    </label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          sortBy: e.target.value as FilterState["sortBy"],
                        })
                      }
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white transition"
                    >
                      <option value="name">بر اساس نام</option>
                      <option value="price_asc">قیمت: کم به زیاد</option>
                      <option value="price_desc">قیمت: زیاد به کم</option>
                      <option value="newest">جدیدترین</option>
                    </select>
                  </div>

                  {/* محدوده قیمت */}
                  <div className="col-span-full md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      محدوده قیمت (هزار تومان)
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        value={filters.minPrice}
                        onChange={(e) =>
                          setFilters({ ...filters, minPrice: e.target.value })
                        }
                        placeholder="از"
                        className="w-1/2 px-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white transition"
                      />
                      <input
                        type="number"
                        value={filters.maxPrice}
                        onChange={(e) =>
                          setFilters({ ...filters, maxPrice: e.target.value })
                        }
                        placeholder="تا"
                        className="w-1/2 px-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white transition"
                      />
                    </div>
                  </div>

                  {/* موجودی */}
                  <div className="flex items-center gap-3 pt-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.inStock}
                        onChange={(e) =>
                          setFilters({ ...filters, inStock: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      <span className="mr-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        فقط کالاهای موجود
                      </span>
                    </label>
                  </div>
                </div>

                {/* دکمه‌های پنل فیلتر */}
                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="flex-1 py-2.5 bg-(--color-primary) text-white rounded-xl font-medium hover:bg-blue-600 transition"
                  >
                    اعمال فیلترها
                  </button>
                  <button
                    onClick={clearFilters}
                    className="py-2.5 px-6 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-300 transition"
                  >
                    پاک کردن همه
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================== */}
        {/* آمار نتایج */}
        {/* ========================================== */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>
              <span className="font-bold text-gray-800 dark:text-white">
                {stats.total}
              </span>{" "}
              کالا یافت شد
            </span>
            {stats.total > 0 && (
              <span>
                ارزش کل:{" "}
                <span className="font-bold text-gray-800 dark:text-white">
                  {formatPrice(stats.totalValue)}
                </span>
              </span>
            )}
            {stats.expiringSoonCount > 0 && (
              <span className="text-yellow-600 dark:text-yellow-400">
                ⚠️ {stats.expiringSoonCount} در حال انقضا
              </span>
            )}
            {stats.expiredCount > 0 && (
              <span className="text-red-600 dark:text-red-400">
                ❌ {stats.expiredCount} منقضی شده
              </span>
            )}
          </div>

          {isFetching && (
            <span className="text-xs text-gray-400">
              <i className="fas fa-spinner fa-spin ml-1"></i>
              در حال بارگذاری...
            </span>
          )}
        </div>

        {/* ========================================== */}
        {/* لیست محصولات */}
        {/* ========================================== */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-md">
            <i className="fas fa-exclamation-triangle text-3xl text-red-500 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              خطا در بارگذاری
            </h3>
            <p className="text-sm text-gray-400">
              مشکلی در ارتباط با سرور رخ داده است. لطفاً دوباره تلاش کنید.
            </p>
            <button
              onClick={() => refetch()}
              className="mt-4 text-blue-500 text-sm font-medium hover:underline"
            >
              تلاش مجدد
            </button>
          </div>
        ) : data?.data?.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-md">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-box-open text-3xl text-gray-400"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              کالایی یافت نشد
            </h3>
            <p className="text-sm text-gray-400">
              با تغییر فیلترها یا جستجوی جدید، دوباره امتحان کنید
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 text-blue-500 text-sm font-medium hover:underline"
            >
              پاک کردن همه فیلترها
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data?.data?.map((product) => {
              const isExpired =
                product.expiryDate && new Date(product.expiryDate) < new Date();
              const isExpiringSoon =
                product.expiryDate &&
                new Date(product.expiryDate) >= new Date() &&
                new Date(product.expiryDate) <=
                  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -2 }}
                  className={`bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer ${
                    isExpired
                      ? "border-r-4 border-red-500"
                      : isExpiringSoon
                        ? "border-r-4 border-yellow-500"
                        : ""
                  }`}
                  onClick={() => goToProduct(product.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 dark:text-white">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-400 font-mono">
                        {product.barcode}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-blue-600 dark:text-blue-400 font-bold">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {product.quantity} عدد
                        </span>
                      </div>
                      {product.categoryName && (
                        <span className="text-xs text-gray-400 mt-1 block">
                          <i className="fas fa-tag ml-1"></i>
                          {product.categoryName}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {isExpired ? (
                        <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">
                          منقضی
                        </span>
                      ) : isExpiringSoon ? (
                        <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 rounded-full">
                          در حال انقضا
                        </span>
                      ) : null}
                      {product.quantity === 0 && (
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 px-2 py-0.5 rounded-full">
                          ناموجود
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                    <i className="fas fa-calendar-alt"></i>
                    <span>
                      {product.expiryDate
                        ? new Date(product.expiryDate).toLocaleDateString(
                            "fa-IR",
                          )
                        : "نامشخص"}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ========================================== */}
        {/* Pagination */}
        {/* ========================================== */}
        {data && data.total > data.limit && (
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              disabled={data.offset === 0}
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set(
                  "offset",
                  String(Math.max(0, data.offset - data.limit)),
                );
                setSearchParams(params);
              }}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition"
            >
              <i className="fas fa-chevron-right ml-1"></i>
              قبلی
            </button>
            <span className="text-sm text-gray-500">
              صفحه {Math.floor(data.offset / data.limit) + 1} از{" "}
              {Math.ceil(data.total / data.limit)}
            </span>
            <button
              disabled={!data.hasMore}
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set("offset", String(data.offset + data.limit));
                setSearchParams(params);
              }}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition"
            >
              بعدی
              <i className="fas fa-chevron-left mr-1"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSearch;
