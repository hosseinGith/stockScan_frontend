import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../shared/stores/hooks";
import {
  selectAllProducts,
  selectProductsCount,
  selectTotalValue,
} from "../../shared/stores/slices/productSlice";
import { selectTheme } from "../../shared/stores/slices/uiSlice";
import {
  isExpired,
  isExpiringSoon,
  formatPrice,
  formatDateToPersian,
} from "../../shared/utils/helpers";
import BottomNav from "../../shared/components/BottomNav";
import Header from "../../shared/components/Header";
import StatsCard from "./components/StatsCard";
import Toast from "../../shared/components/Toast";
import { hideToast } from "../../shared/stores/slices/uiSlice";
import { useNavigate } from "react-router-dom";
import { useDashboardOverview } from "../../shared/hooks/queries/useDashboard";
import { motion } from "framer-motion";

const Dashboard: React.FC = () => {
  const { data, isLoading, error } = useDashboardOverview();
  const dashboardData = data?.data;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectAllProducts);
  const totalProducts = useAppSelector(selectProductsCount);
  const totalValue = useAppSelector(selectTotalValue);
  const theme = useAppSelector(selectTheme);
  const toast = useAppSelector((state) => state.ui.toast);

  const [date, setDate] = useState("");
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);
  useEffect(() => {
    (() => {
      setDate(
        new Date().toLocaleDateString("fa-IR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      );
    })();
  }, []);
  if (isLoading) {
    return <div className="text-center py-10">در حال بارگذاری...</div>;
  }

  if (error || !dashboardData) {
    return (
      <div className="text-center text-red-500 py-10">
        خطا در بارگذاری داشبورد
      </div>
    );
  }

  // محاسبات با استفاده از products
  const expiringCount = products.filter(
    (p) => !isExpired(p.expiryDate) && isExpiringSoon(p.expiryDate),
  ).length;
  const expiredCount = products.filter((p) => isExpired(p.expiryDate)).length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 pb-24 min-h-screen bg-body">
      <Header
        title="انبارک"
        rightAction={
          <button className="relative">
            <i className="fas fa-bell text-secondary text-xl"></i>
            {expiringCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-danger text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {expiringCount}
              </span>
            )}
          </button>
        }
      />

      <p className="text-xs text-secondary mb-6">{date}</p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-linear-to-r from-primary to-primary-dark rounded-2xl p-5 text-white mb-6 shadow-lg"
      >
        <p className="text-sm opacity-90">سلام 👋</p>
        <p className="font-bold text-lg mt-1">به انبارک خوش اومدی</p>
        <p className="text-xs opacity-80 mt-1">
          بارکد کالاها رو اسکن کن و انبارت رو مدیریت کن
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
      >
        <StatsCard
          icon="fas fa-cubes"
          iconColor="text-primary"
          value={totalProducts}
          label="کل کالاها"
          bgColor="bg-primary-bg"
        />
        <StatsCard
          icon="fas fa-credit-card"
          iconColor="text-success"
          value={totalValue}
          label="ارزش کل (تومان)"
          bgColor="bg-success-bg"
        />
        <StatsCard
          icon="fas fa-hourglass-half"
          iconColor="text-warning"
          value={expiringCount}
          label="در حال انقضا"
          bgColor="bg-warning-bg"
        />
        <StatsCard
          icon="fas fa-calendar-times"
          iconColor="text-danger"
          value={expiredCount}
          label="منقضی شده"
          bgColor="bg-danger-bg"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="bg-card rounded-2xl shadow-md mb-6 overflow-hidden"
      >
        <div className="flex justify-between items-center p-4 border-b border-default">
          <h2 className="font-bold text-primary">
            <i className="fas fa-exclamation-triangle text-warning ml-1"></i>{" "}
            کالاهای در حال انقضا
          </h2>
          <button
            onClick={() => navigate("/products")}
            className="text-xs text-primary"
          >
            مشاهده همه →
          </button>
        </div>
        <div className="divide-y divide-default max-h-64 overflow-y-auto">
          {dashboardData?.expiringProducts.length === 0 ? (
            <div className="p-4 text-center text-secondary text-sm">
              <i className="fas fa-check-circle text-success"></i> کالایی در حال
              انقضا نیست
            </div>
          ) : (
            dashboardData?.expiringProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/product/${p.id}`)}
                className="p-3 hover:bg-hover cursor-pointer transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-primary">{p.name}</p>
                    <p className="text-xs text-secondary">
                      موجودی: {p.quantity}
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-warning font-medium">
                      {formatDateToPersian(p.expiryDate)}
                    </p>
                    <p className="text-xs text-secondary">
                      {formatPrice(p.price)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-card rounded-2xl shadow-md mb-6 overflow-hidden"
      >
        <div className="flex justify-between items-center p-4 border-b border-default">
          <h2 className="font-bold text-primary">
            <i className="fas fa-clock text-primary ml-1"></i> کالاهای اخیر
          </h2>
          <button
            onClick={() => navigate("/products")}
            className="text-xs text-primary"
          >
            مشاهده همه →
          </button>
        </div>
        <div className="divide-y divide-default max-h-64 overflow-y-auto">
          {dashboardData.recentProducts.length === 0 ? (
            <div className="p-4 text-center text-secondary text-sm">
              <i className="fas fa-box-open"></i> هنوز کالایی اضافه نشده
            </div>
          ) : (
            dashboardData.recentProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/product/${p.id}`)}
                className="p-3 hover:bg-hover cursor-pointer transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-primary">{p.name}</p>
                    <p className="text-xs text-secondary">
                      {p.barcode.slice(-8)}
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-primary">
                      {formatPrice(p.price)}
                    </p>
                    <p className="text-xs text-secondary">
                      موجودی: {p.quantity}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      <BottomNav />

      {toast?.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => dispatch(hideToast())}
        />
      )}
    </div>
  );
};

export default Dashboard;
