import React from "react";
import MenuCard from "./MenuCard";

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  description: string;
  onClick: () => void;
}

interface MenuGridProps {
  items: MenuItem[];
  className?: string;
}

const MenuGrid: React.FC<MenuGridProps> = ({ items, className = "" }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}>
      {items.map((item) => (
        <MenuCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default MenuGrid; 