import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  isExpired,
  formatPrice,
  formatDateToPersian,
  isExpiringSoon,
} from "../../shared/utils/helpers";
import EditProductModal from "./components/EditProductModal";
import type { Product } from "../../shared/types/product";
import { toast } from "sonner";
import { useProductSearch } from "../../shared/hooks/queries/useProductsSearch";
import { useDebounce } from "use-debounce";
import {
  useDeleteProduct,
  useUpdateProduct,
} from "../../shared/hooks/queries/useProducts";
import type { FilterState } from "./types";
import SearchListOfProducts from "./components/SearchListOfProducts";

const ProductsList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const deleteProduct = useDeleteProduct();
  const updateProduct = useUpdateProduct();

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
  const [debouncedMaxPrice] = useDebounce(filters.maxPrice, 500);
  const [debouncedMinPrice] = useDebounce(filters.minPrice, 500);

  const {
    data: searchData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useProductSearch({
    search: debouncedSearch || undefined,
    categoryId: filters.category || undefined,
    minPrice: debouncedMaxPrice ? Number(debouncedMaxPrice) : undefined,
    maxPrice: debouncedMinPrice ? Number(debouncedMinPrice) : undefined,
    sortBy: filters.sortBy,
    status: filters.status === "all" ? undefined : filters.status,
    inStock: filters.inStock || undefined,
  });

  const stats = {
    total: searchData?.data?.length || 0,
    totalValue: searchData?.stats?.totalPrice || 0,
    expiredCount: searchData?.stats?.expiredProductsCount || 0,
    expiringSoonCount: searchData?.stats?.expiringSoonProductsCount || 0,
  };

  const displayProducts = searchData?.data;

  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    if (debouncedMinPrice) params.set("minPrice", debouncedMinPrice);
    if (debouncedMinPrice) params.set("maxPrice", debouncedMinPrice);
    if (filters.sortBy !== "name") params.set("sortBy", filters.sortBy);
    if (filters.status !== "all") params.set("status", filters.status);
    if (filters.inStock) params.set("inStock", "true");

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const hasActiveFilters =
    filters.search ||
    filters.category ||
    debouncedMinPrice ||
    debouncedMinPrice ||
    filters.sortBy !== "name" ||
    filters.status !== "all" ||
    filters.inStock;

  const activeFilterCount = Object.values(filters).filter(
    (v) => v && v !== "all" && v !== "name" && v !== false,
  ).length;

  const goToProduct = (id: string) => {
    navigate(`/product/${id}`);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveEdit = async (id: string, updates: Partial<Product>) => {
    await updateProduct.mutateAsync({ id, data: updates });
    toast.success("کالا ویرایش شد.");
    await refetch();
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("آیا از حذف این کالا مطمئن هستید؟")) {
      await deleteProduct.mutateAsync(id);
      await refetch();
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10  rounded-full bg-white  shadow-md flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
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
                  : "bg-white  text-gray-600 shadow-md hover:shadow-lg"
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

        <div className="mb-4 flex has-focus:border-(--color-primary) bg-(--color-bg-surface) shadow transition rounded-full border-2 border-transparent  items-center">
          <i className="fas fa-search opacity-75 px-1 text-sm"></i>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="جستجو در نام یا بارکد..."
            className="w-full pr-12 pl-4  py-3.5 bg-transparent shadow-none! border-0!  transition text-(--color-text-primary)"
          />
        </div>
        <SearchListOfProducts
          filters={filters}
          isFilterOpen={isFilterOpen}
          setFilters={setFilters}
          setIsFilterOpen={setIsFilterOpen}
        />

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

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-white  rounded-3xl p-10 text-center shadow-lg">
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
        ) : !displayProducts?.length ? (
          <div className="bg-white  rounded-3xl p-10 text-center shadow-lg">
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

              // eslint-disable-next-line no-useless-assignment
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

        {isFetching && !isLoading && (
          <div className="text-center text-sm text-gray-400 mt-4">
            <i className="fas fa-spinner fa-spin ml-1"></i>
            در حال بروزرسانی...
          </div>
        )}
      </div>

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
