import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../shared/stores/hooks";
import {
  selectAllProducts,
  deleteProduct,
  updateProduct,
} from "../../shared/stores/slices/productSlice";
import {
  selectSearchQuery,
  selectSortBy,
  selectFilterExpired,
  showToast,
} from "../../shared/stores/slices/uiSlice";
import {
  isExpired,
  formatPrice,
  formatDateToPersian,
  isExpiringSoon,
} from "../../shared/utils/helpers";
import BottomNav from "../../shared/components/BottomNav";
import EditProductModal from "./components/EditProductModal";
import type { Product } from "../../shared/types/product";
import { toast } from "sonner";
import { useCategories } from "../../shared/hooks/queries/useCategories";
import { useProductSearch } from "../../shared/hooks/queries/useProductsSearch";
import { useDebounce } from "use-debounce";
import { motion, AnimatePresence } from "framer-motion";

interface FilterState {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  sortBy: "name" | "price_asc" | "price_desc" | "newest";
  status: "all" | "available" | "expired" | "expiring_soon";
  inStock: boolean;
}

const ProductsList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sortBy: (searchParams.get("sortBy") as FilterState["sortBy"]) || "name",
    status: (searchParams.get("status") as FilterState["status"]) || "all",
    inStock: searchParams.get("inStock") === "true",
  });

  const [debouncedSearch] = useDebounce(filters.search, 500);

  const {
    data: searchData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useProductSearch({
    search: debouncedSearch || undefined,
    categoryId: filters.category || undefined,
    minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    sortBy: filters.sortBy,
    status: filters.status === "all" ? undefined : filters.status,
    inStock: filters.inStock || undefined,
  });

  const { data: categories } = useCategories();

  const products = useAppSelector(selectAllProducts);
  const searchQuery = useAppSelector(selectSearchQuery);
  const sortBy = useAppSelector(selectSortBy);
  const filterExpired = useAppSelector(selectFilterExpired);
  const stats = {
    total: searchData?.data?.length || 0,
    totalValue: searchData?.stats?.totalValue || 0,
    expiredCount: searchData?.stats?.expiredCount || 0,
    expiringSoonCount: searchData?.stats?.expiringSoonCount || 0,
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.barcode.includes(searchQuery),
      );
    }

    if (filterExpired) {
      filtered = filtered.filter((p) => isExpired(p.expiryDate));
    }

    switch (sortBy) {
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price_asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "quantity":
        filtered.sort((a, b) => b.quantity - a.quantity);
        break;
      case "expiry":
        filtered.sort((a, b) =>
          (a.expiryDate || "9999-12-31").localeCompare(
            b.expiryDate || "9999-12-31",
          ),
        );
        break;
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
    }

    return filtered;
  }, [products, searchQuery, sortBy, filterExpired]);

  const displayProducts = searchData?.data || filteredAndSortedProducts;

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

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveEdit = (id: string, updates: Partial<Product>) => {
    dispatch(updateProduct({ id, updates }));
    dispatch(
      showToast({ message: "کالا با موفقیت ویرایش شد", type: "success" }),
    );
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("آیا از حذف این کالا مطمئن هستید؟")) {
      dispatch(deleteProduct(id));
      toast.success("کالا حذف شد");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen pb-24 bg-(--color-bg-body)">
      <div className="max-w-2xl mx-auto px-4 py-5">
        {/* ========================================== */}
        {/* هدر */}
        {/* ========================================== */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <i className="fas fa-arrow-right text-lg"></i>
            </button>
            <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              لیست کالاها
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                isFilterOpen || hasActiveFilters
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
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
            <button
              onClick={() => navigate("/scan")}
              className="bg-linear-to-r from-blue-500 to-indigo-600 text-white px-5 py-2.5 rounded-2xl text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              <i className="fas fa-plus ml-1"></i> جدید
            </button>
          </div>
        </div>

        {/* ========================================== */}
        {/* جستجو */}
        {/* ========================================== */}
        <div className="relative mb-4">
          <i className="fas fa-search absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="جستجو در نام یا بارکد..."
            className="w-full pr-12 pl-4 py-3.5 bg-white dark:bg-gray-800 rounded-2xl shadow-md text-gray-700 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
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
              className="overflow-hidden mb-4"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* دسته‌بندی */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      دسته‌بندی
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) =>
                        setFilters({ ...filters, category: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                    <label className="block text-xs text-gray-500 mb-1">
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
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="all">همه</option>
                      <option value="available">موجود</option>
                      <option value="expiring_soon">در حال انقضا</option>
                      <option value="expired">منقضی شده</option>
                    </select>
                  </div>

                  {/* محدوده قیمت */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      قیمت از
                    </label>
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) =>
                        setFilters({ ...filters, minPrice: e.target.value })
                      }
                      placeholder="۰"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      قیمت تا
                    </label>
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        setFilters({ ...filters, maxPrice: e.target.value })
                      }
                      placeholder="نامحدود"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  {/* موجودی */}
                  <div className="flex items-center gap-3">
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

                {/* دکمه‌های پنل */}
                <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="flex-1 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition"
                  >
                    اعمال فیلترها
                  </button>
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-300 transition"
                  >
                    پاک کردن همه
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================== */}
        {/* آمار */}
        {/* ========================================== */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl p-3 text-white shadow-lg">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs opacity-90">کل کالاها</p>
          </div>
          <div className="bg-linear-to-br from-emerald-500 to-emerald-600 rounded-2xl p-3 text-white shadow-lg">
            <p className="text-2xl font-bold">
              {stats.totalValue.toLocaleString()}
            </p>
            <p className="text-xs opacity-90">ارزش کل (تومان)</p>
          </div>
          <div className="bg-linear-to-br from-amber-500 to-amber-600 rounded-2xl p-3 text-white shadow-lg">
            <p className="text-2xl font-bold">{stats.expiringSoonCount}</p>
            <p className="text-xs opacity-90">در حال انقضا</p>
          </div>
        </div>

        {/* ========================================== */}
        {/* لیست کالاها */}
        {/* ========================================== */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-10 text-center shadow-lg">
            <i className="fas fa-exclamation-triangle text-3xl text-red-500 mb-4"></i>
            <p className="text-gray-500 dark:text-gray-400 mb-3">
              خطا در بارگذاری
            </p>
            <button
              onClick={() => refetch()}
              className="text-blue-500 text-sm font-medium hover:text-blue-600 transition"
            >
              تلاش مجدد
            </button>
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-10 text-center shadow-lg">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-box-open text-3xl text-gray-400"></i>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-3">
              کالایی یافت نشد
            </p>
            <button
              onClick={() => navigate("/scan")}
              className="text-blue-500 text-sm font-medium hover:text-blue-600 transition"
            >
              <i className="fas fa-qrcode ml-1"></i> اسکن کالا جدید
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {displayProducts.map((product) => {
              const expired = isExpired(product.expiryDate);
              const expiringSoon = isExpiringSoon(product.expiryDate);

              let bgGradient = "";
              let badgeColor = "";
              let badgeText = "";

              if (expired) {
                bgGradient =
                  "from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20 border-r-4 border-red-500";
                badgeColor = "bg-red-500";
                badgeText = "منقضی شده";
              } else if (expiringSoon) {
                bgGradient =
                  "from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20 border-r-4 border-amber-500";
                badgeColor = "bg-amber-500";
                badgeText = "در حال انقضا";
              } else {
                bgGradient =
                  "from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/80";
              }

              return (
                <div
                  key={product.id}
                  className={`bg-linear-to-br ${bgGradient} rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer`}
                  onClick={() => goToProduct(product.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="font-bold text-gray-800 dark:text-white text-lg">
                          {product.name}
                        </h3>
                        {badgeText && (
                          <span
                            className={`${badgeColor} text-white text-[10px] px-2 py-0.5 rounded-full`}
                          >
                            {badgeText}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 font-mono mb-2">
                        {product.barcode}
                      </p>
                      <div className="flex flex-wrap gap-3 text-sm">
                        <span className="text-blue-600 dark:text-blue-400 font-bold">
                          💰 {formatPrice(product.price)}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          📦 {product.quantity} عدد
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 text-xs">
                          📅 {formatDateToPersian(product.expiryDate)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 mr-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(product);
                        }}
                        className="w-9 h-9 rounded-full bg-white dark:bg-gray-700 shadow-md flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-200"
                      >
                        <i className="fas fa-edit text-sm"></i>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(product.id);
                        }}
                        className="w-9 h-9 rounded-full bg-white dark:bg-gray-700 shadow-md flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
                      >
                        <i className="fas fa-trash-alt text-sm"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================== */}
        {/* وضعیت بارگذاری */}
        {/* ========================================== */}
        {isFetching && !isLoading && (
          <div className="text-center text-sm text-gray-400 mt-4">
            <i className="fas fa-spinner fa-spin ml-1"></i>
            در حال بروزرسانی...
          </div>
        )}

        <BottomNav />
      </div>

      {/* ========================================== */}
      {/* مودال ویرایش */}
      {/* ========================================== */}
      <EditProductModal
        isOpen={isModalOpen}
        product={editingProduct}
        onClose={handleCloseModal}
        onSave={handleSaveEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ProductsList;
