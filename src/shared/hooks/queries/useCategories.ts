/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "../../../api/endpoints/categories.api";
import { toast } from "sonner";

export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: () => [...categoryKeys.lists()] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
};

export const useCategories = () => {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: async () => {
      const { data } = await categoriesApi.getAll();
      return data.data;
    },
    staleTime: 0,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: async () => {
      const { data } = await categoriesApi.getById(id);
      return data.data;
    },
    enabled: !!id,
    staleTime: 0,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; color?: string; icon?: string }) =>
      categoriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast.success("دسته‌بندی با موفقیت ایجاد شد");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "خطا در ایجاد دسته‌بندی");
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<{ name: string; color: string; icon: string }>;
    }) => categoriesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: categoryKeys.detail(variables.id),
      });
      toast.success("دسته‌بندی با موفقیت ویرایش شد");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "خطا در ویرایش دسته‌بندی");
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast.success("دسته‌بندی با موفقیت حذف شد");
    },

    onError: (error: any) => {
      toast.error(error.response?.data?.message || "خطا در حذف دسته‌بندی");
    },
  });
};
