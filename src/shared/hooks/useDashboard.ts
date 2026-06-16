import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dashboardsApi } from "../../api/endpoints/dashboards.api";

import { showToast } from "../stores/slices/uiSlice";
import { useAppDispatch } from "../stores/hooks";

export const dashboardKeys = {
  all: ["dashboards"] as const,
  lists: () => [...dashboardKeys.all, "list"] as const,
  list: (filters: unknown) => [...dashboardKeys.lists(), filters] as const,
  details: () => [...dashboardKeys.all, "detail"] as const,
  detail: (id: string) => [...dashboardKeys.details(), id] as const,
};

export const useDashboard = (params?: {
  search?: string;
  category?: string;
}) => {
  return useQuery({
    queryKey: dashboardKeys.list(params),
    queryFn: async () => {
      const { data } = await dashboardsApi.getAll(params);
      return data;
    },
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export const useDashboard = (id: string) => {
  return useQuery({
    queryKey: dashboardKeys.detail(id),
    queryFn: async () => {
      const { data } = await dashboardsApi.getById(id);
      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateDashboard = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (data: CreateDashboardDto) => dashboardsApi.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.lists() });
      dispatch(
        showToast({ message: "کالا با موفقیت ایجاد شد", type: "success" }),
      );
    },
    onError: (error: unknown) => {
      dispatch(
        showToast({
          message: error?.response?.data?.message || "خطا در ایجاد کالا",
          type: "error",
        }),
      );
    },
  });
};

export const useUpdateDashboard = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDashboardDto }) =>
      dashboardsApi.update(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: dashboardKeys.detail(variables.id),
      });
      dispatch(
        showToast({ message: "کالا با موفقیت ویرایش شد", type: "success" }),
      );
    },
    onError: (error: unknown) => {
      dispatch(
        showToast({
          message: error.response?.data?.message || "خطا در ویرایش کالا",
          type: "error",
        }),
      );
    },
  });
};

export const useDeleteDashboard = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (id: string) => dashboardsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.lists() });
      dispatch(
        showToast({ message: "کالا با موفقیت حذف شد", type: "success" }),
      );
    },
    onError: (error: unknown) => {
      dispatch(
        showToast({
          message: error.response?.data?.message || "خطا در حذف کالا",
          type: "error",
        }),
      );
    },
  });
};

export const useUpdateDashboardQuantity = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: ({
      id,
      quantity,
      action,
    }: {
      id: string;
      quantity: number;
      action: "add" | "subtract";
    }) => dashboardsApi.updateQuantity(id, quantity, action),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: dashboardKeys.detail(variables.id),
      });
      dispatch(
        showToast({
          message: `موجودی با موفقیت ${variables.action === "add" ? "افزایش" : "کاهش"} یافت`,
          type: "success",
        }),
      );
    },
    onError: (error: unknown) => {
      dispatch(
        showToast({
          message: error.response?.data?.message || "خطا در تغییر موجودی",
          type: "error",
        }),
      );
    },
  });
};
