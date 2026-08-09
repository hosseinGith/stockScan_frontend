import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../shared/stores/hooks";
import { showToast } from "../../shared/stores/slices/uiSlice";
import { toast } from "sonner";
import {
  useCreateProduct,
  useGetProductFromBarcode,
} from "../../shared/hooks/queries/useProducts";
import ScannerSection from "./components/ScannerSection";
import ProductFormSection from "./components/ProductFormSection";
import type { ProductFormData } from "./types/index";

const ScanProduct: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.items);

  const [activeTab, setActiveTab] = useState<"scan" | "manual">("scan");
  const [scannedBarcode, setScannedBarcode] = useState<string>("");
  const [manualBarcode, setManualBarcode] = useState<string>("");
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const barcodeCheckMutation = useGetProductFromBarcode();

  const [formData, setFormData] = useState<Omit<ProductFormData, "barcode">>({
    name: "",
    price: 0,
    quantity: 1,
    minQuantity: 1,
    expiryDate: new Date(),
    category: "",
    description: "",
  });

  const productCreateHook = useCreateProduct();

  const handleScanSuccess = (data: string) => {
    console.log("✅ بارکد اسکن شد:", data);
    setScannedBarcode(data);
    setManualBarcode(data);
    setShowForm(true);
    setIsScanning(false);
    toast.success("بارکد با موفقیت اسکن شد");
    handleGetProductInfo(data);
  };

  const handleGetProductInfo = async (barcode: string) => {
    try {
      const data = await barcodeCheckMutation.mutateAsync(barcode);
      if (data.data) {
        setFormData((prev) => ({
          ...prev,
          category: data.data.brand || "",
          description: data.data.description || "",
          name: data.data.description || "",
        }));
      }
    } catch (e) {
      setFormData((prev) => ({
        ...prev,
        category: "",
        description: "",
        name: "",
      }));
      console.error("خطا در دریافت اطلاعات کالا:", e);
    }
  };

  const handleManualSubmit = () => {
    const barcode = manualBarcode.trim();
    if (!barcode) {
      toast.error("لطفاً بارکد را وارد کنید");
      return;
    }
    if (barcode.length < 13) {
      toast.error("کد بارکد باید 13 رقم باشد");
      return;
    }
    setScannedBarcode(barcode);
    setShowForm(true);
    setIsScanning(false);
    handleGetProductInfo(barcode);
  };

  const handleFormChange = (
    data: Partial<Omit<ProductFormData, "barcode">>,
  ) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleSaveProduct = async () => {
    const barcode = scannedBarcode;

    if (!barcode) {
      toast.error("بارکد نامعتبر است");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("لطفاً نام کالا را وارد کنید");
      return;
    }

    if (formData.price <= 0) {
      toast.error("لطفاً قیمت معتبر وارد کنید");
      return;
    }

    if (products.some((p) => p.barcode === barcode)) {
      toast.error("کالا با این بارکد قبلاً ثبت شده است");
      return;
    }

    setIsLoading(true);

    try {
      const newProduct = {
        barcode,
        name: formData.name,
        price: formData.price,
        quantity: formData.quantity,
        expiryDate: formData.expiryDate.toISOString(),
        description: formData.description || "",
        isActive: true,
        category: formData.category || "",
        minQuantity: formData.minQuantity || 1,
      };
      await productCreateHook.mutateAsync(newProduct);

      toast.success("کالا با موفقیت اضافه شد.");
      resetForm();
    } catch {
      toast.error("خطا در ذخیره کالا");
      dispatch(showToast({ message: "خطا در ذخیره کالا", type: "error" }));
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setScannedBarcode("");
    setManualBarcode("");
    setFormData({
      name: "",
      price: 0,
      quantity: 1,
      minQuantity: 1,
      expiryDate: new Date(),
      category: "",
      description: "",
    });
    setIsScanning(true);
    setActiveTab("scan");
  };

  const handleCancelForm = () => {
    resetForm();
  };

  useEffect(() => {
    (() => {
      if (activeTab === "scan") {
        setIsScanning(true);
        setShowForm(false);
      } else {
        setIsScanning(false);
      }
    })();
  }, [activeTab]);

  return (
    <div className="min-h-screen mb-18 bg-bg-body">
      <div className="max-w-2xl mx-auto px-4 py-5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <i className="fas fa-arrow-right text-lg"></i>
            </button>
            <h1 className="text-2xl font-bold bg-(--color-primary) bg-clip-text text-transparent">
              افزودن کالا
            </h1>
          </div>
          <span className="text-xs text-gray-400">
            {activeTab === "scan" ? "📷 اسکن" : "⌨️ دستی"}
          </span>
        </div>

        <div className="flex gap-2 mb-6 bg-white dark:bg-gray-800 p-1.5 rounded-2xl shadow-md">
          <button
            onClick={() => {
              setActiveTab("scan");
              setShowForm(false);
              setScannedBarcode("");
              setIsScanning(true);
            }}
            className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === "scan"
                ? "bg-linear-to-r bg-(--color-primary) text-white shadow-lg"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <i className="fas fa-camera ml-1"></i> اسکن بارکد
          </button>
          <button
            onClick={() => {
              setActiveTab("manual");
              setShowForm(false);
              setIsScanning(false);
            }}
            className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === "manual"
                ? "bg-linear-to-r bg-(--color-primary) text-white shadow-lg"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <i className="fas fa-keyboard ml-1"></i> ورود دستی
          </button>
        </div>

        {activeTab === "scan" && !showForm && (
          <ScannerSection
            isActive={isScanning}
            onScanSuccess={handleScanSuccess}
          />
        )}

        {activeTab === "manual" && !showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-(--color-primary)/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-barcode text-2xl text-(--color-primary)"></i>
              </div>
              <p className="text-sm">کد بارکد ۱۳ رقمی زیر بارکد را وارد کنید</p>
            </div>

            <input
              type="text"
              value={manualBarcode}
              onChange={(e) =>
                setManualBarcode(e.target.value.replace(/\D/g, ""))
              }
              placeholder="مثال: 6260010001234"
              className="w-full px-4 py-3.5 rounded-xl text-center font-mono text-sm focus:outline-none focus:ring-2"
              maxLength={13}
            />

            <button
              onClick={handleManualSubmit}
              disabled={isLoading}
              className={`w-full mt-4 py-3 bg-(--color-primary) text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  در حال دریافت اطلاعات...
                </span>
              ) : (
                <>
                  ادامه برای ثبت کالا <i className="fas fa-arrow-left ml-1"></i>
                </>
              )}
            </button>
          </div>
        )}

        {showForm && (
          <ProductFormSection
            barcode={scannedBarcode}
            formData={formData}
            onFormChange={handleFormChange}
            onSave={handleSaveProduct}
            onCancel={handleCancelForm}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default ScanProduct;
