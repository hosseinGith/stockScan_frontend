import { motion } from "framer-motion";

const StatCard = ({
  description,
  count,
  withDefaultDelay = 1,
}: {
  description: string;
  count: string | number;
  withDefaultDelay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 + withDefaultDelay }}
      className="bgBox  p-2 rounded-lg "
    >
      <div className="text-(--primery) text-2xl font-bold">{count}</div>
      <div className="text-lg">{description}</div>
    </motion.div>
  );
};
export default StatCard;
