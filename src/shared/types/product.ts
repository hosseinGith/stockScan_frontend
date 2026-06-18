import type { Category } from "./category";

export interface Product {
  id: string;
  barcode: string;
  name: string;
  price: number;
  quantity: number;
  expiryDate: string | null;
  description?: string | null;
  imageUrl?: string | null;
  minQuantity?: number;
  categoryId?: string | null;
  category?: Category | null;
  userId?: string | null;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  barcode: string;
  name: string;
  price: number;
  quantity?: number;
  expiryDate?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  minQuantity?: number;
  categoryId?: string | null;
}

export interface UpdateProductDto {
  name?: string;
  price?: number;
  quantity?: number;
  expiryDate?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  minQuantity?: number;
  categoryId?: string | null;
  isActive?: boolean;
}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  userId?: string;
  minPrice?: number;
  maxPrice?: number;
  expired?: boolean;
  expiringSoon?: boolean;
  status?: ProductStatus;
  inStock?: boolean;
  lowStock?: boolean;
  isActive?: boolean;
  sortBy?:
    | "name"
    | "price_asc"
    | "price_desc"
    | "quantity"
    | "expiry"
    | "newest";
  limit?: number;
  offset?: number;
}

export interface ProductStats {
  totalProducts: number;
  totalValue: number;
  expiredCount: number;
  expiringSoonCount: number;
  lowStockCount: number;
  averagePrice: number;
  totalQuantity: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  timestamp: string;
}
export interface Stats {
  expiredCount: number;
  expiringSoonCount: number;
  totalValue: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  stats: Stats;
}

export type ProductStatus =
  | "available"
  | "expired"
  | "expiring_soon"
  | "low_stock";

export type ProductSortField =
  | "name"
  | "price"
  | "quantity"
  | "expiryDate"
  | "createdAt";

export type ProductSortOrder = "ASC" | "DESC";
