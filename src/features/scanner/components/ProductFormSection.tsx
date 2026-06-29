import React from 'react';
import { motion } from 'framer-motion';
import ShamsiDatePicker from '../../../shared/components/ShamsiDatePicker';

interface ProductFormData {
  barcode: string;
  name: string;
  price: number;
  quantity: number;
  minQuantity: number;
  expiryDate: Date;
  category: string;
  description: string;
}

interface ProductFormSectionProps {
  barcode: string;
  formData: Omit<ProductFormData, 'barcode'>;
  onFormChange: (data: Partial<Omit<ProductFormData, 'barcode'>>) => void;
  onSave: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ProductFormSection: React.FC<ProductFormSectionProps> = ({
  barcode,
  formData,
  onFormChange,
  onSave,
  onCancel,
  isLoading = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl mt-4"
    >
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          <i className="fas fa-plus-circle text-green-500 ml-2"></i>
          ثبت کالا جدید
        </h2>
        <button
          onClick={onCancel}
          className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 transition"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="space-y-4">
        {/* بارکد */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">بارکد</label>
          <div className="bg-gray-100 dark:bg-gray-900 rounded-xl px-4 py-3">
            <p className="font-mono text-sm text-gray-700">{barcode}</p>
          </div>
        </div>

        {/* نام کالا */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            نام کالا <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => onFormChange({ name: e.target.value })}
            placeholder="مثال: رب گوجه فرنگی"
            className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2"
            autoFocus
          />
        </div>

        {/* قیمت و تعداد */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              قیمت (هزار تومان) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.price || ''}
              onChange={(e) => onFormChange({ price: Number(e.target.value) })}
              placeholder="0"
              className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">تعداد/موجودی</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => onFormChange({ quantity: Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2"
            />
          </div>
        </div>

        {/* دسته‌بندی و حداقل موجودی */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              دسته بندی <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => onFormChange({ category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">حداقل موجودی</label>
            <input
              type="number"
              value={formData.minQuantity}
              onChange={(e) => onFormChange({ minQuantity: Number(e.target.value) })}
              placeholder="1"
              className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2"
            />
          </div>
        </div>

        {/* تاریخ انقضا */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            تاریخ انقضا <span className="text-red-500">*</span>
          </label>
          <ShamsiDatePicker
            onChange={(val) => onFormChange({ expiryDate: val || new Date() })}
            value={formData.expiryDate || new Date()}
          />
        </div>

        {/* توضیحات */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">توضیحات (اختیاری)</label>
          <textarea
            value={formData.description}
            onChange={(e) => onFormChange({ description: e.target.value })}
            placeholder="توضیحات اضافی..."
            rows={2}
            className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 resize-none"
          />
        </div>

        {/* دکمه‌ها */}
        <div className="flex gap-3 pt-3">
          <button
            onClick={onSave}
            disabled={isLoading}
            className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium shadow-lg shadow-green-500/25 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-70"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                در حال ذخیره...
              </span>
            ) : (
              <>
                <i className="fas fa-save ml-1"></i> ذخیره کالا
              </>
            )}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition"
          >
            انصراف
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductFormSection;