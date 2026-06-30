import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { productsApi } from "../../../api/endpoints/products.api";
import type { ProductFilters } from "../../types/product";

export const searchKeys = {
  all: ["search"] as const,
  results: (params: ProductFilters) =>
    [...searchKeys.all, "results", params] as const,
};

export const useSearchFilters = (): ProductFilters => {
  const [searchParams] = useSearchParams();

  return {
    search: searchParams.get("search") || undefined,
    categoryId: searchParams.get("category") || undefined,
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
    sortBy:
      (searchParams.get("sortBy") as ProductFilters["sortBy"]) || undefined,
    status:
      (searchParams.get("status") as ProductFilters["status"]) || undefined,
    inStock: searchParams.get("inStock") === "true",
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 20,
    offset: searchParams.get("offset") ? Number(searchParams.get("offset")) : 0,
  };
};

export const useProductSearch = (filters?: ProductFilters) => {
  const params = useSearchFilters();
  const finalFilters = filters || params;

  return useQuery({
    queryKey: searchKeys.results(finalFilters),
    queryFn: async () => {
      const { data } = await productsApi.search(finalFilters);
      return data.data;
    },
    staleTime: 5 * 1000,
    gcTime: 0,
    enabled: true,
    placeholderData: (previousData) => previousData,
  });
};
