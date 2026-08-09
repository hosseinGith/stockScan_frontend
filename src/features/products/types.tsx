export interface FilterState {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  sortBy: "name" | "price_asc" | "price_desc" | "newest";
  status: "all" | "available" | "expired" | "expiring_soon";
  inStock: boolean;
}
