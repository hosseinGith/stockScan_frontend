import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { path: "/dashboard", icon: "fas fa-home", label: "دشبورد" },
  { path: "/products", icon: "fas fa-list", label: "کالاها" },
  { path: "/scan", icon: "fas fa-qrcode", label: "اسکن" },
  { path: "/settings", icon: "fas fa-sliders-h", label: "بیشتر" },
];

const BottomNav: React.FC = () => {
  return (
    <div className="fixed bottom-0 bg-bg-surface border-2 border-border left-0 right-0 max-w-2xl mx-auto rounded-t-2xl z-50">
      <div className="flex *:w-full py-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 transition-colors ${isActive ? "text-(--color-primary)" : "text-text-secondary"}`
            }
          >
            <i className={`${item.icon} text-xl`}></i>
            <span className="text-[11px]">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
