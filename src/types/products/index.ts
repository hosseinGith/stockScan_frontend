export interface Product {
  id: string;
  barcode: string;
  name: string;
  price: number;
  quantity: number;
  expiryDate: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface ToastMessage {
  message: string;
  type: "success" | "error" | "info" | "warning";
}
