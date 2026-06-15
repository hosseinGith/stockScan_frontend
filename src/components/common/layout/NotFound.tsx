import { motion } from "framer-motion";
import { History, Home, Search } from "lucide-react";
import { Link } from "react-router";
const NotFound = ({ main = "/" }) => {
  return (
    <div className="min-h-screen flex justify-center items-center  flex-col ">
      <div className="space-y-6 max-w-125 text-center *:mx-auto p-4">
        <motion.h1
          initial={{
            background: "linear-gradient(135deg, #5a3dff, #2b7aff, #ff6b6b)",
            backgroundPositionX: "0%",
            backgroundPositionY: "0%",
          }}
          animate={{
            backgroundPositionX: "100%",
            backgroundPositionY: "50%",
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            direction: {},
            repeatDelay: 1,
            ease: "easeInOut",
          }}
          className="sm:text-[130px] text-[80px] bg-clip-text! text-transparent "
        >
          404
        </motion.h1>
        <motion.div
          animate={{
            y: [0, 10, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 0,
            ease: "easeInOut",
          }}
          className="mx-auto w-max "
        >
          <Search size={100} stroke="var(--primery)" />
        </motion.div>

        <b className="sm:text-[30px] text-[18px] text-(--foreground)">
          صفحه ای که دنبالش بودی پیدا نشد!
        </b>
        <p className="sm:text-[16px] text-[12px] text-center text-(--foreground)">
          شاید آدرس رو اشتباه تایپ کردی یا صفحه‌ای که میخوای حذف شده باشه. نگران
          نباش، با همون راه‌های زیر میتونی برگردی.
        </p>
        <div className="flex w-full justify-center *:w-full gap-5 *:text-center *:flex *:justify-center *:hover:-translate-y-1 transition">
          <Link to={main} className="button primery  gap-2">
            <Home />
            بازگشت به خانه
          </Link>
          {window.history.length > 1 && (
            <button
              onClick={() => window.history.back()}
              className="button boderWithHoverBtn gap-2"
            >
              <History />
              صفحه قبلی
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default NotFound;
