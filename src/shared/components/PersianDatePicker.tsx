// PersianDatePicker.tsx
import React, { useState, useRef, useEffect } from "react";
import moment from "moment";
import "moment-jalaali";
interface PersianDatePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  minYear?: number;
  maxYear?: number;
  className?: string;
  placeholder?: string;
}

interface DateValue {
  year: number;
  month: number;
  day: number;
}

// تبدیل اعداد به فارسی
const toPersianNum = (num: number): string => {
  const persian = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(num).replace(/\d/g, (d) => persian[parseInt(d)]);
};

// تبدیل Date به شمسی
const dateToJalali = (date: Date): DateValue => {
  const m = moment(date);
  return {
    year: m.year(),
    month: m.month() + 1,
    day: m.day(),
  };
};

// تبدیل شمسی به Date
const jalaliToDate = (year: number, month: number, day: number): Date => {
  const m = moment(`${year}/${month}/${day}`, "jYYYY/jM/jD");
  return m.toDate();
};

// کامپوننت اسکرول
interface ScrollPickerProps {
  items: number[];
  value: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  itemHeight?: number;
  visibleItems?: number;
}

const ScrollPicker: React.FC<ScrollPickerProps> = ({
  items,
  value,
  onChange,
  formatValue = (v) => String(v),
  itemHeight = 44,
  visibleItems = 5,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const initialOffset = useRef(0);
  const centerIndex = Math.floor(visibleItems / 2);

  const findIndex = (val: number) => items.indexOf(val);

  useEffect(() => {
    if (containerRef.current && !isDragging) {
      const index = findIndex(value);
      if (index !== -1) {
        const offset = (index - centerIndex) * itemHeight;
        containerRef.current.scrollTop = offset;
      }
    }
  }, [value, items, centerIndex, itemHeight, isDragging]);

  const handleScroll = () => {
    if (containerRef.current && !isDragging) {
      const scrollTop = containerRef.current.scrollTop;
      const index = Math.round(scrollTop / itemHeight) + centerIndex;
      if (index >= 0 && index < items.length) {
        onChange(items[index]);
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
    if (containerRef.current) {
      initialOffset.current = containerRef.current.scrollTop;
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && containerRef.current) {
      const deltaY = startY - e.clientY;
      const newScrollTop = initialOffset.current + deltaY;
      containerRef.current.scrollTop = newScrollTop;

      const index = Math.round(newScrollTop / itemHeight) + centerIndex;
      if (index >= 0 && index < items.length) {
        onChange(items[index]);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const index = Math.round(scrollTop / itemHeight) + centerIndex;
      if (index >= 0 && index < items.length) {
        onChange(items[index]);
        const newOffset = (index - centerIndex) * itemHeight;
        containerRef.current.scrollTop = newOffset;
      }
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);

  const paddingTop = centerIndex * itemHeight;
  const paddingBottom = centerIndex * itemHeight;

  return (
    <div className="relative h-[220px] overflow-hidden select-none">
      <div
        className="absolute left-0 right-0 top-1/2 -translate-y-1/2 bg-blue-50 rounded-lg border-2 border-blue-400 pointer-events-none"
        style={{ height: itemHeight }}
      />

      <div
        ref={containerRef}
        className="no-scrollbar h-full overflow-y-scroll relative cursor-grab active:cursor-grabbing"
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        style={{ scrollBehavior: isDragging ? "auto" : "smooth" }}
      >
        <div style={{ paddingTop, paddingBottom }}>
          {items.map((item) => {
            const isActive = item === value;
            return (
              <div
                key={item}
                className={`flex items-center justify-center text-lg font-medium transition-all duration-150 ${
                  isActive ? "text-blue-600 scale-110" : "text-gray-600"
                }`}
                style={{ height: itemHeight }}
              >
                {formatValue(item)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// کامپوننت اصلی
const PersianDatePicker: React.FC<PersianDatePickerProps> = ({
  value,
  onChange,
  minYear = 1300,
  maxYear = 1450,
  className = "",
  placeholder = "انتخاب تاریخ",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // مقدار اولیه
  const initialDate = value ? dateToJalali(value) : dateToJalali(new Date());
  const [selectedDate, setSelectedDate] = useState<DateValue>(initialDate);

  // وقتی value تغییر کنه آپدیت بشه
  useEffect(() => {
    (() => {
      if (value) {
        const jalali = dateToJalali(value);
        setSelectedDate(jalali);
      }
    })();
  }, [value]);

  // لیست سال‌ها
  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => minYear + i,
  );

  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // تعداد روزهای ماه
  const getDaysInMonth = (year: number, month: number): number => {
    const m = moment(`${year}/${month}/1`, "jYYYY/jM/jD");
    return m.daysInMonth();
  };

  const daysCount = getDaysInMonth(selectedDate.year, selectedDate.month);
  const days = Array.from({ length: daysCount }, (_, i) => i + 1);

  // اسم ماه‌ها
  const monthNames = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];

  const handleChange = (field: keyof DateValue, val: number) => {
    const newDate = { ...selectedDate, [field]: val };

    // بررسی تعداد روزهای ماه
    const maxDay = getDaysInMonth(newDate.year, newDate.month);
    if (newDate.day > maxDay) {
      newDate.day = maxDay;
    }

    setSelectedDate(newDate);

    // تبدیل به Date و call onChange
    if (onChange) {
      const dateObj = jalaliToDate(newDate.year, newDate.month, newDate.day);
      onChange(dateObj);
    }
  };

  // فرمت نمایش تاریخ
  const formatDisplayDate = (date: DateValue): string => {
    return `${toPersianNum(date.day)} ${monthNames[date.month - 1]} ${toPersianNum(date.year)}`;
  };

  // گرفتن تاریخ امروز
  const handleToday = () => {
    const today = new Date();
    const jalali = dateToJalali(today);
    handleChange("year", jalali.year);
    handleChange("month", jalali.month);
    handleChange("day", jalali.day);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} dir="rtl">
      {/* Input */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 transition-colors flex items-center justify-between"
      >
        <span className={selectedDate ? "text-gray-800" : "text-gray-400"}>
          {selectedDate ? formatDisplayDate(selectedDate) : placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 z-50">
          <div className="grid grid-cols-3 gap-4">
            {/* سال */}
            <div>
              <label className="block text-sm font-medium text-gray-600 text-center mb-2">
                سال
              </label>
              <ScrollPicker
                items={years}
                value={selectedDate.year}
                onChange={(val) => handleChange("year", val)}
                formatValue={(v) => toPersianNum(v)}
              />
            </div>

            {/* ماه */}
            <div>
              <label className="block text-sm font-medium text-gray-600 text-center mb-2">
                ماه
              </label>
              <ScrollPicker
                items={months}
                value={selectedDate.month}
                onChange={(val) => handleChange("month", val)}
                formatValue={(v) => monthNames[v - 1]}
              />
            </div>

            {/* روز */}
            <div>
              <label className="block text-sm font-medium text-gray-600 text-center mb-2">
                روز
              </label>
              <ScrollPicker
                items={days}
                value={selectedDate.day}
                onChange={(val) => handleChange("day", val)}
                formatValue={(v) => toPersianNum(v)}
              />
            </div>
          </div>

          {/* دکمه‌ها */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              بستن
            </button>
            <button
              onClick={handleToday}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-colors"
            >
              امروز
            </button>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          width: 0;
          background: transparent;
        }
        .no-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>
    </div>
  );
};

export default PersianDatePicker;
