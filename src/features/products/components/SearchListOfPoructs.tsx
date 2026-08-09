import { AnimatePresence, motion } from "framer-motion";
import type { FilterState } from "../types";
import { useCategories } from "../../../shared/hooks/queries/useCategories";

export default function SearchListOfPoructs({
  isFilterOpen,
  setFilters,
  filters,
  setIsFilterOpen,
}: {
  isFilterOpen: boolean;
  setFilters: (value: React.SetStateAction<FilterState>) => void;
  filters: FilterState;
  setIsFilterOpen: (value: boolean) => void;
}) {
  const { data: categories } = useCategories();
  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "name",
      status: "all",
      inStock: false,
    });
    setIsFilterOpen(false);
  };
  return (
    <AnimatePresence>
      {isFilterOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden mb-4"
        >
          <div className="bg-bg-card  rounded-2xl shadow-xl p-4 text-text-primary">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs  mb-1">دسته‌بندی</label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    setFilters({ ...filters, category: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl text-black bg-white border border-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">همه دسته‌ها</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs  mb-1">وضعیت</label>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      status: e.target.value as FilterState["status"],
                    })
                  }
                  className="w-full px-3 py-2 text-black bg-gray-50 -gray-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="all">همه</option>
                  <option value="available">موجود</option>
                  <option value="expiring_soon">در حال انقضا</option>
                  <option value="expired">منقضی شده</option>
                </select>
              </div>

              <div>
                <label className="block text-xs  mb-1">قیمت از</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, minPrice: e.target.value })
                  }
                  placeholder="۰"
                  className="text-black w-full px-3 py-2 bg-gray-50 -gray-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs  mb-1">قیمت تا</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, maxPrice: e.target.value })
                  }
                  placeholder="نامحدود"
                  className="text-black w-full px-3 py-2 bg-gray-50 -gray-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) =>
                      setFilters({ ...filters, inStock: e.target.checked })
                    }
                    className="text-black sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 -focus:ring-blue-800 rounded-full peer -gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all -gray-600 peer-checked:bg-blue-600"></div>
                </label>
                <span className="mr-3 text-sm font-medium  ">
                  فقط کالاهای موجود
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100 -gray-700">
              <button
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition"
              >
                اعمال فیلترها
              </button>
              <button
                onClick={clearFilters}
                className="px-4 py-2  text-sm font-medium  transition"
              >
                پاک کردن همه
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
