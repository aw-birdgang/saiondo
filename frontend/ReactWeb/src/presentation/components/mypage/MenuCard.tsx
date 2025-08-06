import React from 'react';
import { Card, MenuIcon, MenuItemContent } from '@/presentation/components/common';

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  description: string;
  onClick: () => void;
}

interface MenuCardProps {
  item: MenuItem;
  className?: string;
}

const MenuCard: React.FC<MenuCardProps> = ({ item, className = '' }) => {
  return (
    <Card
      onClick={item.onClick}
      hoverable
      className={`text-left cursor-pointer transition-all duration-200 hover:scale-[1.02] ${className}`}
    >
      <div className='flex items-center space-x-4'>
        <MenuIcon icon={item.icon} size='md' />
        <MenuItemContent title={item.title} description={item.description} />
      </div>
    </Card>
  );
};

export default MenuCard;
