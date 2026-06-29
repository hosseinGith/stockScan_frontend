export interface ProductFormData {
  barcode: string;
  name: string;
  price: number;
  quantity: number;
  minQuantity: number;
  expiryDate: Date;
  category: string;
  description: string;
}