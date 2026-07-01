import type { ApiResponse, Product } from "../../shared/types/product";
import { apiClient } from "../client";

export interface DashboardStats {
  productsCount: number;
  totalPrice: number;
  expiredProductsCount: number;
  categoriesCount: number;
  expiringSoonProductsCount: number;
}

export interface DashboardOverview {
  stats: DashboardStats;
  recentProducts: Product[];
  expiringProducts: Product[];
  lowStockProducts: Product[];
}

export const dashboardApi = {
  getStats: () =>
    apiClient.get<ApiResponse<DashboardStats>>("/dashboard/stats"),
  getRecentProducts: () =>
    apiClient.get<ApiResponse<Product[]>>("/dashboard/recent-products"),
  getExpiringProducts: () =>
    apiClient.get<ApiResponse<Product[]>>("/dashboard/expiring-products"),
  getLowStock: () =>
    apiClient.get<ApiResponse<Product[]>>("/dashboard/low-stock"),
  getOverview: () => apiClient.get<DashboardOverview>("/dashboard/overview"),
};
