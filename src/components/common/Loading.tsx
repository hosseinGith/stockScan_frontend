import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useAppSelector } from "../../stores/hooks";
const Loading = () => {
  const { isLoading } = useAppSelector((state) => state.ui);

  return (
    <div
      className={`${!isLoading ? "opacity-0 pointer-events-none" : ""} fixed inset-0 bg-(--background-2) text-(--foreground) flex items-center justify-center z-50`}
    >
      <div className="text-center">
        <div className="flex justify-center ">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="mb-8"
          >
            <Heart className="w-24 h-24 text-red-500" fill="#ef4444" />
          </motion.div>
        </div>

        <motion.h2
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-2xl font-bold mb-4"
        >
          در حال بارگذاری...
        </motion.h2>
        <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden mx-auto">
          <motion.div
            className="h-full bg-linear-to-r from-blue-500 to-teal-500"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="absolute w-max right-1/2 translate-x-1/2">
          <div className="mt-8 flex justify-center space-x-1 rtl:space-x-reverse">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-teal-400 rounded-full"
                animate={{
                  // eslint-disable-next-line react-hooks/purity
                  height: [10, 30 + Math.random() * 20, 10],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.05,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Loading;
