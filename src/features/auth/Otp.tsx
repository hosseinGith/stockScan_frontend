import { motion } from "framer-motion";
import React, { useRef, useState, type ChangeEvent } from "react";
import CountdownTimer from "../../components/common/CountdownTimer";

export const Otp = ({
  isShow = true,
  setIsShow,
  number,
  formButton,
  timer,
}: {
  isShow: boolean;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
  number: string;
  formButton: React.RefObject<HTMLButtonElement | null>;
  timer: number;
}) => {
  const currentInput = useRef(1);
  const [isEndTime, setIsEndTime] = useState(false);
  const selectedInput = (
    e: React.FocusEvent<HTMLInputElement, Element>,
    index: number,
  ) => {
    currentInput.current = index;
    (e.target as HTMLInputElement).select();
  };

  const changeUserNumber = () => {
    setIsShow(false);
  };
  const changedInputHandler = (
    e: ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    const next = e.target.nextElementSibling as HTMLInputElement;
    const prev = e.target.previousElementSibling as HTMLInputElement;
    if (currentInput.current === 5 && e.target.value.length === 1) {
      formButton?.current?.click();
      // changeUserNumber();
    }
    if (currentInput.current > 1 && e.target.value.length === 0 && prev) {
      prev.focus();
      prev.select();
    } else if (
      currentInput.current < 5 &&
      e.target.value.length === 1 &&
      next
    ) {
      next.focus();
      next.select();
    }
  };
  return (
    <motion.label
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={`flex flex-col gap-2`}
    >
      <span>کد یکبار مصرف</span>

      <div dir="ltr" className="flex  *:w-full  gap-2 ">
        <input
          required
          name="otp_1"
          autoFocus
          maxLength={1}
          onChange={changedInputHandler}
          onFocus={(e) => selectedInput(e, 1)}
          type="text"
          dir="ltr"
          className="text-center"
          placeholder="*"
          disabled={!isShow}
        />
        <input
          required
          name="otp_2"
          maxLength={1}
          onChange={changedInputHandler}
          onFocus={(e) => selectedInput(e, 2)}
          type="text"
          dir="ltr"
          className="text-center"
          placeholder="*"
          disabled={!isShow}
        />
        <input
          required
          name="otp_3"
          maxLength={1}
          onChange={changedInputHandler}
          onFocus={(e) => selectedInput(e, 3)}
          type="text"
          dir="ltr"
          className="text-center"
          placeholder="*"
          disabled={!isShow}
        />
        <input
          required
          name="otp_4"
          maxLength={1}
          onChange={changedInputHandler}
          onFocus={(e) => selectedInput(e, 4)}
          type="text"
          dir="ltr"
          className="text-center"
          placeholder="*"
          disabled={!isShow}
        />
        <input
          required
          name="otp_5"
          maxLength={1}
          onChange={changedInputHandler}
          onFocus={(e) => selectedInput(e, 5)}
          type="text"
          dir="ltr"
          className="text-center"
          placeholder="*"
          disabled={!isShow}
        />
      </div>
      {!isEndTime && (
        <div className="flex justify-center text-2xl text-(--primery)">
          <CountdownTimer
            onComplete={() => setIsEndTime(true)}
            initialSeconds={timer}
          />
        </div>
      )}
      {isEndTime && (
        <div className="text-center text-(--foreground) pt-4">
          زمان کد به پایان رسید. برای دریافت کد جدید
          <button
            type="button"
            onClick={() => setIsShow(false)}
            className=" text-(--primery)"
          >
            کلیک کنید
          </button>
        </div>
      )}
      {!isEndTime && (
        <div className="text-sm text-(--foreground) text-center">
          <p>
            کد به شماره ی{" "}
            <span className="font-bold" dir="ltr">
              {number}
            </span>{" "}
            پیامک شد.
          </p>
          <span
            onClick={changeUserNumber}
            className="p-2 text-(--primery) cursor-pointer transition-all hover:opacity-85 font-bold"
          >
            تغییر شماره تلفن
          </span>
        </div>
      )}
    </motion.label>
  );
};
