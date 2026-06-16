import React from "react";

interface StatsCardProps {
  icon: string;
  iconColor: string;
  value: number | string;
  label: string;
  bgColor?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  iconColor,
  value,
  label,
  bgColor,
}) => {
  return (
    <div className="bg-card rounded-2xl p-3 shadow-md text-center">
      <div
        className={`${bgColor || "bg-primary-bg"} w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2`}
      >
        <i className={`${icon} ${iconColor} text-lg`}></i>
      </div>
      <p className="text-2xl font-bold text-primary">
        {value.toLocaleString()}
      </p>
      <p className="text-xs text-secondary">{label}</p>
    </div>
  );
};

export default StatsCard;
