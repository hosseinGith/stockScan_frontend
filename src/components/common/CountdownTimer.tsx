import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TimerProps {
  initialSeconds: number;
  onComplete?: () => void;
}

const CountdownTimer: React.FC<TimerProps> = ({
  initialSeconds,
  onComplete,
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds, onComplete]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    <div className="flex flex-col relative w-max items-center ">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={seconds}
          initial={{ y: 10, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -10, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="font-bold"
        >
          {String(minutes).padStart(2, "0")}:
          {String(remainingSeconds).padStart(2, "0")}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CountdownTimer;
