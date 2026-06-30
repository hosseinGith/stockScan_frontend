import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../../../api/endpoints/dashboards.api";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
  recent: () => [...dashboardKeys.all, "recent"] as const,
  expiring: () => [...dashboardKeys.all, "expiring"] as const,
  lowStock: () => [...dashboardKeys.all, "low-stock"] as const,
  overview: () => [...dashboardKeys.all, "overview"] as const,
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: async () => {
      const data = await dashboardApi.getStats();
      return data;
    },
    staleTime: 0,
    gcTime: 0,
  });
};

export const useDashboardRecentProducts = () => {
  return useQuery({
    queryKey: dashboardKeys.recent(),
    queryFn: async () => {
      const data = await dashboardApi.getRecentProducts();
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 0,
  });
};

export const useDashboardExpiringProducts = () => {
  return useQuery({
    queryKey: dashboardKeys.expiring(),
    queryFn: async () => {
      const data = await dashboardApi.getExpiringProducts();
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 0,
  });
};

export const useDashboardOverview = () => {
  return useQuery({
    queryKey: dashboardKeys.overview(),
    queryFn: async () => {
      const data = await dashboardApi.getOverview();
      return data;
    },
    staleTime: 0,
    gcTime: 0,
  });
};
