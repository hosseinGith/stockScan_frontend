import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
  setFilterExpired,
  setSearchQuery,
  setSortBy,
  type UiState,
} from "../../shared/stores/slices/uiSlice";
import {
  isExpired,
  formatPrice,
  formatDateToPersian,
  isExpiringSoon,
} from "../../shared/utils/helpers";
import BottomNav from "../../shared/components/BottomNav";
import EditProductModal from "./components/EditProductModal";
import type { Product } from "../../shared/types/index";
import { toast } from "sonner";

const ProductsList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectAllProducts);
  const searchQuery = useAppSelector(selectSearchQuery);
  const sortBy = useAppSelector(selectSortBy);
  const filterExpired = useAppSelector(selectFilterExpired);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // فیلتر و مرتب‌سازی محصولات
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

  const totalValue = filteredAndSortedProducts.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0,
  );

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
    dispatch(deleteProduct(id));
    toast.success("کالا حذف شد");
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
              className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <i className="fas fa-arrow-right text-lg"></i>
            </button>
            <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              لیست کالاها
            </h1>
          </div>
          <button
            onClick={() => navigate("/scan")}
            className="bg-linear-to-r from-blue-500 to-indigo-600 text-white px-5 py-2.5 rounded-2xl text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            <i className="fas fa-plus ml-1"></i> جدید
          </button>
        </div>

        <div className="relative mb-4">
          <i className="fas fa-search absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            placeholder="جستجو در نام یا بارکد..."
            className="w-full pr-12 pl-4 py-3.5 bg-white dark:bg-gray-800 rounded-2xl shadow-md text-gray-700 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <select
            value={sortBy}
            onChange={(e) =>
              dispatch(setSortBy(e.target.value as UiState["sortBy"]))
            }
            className="px-4 py-2.5 bg-white dark:bg-gray-800 rounded-xl text-sm text-gray-700 dark:text-gray-200 shadow-md border-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="name">📝 نام</option>
            <option value="price_asc">💰 قیمت: کم به زیاد</option>
            <option value="price_desc">💰 قیمت: زیاد به کم</option>
            <option value="quantity">📦 موجودی</option>
            <option value="expiry">⏰ نزدیک به انقضا</option>
            <option value="newest">🆕 جدیدترین</option>
          </select>

          <button
            onClick={() => dispatch(setFilterExpired(!filterExpired))}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium shadow-md transition-all duration-200 ${
              filterExpired
                ? "bg-red-500 text-white shadow-red-500/30"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            }`}
          >
            <i className="fas fa-calendar-times ml-1"></i> منقضی شده
          </button>

          <button
            onClick={() => {
              dispatch(setSearchQuery(""));
              dispatch(setSortBy("name"));
              dispatch(setFilterExpired(false));
            }}
            className="px-4 py-2.5 bg-white dark:bg-gray-800 rounded-xl text-sm text-gray-600 dark:text-gray-300 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <i className="fas fa-undo-alt ml-1"></i>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl p-3 text-white shadow-lg">
            <p className="text-2xl font-bold">
              {filteredAndSortedProducts.length}
            </p>
            <p className="text-xs opacity-90">کل کالاها</p>
          </div>
          <div className="bg-linear-to-br from-emerald-500 to-emerald-600 rounded-2xl p-3 text-white shadow-lg">
            <p className="text-2xl font-bold">{totalValue.toLocaleString()}</p>
            <p className="text-xs opacity-90">ارزش کل (تومان)</p>
          </div>
          <div className="bg-linear-to-br from-amber-500 to-amber-600 rounded-2xl p-3 text-white shadow-lg">
            <p className="text-2xl font-bold">
              {
                products.filter(
                  (p) =>
                    !isExpired(p.expiryDate) && isExpiringSoon(p.expiryDate),
                ).length
              }
            </p>
            <p className="text-xs opacity-90">در حال انقضا</p>
          </div>
        </div>

        {filteredAndSortedProducts.length === 0 ? (
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
            {filteredAndSortedProducts.map((product) => {
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
                  onClick={() => navigate(`/product/${product.id}`)}
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
                        className="w-9 h-9 rounded-full bg-white dark:bg-gray-700 shadow-md flex items-center justify-center text-blue-500 hover:bg-(--color-primary) hover:text-white transition-all duration-200"
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

        <BottomNav />
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
