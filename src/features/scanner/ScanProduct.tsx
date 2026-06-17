/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../shared/stores/hooks";

import { showToast } from "../../shared/stores/slices/uiSlice";

import BottomNav from "../../shared/components/BottomNav";
import { Html5Qrcode } from "html5-qrcode";
import { useCreateProduct } from "../../shared/hooks/queries/useProducts";
import { toast } from "sonner";

const ScanProduct: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.items);

  const [activeTab, setActiveTab] = useState<"scan" | "manual">("scan");
  const [scannedBarcode, setScannedBarcode] = useState<string>("");
  const [manualBarcode, setManualBarcode] = useState<string>("");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [, setIsScannerReady] = useState<boolean>(false);
  const formDataInitialData = {
    category: "",
    description: "",
    imageUrl: "",
    minQuantity: 0,
    isActive: true,
  };
  const [formData, setFormData] = useState(formDataInitialData);
  const [formName, setFormName] = useState<string>("");
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formQuantity, setFormQuantity] = useState<number>(1);
  const [formExpiry, setFormExpiry] = useState<string>("");

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = "barcode-scanner";
  const isMountedRef = useRef<boolean>(true);
  const isScanningRef = useRef<boolean>(false);

  const startScanner = useCallback(async () => {
    if (isScanningRef.current) {
      return;
    }

    if (!isMountedRef.current) {
      return;
    }

    const element = document.getElementById(scannerContainerId);
    if (!element) {
      return;
    }

    try {
      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
          scannerRef.current.clear();
        } catch {
          /* empty */
        }
        scannerRef.current = null;
      }

      scannerRef.current = new Html5Qrcode(scannerContainerId);
      isScanningRef.current = true;
      setIsScanning(true);

      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 280, height: 200 },
        },
        (decodedText) => {
          if (decodedText && isMountedRef.current) {
            stopScanner();
            setScannedBarcode(decodedText);
            setShowForm(true);

            toast.success("بارکد با موفقیت اسکن شد");
          }
        },
        () => {},
      );

      setIsScannerReady(true);
    } catch (error) {
      console.error("خطا در شروع اسکنر:", error);
      if (isMountedRef.current) {
        toast.success("دسترسی به دوربین ممکن نیست");

        setIsScanning(false);
        isScanningRef.current = false;
      }
    }
  }, [dispatch]);

  async function stopScanner() {
    if (scannerRef.current && isScanningRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
        scannerRef.current = null;
        isScanningRef.current = false;
        setIsScanning(false);
        setIsScannerReady(false);
      } catch (error) {
        console.error("خطا در توقف اسکنر:", error);

        scannerRef.current = null;
        isScanningRef.current = false;
        setIsScanning(false);
      }
    } else {
      isScanningRef.current = false;
      setIsScanning(false);
    }
  }

  const cleanupScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (error) {
        console.error("خطا در پاکسازی اسکنر:", error);
      }
      scannerRef.current = null;
    }

    isScanningRef.current = false;
    setIsScanning(false);
    setIsScannerReady(false);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      cleanupScanner();
    };
  }, [cleanupScanner]);

  useEffect(() => {
    console.log(activeTab);

    if (activeTab === "manual") {
      stopScanner();
      return;
    }

    if (showForm) {
      stopScanner();
      return;
    }

    if (activeTab === "scan" && !showForm && isMountedRef.current) {
      const timer = setTimeout(() => {
        if (isMountedRef.current && activeTab === "scan" && !showForm) {
          startScanner();
        }
      }, 300);
      return () => clearTimeout(timer);
    }

    return () => {
      if (activeTab !== "scan" || showForm) {
        stopScanner();
      }
    };
  }, [activeTab, showForm, startScanner]);

  const isBarcodeDuplicate = (barcode: string): boolean => {
    return products.some((p) => p.barcode === barcode);
  };
  const createProduct = useCreateProduct();
  const handleSaveProduct = async () => {
    const barcode = activeTab === "scan" ? scannedBarcode : manualBarcode;

    if (!barcode) {
      toast.error("بارکد نامعتبر است");
      return;
    }

    if (!formName.trim()) {
      toast.error("لطفاً نام کالا را وارد کنید");

      return;
    }

    if (formPrice <= 0) {
      toast.error("لطفاً قیمت معتبر وارد کنید");

      return;
    }

    if (isBarcodeDuplicate(barcode)) {
      toast.warning("کالا با این بارکد قبلاً ثبت شده است");
      return;
    }

    const newProduct = {
      ...formData,
      isActive: true,
      barcode,
      name: formName,
      price: formPrice,
      quantity: formQuantity,
      expiryDate: formExpiry,
    };
    console.log(345345);

    const { data } = await createProduct.mutateAsync(newProduct);
    toast.success(`${formName} با موفقیت اضافه شد`);

    resetForm();
    handleCancelForm();
    if (activeTab === "scan") {
      setShowForm(false);
      setScannedBarcode("");

      setTimeout(() => {
        if (isMountedRef.current && activeTab === "scan" && !showForm) {
          startScanner();
        }
      }, 500);
    } else {
      setManualBarcode("");
    }
  };

  const resetForm = () => {
    setFormName("");
    setFormData(formDataInitialData);
    setFormPrice(0);
    setFormQuantity(1);
    setFormExpiry("");
    if (activeTab === "manual") {
      setManualBarcode("");
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setScannedBarcode("");
    resetForm();
    if (activeTab === "scan" && isMountedRef.current) {
      setTimeout(() => {
        startScanner();
      }, 300);
    }
  };

  const handleManualSubmit = () => {
    if (!manualBarcode.trim()) {
      toast.error("لطفاً بارکد را وارد کنید");

      return;
    }
    setScannedBarcode(manualBarcode);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 pb-24">
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
              افزودن کالا
            </h1>
          </div>
        </div>

        {/* تب‌ها */}
        <div className="flex gap-2 mb-6 bg-white dark:bg-gray-800 p-1.5 rounded-2xl shadow-md">
          <button
            onClick={() => {
              setActiveTab("scan");
              setShowForm(false);
              setScannedBarcode("");
            }}
            className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === "scan"
                ? "bg-linear-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <i className="fas fa-camera ml-1"></i> اسکن بارکد
          </button>
          <button
            onClick={() => {
              setActiveTab("manual");
              setShowForm(false);
            }}
            className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === "manual"
                ? "bg-linear-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <i className="fas fa-keyboard ml-1"></i> ورود دستی
          </button>
        </div>

        {/* تب اسکن */}
        {activeTab === "scan" && !showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-xl">
            <div className="text-center mb-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                دوربین را روی بارکد کالا قرار دهید
              </p>
            </div>

            {/* محفظه اسکنر - با key برای رندر مجدد */}
            <div
              key={scannerContainerId}
              id={scannerContainerId}
              className="w-full rounded-2xl overflow-hidden bg-black"
              style={{ minHeight: "300px" }}
            ></div>

            <div className="flex gap-2 mt-4">
              {isScanning ? (
                <button
                  onClick={stopScanner}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition"
                >
                  <i className="fas fa-stop ml-1"></i> توقف اسکن
                </button>
              ) : (
                <button
                  onClick={startScanner}
                  className="flex-1 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition"
                >
                  <i className="fas fa-play ml-1"></i> شروع اسکن
                </button>
              )}
            </div>

            <p className="text-center text-xs text-gray-400 mt-4">
              💡 نکته: بارکد را در نور کافی و با فاصله مناسب قرار دهید
            </p>
          </div>
        )}

        {/* تب ورود دستی */}
        {activeTab === "manual" && !showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-linear-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-barcode text-2xl text-blue-500"></i>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                کد بارکد ۱۳ رقمی زیر بارکد را وارد کنید
              </p>
            </div>
            <input
              type="text"
              value={manualBarcode}
              onChange={(e) => setManualBarcode(e.target.value)}
              placeholder="مثال: 6260010001234"
              className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900 rounded-xl text-center text-gray-700 dark:text-gray-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <button
              onClick={handleManualSubmit}
              className="w-full mt-4 py-3 bg-linear-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
            >
              <i className="fas fa-arrow-left ml-1"></i> ادامه برای ثبت کالا
            </button>
          </div>
        )}

        {/* فرم ثبت کالا */}
        {showForm && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveProduct();
            }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl animate-fade-in"
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                <i className="fas fa-plus-circle text-green-500 ml-2"></i>
                ثبت کالا جدید
              </h2>
              <button
                onClick={handleCancelForm}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 transition"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  بارکد
                </label>
                <div className="bg-gray-100 dark:bg-gray-900 rounded-xl px-4 py-3">
                  <p className="font-mono text-sm text-gray-700 dark:text-gray-300">
                    {activeTab === "scan" ? scannedBarcode : manualBarcode}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  نام کالا *
                </label>
                <input
                  required
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="مثال: رب گوجه فرنگی"
                  className="w-full px-4 py-3  rounded-xl  text-sm transition"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    دسته بندی *
                  </label>
                  <input
                    required
                    type="string"
                    value={formData.category || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="0"
                    className="w-full px-4 py-3  rounded-xl  text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    توضیحات
                  </label>
                  <input
                    type="string"
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-3  rounded-xl  text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  هشدار حداقل
                </label>
                <input
                  type="number"
                  value={formData.minQuantity || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minQuantity: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3  rounded-xl  text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    قیمت (تومان) *
                  </label>
                  <input
                    required
                    type="number"
                    value={formPrice || ""}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-4 py-3  rounded-xl  text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    تعداد/موجودی
                  </label>
                  <input
                    required
                    type="number"
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(Number(e.target.value))}
                    className="w-full px-4 py-3  rounded-xl  text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  تاریخ انقضا *
                </label>
                <input
                  required
                  type="date"
                  value={formExpiry}
                  onChange={(e) => setFormExpiry(e.target.value)}
                  className="w-full px-4 py-3  rounded-xl  text-sm"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button className="flex-1 py-3 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium shadow-lg shadow-green-500/25 hover:shadow-xl hover:scale-[1.02] transition-all duration-200">
                  <i className="fas fa-save ml-1"></i> ذخیره کالا
                </button>
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 transition"
                >
                  انصراف
                </button>
              </div>
            </div>
          </form>
        )}

        <BottomNav />
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ScanProduct;
