import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router";
import type { DoctorSpecialties } from "../../../../api/types";

const DoctorItem = ({
  id,
  first_name,
  last_name,
  specialties,
  ratesCount,
  ratesAvg,
  amount,
}: {
  id: string;
  first_name: string;
  last_name: string;
  specialties: DoctorSpecialties[];
  ratesCount?: number;
  ratesAvg?: number;
  amount: number;
}) => {
  const liRef = useRef(null);
  const isInView = useInView(liRef);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // تأخیر خودکار بین فرزندان
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };
  return (
    <motion.li
      ref={liRef}
      whileHover={{
        translateY: "-10px",
        scale: 1.01,
      }}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="w-full shadow bgBox rounded-2xl p-4 divide-(--foreground-l) divide-y space-y-4 *:py-2"
    >
      {/*header: doctor info */}
      <motion.div variants={itemVariants} className="flex gap-2 items-center">
        <div className="bg-gray-300 bg-linear-300 w-18 h-18 rounded-3xl flex text-5xl justify-center items-center">
          {String(last_name || "")[0]}
        </div>
        <div>
          <div>
            دکتر {first_name} {last_name}
          </div>
          <span className="text-(--primery)">
            متخصص{" "}
            {specialties.map((doctorSpecialty, index) => (
              <>
                {doctorSpecialty.specialty.name}
                {index < specialties.length - 1 ? "," : ""}
              </>
            ))}
          </span>
          <div className="flex items-center gap-1 text-sm">
            <div className="flex *:fill-(--secendry) *:stroke-gray-500 *:size-3">
              <Star />
              <Star />
              <Star />
              <Star />
            </div>
            {ratesAvg}
            <span>({ratesCount} نظر)</span>
          </div>
        </div>
      </motion.div>
      {/* body , about Doctor */}
      <motion.div
        variants={itemVariants}
        className="flex justify-between sm:flex-row flex-col gap-4"
      >
        <span className="flex gap-1 ">
          💰 هزینه ویزیت:
          <span className=" text-(--primery) font-bold">
            <data value={amount}>{amount.toLocaleString()}</data> تومان
          </span>
        </span>
        <span className="flex gap-1">
          📆 سابقه: <span>15</span> سال
        </span>
      </motion.div>
      {/* footer, submit meet */}
      <Link
        to={"/app/patient/doctors/submit/" + id}
        className="active:scale-[.9] button rounded-full w-full primery block! text-center"
      >
        انتخاب نوبت
      </Link>
    </motion.li>
  );
};
export default DoctorItem;
