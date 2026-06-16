import type { Category } from '../../shared/types/category';
import type { ApiResponse } from '../../shared/types/product';
import { apiClient } from '../client';

export const categoriesApi = {
  // GET /categories
  getAll: () =>
    apiClient.get<ApiResponse<Category[]>>('/categories'),

  // GET /categories/:id
  getById: (id: string) =>
    apiClient.get<ApiResponse<Category>>(`/categories/${id}`),

  // POST /categories
  create: (data: { name: string; color?: string; icon?: string }) =>
    apiClient.post<ApiResponse<Category>>('/categories', data),

  // PATCH /categories/:id
  update: (id: string, data: Partial<{ name: string; color: string; icon: string }>) =>
    apiClient.patch<ApiResponse<Category>>(`/categories/${id}`, data),

  // DELETE /categories/:id
  delete: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/categories/${id}`),
};