import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "../../../api/endpoints/products.api";
import type { CreateProductDto, UpdateProductDto } from "../../types/product";
import { showToast } from "../../stores/slices/uiSlice";
import { useAppDispatch } from "../../stores/hooks";
import { toast } from "sonner";

export const useGetProductFromBarcode = (barcode: string) => {
  return useQuery({
    queryKey: ["product", "barcode", barcode],
    queryFn: () => productsApi.getProductByBarcode(barcode).then((r) => r.data),
    enabled: !!barcode,
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
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (data: CreateProductDto) => productsApi.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
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

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductDto }) =>
      productsApi.update(id, data),
    onSuccess: (response, variables) => {
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
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
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

export const useUpdateProductQuantity = () => {
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
    }) => productsApi.updateQuantity(id, quantity, action),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(variables.id),
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
