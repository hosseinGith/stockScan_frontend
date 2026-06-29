import React, { useState, useEffect } from 'react';
import DatePicker from 'react-multi-date-picker';
import DateObject from 'react-date-object';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import 'react-multi-date-picker/styles/colors/teal.css';

interface ShamsiDatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  required?: boolean;
}

const ShamsiDatePicker: React.FC<ShamsiDatePickerProps> = ({
  value,
  onChange,
  placeholder = 'انتخاب تاریخ',
  disabled = false,
  className = '',
  label,
  required = false,
}) => {
  const [selectedDate, setSelectedDate] = useState<DateObject | null>(null);

  useEffect(() => {
    if (value) {
      setSelectedDate(new DateObject(value));
    }
  }, [value]);

  const handleChange = (date: DateObject | null) => {
    if (date) {
      const gregorianDate = date.toDate();
      setSelectedDate(date);
      onChange(gregorianDate);
    } else {
      setSelectedDate(null);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-xs text-gray-500 mb-1">
          {label}
          {required && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}
      <DatePicker
        value={selectedDate}
        onChange={handleChange}
        calendar={persian}
        locale={persian_fa}
        placeholder={placeholder}
        format="YYYY/MM/DD"
        disabled={disabled}
        style={{ direction: 'ltr' }}
        containerClassName="w-full"
        inputClass="
          w-full 
          px-4 
          py-3 
          bg-gray-50 
          dark:bg-gray-900 
          border 
          border-gray-200 
          dark:border-gray-700 
          rounded-xl 
          text-sm 
          text-gray-700 
          dark:text-gray-200
          focus:outline-none 
          focus:ring-2 
          focus:ring-blue-400 
          focus:border-transparent
          transition
          cursor-pointer
        "
        showTodayButton
        todayButtonText="امروز"
        closeButtonText="بستن"
        weekDays={['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']}
        months={[
          'فروردین',
          'اردیبهشت',
          'خرداد',
          'تیر',
          'مرداد',
          'شهریور',
          'مهر',
          'آبان',
          'آذر',
          'دی',
          'بهمن',
          'اسفند',
        ]}
        weekStartDayIndex={6}
      />
    </div>
  );
};

export default ShamsiDatePicker;