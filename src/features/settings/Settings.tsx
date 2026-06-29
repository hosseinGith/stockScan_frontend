import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../shared/stores/hooks";
import { clearAllProducts } from "../../shared/stores/slices/productSlice";
import { toggleTheme, showToast } from "../../shared/stores/slices/uiSlice";
import BottomNav from "../../shared/components/BottomNav";

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.items);
  const theme = useAppSelector((state) => state.ui.theme);

  const [isExporting, setIsExporting] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // خروجی اکسل (CSV)
  const handleExportExcel = () => {
    if (products.length === 0) {
      dispatch(
        showToast({
          message: "هیچ کالایی برای خروجی وجود ندارد",
          type: "warning",
        }),
      );
      return;
    }

    setIsExporting(true);

    try {
      const headers = [
        "نام کالا",
        "بارکد",
        "قیمت (تومان)",
        "موجودی",
        "تاریخ انقضا",
        "تاریخ ثبت",
      ];
      const rows = products.map((p) => [
        p.name,
        p.barcode,
        p.price.toString(),
        p.quantity.toString(),
        p.expiryDate || "",
        new Date(p.createdAt).toLocaleDateString("fa-IR"),
      ]);

      const csvContent = [headers, ...rows]
        .map((row) => row.join(","))
        .join("\n");
      const blob = new Blob(["\uFEFF" + csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.setAttribute(
        "download",
        `anbarak_export_${new Date().toISOString().slice(0, 19)}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      dispatch(
        showToast({ message: "خروجی با موفقیت گرفته شد", type: "success" }),
      );
    } catch (error) {
      dispatch(showToast({ message: "خطا در خروجی گرفتن", type: "error" }));
    } finally {
      setIsExporting(false);
    }
  };

  // پشتیبان گیری JSON
  const handleBackup = () => {
    const backupData = {
      version: "1.0.0",
      exportDate: new Date().toISOString(),
      products: products,
      settings: {
        theme: theme,
      },
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute(
      "download",
      `anbarak_backup_${new Date().toISOString().slice(0, 19)}.json`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    dispatch(
      showToast({ message: "پشتیبان با موفقیت گرفته شد", type: "success" }),
    );
  };

  // بازیابی اطلاعات
  const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backupData = JSON.parse(e.target?.result as string);

        if (backupData.products && Array.isArray(backupData.products)) {
          localStorage.setItem(
            "anbarak_products",
            JSON.stringify(backupData.products),
          );
          dispatch(
            showToast({
              message: "اطلاعات با موفقیت بازیابی شد",
              type: "success",
            }),
          );
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          dispatch(
            showToast({ message: "فایل پشتیبان نامعتبر است", type: "error" }),
          );
        }
      } catch (error) {
        dispatch(showToast({ message: "خطا در خواندن فایل", type: "error" }));
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  // حذف همه کالاها
  const handleClearAll = () => {
    dispatch(clearAllProducts());
    dispatch(showToast({ message: "همه کالاها حذف شدند", type: "success" }));
    setShowClearConfirm(false);
  };

  // اطلاعات برنامه
  const appVersion = "1.0.0";
  const lastUpdate = localStorage.getItem("anbarak_lastUpdate")
    ? new Date(localStorage.getItem("anbarak_lastUpdate")!).toLocaleDateString(
        "fa-IR",
      )
    : "امروز";

  return (
    <div className="min-h-screen bg-(--color-bg-body)">
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
            <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              تنظیمات
            </h1>
          </div>
        </div>

        {/* بخش تنظیمات ظاهری */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3">
            <i className="fas fa-palette ml-1 text-purple-500"></i> ظاهر
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
            <button
              onClick={() => dispatch(toggleTheme())}
              className="w-full p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <i className="fas fa-moon text-purple-500"></i>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800 dark:text-white">
                    حالت تاریک
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    تغییر تم روشن به تاریک
                  </p>
                </div>
              </div>
              <div
                className={`w-12 h-6 rounded-full relative transition-colors ${theme === "dark" ? "bg-(--color-primary)" : "bg-gray-300"}`}
              >
                <div
                  className={`w-5 h-5 rounded-full left-0 relative bg-white shadow-md transform transition-transform mt-0.5 ${theme !== "dark" ? "" :""}`}
                ></div>
              </div>
            </button>
          </div>
        </div>

        {/* بخش مدیریت داده */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3">
            <i className="fas fa-database ml-1 text-blue-500"></i> مدیریت داده
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
            <button
              onClick={handleExportExcel}
              disabled={isExporting}
              className="w-full p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition border-b border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <i className="fas fa-file-excel text-green-600"></i>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800 dark:text-white">
                    خروجی اکسل
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    دانلود لیست کالاها به صورت فایل Excel
                  </p>
                </div>
              </div>
              <i className="fas fa-download text-gray-400"></i>
            </button>

            <button
              onClick={handleBackup}
              className="w-full p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition border-b border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <i className="fas fa-archive text-amber-600"></i>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800 dark:text-white">
                    پشتیبان‌گیری
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    ذخیره کل اطلاعات در فایل JSON
                  </p>
                </div>
              </div>
              <i className="fas fa-download text-gray-400"></i>
            </button>

            <label className="w-full p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <i className="fas fa-upload text-blue-600"></i>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800 dark:text-white">
                    بازیابی اطلاعات
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    آپلود فایل پشتیبان قبلی
                  </p>
                </div>
              </div>
              <i className="fas fa-upload text-gray-400"></i>
              <input
                type="file"
                accept=".json"
                onChange={handleRestore}
                className="hidden"
              />
            </label>

            <button
              onClick={() => setShowClearConfirm(true)}
              className="w-full p-4 flex justify-between items-center hover:bg-red-50 dark:hover:bg-red-900/20 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <i className="fas fa-trash-alt text-red-600"></i>
                </div>
                <div className="text-right">
                  <p className="font-medium text-red-600">حذف همه کالاها</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    پاک کردن کامل انبار (غیرقابل بازگشت)
                  </p>
                </div>
              </div>
              <i className="fas fa-trash-alt text-red-400"></i>
            </button>
          </div>
        </div>

        {/* بخش اطلاعات برنامه */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3">
            <i className="fas fa-info-circle ml-1 text-blue-500"></i> درباره
            برنامه
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">نام برنامه:</span>
                <span className="font-medium text-gray-800 dark:text-white">
                  ستاک اسکن
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">نسخه:</span>
                <span className="font-medium text-gray-800 dark:text-white">
                  v{appVersion}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">تعداد کالاها:</span>
                <span className="font-medium text-blue-600">
                  {products.length} عدد
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">آخرین بروزرسانی:</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {lastUpdate}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* مودال تأیید حذف */}
        {showClearConfirm && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-exclamation-triangle text-2xl text-red-500"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  حذف همه کالاها
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  آیا از حذف کامل تمام {products.length} کالا مطمئن هستید؟
                  <br />
                  این عمل غیرقابل بازگشت است!
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleClearAll}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition"
                >
                  بله، حذف شود
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 transition"
                >
                  انصراف
                </button>
              </div>
            </div>
          </div>
        )}

        </div>
    </div>
  );
};

export default Settings;
