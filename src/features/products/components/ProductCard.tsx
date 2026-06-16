import React from "react";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../../shared/types/index";
import {
  formatPrice,
  formatDateToPersian,
  isExpired,
  isExpiringSoon,
} from "../../../shared/utils/helpers";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();

  const expired = isExpired(product.expiryDate);
  const expiringSoon = isExpiringSoon(product.expiryDate);

  let statusClass = "";
  let statusBadge = "";

  if (expired) {
    statusClass = "border-r-4 border-danger bg-danger-bg";
    statusBadge =
      '<span class="bg-danger text-white text-[10px] px-2 py-0.5 rounded-full">منقضی</span>';
  } else if (expiringSoon) {
    statusClass = "border-r-4 border-warning bg-warning-bg";
    statusBadge =
      '<span class="bg-warning text-white text-[10px] px-2 py-0.5 rounded-full">در حال انقضا</span>';
  }

  return (
    <div
      className={`bg-card rounded-xl p-3 shadow-sm transition-all hover:shadow-md cursor-pointer ${statusClass}`}
    >
      <div className="flex justify-between items-start">
        <div
          className="flex-1"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-bold text-primary">{product.name}</h3>
            {expired && (
              <span className="bg-danger text-white text-[10px] px-2 py-0.5 rounded-full">
                منقضی
              </span>
            )}
            {!expired && expiringSoon && (
              <span className="bg-warning text-white text-[10px] px-2 py-0.5 rounded-full">
                در حال انقضا
              </span>
            )}
          </div>
          <p className="text-xs text-secondary font-mono">{product.barcode}</p>
          <div className="flex gap-3 mt-2 text-sm">
            <span className="text-primary font-medium">
              {formatPrice(product.price)}
            </span>
            <span className="text-secondary">📦 {product.quantity} عدد</span>
            <span className="text-secondary text-xs">
              📅 {formatDateToPersian(product.expiryDate)}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(product);
            }}
            className="text-primary bg-primary-bg w-8 h-8 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition"
          >
            <i className="fas fa-edit text-sm"></i>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(product.id);
            }}
            className="text-danger bg-danger-bg w-8 h-8 rounded-full flex items-center justify-center hover:bg-danger hover:text-white transition"
          >
            <i className="fas fa-trash-alt text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
