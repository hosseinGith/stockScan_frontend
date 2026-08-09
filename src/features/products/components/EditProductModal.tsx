import React, { useState, useEffect } from "react";
import type { Product } from "../../../shared/types/product";

interface EditProductModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Product>) => void;
  onDelete: (id: string) => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  product,
  onClose,
  onSave,
  onDelete,
}) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [expiryDate, setExpiryDate] = useState<string>("");

  useEffect(() => {
    (() => {
      if (product) {
        setName(product.name);
        setPrice(product.price);
        setQuantity(product.quantity);
        setExpiryDate(product.expiryDate || "");
      }
    })();
  }, [product]);

  if (!isOpen || !product) return null;

  const handleSave = () => {
    if (!name.trim()) {
      alert("لطفاً نام کالا را وارد کنید");
      return;
    }
    if (price <= 0) {
      alert("لطفاً قیمت معتبر وارد کنید");
      return;
    }
    
    onSave(product.id, {
      name,
      price,
      quantity,
      expiryDate: expiryDate || null,
    });
  };

  const handleDelete = () => {
    if (confirm("آیا از حذف این کالا مطمئن هستید؟")) {
      onDelete(product.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center modal show">
      <div className="bg-card w-full max-w-lg rounded-t-3xl md:rounded-3xl p-5 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-primary">
            <i className="fas fa-edit text-primary ml-2"></i> ویرایش کالا
          </h3>
          <button
            onClick={onClose}
            className="text-secondary hover:text-primary"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-secondary">بارکد</label>
            <input
              type="text"
              value={product.barcode}
              disabled
              className="w-full bg-hover p-2 rounded-xl text-sm text-secondary font-mono"
            />
          </div>

          <div>
            <label className="text-xs text-secondary">نام کالا *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: رب گوجه فرنگی"
              className="w-full border border-default bg-card text-primary p-2 rounded-xl text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-secondary">قیمت (تومان) *</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="0"
                className="w-full border border-default bg-card text-primary p-2 rounded-xl text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-secondary">تعداد/موجودی</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full border border-default bg-card text-primary p-2 rounded-xl text-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-secondary">
              تاریخ انقضا (اختیاری)
            </label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full border border-default bg-card text-primary p-2 rounded-xl text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              className="bg-success text-white py-2 rounded-xl flex-1 hover:bg-opacity-90 transition"
            >
              💾 ذخیره
            </button>
            <button
              onClick={onClose}
              className="bg-gray-200 dark:bg-gray-700 text-secondary py-2 rounded-xl flex-1 transition"
            >
              انصراف
            </button>
          </div>

          <button
            onClick={handleDelete}
            className="w-full text-danger text-sm py-2 border-t border-default mt-2 pt-3 hover:bg-danger-bg rounded-lg transition"
          >
            <i className="fas fa-trash-alt ml-1"></i> حذف کالا
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
