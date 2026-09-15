import { useNavigate } from "react-router";
import type { Product } from "../../../../shared/types/product";
import {
    formatDateToPersian,
  formatPrice,
  isExpired,
  isExpiringSoon,
} from "../../../../shared/utils/helpers";

export const ProductListCard = ({
  product,
  handleEdit,
  handleDelete,
}: {
  product: Product;
  handleEdit: (product: Product) => void;
  handleDelete: (id: string) => void;
}) => {
  const navigate = useNavigate();
  const goToProduct = (id: string) => {
    navigate(`/product/${id}`);
  };
  const expired = isExpired(product.expiryDate);
  const expiringSoon = isExpiringSoon(product.expiryDate);

  // eslint-disable-next-line no-useless-assignment
  let bgGradient = "";
  let badgeColor = "";
  let badgeText = "";

  if (expired) {
    bgGradient =
      "from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20 border-r-4 border-red-500";
    badgeColor = "bg-red-500";
    badgeText = "منقضی شده";
  } else if (expiringSoon) {
    bgGradient =
      "from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20 border-r-4 border-amber-500";
    badgeColor = "bg-amber-500";
    badgeText = "در حال انقضا";
  } else {
    bgGradient = "from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/80";
  }

  return (
    <div
      key={product.id}
      className={`bg-linear-to-br ${bgGradient} rounded-2xl overflow-hidden  shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer`}
      onClick={() => goToProduct(product.id)}
    >
      {product.imageUrl && (
        <img src={product.imageUrl} className="aspect-video w-full max-h-40" />
      )}
      <div className="flex justify-between items-start p-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <h3 className="font-bold text-gray-800 dark:text-white text-lg">
              {product.name}
            </h3>
            {badgeText && (
              <span
                className={`${badgeColor} text-white text-[10px] px-2 py-0.5 rounded-full`}
              >
                {badgeText}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 font-mono mb-2">
            {product.barcode}
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="text-blue-600 dark:text-blue-400 font-bold">
              💰 {formatPrice(product.price)}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              📦 {product.quantity} عدد
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-xs">
              📅 {formatDateToPersian(product.expiryDate)}
            </span>
          </div>
        </div>
        <div className="flex gap-2 mr-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(product);
            }}
            className="w-9 h-9 rounded-full bg-white dark:bg-gray-700 shadow-md flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-200"
          >
            <i className="fas fa-edit text-sm"></i>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(product.id);
            }}
            className="w-9 h-9 rounded-full bg-white dark:bg-gray-700 shadow-md flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
          >
            <i className="fas fa-trash-alt text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductListCard;
