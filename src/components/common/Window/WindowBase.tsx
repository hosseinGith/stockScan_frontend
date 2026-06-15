import { motion } from "framer-motion";
import { type ReactNode } from "react";

export default function WindowBase({
  children,
  className = "",
  active,
}: {
  children: ReactNode;
  className?: string;
  active?: boolean;
}) {
  return (
    <motion.div className={`window ${active ? "active" : ""} ${className}`}>
      {children}
    </motion.div>
  );
}
