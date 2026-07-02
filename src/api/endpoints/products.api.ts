import { apiClient } from "../client";
import type {
  Product,
  CreateProductDto,
  UpdateProductDto,
  ProductFilters,
  ApiResponse,
  PaginatedResponse,
} from "../../shared/types/product";

export const productsApi = {
  // GET /products
  getAll: (params?: { search?: string; category?: string }) =>
    apiClient.get<ApiResponse<Product[]>>("/products", { params }),

  // GET /products/:id
  getById: (id: string) => apiClient.get<Product>(`/products/${id}`),

  // POST /products
  create: (data: CreateProductDto) =>
    apiClient.post<Product>("/products", data),

  // PATCH /products/:id
  update: (id: string, data: UpdateProductDto) =>
    apiClient.patch<Product>(`/products/${id}`, data),

  // DELETE /products/:id
  delete: (id: string) => apiClient.delete(`/products/${id}`),

  // PATCH /products/:id/quantity
  updateQuantity: (id: string, quantity: number, action: "add" | "subtract") =>
    apiClient.patch<Product>(`/products/${id}/quantity`, { quantity, action }),
  search: (params: ProductFilters) =>
    apiClient.get<ApiResponse<PaginatedResponse<Product>>>("/products/search", {
      params,
    }),
  getProductByBarcode: (barcode: string) => {
    return apiClient.get(`/products/barcode/${barcode}`);
  },
};
