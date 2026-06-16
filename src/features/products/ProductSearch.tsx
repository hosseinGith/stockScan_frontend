import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppSelector } from "../../shared/stores/hooks";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "../../shared/types/product";
import { useProductSearch } from "../../shared/hooks/queries/useProductsSearch";
import { useDebounce } from "use-debounce";
import { useCategories } from "../../shared/hooks/queries/useCategories";

interface FilterState {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  sortBy: "name" | "price_asc" | "price_desc" | "newest";
  status: "all" | "available" | "expired" | "expiring_soon";
  inStock: boolean;
}

const ProductSearch: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [debouncedSearch] = useDebounce(filters.search, 500);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sortBy: (searchParams.get("sortBy") as FilterState["sortBy"]) || "name",
    status: (searchParams.get("status") as FilterState["status"]) || "all",
    inStock: searchParams.get("inStock") === "true",
  });
  const { data, isLoading, isFetching, error, refetch } = useProductSearch({
    search: debouncedSearch || undefined,
    categoryId: filters.category || undefined,
    minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    sortBy: filters.sortBy,
    status: filters.status === "all" ? undefined : filters.status,
    inStock: filters.inStock || undefined,
  });

  const { data: categories } = useCategories();

  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.sortBy !== "name") params.set("sortBy", filters.sortBy);
    if (filters.status !== "all") params.set("status", filters.status);
    if (filters.inStock) params.set("inStock", "true");

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.sortBy !== "name") params.set("sortBy", filters.sortBy);
    if (filters.status !== "all") params.set("status", filters.status);
    if (filters.inStock) params.set("inStock", "true");

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const stats = {
    total: data?.data?.length || 0,
    totalValue: data?.stats?.totalValue || 0,
    expiredCount: data?.stats?.expiredCount || 0,
    expiringSoonCount: data?.stats?.expiringSoonCount || 0,
  };

  const hasActiveFilters =
    filters.search ||
    filters.category ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.sortBy !== "name" ||
    filters.status !== "all" ||
    filters.inStock;

  const activeFilterCount = Object.values(filters).filter(
    (v) => v && v !== "all" && v !== "name" && v !== false,
  ).length;

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "name",
      status: "all",
      inStock: false,
    });
    setIsFilterOpen(false);
  };

  const goToProduct = (id: string) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4">
      <div className="max-w-4xl mx-auto">
        {/* هدر */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            <i className="fas fa-search text-blue-500 ml-2"></i>
            جستجوی کالا
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isFilterOpen || hasActiveFilters
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-md hover:shadow-lg"
              }`}
            >
              <i className="fas fa-sliders-h ml-1"></i>
              فیلترها
              {hasActiveFilters && (
                <span className="mr-1 bg-white text-blue-500 text-xs rounded-full w-5 h-5 inline-flex items-center justify-center">
                  {
                    Object.values(filters).filter(
                      (v) => v && v !== "all" && v !== "name",
                    ).length
                  }
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
                      <option value="food">خوراکی</option>
                      <option value="hygiene">بهداشتی</option>
                      <option value="electronics">الکترونیک</option>
                      <option value="clothing">پوشاک</option>
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
                    className="flex-1 py-2.5 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition"
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
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
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
                  {Number(stats.totalValue).toLocaleString("fa-IR")} تومان
                </span>
              </span>
            )}
          </div>
          {filters.search && (
            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full">
              "{filters.search}"
            </span>
          )}
        </div>

        {/* ========================================== */}
        {/* لیست محصولات */}
        {/* ========================================== */}
        {filteredProducts.length === 0 ? (
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
            {filteredProducts.map((product: Product) => {
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
                          {Number(product.price).toLocaleString("fa-IR")} تومان
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {product.quantity} عدد
                        </span>
                      </div>
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
      </div>
    </div>
  );
};

export default ProductSearch;
