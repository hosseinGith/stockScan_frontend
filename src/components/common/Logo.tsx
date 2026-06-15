import { motion } from "framer-motion";

const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <picture>
        <source srcSet="/assets/images/logo/logo-3.webp" type="image/webp" />
        <source srcSet="/assets/images/logo/logo-3.png" type="image/png" />
        <img
          src="/assets/images/logo/logo-3.webp"
          alt="دکتر کریمی"
          className="w-full h-auto"
        />
      </picture>
    </motion.div>
  );
};
export default Logo;
