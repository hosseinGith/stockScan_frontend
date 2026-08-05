import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "../../../api/endpoints/products.api";
import type { CreateProductDto, UpdateProductDto } from "../../types/product";
import { toast } from "sonner";

export const useGetProductFromBarcode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (barcode: string) => productsApi.getProductByBarcode(barcode),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["product", "barcode", data.data],
      });
    },
  });
};
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: unknown) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};
export const useProducts = (params?: {
  search?: string;
  category?: string;
}) => {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: async () => {
      const { data } = await productsApi.getAll(params);
      return data;
    },
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const { data } = await productsApi.getById(id);
      return data;
    },
    enabled: !!id,
    staleTime: 0,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductDto) => productsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductDto }) =>
      productsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(variables.id),
      });
    },
    onError: () => {
      toast.error("مشکل در ذخیره کردن محصول.");
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

export const useUpdateProductQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      quantity,
      action,
    }: {
      id: string;
      quantity: number;
      action: "add" | "subtract";
    }) => productsApi.updateQuantity(id, quantity, action),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(variables.id),
      });
    },
  });
};
