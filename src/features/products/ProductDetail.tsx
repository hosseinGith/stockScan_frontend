import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../shared/stores/hooks";
import {
  updateProduct,
  deleteProduct,
} from "../../shared/stores/slices/productSlice";
import {
  formatPrice,
  formatDateToPersian,
  isExpired,
  isExpiringSoon,
} from "../../shared/utils/helpers";
import BottomNav from "../../shared/components/BottomNav";
import { toast } from "sonner";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const product = useAppSelector((state) =>
    state.products.items.find((p) => p.id === id),
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState(0);
  const [editQuantity, setEditQuantity] = useState(1);
  const [editExpiry, setEditExpiry] = useState("");

  useEffect(() => {
    if (product) {
      setEditName(product.name);
      setEditPrice(product.price);
      setEditQuantity(product.quantity);
      setEditExpiry(product.expiryDate || "");
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-box-open text-3xl text-gray-400"></i>
          </div>
          <p className="text-gray-500 dark:text-gray-400">کالایی یافت نشد</p>
          <button
            onClick={() => navigate("/products")}
            className="mt-4 text-blue-500 text-sm"
          >
            بازگشت به لیست کالاها
          </button>
        </div>
      </div>
    );
  }

  const expired = isExpired(product.expiryDate);
  const expiringSoon = isExpiringSoon(product.expiryDate);

  let statusColor = "";
  let statusText = "";
  let statusBg = "";

  if (expired) {
    statusColor = "text-red-600";
    statusText = "منقضی شده";
    statusBg = "bg-red-100 dark:bg-red-900/30";
  } else if (expiringSoon) {
    statusColor = "text-amber-600";
    statusText = "در حال انقضا";
    statusBg = "bg-amber-100 dark:bg-amber-900/30";
  } else {
    statusColor = "text-green-600";
    statusText = "موجود";
    statusBg = "bg-green-100 dark:bg-green-900/30";
  }

  const handleSaveEdit = () => {
    if (!editName.trim()) {
      toast.error("لطفاً نام کالا را وارد کنید");

      return;
    }
    if (editPrice <= 0) {
      toast.error("لطفاً قیمت معتبر وارد کنید");

      return;
    }

    dispatch(
      updateProduct({
        id: product.id,
        updates: {
          name: editName,
          price: editPrice,
          quantity: editQuantity,
          expiryDate: editExpiry || null,
        },
      }),
    );
    toast.success("کالا با موفقیت ویرایش شد");

    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm("آیا از حذف این کالا مطمئن هستید؟")) {
      dispatch(deleteProduct(product.id));
      toast.success("کالا حذف شد");
      navigate("/products");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 pb-24">
      <div className="max-w-2xl mx-auto px-4 py-5">
        {/* هدر */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <i className="fas fa-arrow-right text-lg"></i>
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              جزئیات کالا
            </h1>
          </div>
          <div className="flex gap-2">
            {!isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-10 h-10 rounded-full bg-(--color-primary) text-white shadow-md flex items-center justify-center hover:bg-blue-600 transition"
                >
                  <i className="fas fa-edit text-sm"></i>
                </button>
                <button
                  onClick={handleDelete}
                  className="w-10 h-10 rounded-full bg-red-500 text-white shadow-md flex items-center justify-center hover:bg-red-600 transition"
                >
                  <i className="fas fa-trash-alt text-sm"></i>
                </button>
              </>
            )}
          </div>
        </div>

        {/* کارت اصلی */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
          {/* هدر کارت با بارکد */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-950 dark:to-gray-900 p-6 text-center">
            <div className="bg-white/10 rounded-2xl p-4 inline-block mx-auto">
              <i className="fas fa-barcode text-4xl text-white/70"></i>
            </div>
            <p className="text-white/60 text-xs mt-3 font-mono">
              {product.barcode}
            </p>
          </div>

          {/* محتوای کارت */}
          <div className="p-6">
            {!isEditing ? (
              // حالت نمایش
              <div className="space-y-5">
                <div className="text-center border-b border-gray-100 dark:border-gray-700 pb-4">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    {product.name}
                  </h2>
                  <div
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusBg} ${statusColor}`}
                  >
                    <i
                      className={`fas fa-${expired ? "skull" : expiringSoon ? "hourglass-half" : "check-circle"} text-xs`}
                    ></i>
                    <span>{statusText}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      💰 قیمت
                    </span>
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {formatPrice(product.price)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      📦 موجودی
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-lg font-bold ${product.quantity <= 3 ? "text-red-500" : "text-gray-800 dark:text-white"}`}
                      >
                        {product.quantity} عدد
                      </span>
                      {product.quantity <= 3 && product.quantity > 0 && (
                        <span className="text-xs text-red-500">
                          (در حال اتمام)
                        </span>
                      )}
                      {product.quantity === 0 && (
                        <span className="text-xs text-red-500">
                          (اتمام موجودی)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      📅 تاریخ انقضا
                    </span>
                    <span
                      className={`font-medium ${expired ? "text-red-500" : expiringSoon ? "text-amber-500" : "text-gray-800 dark:text-white"}`}
                    >
                      {formatDateToPersian(product.expiryDate)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      🕐 تاریخ ثبت
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {formatDateToPersian(product.createdAt)}
                    </span>
                  </div>
                </div>

                {/* ارزش کل */}
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300 text-sm">
                      ارزش کل موجودی
                    </span>
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {formatPrice(product.price * product.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              // حالت ویرایش
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    نام کالا *
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl text-gray-700 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      قیمت (تومان) *
                    </label>
                    <input
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl text-gray-700 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      تعداد/موجودی
                    </label>
                    <input
                      type="number"
                      value={editQuantity}
                      onChange={(e) => setEditQuantity(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl text-gray-700 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    تاریخ انقضا (اختیاری)
                  </label>
                  <input
                    type="date"
                    value={editExpiry}
                    onChange={(e) => setEditExpiry(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl text-gray-700 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium shadow-lg shadow-green-500/25 hover:shadow-xl transition"
                  >
                    <i className="fas fa-save ml-1"></i> ذخیره تغییرات
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 transition"
                  >
                    انصراف
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* کارت اطلاعات اضافی */}
        <div className="mt-4 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md">
          <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
            <i className="fas fa-info-circle text-blue-500 ml-1"></i> اطلاعات
            تکمیلی
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">شناسه کالا:</span>
              <span className="text-gray-700 dark:text-gray-300 font-mono text-xs">
                {product.id}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">آخرین بروزرسانی:</span>
              <span className="text-gray-700 dark:text-gray-300">
                {product.updatedAt
                  ? formatDateToPersian(product.updatedAt)
                  : "---"}
              </span>
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  );
};

export default ProductDetail;
