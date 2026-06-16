import React from "react";
import { useDashboardOverview } from "../../shared/hooks/queries/useDashboard";
import StatsCard from "./components/StatsCard";
import ProductCard from "../products/components/ProductCard";

const Dashboard: React.FC = () => {
  const { data, isLoading, error } = useDashboardOverview();

  if (isLoading) {
    return <div className="text-center py-10">در حال بارگذاری...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-10">
        خطا در بارگذاری داشبورد
      </div>
    );
  }

  const { stats, recentProducts, expiringProducts, lowStockProducts } = data!;

  return (
    <div className="space-y-6">
      {/* کارت‌های آمار */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          icon="fa-boxes"
          value={stats.totalProducts}
          label="کل کالاها"
          iconColor="blue"
        />
        <StatsCard
          icon="fa-credit-card"
          value={stats.totalValue.toLocaleString()}
          label="ارزش کل (تومان)"
          iconColor="green"
        />
        <StatsCard
          icon="fa-hourglass-half"
          value={stats.expiringSoonCount}
          label="در حال انقضا"
          iconColor="yellow"
        />
        <StatsCard
          icon="fa-calendar-times"
          value={stats.expiredCount}
          label="منقضی شده"
          iconColor="red"
        />
      </div>

      {/* کالاهای در حال انقضا */}
      <div className="bg-white rounded-2xl p-4 shadow">
        <h3 className="font-bold text-lg mb-3">⚠️ کالاهای در حال انقضا</h3>
        {expiringProducts.length === 0 ? (
          <p className="text-gray-400">کالایی در حال انقضا نیست</p>
        ) : (
          <div className="space-y-2">
            {expiringProducts.map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        )}
      </div>

      {/* کالاهای با موجودی کم */}
      <div className="bg-white rounded-2xl p-4 shadow">
        <h3 className="font-bold text-lg mb-3">⚡ کالاهای با موجودی کم</h3>
        {lowStockProducts.length === 0 ? (
          <p className="text-gray-400">کالایی با موجودی کم نیست</p>
        ) : (
          <div className="space-y-2">
            {lowStockProducts.map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
