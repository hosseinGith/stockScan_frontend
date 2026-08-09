import type { Product } from "./product";

export interface Category {
  id: string;
  name: string;
  color?: string | null;
  icon?: string | null;
  description?: string | null;
  isActive?: boolean;
  products?: Product[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryDto {
  name: string;
  color?: string;
  icon?: string;
  description?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  color?: string;
  icon?: string;
  description?: string;
  isActive?: boolean;
}
