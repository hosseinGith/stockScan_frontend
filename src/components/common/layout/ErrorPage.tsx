import { History, Home } from "lucide-react";
import { Link } from "react-router";
export default function ErrorPage({ main = "/app" }) {
  return (
    <div className="flex flex-1 w-full h-full flex-col justify-center items-center gap-4">
      <div className="text-[100px] text-(--secendry-3) font-bold">خطا</div>
      <span className="text-[80px]">🔌</span>
      <span className="font-bold text-xl">خطا در ارتباط با سرور</span>
      <span>خطای ناشناخته‌ای رخ داده است</span>
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
  );
}
